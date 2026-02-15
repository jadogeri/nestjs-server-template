import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {

  constructor(
    private readonly sessionRepository: SessionRepository,
  ) {}  
  async create(createSessionDto: CreateSessionDto) {
    return await this.sessionRepository.create(createSessionDto);
  }

  async findAll() {
    return await this.sessionRepository.findAll({});
  }

  async findOne(id: string) {    
    return await this.sessionRepository.findOne({ where: { id }, relations: [] });
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    return await this.sessionRepository.update(id, updateSessionDto);
  }

  async remove(id: string) {
    return await this.sessionRepository.delete(id);
  }
}
