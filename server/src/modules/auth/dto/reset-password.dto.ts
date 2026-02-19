import { ApiProperty } from '@nestjs/swagger';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';
import { IsMatch } from '../../../common/decorators/validators/is-match.decorator';

export class ResetPasswordDto {

  @ApiProperty({ 
    example: 'john.doe@example.com', 
    description: 'The registered email address of the user',
    required: true
  })
  @IsUserEmail()
  email: string;

  @ApiProperty({ 
    example: 'OldPassword123!', 
    description: 'The current password of the user',
    required: true
  })
  @IsSecuredPassword()
  oldPassword: string;

  @ApiProperty({ 
    example: 'NewStrongPass456!', 
    description: 'The new password to be set',
    required: true
  })
  @IsSecuredPassword()
  newPassword: string;

  @ApiProperty({ 
    example: 'NewStrongPass456!', 
    description: 'Must match the newPassword field',
    required: true
  })
  @IsSecuredPassword()
  @IsMatch('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;

}
