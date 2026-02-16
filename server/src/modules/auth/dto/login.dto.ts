import { ApiProperty } from '@nestjs/swagger';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';


export class LoginDto {
  @ApiProperty({
    description: 'The registered email address of the user',
    example: 'user@example.com',
    required: true,
  })
  @IsUserEmail()
  email: string;

  @ApiProperty({
    description: 'The secure password for the account',
    example: 'P@ssw0rd123!',
    required: true,
    format: 'password', // <--- THIS enables the "eye" icon and masking
  })
  @IsSecuredPassword()
  password: string;
}
