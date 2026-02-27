import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiPostUser } from './decorators/api-post-user.decorator';
import { ApiGetUser } from './decorators/api-get-user.decorator';
import { ApiGetUsers } from './decorators/api-get-users.decorator';
import { ApiPatchUser } from './decorators/api-patch-user.decorator';
import { ApiDeleteUser } from './decorators/api-delete-user.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';

@UseGuards(AccessAuthGuard )
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiPostUser()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiGetUsers()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiGetUser()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @ApiPatchUser()
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiDeleteUser()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
