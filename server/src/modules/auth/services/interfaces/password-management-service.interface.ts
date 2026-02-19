import { ResetPasswordDto } from "../../dto/reset-password.dto";

export abstract class PasswordManagementServiceInterface {     

    abstract forgotPassword(email: string): Promise<any>;

    abstract resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any>; ;
}

