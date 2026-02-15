import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,
  ) {
    super(repo); // Pass the injected TypeORM repo to the super class
  }

}
