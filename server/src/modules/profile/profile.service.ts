import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {

  constructor(
    private readonly profileRepository: ProfileRepository,
  ) {}  
  async create(createProfileDto: CreateProfileDto) {
    return await this.profileRepository.create(createProfileDto);
  }

  async findAll() {
    return await this.profileRepository.findAll({});
  }

  async findOne(id: number) {    
    return await this.profileRepository.findOne({ where: { id }, relations: ["users"] });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    return await this.profileRepository.update(id, updateProfileDto);
  }

  async remove(id: number) {
    return await this.profileRepository.delete(id);
  }
}
