import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Service } from '../../../common/decorators/service.decorator';
import { User } from '../../../modules/user/entities/user.entity';
import { Action } from '../../../common/enums/action.enum';
import { Resource } from '../../../common/types/resource.type';


// Define your resources as a union type for better IDE support
export type Subjects = InferSubjects<typeof User> | Resource;
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Service()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    // Ensure user.roles and role.permissions are loaded (via TypeORM relations)
    user.roles?.forEach((role) => {
      if (role.name === 'SUPER_USER') {
        can(Action.ALL, 'all');
      }

      role.permissions?.forEach((perm) => {
        // perm.resource would be 'auth', 'profile', etc.
        can(perm.action, perm.resource as Resource);
      });
    });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
