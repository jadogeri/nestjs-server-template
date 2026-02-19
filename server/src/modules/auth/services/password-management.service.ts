import { UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { StatusEnum } from "src/common/enums/user-status.enum";
import { HashingService } from "src/core/security/hashing/interfaces/hashing.service";
import { TokenService } from "src/core/security/token/token.service";
import { Service } from "../../../common/decorators/service.decorator";
import { AuthRepository } from "../auth.repository";
import { PasswordManagementServiceInterface } from "./interfaces/password-management-service.interface";
import { AccessControlService } from "src/core/security/access-control/access-control.service";
import { PasswordGeneratorUtil } from "src/common/utils/password-generator.util";

@Service()
export class PasswordManagementService implements PasswordManagementServiceInterface {

      
      constructor(
          private readonly authRepository: AuthRepository, // Also injected here
          private readonly hashingService: HashingService,
          private readonly tokenService: TokenService,   
          private readonly eventEmitter: EventEmitter2, // For emitting events
          private readonly accessControlService: AccessControlService, // For checking user status
      ){ }
    async forgotPassword(email: string): Promise<any> {
      const auth = await this.authRepository.findByEmail(email);
      if (!auth) throw new UnauthorizedException('Invalid credentials provided - auth record not found');  
      console.log("auth record found for email:", auth);

      const isVerified = this.accessControlService.isUserVerified(auth);
      if (!isVerified) throw new ForbiddenException('Account not verified, please verify your email before logging in');
      if (auth.status === StatusEnum.LOCKED) throw new ForbiddenException('Account is locked, use forget account to access account');
      if (auth.status === StatusEnum.DISABLED) throw new ForbiddenException('Account is disabled, Please contact support for assistance');

      return PasswordGeneratorUtil.generateRandomPassword()
    



     }
    async resetPassword(): Promise<void> {
        throw new Error("Method not implemented.");
    }    

}

/**
 * 
 export const forgotUser = asyncHandler(async (req: Request, res : Response) => {

  const { email} : IUserForgot = req.body;
  if (!email ) {
    res.status(400);
    throw new Error("Email is mandatory!");
  }
  if(!isValidEmail(email)){
    errorBroadcaster(res,400,"not a  valid email")
  }

  const user  = await userService.getByEmail(email);
  if (!user) {
    errorBroadcaster(res,400,`Invalid Email ${email}`);
  }else{
    //generate unique password
    const size : number = parseInt(process.env.NANOID_SIZE as string);
    
    // Using the alphanumeric dictionary
    const uuid = generateRandomUUID(size)  

    console.log("uuid === ", uuid);
    //hash generated password
    const hashedPassword : string = await bcrypt.hash(uuid , parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
    console.log("Hashed Password: ", hashedPassword);
    //store generated password in database and unlock account
    const updatedUser : IUser = {
      password : hashedPassword,
      failedLogins : 0,
      isEnabled : true
    }
    await userService.update(user._id, updatedUser)
    //update user password with uuid
    .then(()=>{
      let recipient : Recipient ={
        company : process.env.COMPANY as string,
        username : user.username,
        email : user.email,
        password : uuid
      }
      sendEmail("forgot-password",recipient)
    res.status(200).json({ password: uuid });

    })
  }
});



 */
