import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
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


@Controller('sessions')
@UseGuards(AccessAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiPostSession()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  @ApiGetSessions()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  @ApiGetSession()
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sessionService.findOne(id);
  }

  @Patch(':id')
  @ApiPatchSession()
  update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateSessionDto: UpdateSessionDto
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @ApiDeleteSession()
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sessionService.remove(id);
  }
}
