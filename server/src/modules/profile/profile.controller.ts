import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiDeleteProfile } from './decorators/api-delete-profile.decorator';
import { ApiGetProfile } from './decorators/api-get-profile.decorator';
import { ApiGetProfiles } from './decorators/api-get-profiles.decorator';
import { ApiPatchProfile } from './decorators/api-patch-profile.decorator';
import { ApiPostProfile } from './decorators/api-post-profile.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import type { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../core/security/guards/roles.guard';
import { PoliciesGuard } from '../../core/security/guards/policies.guard';
import { CacheMonitorInterceptor } from '../../core/infrastructure/interceptors/cache-monitor.interceptor';


@Controller('profiles')
@UseGuards(AccessAuthGuard, PoliciesGuard) // Apply both guards to this controller
@UseInterceptors(CacheMonitorInterceptor) // Apply the monitor here 
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiPostProfile()
  async create(@AccessToken() accessTokenPayload: AccessTokenPayload,@Body() createProfileDto: CreateProfileDto) {
    return await this.profileService.create(accessTokenPayload, createProfileDto);
  }

  @Get()
    @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("all:manage") // Only ADMIN can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiGetProfiles()
  async findAll(@AccessToken() accessTokenPayload: AccessTokenPayload) {
    return await this.profileService.findAll(accessTokenPayload);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard) // Apply both guards to this endpoint)
  @Permissions("all:manage") // Only ADMIN can access this endpoint
  @ApiGetProfile()
  async findOne(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', ParseIntPipe) id: number) {
    return await this.profileService.findOne(accessTokenPayload, id);
  }

  @Patch(':id')
  @Permissions("profile:update") // Only users with 'profile:update' permission can access this endpoint
  @ApiPatchProfile()
  async update(
    @AccessToken() accessTokenPayload: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return await this.profileService.update(accessTokenPayload, id, updateProfileDto);
  }

  @Delete(':id')
  @Permissions("profile:delete") // Only users with 'profile:delete' permission can access this endpoint
  @ApiDeleteProfile()
  async remove(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', ParseIntPipe) id: number) {
    return await this.profileService.remove(accessTokenPayload, id);
  }
}
