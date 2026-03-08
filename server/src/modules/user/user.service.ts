import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';
import { Action } from '../../common/enums/action.enum';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}  
  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create({
      ...createUserDto,
    });
  }

  async findAll(accessTokenPayload: AccessTokenPayload) {
    const { roles } = accessTokenPayload;

    // 1. Super User gets global access
    if (roles.includes('SUPER_USER')) {
      return await this.userRepository.findAll({});
    }

    throw new ForbiddenException('You do not have permission to access this resource');
    
  }

  async findOne(accessTokenPayload: AccessTokenPayload, id: number) { 

    // 1. Fetch by ID first (don't filter by userId in SQL so Admins can find it)
    const user = await this.userRepository.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    
    // 2. Check Permissions via CASL
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    // Checks if user is Admin OR if user.id === token.userId
    if (ability.cannot(Action.READ, user)) {
      throw new ForbiddenException(`You do not have permission to access this user`); // Hide existence if no permission
    }
    return user;
  }

  async findById(accessTokenPayload: AccessTokenPayload, id: number): Promise<User | null> {    
    return await this.userRepository.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
  }

  async update(accessTokenPayload: AccessTokenPayload, id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    // Checks if user is Admin OR if user.id === token.userId
    if (ability.cannot(Action.UPDATE, existingUser)) {
      throw new ForbiddenException('You do not have permission to update this user');
    }
    Object.assign(existingUser, updateUserDto);
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(accessTokenPayload: AccessTokenPayload, id: number) {
    const existingUser = await this.findOne(accessTokenPayload, id);
    const ability = this.caslAbilityFactory.createForUser(accessTokenPayload);

    // Checks if user is Admin OR if user.id === token.userId
    if (ability.cannot(Action.DELETE, existingUser)) {
      throw new ForbiddenException('You do not have permission to delete this user');
    }
    return await this.userRepository.delete(id);
  }
}
