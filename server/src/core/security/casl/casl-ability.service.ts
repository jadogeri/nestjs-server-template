import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Service } from '../../../common/decorators/service.decorator';
import { User } from '../../../modules/user/entities/user.entity';
import { Action } from '../../../common/enums/action.enum';
import { Resource } from '../../../common/types/resource.type';
import { AccessTokenPayload } from '../../../common/types/access-token-payload.type';
import { PermissionString } from '../../../common/types/permission-string.type';
import { PermissionStringGeneratorUtil } from '../../../common/utils/permission-string.util';
import { Contact } from '../../../modules/contact/entities/contact.entity';
import { Profile } from '../../../modules/profile/entities/profile.entity';

export type Subjects = InferSubjects<typeof User | typeof Contact | typeof Profile> | Resource;
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Service()
export class CaslAbilityFactory {
  createForUser(accessTokenPayload: AccessTokenPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    const { roles, permissions, userId } = accessTokenPayload;

    // 1. SUPER_USER: Global Wildcard
    if (roles.includes('SUPER_USER')) {
      can(Action.MANAGE, 'all');
    }

    // 2. Database Permissions (ADMIN, EDITOR, VIEWER, USER)
    // This dynamically maps the roles_permissions records from your SQL script
    permissions.forEach((perm: PermissionString) => {
      const { resource, action } = PermissionStringGeneratorUtil.extract(perm);
      
      if (resource === 'all') {
        can(action, 'all');
      } else {
        // Map string resource to class-based subjects if necessary
        can(action, resource as ExtractSubjectType<Subjects>);
      }
    });

    // 3. Ownership Override: Refine generic permissions with specific constraints
    // Even if 'USER' has READ 'contact' from DB, these lines ensure 
    // they can only MANAGE/READ entries where they are the owner.
    
    // Contact & Profile Ownership
    can(Action.MANAGE, Contact, { 'user.id': userId } as any);
    can(Action.MANAGE, Profile, { 'user.id': userId } as any);

    // User Ownership (Self-service)
    can(Action.READ, User, { id: userId } as any); 
    can(Action.UPDATE, User, { id: userId } as any);
    
    // Auth & Registration
    can(Action.CREATE, User); // Allow registration/creation

    return build({
      detectSubjectType: (item) => 
        typeof item === 'string' 
          ? (item as ExtractSubjectType<Subjects>) 
          : (item.constructor as ExtractSubjectType<Subjects>),
    });
  }
}
