import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';

@Injectable()
export class PermissionService {

  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}  
  async create(accessTokenPayload: AccessTokenPayload, createPermissionDto: CreatePermissionDto) {
    return await this.permissionRepository.create(createPermissionDto);
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {
    return await this.permissionRepository.findAll({});
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {    
    return await this.permissionRepository.findOne({ where: { id }, relations: [] });
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    return await this.permissionRepository.delete(id);
  }
}
