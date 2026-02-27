import { ApiProperty } from '@nestjs/swagger';
import { IsSecuredToken } from '../../../common/decorators/validators/is-secured-token.decorator';

export class VerifyEmailDto {

  @ApiProperty({
    description: 'The unique verification hash from the email',
    example: 'a1b2c3d4e5f6g7h8i9j0...',
    required: true,
  })
  @IsSecuredToken()
  token: string;
}
  