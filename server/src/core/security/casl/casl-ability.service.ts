import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Service } from '../../../common/decorators/service.decorator';
import { User } from '../../../modules/user/entities/user.entity';
import { Action } from '../../../common/enums/action.enum';
import { Resource } from '../../../common/types/resource.type';
import { AccessTokenPayload } from '../../../common/types/access-token-payload.type';
import { PermissionString } from '../../../common/types/permission-string.type';
import { PermissionStringGeneratorUtil } from '../../../common/utils/permission-string.util';
import { Contact } from '../../../modules/contact/entities/contact.entity';

export type Subjects = InferSubjects<typeof User | typeof Contact> | Resource;
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Service()
export class CaslAbilityFactory {
  createForUser(accessTokenPayload: AccessTokenPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    const { roles, permissions, userId } = accessTokenPayload;

    // 1. Super User gets global access
    if (roles.includes('SUPER_USER')) {
      can(Action.MANAGE, 'all');
    }

    // 2. Add granular permissions from DB/Token (This gives Admins their power)
    permissions.forEach((perm: PermissionString) => {
      const { resource, action } = PermissionStringGeneratorUtil.extract(perm);
      if (resource === 'all' && action === Action.MANAGE) {
        can(Action.MANAGE, 'all');
      } else {    
        can(action, resource);
      } 
    });

    // 3. Ownership Rule: Allow users to MANAGE (Read/Update/Delete) their OWN contacts 
    // This allows regular users to pass the check ONLY if user.id matches.
    can(Action.MANAGE, Contact, { 'user.id': userId } as any);

    return build({
      detectSubjectType: (item) => 
        typeof item === 'string' 
          ? (item as ExtractSubjectType<Subjects>) 
          : (item.constructor as ExtractSubjectType<Subjects>),
    });
  }
}
