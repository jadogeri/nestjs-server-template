import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiDeleteSession } from './decorators/api-delete-session.decorator';
import { ApiGetSession } from './decorators/api-get-session.decorator';
import { ApiGetSessions } from './decorators/api-get-sessions.decorator';
import { ApiPatchSession } from './decorators/api-patch-session.decorator';
import { ApiPostSession } from './decorators/api-post-session.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import type { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../core/security/guards/roles.guard';
import { PoliciesGuard } from '../../core/security/guards/policies.guard';
import { CacheMonitorInterceptor } from '../../core/infrastructure/interceptors/cache-monitor.interceptor';



@Controller('sessions')
@UseGuards(AccessAuthGuard, PoliciesGuard ) 
@UseInterceptors(CacheMonitorInterceptor) // Apply the monitor here   
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiPostSession()
  async create(@Body() createSessionDto: CreateSessionDto) {
    return await this.sessionService.create(createSessionDto);
  }

  @Get()
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("all:manage") // Only ADMIN can access this endpoint
  @Roles('SUPER_USER') // Only users with SUPER_USER role can access this endpoint
  @ApiGetSessions()
  async findAll(@AccessToken() accessTokenPayload: AccessTokenPayload) {
    return await this.sessionService.findAll(accessTokenPayload);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard) // Apply both guards to this endpoint)
  @Permissions("session:read") // Only users with 'session:read' permission can access this endpoint
  @ApiGetSession()  
  async findOne(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', new ParseUUIDPipe()) id: string) {
    return await this.sessionService.findOne(accessTokenPayload, id);
  } 

  @Patch(':id')
  @Permissions("session:update") // Only users with 'session:update' permission can access this endpoint
  @ApiPatchSession()
  async update(
    @AccessToken() accessTokenPayload: AccessTokenPayload,
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateSessionDto: UpdateSessionDto
  ) {
    return await this.sessionService.update(accessTokenPayload, id, updateSessionDto);
  }

  @Delete(':id')
  @ApiDeleteSession()
  async remove(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id', new ParseUUIDPipe()) id: string) {
    return await this.sessionService.remove(accessTokenPayload, id);
  }
}
