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
import { StatusEnum } from "../../../common/enums/user-status.enum";
import { CacheKeys } from "../../../core/infrastructure/cache/cache-keys.types";
import { CacheService } from "../../../core/infrastructure/cache/cache.service";
import { ReactivationTokenPayload } from "../../../common/types/reactivation-token-payload.type";
import { NotFoundException } from "@nestjs/common";
import { ContactService } from "../../../modules/contact/contact.service";
import { ProfileService } from "../../../modules/profile/profile.service";
import { DeleteUserResponseDto } from "../dto/api-delete-user-response.dto";

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
          private readonly cacheService: CacheService, // For cache invalidation
          private readonly contactService: ContactService, // For deleting user contacts if needed
          private readonly profileService: ProfileService, // For deleting user profile if needed

        ){ }

    async deactivate(res: Response<any, Record<string, any>>, accessTokenPayload: AccessTokenPayload): Promise<any> {

        const userId = accessTokenPayload.userId;
        const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
        console.log(`Found auth record for user ID ${userId}: ${JSON.stringify(auth)}`);
        if (!auth) throw new NotFoundException('User not found for deactivation');
        
        auth.status = StatusEnum.DISABLED;
        auth.isEnabled = false;      
        const updatedAuth = await this.authRepository.update(auth.id, auth); // Use update to avoid triggering entity listeners that might be on save/remove
        console.log(`Updated auth record for user ID ${userId}: ${JSON.stringify(updatedAuth)}`);
        const authId : string = auth.id as unknown as string
        // Invalidate sessions - this depends on how you manage sessions. For example, if you have a Session entity:
        const removedSessions = await this.sessionService.removeByAuthId(authId); // Implement this method to delete sessions by auth ID
        console.log(`Removed ${JSON.stringify(removedSessions)} sessions for auth ID ${authId}`);

        // Clear cookies - this depends on how you set cookies. For example, if you have a cookie named 'refreshToken':
        const isDeleted = this.cookieService.deleteRefreshToken(res); // Implement this method to clear the specific cookie
        console.log(`Refresh token cookie deleted: ${isDeleted}`);

              // 4. Cache Invalidation
        // We invalidate the specific user, their profile, and their session list
        const userIdStr = userId.toString(); // Ensure it's a string for cache keys
        const keysToInvalidate = [
            CacheKeys.users.byId(userIdStr),
            CacheKeys.profiles.byId(Number(userIdStr)), // Ensure ID type matches your store
            CacheKeys.sessions.byUserId(userIdStr),
            CacheKeys.contacts.byUserId(userIdStr),
        ];
        
        await Promise.all(keysToInvalidate.map(key => this.cacheService.delete(key)));
        console.log(`Invalidated cache keys: ${JSON.stringify(keysToInvalidate)}`);
        

        // 5. Emit Event
        const reactivateUrl = `${process.env.FRONTEND_URL}/reactivate?userId=${userId}`;
        this.eventEmitter.emit('account.deactivation', { auth, reactivateUrl });

        // 6. Return Response
        return { 
            success: true, 
            message: "Your account has been deactivated and all sessions have been cleared." 
        };


    }
    async requestReactivation(email: string): Promise<any> {
        const auth = await this.authRepository.findOne({ where: { email }, relations: ['user'] });
        if (!auth) {
            console.log(`No auth record found for email: ${email}`);
            return {message : "If an account with that email exists, a reactivation link has been sent."}; // Avoid revealing whether the email exists
        }
        if (auth.status === StatusEnum.ENABLED) {
            console.log(`Auth record for email ${email} is already enabled. Current status: ${auth.status}`);
            return {message : "Account is already active."}; // Avoid revealing account status
        }
        if (auth.status === StatusEnum.LOCKED) {
            console.log(`Auth record for email ${email} is locked. Current status: ${auth.status}`);
            return {message : "Account is locked. Please contact support."}; // Avoid revealing account status
        }
        if (auth.status !== StatusEnum.DISABLED) {
            console.log(`Auth record for email ${email} is not disabled. Current status: ${auth.status}`);
            return {message : "If an account with that email exists, a reactivation link has been sent."}; // Avoid revealing account status
        }
        
        const reactivationTokenPayload: ReactivationTokenPayload = {
            email: auth.email,
            userId: auth.user.id,
            type: "reactivation",
        };
        const reactivationToken = await this.tokenService.generateReactivationToken(reactivationTokenPayload);
        // Hash the token before storing it in the database for security
        const hashedReactivationToken = await this.hashingService.hash(reactivationToken);
        auth.reactivateToken = hashedReactivationToken;
        const updatedAuth = await this.authRepository.update(auth.id, auth); // Update the auth record with the hashed token
        console.log(`Updated auth record for reactivation: ${JSON.stringify(updatedAuth)}`);
        
        const reactivateLink = `${process.env.FRONTEND_URL}/verify-reactivate?token=${reactivationToken}`;
        this.eventEmitter.emit('account.reactivate-request', { auth: updatedAuth, reactivateLink });

        return {message : "If an account with that email exists, a reactivation link has been sent."}; // Always return the same message for security

    }

    async verifyReactivation(reactivationToken: any): Promise<any> {
        const verifyReactivationTokenPayload = await this.tokenService.verifyReactivationToken(reactivationToken);
        if (!verifyReactivationTokenPayload) {
            console.log(`Invalid or expired reactivation token: ${reactivationToken}`);
            throw new Error('Invalid or expired reactivation token');
        }
        const auth = await this.authRepository.findOne({ where: { email: verifyReactivationTokenPayload.email }, relations: ['user'] });
        if (!auth) {
            console.log(`No auth record found for email: ${verifyReactivationTokenPayload.email}`);
            throw new Error('Invalid reactivation token');
        }
        auth.status = StatusEnum.ENABLED;
        console.log(`Reactivating account for email: ${auth.email}`);
        auth.reactivateToken = null;
        const updatedAuth = await this.authRepository.update(auth.id, auth);
        console.log(`Account reactivated for email: ${auth.email}`);
        console.log(`Updated auth record after reactivation: ${JSON.stringify(updatedAuth)}`);
        //emit event for reactivation if needed, e.g. to send a confirmation email
        this.eventEmitter.emit('account.verified-reactivation', { auth: updatedAuth });
        return {message : "Account has been successfully reactivated."};

    }


    async deleteMe(accessTokenPayload: AccessTokenPayload): Promise<DeleteUserResponseDto | null> {
        const { userId, email } = accessTokenPayload;
        const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
        if (!auth) {
            console.log(`No auth record found for userId: ${userId}`);
            throw new NotFoundException('User not found');
        }
        // delete user account and related auth record
        await this.authRepository.delete(auth.id); // This will also cascade and delete the user due to the relation setup
        // delete user profile and related data if needed (e.g. contacts, sessions)
        await this.profileService.removeByUserId(userId); // Implement this method to delete the profile by user ID
        await this.contactService.removeByUserId(userId); // Implement this method to delete contacts by user ID
        await this.sessionService.removeByAuthId(auth.id.toString()); // Implement this method to delete sessions by auth ID
        await this.userService.remove(userId); // Implement this method to delete the user profile

        this.eventEmitter.emit('account.deletion', { auth });
        
        const deleteUserResponse = {
            success: true,
            message: `Your account '${email}' has been permanently deleted. We're sorry to see you go!`,
            deletedAt: new Date().toISOString(),
        };
        return deleteUserResponse;
    }

}