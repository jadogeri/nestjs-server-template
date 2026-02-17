import { Service } from "../../../common/decorators/service.decorator";
import { RegisterDto } from "../dto/register.dto";
import { RegistrationServiceInterface } from "./interfaces/registration-service.interface";

@Service()
export class RegistrationService implements RegistrationServiceInterface {     

    async register(registerDto: RegisterDto): Promise<void> {
        // Implementation for user registration
    }

    async verifyEmail(token: string): Promise<void> {
        // Implementation for email verification
    }

    async resendVerification(email: string): Promise<void> {
        // Implementation for resending verification email
    }
}