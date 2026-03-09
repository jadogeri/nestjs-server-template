import { User } from '../../../modules/user/entities/user.entity';
import { Action } from '../../../common/enums/action.enum';
import { PermissionString } from '../../../common/types/permission-string.type';
import { Contact } from '../../../modules/contact/entities/contact.entity';
import { CaslAbilityFactory } from './casl-ability.service';
import { Profile } from '../../../modules/profile/entities/profile.entity';
import { subject } from '@casl/ability';


describe('CaslAbilityFactory', () => {
  let factory: CaslAbilityFactory;

  beforeEach(() => {
    factory = new CaslAbilityFactory();
  });

  describe('Happy Path - Role & Dynamic Permissions', () => {
    it('should allow SUPER_USER to manage everything (Global Wildcard)', () => {
      const ability = factory.createForUser({ roles: ['SUPER_USER'], permissions: [], userId: 0, type: 'access', email: '' });
      expect(ability.can(Action.MANAGE, 'all')).toBe(true);
      expect(ability.can(Action.DELETE, User)).toBe(true);
      expect(ability.can(Action.UPDATE, Contact)).toBe(true);
    });

    it('should grant ADMIN specific resource access from DB permissions', () => {
      const permissions = ['user:manage', 'contact:read'] as PermissionString[];
      const ability = factory.createForUser({ roles: ['ADMIN'], permissions, userId: 0, type: 'access', email: '' });
      
      expect(ability.can(Action.MANAGE, 'user')).toBe(true);
      expect(ability.can(Action.READ, 'contact')).toBe(true);
      expect(ability.can(Action.DELETE, 'contact')).toBe(false);
    });

    it('should allow VIEWER read-only access across allowed resources', () => {
      const permissions = ['user:read', 'contact:read', 'profile:read'] as PermissionString[];
      const ability = factory.createForUser({ roles: ['VIEWER'], permissions, userId: 0, type: 'access', email: '' });
      
      expect(ability.can(Action.READ, 'user')).toBe(true);
      expect(ability.can(Action.UPDATE, 'user')).toBe(false);
      expect(ability.can(Action.CREATE, 'contact')).toBe(false);
    });

    it('should allow EDITOR to manage contacts but only read users', () => {
      const permissions = ['contact:manage', 'user:read'] as PermissionString[];
      const ability = factory.createForUser({ roles: ['EDITOR'], permissions, userId: 0, type: 'access', email: '' });
      
      expect(ability.can(Action.MANAGE, 'contact')).toBe(true);
      expect(ability.can(Action.READ, 'user')).toBe(true);
      expect(ability.can(Action.DELETE, 'user')).toBe(false);
    });

    it('should allow any authenticated user to create a User (Registration)', () => {
      const ability = factory.createForUser({ roles: ['USER'], permissions: [], userId: 0, type: 'access', email: '' });
      expect(ability.can(Action.CREATE, User)).toBe(true);
    });
  });


describe('Happy Path - Ownership Rules', () => {
  const userId = 123;



  it('should deny managing a Profile or Contact owned by someone else', () => {
    const ability = factory.createForUser({
      roles: ['USER'],
      permissions: ['profile:update'],
      userId,
      type: 'access',
      email: ''
    });

    // Different owner ID
    const otherProfile = subject('Profile', { user: { id: 999 } } as any);
    
    expect(ability.can(Action.UPDATE, otherProfile)).toBe(false);
  });
});

  describe('Edge Cases & Security Boundaries', () => {
    it('should deny a user from accessing another users Profile', () => {
      const ability = factory.createForUser({
          roles: ['USER'], permissions: ["profile:read"], userId: 0,
          type: 'access',
          email: ''
      });
      const otherProfile = { user: { id: 1 } } as Profile;
      
      expect(ability.can(Action.READ, otherProfile)).toBe(false);
    });

    it('should deny a user from updating another users record', () => {
      const ability = factory.createForUser({
          roles: ['USER'], permissions: ["user:update"], userId: 1,
          type: 'access',
          email: ''
      });
      const otherUser = { id: 2 } as unknown as User;
      
      expect(ability.can(Action.UPDATE, otherUser)).toBe(false);
    });

    it('should prioritize SUPER_USER role even if permissions array is empty', () => {
      const ability = factory.createForUser({ roles: ['SUPER_USER'], permissions: [], userId: 0, type: 'access', email: '' });
      expect(ability.can(Action.MANAGE, 'all')).toBe(true);
    });

    it('should correctly parse and apply "all:manage" from the permissions string array', () => {
      const permissions = ['all:manage'] as PermissionString[];
      const ability = factory.createForUser({ roles: [], permissions, userId: 0, type: 'access', email: '' });
      
      expect(ability.can(Action.MANAGE, 'all')).toBe(true);
      expect(ability.can(Action.DELETE, Contact)).toBe(true);
    });

    it('should handle malformed or unexpected resource strings from DB without crashing', () => {
      const permissions = ['invalid-resource:read'] as any;
      const ability = factory.createForUser({
          roles: [''], permissions, userId: 1,
          type: 'access',
          email: ''
      });
      
      expect(ability.can(Action.READ, 'invalid-resource' as any)).toBe(true);
      expect(ability.can(Action.READ, 'contact')).toBe(false);
    });
  });
});
