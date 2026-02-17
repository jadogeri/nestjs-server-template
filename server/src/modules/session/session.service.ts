import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  private readonly MAX_SESSIONS = 5; // Max sessions per user


  constructor(
    private readonly sessionRepository: SessionRepository,
  ) {}  

 async create(createSessionDto: CreateSessionDto) {
    const { id, refreshTokenHash, auth, expiresAt } = createSessionDto;
    console.log(`Creating session for user ${auth.id} with session ID ${id}`);
    // 1. Count existing sessions for this user
    const [sessions, count] = await this.sessionRepository.findAllAndCountByAuth(auth.id);

    // 2. If at limit, delete the oldest one(s)
    if (count >= this.MAX_SESSIONS) {
      const oldestSession = sessions[0];
      await this.sessionRepository.delete(oldestSession.id);
    }

    // 3. Create the new session
    const newSession = await this.sessionRepository.create({
      id: id, // Use provided session ID or generate a new one
      refreshTokenHash,
      auth: auth, // Only set the ID to avoid unnecessary data
      //#TODO replace commented line with the line below after testing
      //expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    

    return newSession;
  }

  async findAll() {
    return await this.sessionRepository.findAll({});
  }

  async findOne(id: string) {    
    return await this.sessionRepository.findOne({ where: { id }, relations: ['auth'] });
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    return await this.sessionRepository.update(id, updateSessionDto);
  }

  async remove(id: string) {
    return await this.sessionRepository.delete(id);
  }
}
