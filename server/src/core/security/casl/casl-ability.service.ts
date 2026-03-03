import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Service } from '../../../common/decorators/service.decorator';
import { User } from '../../../modules/user/entities/user.entity';
import { Action } from '../../../common/enums/action.enum';
import { Resource } from '../../../common/types/resource.type';
import { AccessTokenPayload } from '../../../common/types/access-token-payload.type';
import { PermissionString } from '../../../common/types/permission-string.type';
import { PermissionStringGeneratorUtil } from '../../../common/utils/permission-string.util';


// Define your resources as a union type for better IDE support
export type Subjects = InferSubjects<typeof User> | Resource ;
export type AppAbility = MongoAbility<[Action , Subjects]>;

@Service()
export class CaslAbilityFactory {
  createForUser(accessTokenPayload: AccessTokenPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    console.log(`Creating abilities from access token payload  ....................`);
    const { email, roles, permissions } = accessTokenPayload;
    console.log(`Access Token Payload: email=${email}, roles=${JSON.stringify(roles)}, permissions=${JSON.stringify(permissions)}`);

        // 1. Handle Super User Role (Independent of other roles)
    if (roles.includes('SUPER_USER')) {
      can(Action.MANAGE, 'all');
    }

    // 2. Add granular permissions (Always run this, outside any role loop)
    permissions.forEach((perm: PermissionString) => {
      const { resource, action } = PermissionStringGeneratorUtil.extract(perm);
      


      if (resource === 'all' && action === Action.MANAGE) {
        can(Action.MANAGE, 'all');
      } else {    
        can(action, resource);
      } 
    });

    return build({
      detectSubjectType: (item) => 
        typeof item === 'string' 
          ? (item as ExtractSubjectType<Subjects>) 
          : (item.constructor as ExtractSubjectType<Subjects>),
    });
  }
}
