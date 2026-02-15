import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export function IsAddress() {
  return applyDecorators(
    IsNotEmpty({ message: 'Address is required' }),
    IsString(),
    Length(5, 100, { message: 'Address must be between 5 and 100 characters' }),
    // Allows alphanumeric, spaces, #, and common punctuation
    Matches(/^[a-zA-Z0-9\s,'\-\\.#]*$/, { message: 'Address contains invalid characters' })
  );
}
