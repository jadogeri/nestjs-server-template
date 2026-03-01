import { InjectRepository } from '@nestjs/typeorm';
import { Not, IsNull, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { Service } from '../../common/decorators/service.decorator';
import { Contact } from '../contact/entities/contact.entity';

@Service()
export class StatsService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Contact) private readonly contactRepository: Repository<Contact>
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

      async getContactStats() {
        // 1. Geographic Distribution (by City)
        // Note: location.city refers to the embedded column
        const regions = await this.contactRepository
            .createQueryBuilder('contact')
            .select('contact.location.city', 'name')
            .addSelect('COUNT(contact.id)', 'value')
            .where('contact.location.city IS NOT NULL')
            .groupBy('contact.location.city')
            .getRawMany();

        // 2. Completeness Score
        const total = await this.contactRepository.count();
        const complete = await this.contactRepository.count({
            where: {
                email: Not(IsNull()),
                phone: Not(IsNull()),
                // Checking if embedded city exists
                location: { city: Not(IsNull()) }
            }
        });
        const completeness = total > 0 ? Math.round((complete / total) * 100) : 0;

        // 3. Communication Channels
        const emailCount = await this.contactRepository.count({ where: { email: Not(IsNull()) } });
        const phoneCount = await this.contactRepository.count({ where: { phone: Not(IsNull()) } });
        const faxCount = await this.contactRepository.count({ where: { fax: Not(IsNull()) } });

        // 4. User Ownership (Top Owners) - SQLite Concatenation Fix
        const topOwners = await this.contactRepository
            .createQueryBuilder('contact')
            .leftJoin('contact.user', 'user')
            // 1. Concatenate firstName and lastName with a space
            .select("user.firstName || ' ' || user.lastName", 'name') 
            .addSelect('COUNT(contact.id)', 'value')
            // 2. Group by the ID and the raw columns (SQLite requirement)
            .where('user.id IS NOT NULL')
            .groupBy('user.id')
            .addGroupBy('user.firstName') 
            .addGroupBy('user.lastName')
            // 3. Order by the count
            .orderBy('COUNT(contact.id)', 'DESC') 
            .limit(5)
            .getRawMany();


        return {
            regions,
            completeness,
            channels: [
                { name: 'Email', value: Number(emailCount) },
                { name: 'Phone', value: Number(phoneCount) },
                { name: 'Fax', value: Number(faxCount) },
            ],
            topOwners,
            totalContacts: total
        };
    }
}
