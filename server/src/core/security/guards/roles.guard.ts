import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../../common/decorators/roles.decorator";
import { UserRole } from "../../../common/enums/user-role.enum";
import { Service } from "../../../common/decorators/service.decorator";

@Service()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
    
  canActivate(context: ExecutionContext): boolean {
    // Retrieves the array of roles defined on the handler
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    // Check if user has ANY of the required roles
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
