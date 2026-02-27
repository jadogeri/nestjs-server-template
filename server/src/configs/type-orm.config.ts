// 1. NestJS & Third-Party Libs
import { SeederOptions } from 'typeorm-extension';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';


import dotenv from 'dotenv';
import UserSeeder from '../database/seeds/user.seeder';
import ContactFactory from '../database/factories/contact.factory';
import ProfileFactory from '../database/factories/profile.factory';

// 2. Entities
import { Auth } from '../modules/auth/entities/auth.entity';
import { Contact } from '../modules/contact/entities/contact.entity';
import { User } from '../modules/user/entities/user.entity';
import { Permission } from '../modules/permission/entities/permission.entity';
import { Role } from '../modules/role/entities/role.entity';
import { Profile } from '../modules/profile/entities/profile.entity';
import { Session } from '../modules/session/entities/session.entity';
//import { TypeOrmPinoLogger } from '../common/logger/typeorm.logger';


dotenv.config();

console.log("Loading TypeORM configuration...");

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const databaseFile = isProduction ? process.env.DATABASE || "prodDB.sqlite" : 'devDB.sqlite';
console.log("Using database file:", databaseFile);

export const dataSourceOptions: TypeOrmModuleOptions & SeederOptions = {
  type: 'sqlite',
  database: databaseFile,
  // {ts,js} matches both source and compiled files
    // 🔍 Check these paths carefully!
  entities: [User, Contact, Auth, Role, Permission, Profile, Session], // Add your entities here],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  factories: [ContactFactory, ProfileFactory], // Add your factories here
  seeds: [UserSeeder],
  synchronize: !isProduction,
  logging: isProduction === false ? ["warn","query", "error", "schema"] : ["error"],
  //logger: new TypeOrmPinoLogger(), 
  //maxQueryExecutionTime: 1000, // Trigger logQuerySlow if > 1 second
  
  // High-value for performance tuning: logs any query taking longer than 1 second
  //maxQueryExecutionTime: 1000, 
  
  // Use 'formatted-console' for readable SQL in dev
  logger: "advanced-console", 
  }  


export default dataSourceOptions;

