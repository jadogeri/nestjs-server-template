import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { Service } from '../../common/decorators/service.decorator';

@Service()
export class StatsService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getRoleDistribution() {
    return this.roleRepository.createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .select('role.name', 'name')
      .addSelect('COUNT(user.id)', 'value')
      .groupBy('role.name')
      .getRawMany();
  }

  async getGeneralStats() {
    const [users, roles] = await Promise.all([
      this.userRepository.count(),
      this.roleRepository.count(),
    ]);
    return { users, roles };
  }
}
