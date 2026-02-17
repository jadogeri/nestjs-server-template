import { RegisterDto } from "../../dto/register.dto";

export abstract class RegistrationServiceInterface {     

    abstract register(registerDto: RegisterDto): Promise<void>;

    abstract verifyEmail(token: string): Promise<void> ;

    abstract resendVerification(email: string): Promise<void> ;
}

