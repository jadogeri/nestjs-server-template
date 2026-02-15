import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';


export class LoginDto {
  @IsUserEmail()
  email: string;

  @IsSecuredPassword()
  password: string;
}
