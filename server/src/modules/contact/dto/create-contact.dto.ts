import { IsString, IsOptional, IsPhoneNumber, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsFaxNumber } from '../../../common/decorators/validators/is-fax-number.decorator';
import { IsUserEmail } from 'src/common/decorators/validators/is-email.decorator';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  @IsNotEmpty()
 @Matches(/^[a-zA-Z ]+$/, {
    message: 'fullName must only contain letters (a-z, A-Z) and spaces',
  })
  fullName: string;

  @ApiPropertyOptional({ example: '+15559876543' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string | null;

  @ApiPropertyOptional({ example: 'jane@company.com' })
  @IsOptional()
  @IsUserEmail()
  email?: string | null;

  @ApiPropertyOptional({ example: ['15551112222', '+1-555-333-4444'] })
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
}
