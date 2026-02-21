import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: '+15559876543' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string | null;

  @ApiPropertyOptional({ example: 'jane@company.com' })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({ example: '+15551112222' })
  @IsOptional()
  @IsPhoneNumber()
  fax?: string | null;
}
