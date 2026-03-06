import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './profile.repository';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';
import { Action } from '../../common/enums/action.enum';
import { Profile } from './entities/profile.entity';
import { O } from 'node_modules/@faker-js/faker/dist/airline-Dz1uGqgJ';


@Injectable()
export class ProfileService {

  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}  
  async create(accessTokenPayload: AccessTokenPayload, createProfileDto: CreateProfileDto) {
        // Basic creation - always link to the creator
    return await this.profileRepository.create({ 
      ...createProfileDto, 
      user: { id: accessTokenPayload.userId } 
    });
  }

  async findAll(accessTokenPayload: AccessTokenPayload  ) {
    const { roles, userId } = accessTokenPayload;

    // Logic: Admins see all, regular users see only theirs
    if (roles.includes('SUPER_USER') || roles.includes('ADMIN')) {
      return await this.profileRepository.findAll();
    }

    // For regular users, only return profiles where profile.user.id matches token.userId
    return await this.profileRepository.findAll({ where: { user: { id: userId } } });
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {    
    // 1. Fetch by ID first (don't filter by userId in SQL so Admins can find it)
    const profile : Profile  | null = await this.profileRepository.findOne({ where: { id }, relations: ["users"] });
    if (!profile) throw new NotFoundException(`Profile #${id} not found`);
    // 2. Check Permissions via CASL
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);  
    // Checks if user is Admin OR if profile.user.id === token.userId
    if (ability.cannot(Action.READ, profile)) {
      throw new ForbiddenException(`You do not have permission to view Profile #${id}`); // Hide existence if no access
    }
    return profile;
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updateProfileDto: UpdateProfileDto) {
    const existingProfile = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    
    // Checks if user is Admin OR if profile.user.id === token.userId
    if (ability.cannot(Action.UPDATE, existingProfile)) {
      throw new ForbiddenException(`You do not have permission to update Profile #${id}`); // Hide existence if no access
    }
    Object.assign(existingProfile, updateProfileDto); // Merge updates into existing entity
    return await this.profileRepository.update(id, updateProfileDto);
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    const existingProfile = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    
    // Checks if user is Admin OR if profile.user.id === token.userId
    if (ability.cannot(Action.DELETE, existingProfile)) {
      throw new ForbiddenException(`You do not have permission to delete Profile #${id}`); // Hide existence if no access
    }
    return await this.profileRepository.delete(id);
  }
}
