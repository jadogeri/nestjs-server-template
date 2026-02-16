
// 1. NestJS & Third-Party Libs
import { DocumentBuilder } from '@nestjs/swagger';
import dotenv from 'dotenv';

dotenv.config();

const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
console.log(`Using refresh token cookie name: ${REFRESH_TOKEN_COOKIE_NAME}`);

  export const swaggerConfig = new DocumentBuilder()
    .setTitle('User Auth App')
    .setDescription('The API description')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact('User API', 'https://your-website.com', 'your-email@example.com')
    .setTermsOfService('https://your-website.com/terms')
    .setExternalDoc('Find out more', 'https://your-website.com/docs')
    .addServer('http://localhost:3000', "Local development server")
    .addServer('https://your-website.com', "Production server")
    .addServer('https://staging.your-website.com', "Staging server")
    .addServer('http://localhost:3001', "Testing server")
    .addTag('User', 'Operations related to users')
    .addTag('Auth', 'Operations related to authentication')
    .addTag('Profile', 'Operations related to user profiles')
    .addTag('Contact', 'Operations related to contacts')
    // .addTag('Admin', 'Administrative operations')
    .addTag('Session', 'Operations related to user sessions')
    .addTag('Permission', 'Operations related to permissions')
    .addTag('Role', 'Operations related to roles')
    // Add bearer authentication if your API uses JWTs
    .addBearerAuth()
    .addCookieAuth('refresh-token', { // This key must match ApiCookieAuth('refresh-token')
      type: 'apiKey',
      in: 'cookie',
      name: REFRESH_TOKEN_COOKIE_NAME, // The ACTUAL name of the cookie sent in headers
    })
    .build();


