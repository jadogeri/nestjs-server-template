import { Response } from "express";
import { UserPayload } from "../../../common/interfaces/user-payload.interface";
import { RefreshTokenPayload } from "../../../common/types/refresh-token-payload.type";
import { Service } from "../../../common/decorators/service.decorator";
import { AuthenticationServiceInterface } from "./interfaces/authentication-service.interface";
import { randomUUID } from "node:crypto";
import { UnauthorizedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { HashingService } from "../../../core/security/hashing/interfaces/hashing.service";
import { TokenService } from "../../../core/security/token/token.service";
import { CreateSessionDto } from "../../../modules/session/dto/create-session.dto";
import { AuthRepository } from "../auth.repository";
import { SessionService } from "../../../modules/session/session.service";
import { CookieService } from "../../../core/security/cookie/cookie.service";


@Service()
export class AuthenticationService implements AuthenticationServiceInterface {
    constructor(
      private readonly authRepository: AuthRepository, // Also injected here
      private readonly hashingService: HashingService,
      private readonly tokenService: TokenService,   
      private readonly sessionService: SessionService, // Inject your SessionService
      private readonly cookieService: CookieService, // Inject your CookieService
      private readonly eventEmitter: EventEmitter2, // For emitting events
    ){ }

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
        };  
    }
    logout(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any> {
        throw new Error("Method not implemented.");
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