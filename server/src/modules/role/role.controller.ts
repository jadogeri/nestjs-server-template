import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiPostRole } from './decorators/api-post-role.decorator';
import { ApiGetRole } from './decorators/api-get-role.decorator';
import { ApiGetRoles } from './decorators/api-get-roles.decorator';
import { ApiPatchRole } from './decorators/api-patch-role.decorator';
import { ApiDeleteRole } from './decorators/api-delete-role.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import { RoleService } from './role.service';
import type { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../core/security/guards/roles.guard';
import { PoliciesGuard } from '../../core/security/guards/policies.guard';
import { CacheMonitorInterceptor } from '../../core/infrastructure/interceptors/cache-monitor.interceptor';



@Controller('roles')
@UseGuards(AccessAuthGuard, PoliciesGuard ) 
@UseInterceptors(CacheMonitorInterceptor) // Apply the monitor here   
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('SUPER_USER') // Only users with SUPER_USER role can access this endpoint
  @Permissions("all:manage") // Only users with 'all:manage' permission can access this endpoint
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint
  @ApiPostRole()
  create(@AccessToken() accessTokenPayload: AccessTokenPayload, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(accessTokenPayload, createRoleDto);
  }

  @Get()
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("all:manage") // Only ADMIN can access this endpoint
  @Roles('SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiGetRoles()
  findAll(@AccessToken() accessTokenPayload: AccessTokenPayload) {
    return this.roleService.findAll(accessTokenPayload);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard) // Apply both guards to this endpoint)
  @Permissions("role:read") // Only users with 'role:read' permission can access this endpoint
  @ApiGetRole()
  findOne(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id') id: number) {
    return this.roleService.findOne(accessTokenPayload, id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard) // Apply both guards to this endpoint)
  @Permissions("role:update") // Only users with 'role:update' permission can access this endpoint
  @ApiPatchRole()
  update(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(accessTokenPayload, id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard) // Apply both guards to this endpoint)
  @Permissions("role:delete") // Only users with 'role:delete' permission can access this endpoint
  @ApiDeleteRole()
  remove(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id') id: number) {
    return this.roleService.remove(accessTokenPayload, id);
  }
}
