import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
@Injectable()
export class ContactRepository extends BaseRepository<Contact> {
  constructor(
    @InjectRepository(Contact)
    private readonly repo: Repository<Contact>,
  ) {
    super(repo); // Pass the injected TypeORM repo to the super class
  }

}
