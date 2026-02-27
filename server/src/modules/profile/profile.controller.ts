import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiDeleteProfile } from './decorators/api-delete-profile.decorator';
import { ApiGetProfile } from './decorators/api-get-profile.decorator';
import { ApiGetProfiles } from './decorators/api-get-profiles.decorator';
import { ApiPatchProfile } from './decorators/api-patch-profile.decorator';
import { ApiPostProfile } from './decorators/api-post-profile.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';

@Controller('profile')
@UseGuards(AccessAuthGuard )

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiPostProfile()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiGetProfiles()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiGetProfile()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @ApiPatchProfile()
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiDeleteProfile()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.remove(id);
  }
}
