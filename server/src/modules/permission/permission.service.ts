import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {

  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}  
  async create(createPermissionDto: CreatePermissionDto) {
    return await this.permissionRepository.create(createPermissionDto);
  }

  async findAll() {
    return await this.permissionRepository.findAll({});
  }

  async findOne(id: number) {    
    return await this.permissionRepository.findOne({ where: { id }, relations: [] });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: number) {
    return await this.permissionRepository.delete(id);
  }
}
