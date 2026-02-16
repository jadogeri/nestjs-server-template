import { ApiProperty } from '@nestjs/swagger';

import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator';

export class ResendVerificationEmailDto {

  @ApiProperty({
    description: 'The email address of the user requesting verification',
    example: 'user@example.com',
    required: true,
  })
  @IsUserEmail()
  email: string;
}
  