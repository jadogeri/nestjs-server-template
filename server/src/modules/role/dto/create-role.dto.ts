import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsArray, IsInt } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole)
  name: UserRole;

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
