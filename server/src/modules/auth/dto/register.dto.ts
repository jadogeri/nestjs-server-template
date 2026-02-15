import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsFormattedDate } from '../../../common/decorators/validators/is-formatted-date.decorator';
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';
import { IsName } from '../../../common/decorators/validators/is-name.decorator';

export class RegisterDto {

  @IsName('FirstName')
  firstName: string;

  @IsName('LastName')
  lastName: string;

  @IsUserEmail()
  email: string;

  @IsSecuredPassword()
  password: string;

  /// Use date-fns to strictly parse the custom format
  @IsFormattedDate('dd-MMM-yyyy')
  dateOfBirth: Date;
}
