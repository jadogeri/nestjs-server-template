import { IsString, IsOptional, IsNotEmpty, Matches, IsNumber } from 'class-validator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsFaxNumber } from '../../../common/decorators/validators/is-fax-number.decorator';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator';
import { Transform } from 'class-transformer';
import { Location } from '../../../common/entities/location.entity';
import { IsPhoneNumber } from '../../../common/decorators/validators/is-phone-number.decorator'; 

export class CreateContactDto {

  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  @IsNotEmpty()
 @Matches(/^[a-zA-Z ]+$/, {
    message: 'fullName must only contain letters (a-z, A-Z) and spaces',
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) 
  fullName: string;

  @ApiPropertyOptional({ example: '(123) 456-7890' })
  @IsOptional()
  @ApiPropertyOptional({ 
    example: '(213) 373-4253', 
    description: 'Supports US National, Dotted, and E.164 formats' 
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsPhoneNumber() // Allows US local + Global E.164
  phone?: string | null;

  @ApiPropertyOptional({ example: 'jane@company.com' })
  @IsOptional()
  @IsUserEmail()
  email?: string | null;

  @ApiPropertyOptional({ example: ['(123) 456-7890', '(987) 654-3210'] })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) 
  @IsOptional()
  @IsFaxNumber()
  fax?: string | null;

  @ApiPropertyOptional({ example: {
    address    : '456 Elm St',
    city        : 'Othertown',
    state       : 'NY',
    postalCode  : '67890',
    country     : 'US'
  }})
  @IsOptional()
  location: Location | null;

  @ApiHideProperty() 
  @IsOptional()
  @IsNumber()
  userId?: number; 

  
}
