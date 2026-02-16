import { PipeTransform, BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Pipe } from '../decorators/pipe.decorator';
import { ResendVerificationEmailDto } from 'src/modules/auth/dto/resend-verification-email.dto';

@Pipe()
export class EmailValidationPipe implements PipeTransform {
  transform(dto: ResendVerificationEmailDto) {
    const { email } = dto;
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    dto.email = email.toLowerCase().trim();
    return dto; 
  }
}
