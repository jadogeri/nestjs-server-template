import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './contact.repository';
import { AccessTokenPayload } from 'src/common/types/access-token-payload.type';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(accessTokenPayload: AccessTokenPayload, createContactDto: CreateContactDto) {
    // Merging userId from token for security
    return await this.contactRepository.create({ 
      ...createContactDto, 
      userId: accessTokenPayload.userId 
    });
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {
    return await this.contactRepository.findAll({ 
      where: { userId: accessTokenPayload.userId } 
    });
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {
    const contact = await this.contactRepository.findOne({ 
      where: { userId: accessTokenPayload.userId, id } 
    });
    if (!contact) throw new NotFoundException(`Contact #${id} not found`);
    return contact;
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updateContactDto: UpdateContactDto) {
    // 1. Check ownership first
    const existingContact = await this.findOne(accessTokenPayload, id);

       Object.assign(existingContact, updateContactDto);


    // 3. Return the fresh data (update() only returns metadata)
    return await this.contactRepository.update(id, existingContact);
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    // Ensure the contact exists and belongs to the user before deleting
    await this.findOne(accessTokenPayload, id);

    // Use the ID directly as the first argument
    return await this.contactRepository.delete(id);
  }
}
