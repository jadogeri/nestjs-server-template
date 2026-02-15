import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 

export class ForgotPasswordDto {
  @IsUserEmail()
  email: string;
}
