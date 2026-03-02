
import { SetMetadata } from '@nestjs/common';
export const CheckPermissions = (...params: any[]) => SetMetadata('permissions', params);
