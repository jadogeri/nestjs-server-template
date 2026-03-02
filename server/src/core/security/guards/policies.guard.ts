import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Service } from '../../../common/decorators/service.decorator';
import { Action } from '../../../common/enums/action.enum';
import { Resource } from '../../../common/types/resource.type';
import { CaslAbilityFactory } from '../casl/casl-ability.service';
import { AccessTokenPayload } from '../../../common/types/access-token-payload.type';
import { PERMISSIONS_KEY } from '../../../common/decorators/permissions.decorator';
import { PermissionString } from '../../../common/types/permission-string.type';
import { PermissionStringGeneratorUtil } from '../../../common/utils/permission-string.util';


@Service()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.getAllAndOverride<PermissionString[]>(PERMISSIONS_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

    console.log("inside of policies guard.................................................");
    console.log("required policies ==> ", rules);
      // 1. Get the request object
    const request = context.switchToHttp().getRequest();
    
    // 2. Access the user property attached by Passport
    const accessTokenUser: AccessTokenPayload = request.user; 

    if (!accessTokenUser) {
        console.error("No user found on request. Ensure AuthGuard('access-token') is applied.");
        return false;
    }

    const ability = this.caslAbilityFactory.createForUser(accessTokenUser);
    
    // Check if user has permission for every rule defined on the route
    return rules.every((rule: PermissionString) => {
      const { action, resource } = PermissionStringGeneratorUtil.extract(rule);
      return ability.can(action, resource);
    });
  }
}
