import { applyDecorators } from '@nestjs/common';
import { IsString, IsNotEmpty, MinLength, IsJWT } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsSecuredToken() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    // Note: No '@' here
    Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)), 
    MinLength(31, { message: 'Token must be at least 31 characters long' }),
    IsJWT({ message: 'Token must be a valid JWT format' })
  );
}
