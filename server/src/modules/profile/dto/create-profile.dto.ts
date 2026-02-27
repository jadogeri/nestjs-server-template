import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Location } from '../../../common/entities/location.entity';

export class CreateProfileDto {
  @ApiPropertyOptional({ example: 'Software developer and tech enthusiast.' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ 
    example: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US'
    } 
  })
  @IsOptional()
  location?: Location | null;

  @ApiPropertyOptional({ example: 'https://johndoe.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: '@johndoe_dev' })
  @IsOptional()
  @IsString()
  socialMedia?: string;

  @ApiPropertyOptional({ example: 'Non-binary' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ 
    example: { theme: 'dark', notifications: true },
    description: 'User-specific UI and system preferences'
  })
  @IsOptional()
  @IsObject()
  preferences?: { [key: string]: any };
}
