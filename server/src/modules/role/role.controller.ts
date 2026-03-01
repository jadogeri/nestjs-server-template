import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiPostRole } from './decorators/api-post-role.decorator';
import { ApiGetRole } from './decorators/api-get-role.decorator';
import { ApiGetRoles } from './decorators/api-get-roles.decorator';
import { ApiPatchRole } from './decorators/api-patch-role.decorator';
import { ApiDeleteRole } from './decorators/api-delete-role.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import { RoleService } from './role.service';


@Controller('roles')
@UseGuards(AccessAuthGuard )
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiPostRole()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiGetRoles()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiGetRole()
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiPatchRole()
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiDeleteRole()
  remove(@Param('id') id: number) {
    return this.roleService.remove(id);
  }
}
