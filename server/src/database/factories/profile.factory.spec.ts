import { Profile } from '../../modules/profile/entities/profile.entity';
import ProfileFactory from './profile.factory';
import { faker } from '@faker-js/faker';

describe('ProfileFactory', () => {
  // Extract the factory function from the SeederFactoryItem
  const factoryFn = (ProfileFactory as any).factoryFn;

  // 1. Instantiation
  it('should return an instance of Profile', async () => {
    const profile = await factoryFn(faker);
    expect(profile).toBeInstanceOf(Profile);
  });

  // 2. Bio Field
  it('should generate a sentence for the bio', async () => {
    const profile = await factoryFn(faker);
    expect(typeof profile.bio).toBe('string');
    expect(profile.bio.split(' ').length).toBeGreaterThan(1);
  });

  // 3. Avatar URL
  it('should generate a valid image URL', async () => {
    const profile = await factoryFn(faker);
    expect(profile.avatarUrl).toMatch(/^https?:\/\//);
  });

  // 4. Social Media
  it('should format social media handle with @', async () => {
    const profile = await factoryFn(faker);
    expect(profile.socialMedia).toMatch(/^@/);
  });

  // 5. Gender
  it('should default gender to "Male"', async () => {
    const profile = await factoryFn(faker);
    expect(profile.gender).toBe('Male');
  });

  // 6. Preferences Structure
  it('should have a nested preferences object', async () => {
    const profile = await factoryFn(faker);
    expect(profile.preferences).toEqual(
      expect.objectContaining({
        language: 'en',
        notifications: expect.any(Boolean),
        theme: expect.stringMatching(/light|dark|system/),
      })
    );
  });

  // 7. Theme logic
  it('should pick a valid theme option', async () => {
    const profile = await factoryFn(faker);
    const themes = ['light', 'dark', 'system'];
    expect(themes).toContain(profile.preferences.theme);
  });

  // 8. Location Structure
  it('should have a complete location object', async () => {
    const profile = await factoryFn(faker);
    expect(profile.location).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        city: expect.any(String),
        country: expect.stringMatching(/^[A-Z]{2}$/),
      })
    );
  });

  // 9. Zipcode format
  it('should generate a non-empty zipcode', async () => {
    const profile = await factoryFn(faker);
    expect(profile.location.zipcode).toBeDefined();
    expect(profile.location.zipcode.length).toBeGreaterThan(1);
  });

  // 10. Data Independence
  it('should generate unique data on each call', async () => {
    const p1 = await factoryFn(faker);
    const p2 = await factoryFn(faker);
    expect(p1.socialMedia).not.toBe(p2.socialMedia);
  });
});
