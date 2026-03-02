import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Service } from '../../../common/decorators/service.decorator';
import { Action } from '../../../common/enums/action.enum';
import { Resource } from '../../../common/types/resource.type';
import { CaslAbilityFactory } from '../casl/casl-ability.service';


interface RequiredPermission {
  action: Action;
  resource: Resource;
}

@Service()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredPermission[]>('permissions', context.getHandler()) || [];
    
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const ability = this.caslAbilityFactory.createForUser(user);
    
    // Check if user has permission for every rule defined on the route
    return rules.every((rule) => ability.can(rule.action, rule.resource as Resource));
  }
}
