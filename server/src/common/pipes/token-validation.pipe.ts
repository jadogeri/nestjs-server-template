import { PipeTransform, BadRequestException } from '@nestjs/common';
import { Pipe } from '../decorators/pipe.decorator';
import { VerifyEmailDto } from 'src/modules/auth/dto/verify-email.dto';

@Pipe()
export class TokenValidationPipe implements PipeTransform {
  transform(dto: VerifyEmailDto) {
    console.log('TokenValidationPipe received value:', dto);
    // 1. Basic check: Is it missing?
    if (!dto || !dto.token) {
      throw new BadRequestException('Verification token is required');
    }

    const { token: verificationToken } = dto;

    // 2. Custom Logic: e.g., check length or format (JWT-ish check)
    if (typeof verificationToken !== 'string' || verificationToken.length < 20) {
      throw new BadRequestException('Invalid token format');
    }

    return dto;
  }
}
