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
import { ResetPasswordDto } from "../dto/reset-password.dto";

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

      const generatedPassword = PasswordGeneratorUtil.generateRandomPassword();
      // hash the generated password
      const hashedPassword = await this.hashingService.hash(generatedPassword);

      // update the auth record with the new hashed password
      await this.authRepository.update(auth.id, { password: hashedPassword });
        const updatedAuth = await this.authRepository.findOne({ where: { id: auth.id }, relations: ['user'] });

        console.log("Updated auth record after password reset:", updatedAuth);
      
       this.eventEmitter.emit('password.forgot', updatedAuth, generatedPassword );

       return { message: 'A new password has been generated and sent to your email address.' };

    }
    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
        const { email, oldPassword, newPassword } = resetPasswordDto;

        const auth = await this.authRepository.findByEmail(email);
        if (!auth) throw new UnauthorizedException('Invalid credentials provided - auth record not found');  
        console.log("auth record found for email:", auth);
      const isVerified = this.accessControlService.isUserVerified(auth);
      if (!isVerified) throw new ForbiddenException('Account not verified, please verify your email before logging in');
      if (auth.status === StatusEnum.DISABLED) throw new ForbiddenException('Account is disabled, Please contact support for assistance');
      const isOldPasswordValid = await this.hashingService.compare(oldPassword, auth.password);
      if (!isOldPasswordValid) throw new UnauthorizedException('Invalid credentials provided - old password does not match');
      const hashedNewPassword = await this.hashingService.hash(newPassword);
      console.log("hashed new password:", hashedNewPassword);
        await this.authRepository.update(auth.id, { password: hashedNewPassword });
        const updatedAuth = await this.authRepository.findOne({ where: { id: auth.id }, relations: ['user'] });

        console.log("Updated auth record after password reset:", updatedAuth);
        console.log("Password reset successful for email:", email);
        this.eventEmitter.emit('password.reset', updatedAuth);

        return { success: true, message: 'Your password has been successfully updated.' };
      
      
      }    

}