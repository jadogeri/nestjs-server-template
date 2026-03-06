import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiPostUser } from './decorators/api-post-user.decorator';
import { ApiGetUser } from './decorators/api-get-user.decorator';
import { ApiGetUsers } from './decorators/api-get-users.decorator';
import { ApiPatchUser } from './decorators/api-patch-user.decorator';
import { ApiDeleteUser } from './decorators/api-delete-user.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import { CacheMonitorInterceptor } from '../../core/infrastructure/interceptors/cache-monitor.interceptor';
import type { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../core/security/guards/roles.guard';
import { PoliciesGuard } from '../../core/security/guards/policies.guard';
import { access } from 'fs';

@Controller('users')
@UseGuards(AccessAuthGuard, PoliciesGuard ) 
@UseInterceptors(CacheMonitorInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiPostUser()
  create(@AccessToken() accessTokenPayload: AccessTokenPayload,@Body() createUserDto: CreateUserDto) {
    return this.userService.create(accessTokenPayload, createUserDto);
  }

  @Get()
    @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("all:manage") // Only ADMIN can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiGetUsers()
  async findAll(@AccessToken() accessTokenPayload: AccessTokenPayload ) {
    return await this.userService.findAll(accessTokenPayload);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard) // Apply both guards to this endpoint)
  @Permissions("user:read") // Only users with 'user:read' permission can access this endpoint
  @ApiGetUser()
  findOne(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(accessTokenPayload, id);
  }

  @Patch(':id')
  @ApiPatchUser()
  update(
    @AccessToken() accessTokenPayload: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(accessTokenPayload, id, updateUserDto);
  }

  @Delete(':id')
  @ApiDeleteUser()
  remove(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(accessTokenPayload, id);
  }
}
