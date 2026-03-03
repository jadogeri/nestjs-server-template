import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Service } from "../../../common/decorators/service.decorator";
import { PermissionString } from "../../../common/types/permission-string.type";
import { PERMISSIONS_KEY } from "../../../common/decorators/permissions.decorator";
import { Action } from "../../../common/enums/action.enum";
import { Resource } from "src/common/types/resource.type";


@Service()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionString[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("inside of permission guard.................................................");
    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log("user in guard==> ", user);

    console.log("user per==> ", user.permissions);
    console.log("requiredPermissions ==> ", requiredPermissions);

    const action: Action = Action.MANAGE; // Default action for all permissions
    const resource : Resource = "all"; // Default resource for all permissions
    
    return requiredPermissions.every((permission) => 
      user.permissions?.includes(permission) || user.permissions?.includes(`${resource}:${action}`) // Check for global manage permission
    );
  }
}
