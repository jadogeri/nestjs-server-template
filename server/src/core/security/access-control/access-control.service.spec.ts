import { AccessControlService } from './access-control.service';
import { Auth } from "../../../modules/auth/entities/auth.entity";
import { StatusEnum } from "../../../common/enums/user-status.enum";

describe('AccessControlService', () => {
  let service: AccessControlService;

  beforeEach(() => {
    service = new AccessControlService();
  });

  describe('isUserActive (Happy Path & Edge Cases)', () => {
    // Happy Paths
    it('should return true when status is ENABLED', () => {
      const auth = { status: StatusEnum.ENABLED } as Auth;
      expect(service.isUserActive(auth)).toBe(true);
    });

    it('should return false when status is DISABLED', () => {
      const auth = { status: StatusEnum.DISABLED } as Auth;
      expect(service.isUserActive(auth)).toBe(false);
    });

    it('should return false when status is PENDING', () => {
      const auth = { status: StatusEnum.PENDING } as Auth;
      expect(service.isUserActive(auth)).toBe(false);
    });

    // Edge Cases
    it('should return false when auth object is null', () => {
      expect(service.isUserActive(null as any)).toBe(false);
    });

    it('should return false when auth object is undefined', () => {
      expect(service.isUserActive(undefined as any)).toBe(false);
    });

    it('should return false when status property is missing', () => {
      const auth = {} as Auth;
      expect(service.isUserActive(auth)).toBe(false);
    });
  });

  describe('isUserVerified (Happy Path & Edge Cases)', () => {
    // Happy Paths
    it('should return true when isVerified is true', () => {
      const auth = { isVerified: true } as Auth;
      expect(service.isUserVerified(auth)).toBe(true);
    });

    it('should return false when isVerified is false', () => {
      const auth = { isVerified: false } as Auth;
      expect(service.isUserVerified(auth)).toBe(false);
    });

    it('should handle a verified user with ENABLED status correctly', () => {
        const auth = { isVerified: true, status: StatusEnum.ENABLED } as Auth;
        expect(service.isUserVerified(auth)).toBe(true);
    });

    // Edge Cases
    it('should return undefined/falsy when auth is null (safe navigation check)', () => {
      expect(service.isUserVerified(null as any)).toBeUndefined();
    });

    it('should return undefined/falsy when auth is undefined', () => {
      expect(service.isUserVerified(undefined as any)).toBeUndefined();
    });

    it('should return false if isVerified is null or missing', () => {
      const auth = { isVerified: null } as unknown as Auth;
      expect(service.isUserVerified(auth)).toBeFalsy();
    });
  });
});
