import { IsString, IsOptional, IsNotEmpty, Matches, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; // Assuming custom email validator
import { IsName } from '../../../common/decorators/validators/is-name.decorator';
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';

export class CreateUserDto {

  @ApiProperty({ example: 'john.doe' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'username must only contain letters, numbers, dots, underscores, or hyphens',
  })
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsSecuredPassword()
  password: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsUserEmail() // Custom email validator that checks for uniqueness
  email: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsName('FirstName')
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsName('LastName')
  lastName: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  dateOfBirth?: Date; // Optional field, no validation needed
}
