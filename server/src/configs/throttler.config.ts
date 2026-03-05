import { seconds, ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig : ThrottlerModuleOptions= {
    throttlers: [
        { name: 'short', ttl: seconds(1), limit: 3 },       
        { name: 'medium', ttl: seconds(10), limit: 20 },
        { name: 'long', ttl: seconds(60), limit: 100 }
    ],
};