import { RegisterDto } from "../../dto/register.dto";

export interface RegistrationServiceInterface {     

    register(registerDto: RegisterDto): Promise<void>;

    verifyEmail(token: string): Promise<void> ;

    resendVerification(email: string): Promise<void> ;
}

