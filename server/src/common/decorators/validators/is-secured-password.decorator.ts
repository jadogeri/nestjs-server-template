// is-secure-password.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { IsString, IsStrongPassword, Max, MaxLength, MinLength,IsNotEmpty  } from 'class-validator';

export function IsSecuredPassword() {
  return applyDecorators(
    IsNotEmpty({ message: 'Password is required' }),
    IsString(),
    MinLength(8, { message: 'Password is too short (min 8 characters)' }),  
    MaxLength(20, { message: 'Password is too long (max 20 characters)' }),  
    
    // Message 2: Specifically for complexity
    IsStrongPassword(
      { minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
      { message: 'Password must include uppercase, lowercase, numbers, and symbols' }
    ),
  );
}
