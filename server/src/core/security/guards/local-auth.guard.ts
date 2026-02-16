
import { AuthGuard } from '@nestjs/passport';
import { Guard } from '../../../common/decorators/guard.decorator';

@Guard()
export class LocalAuthGuard extends AuthGuard('local') {}


