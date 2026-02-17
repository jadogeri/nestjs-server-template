import { RegisterDto } from "../../dto/register.dto";

export interface RegistrationServiceInterface {     

    register(registerDto: RegisterDto): Promise<void>;

    verifyEmail(token: string): Promise<void> ;

    resendVerificationEmail(email: string): Promise<void> ;
}

