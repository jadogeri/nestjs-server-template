import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
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


@Controller('permissions')
@UseGuards(AccessAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiPostPermission()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @ApiGetPermissions()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiGetPermission()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @ApiPatchPermission()
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiDeletePermission()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }
}
