import { Service } from "../../../common/decorators/service.decorator";
//import { RegistrationInterface } from "../interfaces/registration.interface";

@Service()
export class RegistrationService {     


    async register(): Promise<void> {
        // Implementation for user registration
    }

    async verifyEmail(token: string): Promise<void> {
        // Implementation for email verification
    }

    async resendVerificationEmail(email: string): Promise<void> {
        // Implementation for resending verification email
    }
}