// 1. NestJS & Third-Party Libs


// 2. Services & Helpers (Logic Layer)
import { AuthRepository } from './auth.repository';



// 3. DTOs & Entities (Data Layer)
import { RegisterDto } from './dto/register.dto';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';



// 4. Custom Decorators (Documentation/Metatdata)
import { Service } from '../../common/decorators/service.decorator';

@Service()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
  ) {}  

  async register(registerDto: RegisterDto) {
    return { success: true, 
      message: 'Registration successful. Please check your email to verify your account.' 
    };
  }

  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.create(createAuthDto);
  }

  async findAll() {
    return await this.authRepository.findAll({});
  }

  async findOne(id: number) {    
    return await this.authRepository.findOne({ where: { id }, relations: [] });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.authRepository.update(id, updateAuthDto);
  }

  async remove(id: number) {
    return await this.authRepository.delete(id);
  }
}
