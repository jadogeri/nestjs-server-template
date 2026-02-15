import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {

  constructor(
    private readonly roleRepository: RoleRepository,
  ) {}  
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.create(createRoleDto);
  }

  async findAll() {
    return await this.roleRepository.findAll({});
  }

  async findOne(id: number) {    
    return await this.roleRepository.findOne({ where: { id }, relations: [] });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    return await this.roleRepository.delete(id);
  }
}
