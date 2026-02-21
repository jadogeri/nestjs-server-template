import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiPostContact } from './decorators/api-post-contact.decorator';
import { ApiPatchContact } from './decorators/api-patch-contact.decorator';
import { ApiDeleteContact } from './decorators/api-delete-contact.decorator';
import { ApiGetContact } from './decorators/api-get-contact.decorator';
import { ApiGetContacts } from './decorators/api-get-contacts.decorator';

@Controller('contact')
export class ContactController {

  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiPostContact()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiGetContacts()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  @ApiGetContact()  
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  @ApiPatchContact()  
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @ApiDeleteContact()
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
