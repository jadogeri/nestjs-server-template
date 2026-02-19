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
import { IdentityServiceInterface } from "./interfaces/identity-service.interface";

@Service()
export class IdentityService implements IdentityServiceInterface {

      
      constructor(
          private readonly authRepository: AuthRepository, // Also injected here
          private readonly hashingService: HashingService,
          private readonly tokenService: TokenService,   
          private readonly eventEmitter: EventEmitter2, // For emitting events
          private readonly accessControlService: AccessControlService, // For checking user status
      ){ }

    async verifyUser(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async verifyAccessToken(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async verifyRefreshToken(): Promise<any> {
        throw new Error("Method not implemented.");
    }
 

}