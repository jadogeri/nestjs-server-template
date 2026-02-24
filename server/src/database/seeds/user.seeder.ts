import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { Contact } from '../../modules/contact/entities/contact.entity';
import { Auth } from '../../modules/auth/entities/auth.entity'; 
import { HashingService } from '../../core/security/hashing/interfaces/hashing.service';
import { Argon2Service } from '../../core/security/hashing/argon2.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../common/enums/user-role.enum';
import { StatusEnum } from '../../common/enums/user-status.enum';
import { Role } from '../../modules/role/entities/role.entity';
import dotenv from 'dotenv';
import { Profile } from '../../modules/profile/entities/profile.entity';
import moment from 'moment';

dotenv.config();

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    console.log('Starting UserSeeder...');
    console.log('start time:', new Date().toISOString());
    
    const userRepository = dataSource.getRepository(User);
    const contactRepository = dataSource.getRepository(Contact);
    const authRepository = dataSource.getRepository(Auth);
    const roleRepository = dataSource.getRepository(Role);
    const profileRepository = dataSource.getRepository(Profile); // Added
    
    const contactFactory = factoryManager.get(Contact);
    const profileFactory = factoryManager.get(Profile); // Added
        
    const configService = new ConfigService();
    const argons2Service: HashingService = new Argon2Service(configService);

        // --- 1. VALIDATION GUARD ---
    const requiredEnvVars = [
      'ROOT_EMAIL',
      'ROOT_PASSWORD',
      'ROOT_FIRST_NAME',
      'ROOT_LAST_NAME',
      'ROOT_DATE_OF_BIRTH'
    ];

    const missingVars = requiredEnvVars.filter(key => !process.env[key]);

    if (missingVars.length > 0) {
      console.error('❌ SEEDING ABORTED: Missing required environment variables:');
      missingVars.forEach(v => console.error(`   - ${v}`));
      return; // Stop execution immediately
    }

    //0. Environment Variables 
    const rootEmail = process.env.ROOT_EMAIL || '';
    const rootPassword = process.env.ROOT_PASSWORD || '';
    const rootFirstName = process.env.ROOT_FIRST_NAME || '';
    const rootLastName = process.env.ROOT_LAST_NAME || '';
    const rootDateOfBirth    = process.env.ROOT_DATE_OF_BIRTH || '';

    // 1. Verify Role exists
    const superUserRole = await roleRepository.findOne({ where: { name: UserRole.SUPER_USER } });
    if (!superUserRole) {
      console.error(`Role ${UserRole.SUPER_USER} not found. Aborting.`);
      return;
    }

    // 2. Prevent Duplicates
    const existingAdmin = await authRepository.findOne({ where: { email: rootEmail } });
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seeding.');
      return;
    }

    const hashedPassword = await argons2Service.hash(rootPassword);

    // 3. Define the Entities (Do NOT call .save() yet)
    const adminUser = userRepository.create({
      firstName: rootFirstName,
      lastName: rootLastName,
      dateOfBirth: new Date(`${rootDateOfBirth}T00:00:00Z`),
      roles: [superUserRole],
    });

    const adminAuth = authRepository.create({
      email: rootEmail,
      password: hashedPassword,
      isEnabled: true,
      isVerified: true,
      verifiedAt: new Date(),
      status: StatusEnum.ENABLED,
      user: adminUser, // Link the user object here
    });

    // 4. Save via Auth (Cascades to User)
    // NOTE: Ensure your Auth entity relation has { cascade: true } 
    // or TypeORM will save them in the correct order automatically.
    const savedAdminAuth = await authRepository.save(adminAuth);
    const savedAdminUser = savedAdminAuth.user; // Access the saved user from the auth result

    console.log('Admin Auth & User created successfully with ID:', savedAdminUser.id);

    // 5. Generate 1 Profile for Admin (New)
    const existingProfile = await profileRepository.findOne({ where: { user: { id: savedAdminUser.id } } });
    if (existingProfile === null) {
      const adminProfile = await profileFactory.save({ user: savedAdminUser });
      console.log(`Generated profile for admin user (ID: ${adminProfile.id})`);
    }else{
      console.log('Profile already exists for this user.');
    }

    // 6. Generate Contacts
    const contactsCount = await contactRepository.count({ where: { user: { id: savedAdminUser.id } } });
    if (contactsCount === 0) {
      // Use the Factory to generate 10 contacts linked to the new user
      const contacts = await contactFactory.saveMany(10, { user: savedAdminUser });
      console.log(`Generated ${contacts.length} contacts for admin user.`);
    } else {
      console.log('Contacts already exist for this user.');
    }

    console.log('Seeding completed.');
    console.log('end time:', new Date().toISOString());
  }
  
}