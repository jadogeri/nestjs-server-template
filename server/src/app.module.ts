import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { ContactModule } from './modules/contact/contact.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';
import dataSourceOptions from './configs/type-orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

console.log("__dirname:", __dirname);

 @Module({
  imports: [
    CoreModule,
    UserModule, 
    AuthModule, 
    SessionModule, 
    ProfileModule, 
    RoleModule, 
    ContactModule, 
    PermissionModule,
        ServeStaticModule.forRoot({
  // Use join with process.cwd() for the absolute path
  rootPath: join(process.cwd(), '..','server', 'react-admin', 'dist'), 
  
  // The URL where your admin lives
  serveRoot: '/admin', // This should match the base in your Vite config
   // Don't exclude index.html, as it's needed for the admin panel to load
   // Exclude other files if necessary, but ensure index.html is served
   // exclude: ['/index.html'], // REMOVE this line entirely

  // REMOVE the 'exclude' line entirely. 
  // It is the cause of your PathError crashes.
    exclude: ['/api*'], 
    }),

    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})

export class AppModule {}


