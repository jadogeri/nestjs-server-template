import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ 
    description: 'The unique name of the role', 
    example: 'MANAGER' 
  })
  @IsString()
  @IsNotEmpty() // Ensures the role name isn't sent as an empty string
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
