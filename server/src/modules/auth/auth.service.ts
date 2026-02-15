import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FindAuthDto } from './dto/find-auth.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
  ) {}  
  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.create(createAuthDto);
  }

  async findAll() {
    return await this.authRepository.findAll();
  }

  async findOne(options: FindAuthDto) {    
    return await this.authRepository.findOne({ where: options });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.authRepository.update(id, updateAuthDto);
  }

  async remove(id: number) {
    return await this.authRepository.delete({ where: { id } });
  }
}
