// 1. NestJS & Third-Party Libs
import { BadRequestException, ForbiddenException, GoneException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { randomUUID } from 'node:crypto';

// 2. Services (Logic Layer)
import { AccessControlService } from '../../core/security/access-control/access-control.service';
import { CookieService } from '../../core/security/cookie/cookie.service';
import { HashingService } from '../../core/security/hashing/interfaces/hashing.service';
import { MailService } from '../../core/infrastructure/mail/mail.service';
import { SessionService } from '../session/session.service';
import { TokenService } from '../../core/security/token/token.service';
import { UserService } from '../user/user.service';

// 3. Repositories (Data Layer)
import { AuthRepository } from './auth.repository';


// 5. DTOs & Entities (Data Layer)
import { Auth } from './entities/auth.entity';
import { Profile } from '../profile/entities/profile.entity';
import { User } from '../user/entities/user.entity';

import { RegisterDto } from './dto/register.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

// 6. Custom Decorators (Documentation/Metatdata)
import { Service } from '../../common/decorators/service.decorator';

// . Interfaces (Data Layer)
import { VerificationEmailContext } from '../../core/infrastructure/mail/interfaces/mail-context.interface';
import { VerificationTokenPayload } from '../../common/types/verification-token-payload.type';
import { AuthNotFoundException } from '../../common/exceptions/auth-not-found.exception';
import { UserPayload } from '../../common/interfaces/user-payload.interface';
import { PayloadMapperService } from './payload-mapper.service';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { AccessTokenPayload } from 'src/common/types/access-token-payload.type';
import { FindOneOptions } from 'typeorm';
import { is } from 'date-fns/locale';
import { RefreshTokenPayload } from 'src/common/types/refresh-token-payload.type';
import { CreateSessionDto } from '../session/dto/create-session.dto';
import { UpdateSessionDto } from '../session/dto/update-session.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegistrationServiceInterface } from './services/interfaces/registration-service.interface';
import { AuthenticationServiceInterface } from './services/interfaces/authentication-service.interface';
import { AccountManagementServiceInterface } from './services/interfaces/account-management-service.interface';
import { PasswordManagementServiceInterface } from './services/interfaces/password-management-service.interface';
import { ProfilePayload } from 'src/common/interfaces/profile-payload.interface';


@Service()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);g

  constructor(
    private readonly registration: RegistrationServiceInterface, 
    private readonly session: AuthenticationServiceInterface,
    private readonly passwords: PasswordManagementServiceInterface,
    private readonly account: AccountManagementServiceInterface,
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService, 
    private readonly configService: ConfigService,
    private readonly accessControlService: AccessControlService,
    private readonly userService: UserService,
    private readonly payloadMapperService: PayloadMapperService,
    private readonly sessionService: SessionService,
    private readonly cookieService: CookieService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(registerDto: RegisterDto) {

    return await this.registration.register(registerDto);

  }

  async verifyEmail(token: string) {
    
    return await this.registration.verifyEmail(token);

  }

  async resendVerification(email: string) {

    return await this.registration.resendVerification(email);
  
  }

  async login(res: Response<any, Record<string, any>>, userPayload: UserPayload): Promise<any> {
   // A. Generate a unique Session ID immediately
    const sessionId = randomUUID();
    console.log("Generated session ID:", sessionId);

    // B. Generate tokens, passing the sessionId so it can be embedded in the payload
    const data = await this.tokenService.generateAuthTokens(userPayload, sessionId); 
    
    // C. Hash the refresh token
    const hashedRefreshToken = await this.hashingService.hash(data.refreshToken);

    const auth = await this.authRepository.findOne({ where: { user: { id: userPayload.userId } } });
    if (!auth) throw new UnauthorizedException('User not found for token generation');

    // D. Create the session in DB using our pre-generated ID
    // Ensure your Session entity/DTO accepts 'id' or 'sessionId'
    const createSessionDto : CreateSessionDto = { 
        refreshTokenHash: hashedRefreshToken,
        id: sessionId, // Use the same ID for the session record
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Example: 7 days expiry
        auth: auth
    };
    console.log("Creating session with DTO:", createSessionDto);
    const session = await this.sessionService.create(createSessionDto);
    console.log("Created session with pre-generated ID:", session);

    // E. Set Cookie
    await this.cookieService.createRefreshToken(res, data.refreshToken);

    return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: userPayload.userId,
        sessionId: sessionId // Return it if needed by the client
    };  }

    async refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any> { 
    const { userId, sessionId } = refreshTokenPayload;
    console.log("Attempting to refresh token for userId:", userId, "sessionId:", sessionId);
    //const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] }); 
    //create user payload from auth
    const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user', 'user.roles', 'user.roles.permissions'] });
    if (!auth?.user) {
      this.logger.warn(`Auth or User not found for userId: ${userId}`);
      throw new UnauthorizedException('User not found for token refresh');
    }
    const userPayload = this.payloadMapperService.toUserPayload(auth.user, auth.email);

    // B. Generate tokens, passing the sessionId so it can be embedded in the payload
    const data = await this.tokenService.generateAuthTokens(userPayload, sessionId); 
    
    // C. Hash the refresh token
    const hashedRefreshToken = await this.hashingService.hash(data.refreshToken);


    // D. Create the session in DB using our pre-generated ID
    // Ensure your Session entity/DTO accepts 'id' or 'sessionId'
    const updateSessionDto : UpdateSessionDto = { 
        refreshTokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Example: 7 days expiry
    };
    console.log("Creating session with DTO:", updateSessionDto);
    const session = await this.sessionService.update(sessionId, updateSessionDto);
    console.log("Created session with pre-generated ID:", session);

    // E. Set Cookie
    await this.cookieService.updateRefreshToken(res, data.refreshToken);

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: userPayload.userId,
      sessionId: sessionId // Return it if needed by the client
    };  
  }


  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.create(createAuthDto);
  }

  async findAll() {
    return await this.authRepository.findAll({});
  }


  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.authRepository.update(id, updateAuthDto);
  }

  async remove(id: number) {
    return await this.authRepository.delete(id);
  }

  async verifyUser(email: string, password: string): Promise<UserPayload | null> {
    try {
      const auth = await this.authRepository.findByEmail(email);
            if (!auth) throw new UnauthorizedException('Invalid credentials');  

      const isEnabled = this.accessControlService.isUserActive(auth);
      const isVerified = this.accessControlService.isUserVerified(auth);
      if (!isVerified) throw new ForbiddenException('Account not verified, please verify your email before logging in');
      if (isVerified && !isEnabled) throw new ForbiddenException('Account is locked, use forget account to access account');
      


      // ALWAYS use the service so the pepper logic stays identical
      console.log(`Verifying user with email: ${email}`);
      console.log("password provided:", password);
      console.log("stored password hash:", auth.password);
      const pepper = this.configService.get<string>('HASH_PEPPER') || '';
      console.log("Using pepper:", pepper ? 'Yes' : 'No');

      const isMatch = await this.hashingService.compare(password, auth.password);
      if (auth && !isMatch) {
        if(auth.isEnabled === false) throw new ForbiddenException('Account is disabled');
        if(auth.isVerified === false) throw new ForbiddenException('Account not verified');
      }else{

      }

      if (!isMatch) {
        this.logger.warn(`Password mismatch for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
     
      // 2. Account Status Checks (Business Logic)
      if (!this.accessControlService.isUserActive(auth)) throw new ForbiddenException('Account is disabled'); 

      if (!this.accessControlService.isUserVerified(auth))  throw new ForbiddenException('Account not verified');
      // 3. Fetch Full Data & Map to Payload
      const user = await this.userService.findOne({ where: { id: auth.user.id }, relations: ['roles', 'roles.permissions'] });
      if (!user) throw new UnauthorizedException('User profile not found');

      return this.payloadMapperService.toUserPayload(user, email);

    } catch (error) {
      this.logger.error('Verify user error', error);
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }

  async verifyAccessToken(accessTokenPayload: AccessTokenPayload): Promise<AccessTokenPayload | null> {
  const { userId, email } = accessTokenPayload;

    const auth = await this.findOne({ where: { email: email }, relations: ['user', 'user.roles', 'user.roles.permissions'] });
    console.log("AuthService: Verifying access token for email:", email);
    if (!auth)  return null;
   //  account status checks
    if (!this.accessControlService.isUserActive(auth)) {
      this.logger.warn(`Account for email ${email} is disabled.`);
      return null;

    }

    this.logger.log(`Account for email ${email} is active.`);

    const user = await this.userService.findById(userId);
    if (!user){
      this.logger.warn(`User not found with id: ${userId}`);
      return null;
    }
    console.log("auth ==> ", auth);
    if (auth.user.id !== userId) {
      this.logger.warn(`User ID mismatch: token has ${userId} but auth record has ${auth.user.id}`);
      return null;
    }
    console.log("JwtStrategy: Retrieved user from database:", accessTokenPayload.email);

    return accessTokenPayload;
}

  async verifyRefreshToken(refreshTokenPayload: RefreshTokenPayload): Promise<RefreshTokenPayload | null> {
  const { userId, sessionId} = refreshTokenPayload;
  const auth  = await this.authRepository.findOne({ where: { user: { id: userId } } , relations: ['user'] });
  const session = await this.sessionService.findOne(sessionId);
  console.log("seesionId from token:", sessionId);
  console.log("session ==> ", session);
  console.log("AuthService: Verifying refresh token for user ID:", JSON.stringify(auth, null,4));
  if (!auth) throw new UnauthorizedException('User not found for this token');
  if (auth.user.id !== userId) throw new UnauthorizedException('Token user ID does not match auth record');
  if (!session) throw new UnauthorizedException('Session not found for this token');
  if (session.auth.id !== auth.id) throw new UnauthorizedException('Session does not belong to the user');
  if (session.expiresAt < new Date()) throw new UnauthorizedException('Session has expired');

  const isUserActive = this.accessControlService.isUserActive(auth);
  if (!isUserActive) {
    this.logger.warn(`Account for user ID ${userId} is disabled.`);
    return null;  
  }

    this.logger.log(`Account for email ${auth.email} is active.`);

    const user = await this.userService.findById(userId);
    if (!user){
      this.logger.warn(`User not found with id: ${userId}`);
      return null;
    }
    console.log("auth ==> ", auth);
    if (auth.user.id !== userId) {
      this.logger.warn(`User ID mismatch: token has ${userId} but auth record has ${auth.user.id}`);
      return null;
    }
    console.log("refresh token: Retrieved user from database:", refreshTokenPayload);

    return refreshTokenPayload;
}

  async findOne(options: FindOneOptions<Auth>): Promise<Auth | null> {    
    return await this.authRepository.findOne(options);
  }

  async findById(id: number): Promise<Auth | null> {    
    return await this.authRepository.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
  }
  
}

/**
 * 
 
export const loginUser = asyncHandler(async (req : Request, res: Response)  => {

  const { email, password } : IUser = req.body;
  console.log(email,password)
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  if(!isValidEmail(email)){
    errorBroadcaster(res,400,"not a valid standard email address")
  }

  const user  = await userService.getByEmail(email);

  if(user){

    if(user.isEnabled === false){      
      errorBroadcaster(res,423,"Account is locked, use forget account to access acount")
    }

    //compare password with hashedpassword 
    if (user &&  await bcrypt.compare(password,user.password as string)) {

      let payload = {
        user: {
          username: user.username as string , email: user.email as string , id: user._id ,
        },
      }
      //post fix operator   knowing value cant be undefined
      let secretKey  = process.env.JSON_WEB_TOKEN_SECRET! ;
      const accessToken  =  jwt.sign( payload,secretKey as jwt.Secret,  { expiresIn: "30m" } );
      //add token and id to auth 
      const authUser : IAuth = {
        id : user._id,
        token : accessToken
      }

      const authenticatedUser = await authService.getById(user._id);
      if(!authenticatedUser){

        await authService.create(authUser);
      }else{

        await authService.update(authUser);;     
      }

      //if failed logins > 0, 
      //reset to zero if account is not locked
      if(user.failedLogins as number > 0){

        const resetUser : IUser ={
          failedLogins: 0
        }

        await userService.update(user._id, resetUser)
      }
        res.status(200).json({ accessToken }); 
    }else{ 
      user.failedLogins = user.failedLogins  as number + 1      
      if(user.failedLogins === 3){

        user.isEnabled = false;
        await userService.update(user._id, user)
              const recipient : Recipient = {
                username : user.username,
                email : user.email,
                company : process.env.COMPANY
              }
        sendEmail("locked-account",recipient )
        res.status(400).json("Account is locked beacause of too many failed login attempts. Use forget account to access acount");

      }else{
        await userService.update(user._id, user)    
      }      
      res.status(400).json({ message: "email or password is incorrect" });
    }
  }else{
    res.status(400).json({ message: "email does not exist" });
  }

});
  





 */