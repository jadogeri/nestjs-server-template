import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './contact.repository';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';
import { Action } from '../../common/enums/action.enum';
import { CacheService } from '../../core/infrastructure/cache/cache.service'; 
import { CacheKeys } from '../../core/infrastructure/cache/cache-keys.types';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly cacheService: CacheService, // 1. Inject CacheService
  ) {}

  async create(accessTokenPayload: AccessTokenPayload, createContactDto: CreateContactDto) {
    const contact = await this.contactRepository.create({ 
      ...createContactDto, 
      user: { id: accessTokenPayload.userId } 
    });

    // Invalidate the user's contact list cache
    await this.cacheService.delete(CacheKeys.contacts.byUserId(accessTokenPayload.userId.toString()));
    return contact;
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {
    const { roles, userId } = accessTokenPayload;
    const isAdmin = roles.includes('SUPER_USER') || roles.includes('ADMIN');
    
    // We only cache the "personal" list for now; admins usually need live data
    const cacheKey = isAdmin ? 'contacts:admin:all' : CacheKeys.contacts.byUserId(userId.toString());
    
    const cachedData = await this.cacheService.get<any[]>(cacheKey);
    if (cachedData) return cachedData;

    const contacts = isAdmin 
      ? await this.contactRepository.findAll()
      : await this.contactRepository.findAll({ where: { user: { id: userId } } });

    await this.cacheService.set(cacheKey, contacts);
    return contacts;
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {
    const cacheKey = CacheKeys.contacts.byId(id.toString());
    
    // Try cache first
    let contact = await this.cacheService.get<any>(cacheKey);

    if (!contact) {
      contact = await this.contactRepository.findOne({ where: { id } });
      if (!contact) throw new NotFoundException(`Contact #${id} not found`);
      await this.cacheService.set(cacheKey, contact);
    }

    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    if (ability.cannot(Action.READ, contact)) {
      throw new ForbiddenException('You do not have permission to view this contact');
    }

    return contact;
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updateContactDto: UpdateContactDto) {
    const existingContact = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    if (ability.cannot(Action.UPDATE, existingContact)) {
      throw new ForbiddenException('You do not have permission to update this contact');
    }

    Object.assign(existingContact, updateContactDto);
    const updated = await this.contactRepository.update(id, existingContact);

    // Invalidate both the individual contact and the user's list
    await this.invalidateContactCache(accessTokenPayload.userId, id);
    
    return updated;
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    const existingContact = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    if (ability.cannot(Action.DELETE, existingContact)) {
      throw new ForbiddenException('You do not have permission to delete this contact');
    }

    const result = await this.contactRepository.delete(id);
    await this.invalidateContactCache(accessTokenPayload.userId, id);
    return result;
  }

  // Helper to keep code clean
  private async invalidateContactCache(userId: number, contactId: number) {
    await Promise.all([
      this.cacheService.delete(CacheKeys.contacts.byId(contactId.toString())),
      this.cacheService.delete(CacheKeys.contacts.byUserId(userId.toString())),
      this.cacheService.delete('contacts:admin:all') // Clear admin view if applicable
    ]);
  }
}
