import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Service } from '../../../common/decorators/service.decorator';
import { User } from '../../../modules/user/entities/user.entity';
import { Action } from '../../../common/enums/action.enum';


// Define which subjects (entities) CASL should manage
export type Subjects = InferSubjects<typeof User | 'all'>;
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Service()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    // Iterate through all roles and their associated permissions
    user.roles.forEach((role) => {
      // Logic for SUPER_USER: grant all permissions
      if (role.name === 'SUPER_USER') {
        can(Action.ALL, 'all');
      }

      // Map database permissions to CASL rules
      role.permissions?.forEach((permission) => {
        // Convert permission.resource (string) and permission.action (enum) to CASL rules
        can(permission.action, permission.resource as any);
      });
    });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
