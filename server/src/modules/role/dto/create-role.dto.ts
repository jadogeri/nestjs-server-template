import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsString, IsOptional, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ 
    description: 'The unique name of the role', 
    example: 'MANAGER' 
  })
  @IsString()
  @IsNotEmpty() // Ensures the role name isn't sent as an empty string
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value)) // Normalize to uppercase and trim whitespace
  name: string; 

  @ApiProperty({ required: false, example: 'Standard user with basic access' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [Number], description: 'List of permission IDs to associate' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  permissionIds?: number[];
}
