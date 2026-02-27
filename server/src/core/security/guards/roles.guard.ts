import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../../common/decorators/roles.decorator";
import { Service } from "../../../common/decorators/service.decorator";

@Service()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
    
  canActivate(context: ExecutionContext): boolean {
    // Retrieves the array of roles defined on the handler
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("inside of role guard.................................................");
    console.log("requiredRoles ==> ", requiredRoles);
    
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log("user roles==> ", user.roles);
    // Check if user has ANY of the required roles
    return requiredRoles.some((role) => user.roles?.includes(role)) || user.roles?.includes('SUPER_USER');
  }
}
