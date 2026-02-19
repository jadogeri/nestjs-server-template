import { ApiProperty } from '@nestjs/swagger';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The registered email address of the user',
    example: 'user@example.com',
    required: true,
  })
  @IsUserEmail()
  email: string;
}
