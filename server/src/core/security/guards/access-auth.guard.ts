
import { AuthGuard } from '@nestjs/passport';
import { Guard } from '../../../common/decorators/guard.decorator';

@Guard()
export class AccessAuthGuard extends AuthGuard('access-token') {}