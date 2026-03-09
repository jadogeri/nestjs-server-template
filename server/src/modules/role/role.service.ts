import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';
import { Action } from '../../common/enums/action.enum';

@Injectable()
export class RoleService {

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}  
  async create(accessTokenPayload: AccessTokenPayload, createRoleDto: CreateRoleDto) {
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    if (ability.cannot(Action.MANAGE, 'role')) {
      throw new ConflictException('You do not have permission to create roles');
    }
    let { name } = createRoleDto;
    name = name.toUpperCase().trim(); // Normalize role name to uppercase and trim whitespace
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictException(`Role with name '${name}' already exists`);
    }
    return await this.roleRepository.create(createRoleDto);
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {

    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    if (ability.cannot(Action.MANAGE, 'role')) {
      throw new ConflictException('You do not have permission to view roles');
    }
    return await this.roleRepository.findAll({});
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {    
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    if (ability.cannot(Action.MANAGE, 'role')) {
      throw new ConflictException('You do not have permission to view this role');
    }
    return await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updateRoleDto: UpdateRoleDto) {
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    if (ability.cannot(Action.MANAGE, 'role')) {
      throw new ConflictException('You do not have permission to update this role');
    }
    return await this.roleRepository.update(id, updateRoleDto);
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    if (ability.cannot(Action.MANAGE, 'role')) {
      throw new ConflictException('You do not have permission to delete this role');
    }

    return await this.roleRepository.delete(id);
  }
}
