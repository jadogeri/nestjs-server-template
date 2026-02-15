import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactService {

  constructor(
    private readonly contactRepository: ContactRepository,
  ) {}  
  async create(createContactDto: CreateContactDto) {
    return await this.contactRepository.create(createContactDto);
  }

  async findAll() {
    return await this.contactRepository.findAll({});
  }

  async findOne(id: number) {    
    return await this.contactRepository.findOne({ where: { id }, relations: [] });
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    return await this.contactRepository.update(id, updateContactDto);
  }

  async remove(id: number) {
    return await this.contactRepository.delete(id);
  }
}
