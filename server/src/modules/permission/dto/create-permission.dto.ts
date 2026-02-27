import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Resource } from '../../../common/enums/resource.enum';
import { Action } from '../../../common/enums/action.enum';

export class CreatePermissionDto {
  @ApiProperty({ 
    type: String, // Explicitly tell Swagger it's a string now
    example: 'user',
    description: 'The system resource this permission applies to' 
  })
  @IsString() // Change this from @IsEnum(Resource)
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  resource: string;

  @ApiProperty({ 
    enum: Action, 
    example: Action.CREATE,
    description: 'The specific operation allowed on the resource' 
  })
  @IsEnum(Action)
  @IsNotEmpty()
  action: Action;

  @ApiPropertyOptional({ 
    example: 'Allows the user to create new user accounts.',
    description: 'A human-readable description of what this permission grants'
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;
}
