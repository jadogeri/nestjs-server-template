import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsJWT, MinLength, } from 'class-validator';

export class VerifyEmailDto {

  @ApiProperty({
    description: 'The unique verification hash from the email',
    example: 'a1b2c3d4e5f6g7h8i9j0...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) // Manual trim logic
  @MinLength(31, { message: 'Token must be at least 31 characters long' })
  @IsJWT({ message: 'Token must be a valid JWT format' })
  token: string;
}
  