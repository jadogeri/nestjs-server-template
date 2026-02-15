import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';


export class ResetPasswordDto {

  @IsUserEmail()
  email: string;

  @IsSecuredPassword()
  oldPassword: string;

  @IsSecuredPassword()
  newPassword: string;

  @IsSecuredPassword()
  confirmPassword: string;

}

