import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';
import { Action } from '../../common/enums/action.enum';
import { CacheService } from '../../core/infrastructure/cache/cache.service';
import { CacheKeys } from '../../core/infrastructure/cache/cache-keys.types';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly cacheService: CacheService,
  ) {}

  async create(accessTokenPayload: AccessTokenPayload, createPermissionDto: CreatePermissionDto) {
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    
    // Check permission to create the resource type
    if (ability.cannot(Action.CREATE, 'Permission' as any)) {
      throw new ForbiddenException('You do not have permission to create permissions');
    }

    const permission = await this.permissionRepository.create(createPermissionDto);

    // Invalidate the global list cache
    await this.cacheService.delete(CacheKeys.permissions.all);
    return permission;
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    
    if (ability.cannot(Action.READ, 'Permission' as any)) {
      throw new ForbiddenException('You do not have permission to view permissions');
    }

    const cacheKey = CacheKeys.permissions.all;
    const cachedData = await this.cacheService.get<any[]>(cacheKey);
    if (cachedData) return cachedData;

    const permissions = await this.permissionRepository.findAll({});
    await this.cacheService.set(cacheKey, permissions);
    
    return permissions;
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) {
    const cacheKey = CacheKeys.permissions.byId(id.toString());
    
    // Try cache first
    let permission = await this.cacheService.get<any>(cacheKey);

    if (!permission) {
      permission = await this.permissionRepository.findOne({ where: { id } });
      if (!permission) throw new NotFoundException(`Permission #${id} not found`);
      await this.cacheService.set(cacheKey, permission);
    }

    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);
    // Note: If permissions have ownership logic, check against the instance; otherwise check the type
    if (ability.cannot(Action.READ, permission)) {
      throw new ForbiddenException('You do not have permission to view this permission');
    }

    return permission;
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updatePermissionDto: UpdatePermissionDto) {
    const existingPermission = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    if (ability.cannot(Action.UPDATE, existingPermission)) {
      throw new ForbiddenException('You do not have permission to update this permission');
    }

    const updated = await this.permissionRepository.update(id, updatePermissionDto);
    await this.invalidatePermissionCache(id);
    
    return updated;
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    const existingPermission = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    if (ability.cannot(Action.DELETE, existingPermission)) {
      throw new ForbiddenException('You do not have permission to delete this permission');
    }

    const result = await this.permissionRepository.delete(id);
    await this.invalidatePermissionCache(id);
    
    return result;
  }

  private async invalidatePermissionCache(permissionId: number) {
    await Promise.all([
      this.cacheService.delete(CacheKeys.permissions.byId(permissionId.toString())),
      this.cacheService.delete(CacheKeys.permissions.all),
    ]);
  }
}
