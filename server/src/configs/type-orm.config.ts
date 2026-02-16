// 1. NestJS & Third-Party Libs
import { SeederOptions } from 'typeorm-extension';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';


import dotenv from 'dotenv';
import { TypeOrmPinoLogger } from '../common/logger/typeorm.logger';


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

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../database/subscribers/*{.ts,.js}'],
  // seeds: [UserSeeder],
  // factories: [UserFactory],
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

