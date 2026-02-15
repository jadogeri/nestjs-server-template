// src/common/decorators/is-user-email.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsUserEmail() {
  return applyDecorators(
    // 1. Transform runs first in the NestJS ValidationPipe lifecycle
    Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)),
    
    // 2. Then validate the transformed result
    IsNotEmpty({ message: 'Email is required' }),
    IsString(),
    Length(10, 40, { message: 'Email must be between 10 and 40 characters' }),
    IsEmail({}, { message: 'Please provide a valid email address' }),
  );
}
