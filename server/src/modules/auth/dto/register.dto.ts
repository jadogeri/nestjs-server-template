import { ApiProperty } from '@nestjs/swagger';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsFormattedDate } from '../../../common/decorators/validators/is-formatted-date.decorator';
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';
import { IsName } from '../../../common/decorators/validators/is-name.decorator';

export class RegisterDto {

  @ApiProperty({ example: 'John', description: 'The first name of the user' , required: true})
  @IsName('FirstName')
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user', required: true })
  @IsName('LastName')
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user', required: true })
  @IsUserEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'The password of the user', required: true })
  @IsSecuredPassword()
  password: string;

  @ApiProperty({ 
    example: '01-Jan-1990', 
    description: 'Format: dd-MMM-yyyy', 
    required: true 
  })
  @IsFormattedDate('dd-MMM-yyyy')
  dateOfBirth: Date;
}
