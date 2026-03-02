import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiPostContact } from './decorators/api-post-contact.decorator';
import { ApiPatchContact } from './decorators/api-patch-contact.decorator';
import { ApiDeleteContact } from './decorators/api-delete-contact.decorator';
import { ApiGetContact } from './decorators/api-get-contact.decorator';
import { ApiGetContacts } from './decorators/api-get-contacts.decorator';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import type { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../core/security/guards/roles.guard';
import { PoliciesGuard } from '../../core/security/guards/policies.guard';

@Controller('contacts')
@UseGuards(AccessAuthGuard, PoliciesGuard )
export class ContactController {

  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiPostContact()
  async create(@AccessToken() accessTokenPayload: AccessTokenPayload, @Body() createContactDto: CreateContactDto) {
    return await this.contactService.create(accessTokenPayload, createContactDto);
  }

  @Get()
  @UseGuards(PermissionsGuard, RolesGuard) // Apply both guards to this endpoint)
  @Permissions("*:*") // Only ADMIN can access this endpoint
  @Roles('USER', 'SUPER_USER') // Only users with ADMIN role can access this endpoint
  @ApiGetContacts()
  async findAll(@AccessToken() accessTokenPayload: AccessTokenPayload) {

    return await this.contactService.findAll(accessTokenPayload);
  }
  
  @Get(':id')
  @UseGuards(PermissionsGuard) // Apply both guards to this endpoint)
  @Permissions("contact:read") // Only users with 'contact:read' permission can access this endpoint
  @ApiGetContact()  
  async findOne(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id') id: string) {
    return await this.contactService.findOne(accessTokenPayload, +id);
  }

  @Patch(':id')
  @Permissions("contact:update") // Only users with 'contact:update' permission can access this endpoint
  @ApiPatchContact()  
  async update(@AccessToken() accessTokenPayload: AccessTokenPayload , @Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return await this.contactService.update(accessTokenPayload, +id, updateContactDto);
  }

  @Delete(':id')
  @Permissions("contact:delete") // Only users with 'contact:delete' permission can access this endpoint
  @ApiDeleteContact()
  async remove(@AccessToken() accessTokenPayload: AccessTokenPayload, @Param('id') id: string) {
    return await this.contactService.remove(accessTokenPayload, +id);
  }
}
