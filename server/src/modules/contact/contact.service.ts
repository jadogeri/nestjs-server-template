import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './contact.repository';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';
import { Action } from '../../common/enums/action.enum';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(accessTokenPayload: AccessTokenPayload, createContactDto: CreateContactDto) {
    // Basic creation - always link to the creator
    return await this.contactRepository.create({ 
      ...createContactDto, 
      user: { id: accessTokenPayload.userId } 
    });
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {
    const { roles, userId } = accessTokenPayload;

    // Logic: Admins see all, regular users see only theirs
    if (roles.includes('SUPER_USER') || roles.includes('ADMIN')) {
      return await this.contactRepository.findAll();
    }

    return await this.contactRepository.findAll({ 
      where: { user: { id: userId } }  
    });
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {
    // 1. Fetch by ID first (don't filter by userId in SQL so Admins can find it)
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) throw new NotFoundException(`Contact #${id} not found`);

    // 2. Check Permissions via CASL
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    
    // Checks if user is Admin OR if contact.user.id === token.userId
    if (ability.cannot(Action.READ, contact)) {
      throw new ForbiddenException('You do not have permission to view this contact');
    }

    return contact;
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updateContactDto: UpdateContactDto) {
    const existingContact = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    // Checks if user is Admin OR if contact.user.id === token.userId
    if (ability.cannot(Action.UPDATE, existingContact)) {
      throw new ForbiddenException('You do not have permission to update this contact');
    }

    Object.assign(existingContact, updateContactDto);
    return await this.contactRepository.update(id, existingContact);
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    const existingContact = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    // Checks if user is Admin OR if contact.user.id === token.userId
    if (ability.cannot(Action.DELETE, existingContact)) {
      throw new ForbiddenException('You do not have permission to delete this contact');
    }

    return await this.contactRepository.delete(id);
  }
}
