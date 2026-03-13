import { AccessTokenPayload } from "../../../common/types/access-token-payload.type";
import { Service } from "../../../common/decorators/service.decorator";
import { AccountManagementServiceInterface } from "./interfaces/account-management-service.interface";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AccessControlService } from "../../../core/security/access-control/access-control.service";
import { CookieService } from "../../../core/security/cookie/cookie.service";
import { HashingService } from "../../../core/security/hashing/interfaces/hashing.service";
import { TokenService } from "../../../core/security/token/token.service";
import { SessionService } from "../../../modules/session/session.service";
import { UserService } from "../../../modules/user/user.service";
import { AuthRepository } from "../auth.repository";
import { PayloadMapperService } from "../payload-mapper.service";
import { StatusEnum } from "src/common/enums/user-status.enum";

@Service()
export class AccountManagementService implements AccountManagementServiceInterface {

        constructor(
          private readonly authRepository: AuthRepository, // Also injected here
          private readonly hashingService: HashingService,
          private readonly tokenService: TokenService,   
          private readonly sessionService: SessionService, // Inject your SessionService
          private readonly cookieService: CookieService, // Inject your CookieService
          private readonly eventEmitter: EventEmitter2, // For emitting events
          private readonly accessControlService: AccessControlService, // For checking user status
          private readonly configService: ConfigService, // For accessing config values like pepper
          private readonly payloadMapperService: PayloadMapperService, // For mapping to UserPayload
          private readonly userService: UserService, // For fetching user details
        ){ }
    async deactivate(res: Response<any, Record<string, any>>, accessTokenPayload: AccessTokenPayload): Promise<any> {
        //throw new Error("Method not implemented.");   
        
        // 1. Set the user's status to 'deactivated' in the database
        // 2. Invalidate all active sessions for the user (e.g., by deleting session records)
        // 3  clear cookie in browser
        // 4. handle cache invalidation if you have any caching layer for user data
        // 5. Optionally, emit an event or log the deactivation action for auditing purposes
        // 6. Return a response indicating the account has been deactivated (or handle it as needed in your application flow)

        const auth = await this.authRepository.findOne({ where: { user: { id: accessTokenPayload.userId } } });
        if (!auth) throw new Error('User not found for deactivation');
        auth.status = StatusEnum.DISABLED;
        auth.isEnabled = false;      
        await this.authRepository.update(auth.id, auth); // Use update to avoid triggering entity listeners that might be on save/remove
        const authId : string = auth.id as unknown as string
        // Invalidate sessions - this depends on how you manage sessions. For example, if you have a Session entity:
        await this.sessionService.removeByAuthId(authId); // Implement this method to delete sessions by auth ID

        // Clear cookies - this depends on how you set cookies. For example, if you have a cookie named 'refreshToken':
        this.cookieService.deleteRefreshToken(res); // Implement this method to clear the specific cookie

        


        return { message: "Account deactivated successfully (placeholder response)" };
    }
    async delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async reactivate(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}