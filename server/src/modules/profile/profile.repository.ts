import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
@Injectable()
export class ProfileRepository extends BaseRepository<Profile> {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {
    super(repo); // Pass the injected TypeORM repo to the super class
  }

}
