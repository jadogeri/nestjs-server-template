import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './contact.repository';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(accessTokenPayload: AccessTokenPayload, createContactDto: CreateContactDto) {
    const existingContact = await this.contactRepository.findOne({ 
      where: { 
        user: { id: accessTokenPayload.userId } 
      } 
    }); 
    
    if (existingContact) {
      throw new ConflictException(`Contact for user #${accessTokenPayload.userId} already exists`);
    }

    return await this.contactRepository.create({ 
      ...createContactDto, 
      user: { id: accessTokenPayload.userId } 
    });
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {
    return await this.contactRepository.findAll({ 
      where: { user: { id: accessTokenPayload.userId } }  
    });
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {
    const contact = await this.contactRepository.findOne({ 
      where: { 
        id, 
        user: { id: accessTokenPayload.userId } 
      } 
    });

    // If no contact matches BOTH the id and the userId, throw error
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return contact;
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updateContactDto: UpdateContactDto) {
    // 1. findOne validates existence and ownership; it throws 404 if check fails
    const existingContact = await this.findOne(accessTokenPayload, id);

    // 2. Merge update data into the existing entity
    Object.assign(existingContact, updateContactDto);

    // 3. Persist the changes
    return await this.contactRepository.update(id, existingContact);
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    // 1. findOne validates existence and ownership
    await this.findOne(accessTokenPayload, id);

    // 2. Perform the deletion
    return await this.contactRepository.delete(id);
  }
}
