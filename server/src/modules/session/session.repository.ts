import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
@Injectable()
export class SessionRepository extends BaseRepository<Session> {
  constructor(
    @InjectRepository(Session)
    private readonly repo: Repository<Session>,
  ) {
    super(repo); // Pass the injected TypeORM repo to the super class
  }

}
