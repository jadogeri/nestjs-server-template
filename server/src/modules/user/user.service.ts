import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { FindOneOptions, FindOptionsRelations } from 'typeorm';
import { User } from './entities/user.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
  ) {}  
  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  async findAll() {
    return await this.userRepository.findAll({});
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {    
    return await this.userRepository.findOne(options);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
