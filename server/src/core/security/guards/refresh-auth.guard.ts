
import { AuthGuard } from '@nestjs/passport';
import { Guard } from '../../../common/decorators/guard.decorator';

@Guard()
export class RefreshAuthGuard extends AuthGuard('refresh-token') {}