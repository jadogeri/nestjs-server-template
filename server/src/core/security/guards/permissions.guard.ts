import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Service } from "../../../common/decorators/service.decorator";
import { PermissionString } from "../../../common/types/permission-string.type";
import { PERMISSIONS_KEY } from "../../../common/decorators/permissions.decorator";

@Service()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionString[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("inside of permission guard.................................................");
    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    console.log("user per==> ", user.permissions);
    console.log("requiredPermissions ==> ", requiredPermissions);
    
    return requiredPermissions.every((permission) => 
      user.permissions?.includes(permission) || user.permissions?.includes('*:*')
    );
  }
}
