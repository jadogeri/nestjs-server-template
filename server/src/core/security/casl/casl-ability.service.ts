import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Service } from '../../../common/decorators/service.decorator';
import { User } from '../../../modules/user/entities/user.entity';
import { Action } from '../../../common/enums/action.enum';
import { Resource } from '../../../common/types/resource.type';
import { AccessTokenPayload } from '../../../common/types/access-token-payload.type';
import { PermissionString } from '../../../common/types/permission-string.type';
import { PermissionStringGeneratorUtil } from 'src/common/utils/permission-string.util';


// Define your resources as a union type for better IDE support
export type Subjects = InferSubjects<typeof User> | Resource | 'all';
export type AppAbility = MongoAbility<[Action | 'manage', Subjects]>;

@Service()
export class CaslAbilityFactory {
  createForUser(accessTokenPayload: AccessTokenPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    console.log(`Creating abilities from access token payload  ....................`);
    console.log(accessTokenPayload.userId, accessTokenPayload.email, accessTokenPayload.roles, accessTokenPayload.permissions   );

    // Ensure user.roles and role.permissions are loaded (via TypeORM relations)
    accessTokenPayload.roles?.forEach((role) => {
      if (role === 'SUPER_USER') {
        can("manage", 'all');
      }

      accessTokenPayload.permissions?.forEach((perm: PermissionString) => {
        // perm.resource would be 'auth', 'profile', etc.
        const { resource, action } = PermissionStringGeneratorUtil.extract(perm);
        console.log(`Adding permission for user ${accessTokenPayload.email}: ${action} on ${resource}`);

        if (resource === '*' && action === '*') {
          can("manage", 'all');
        } else {
            if (resource === '*' && action !== '*') {
                can(action, 'all');
            } else if (resource !== '*' && action === '*') {
                can("manage", resource);
            } else {    
          can(action, resource);
            }
        }
        
        can(action, resource);
      });
    });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
