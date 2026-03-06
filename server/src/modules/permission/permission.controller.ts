import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiPostPermission } from './decorators/api-post-permission.decorator';
import { ApiGetPermission } from './decorators/api-get-permission.decorator';
import { ApiGetPermissions } from './decorators/api-get-permissions.decorator';
import { ApiPatchPermission } from './decorators/api-patch-permission.decorator';
import { ApiDeletePermission } from './decorators/api-delete-permission.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import { PoliciesGuard } from '../../core/security/guards/policies.guard';
import { CacheMonitorInterceptor } from '../../core/infrastructure/interceptors/cache-monitor.interceptor';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import type { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../core/security/guards/roles.guard';

@Controller('permissions')
@UseGuards(AccessAuthGuard , PoliciesGuard)
@UseInterceptors(CacheMonitorInterceptor) // Apply the monitor here  
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("permission:create") // Only ADMIN can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  
  @ApiPostPermission()
  create(@AccessToken() accessTokenPayload: AccessTokenPayload,@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(accessTokenPayload, createPermissionDto);
  }

  @Get()
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("permission:read") // Only users with 'permission:read' permission can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiGetPermissions()
  findAll(@AccessToken() accessTokenPayload: AccessTokenPayload) {
    return this.permissionService.findAll(accessTokenPayload);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("permission:read") // Only users with 'permission:read' permission can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiGetPermission()
  findOne(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(accessTokenPayload, id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("permission:update") // Only users with 'permission:update' permission can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiPatchPermission()
  update(
    @AccessToken() accessTokenPayload: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionService.update(accessTokenPayload, id, updatePermissionDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("permission:delete") // Only users with 'permission:delete' permission can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiDeletePermission()
  remove(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(accessTokenPayload, id);
  }
}
