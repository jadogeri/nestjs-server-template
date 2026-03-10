import { faker } from '@faker-js/faker';
import { Contact } from '../../modules/contact/entities/contact.entity';
import ContactFactory from './contact.factory'; // Adjust path to your factory file

describe('ContactFactory', () => {
  // Mock the setSeederFactory wrapper to get the raw generator function
  // In typeorm-extension, the second argument is the actual factory function
  const factoryFn = (ContactFactory as any).factoryFn;

  it('1. should generate a contact with a fullName', () => {
    const contact = factoryFn(faker);
    
    expect(contact).toBeInstanceOf(Contact);
    expect(contact.fullName).toBeDefined();
    expect(typeof contact.fullName).toBe('string');
    expect(contact.fullName.split(' ').length).toBeGreaterThanOrEqual(2);
  });

  it('2. should generate an email derived from the first and last name', () => {
    const contact = factoryFn(faker);
    const [firstName, lastName] = contact.fullName.toLowerCase().split(' ');
    const emailPrefix = contact.email.split('@')[0];

    // Check if the email contains at least part of the name to verify "human-style" logic
    const containsNamePart = 
      emailPrefix.includes(firstName) || 
      emailPrefix.includes(lastName) || 
      emailPrefix.includes(firstName.charAt(0));

    expect(containsNamePart).toBe(true);
    expect(contact.email).toContain('@');
  });

  it('3. should correctly populate the nested location object', () => {
    const contact = factoryFn(faker);
    
    expect(contact.location).toBeDefined();
    expect(contact.location.address).toBeDefined();
    expect(contact.location.city).toBeDefined();
    expect(contact.location.country).toHaveLength(2); // Alpha 2 check
    expect(contact.location.country).toBe(contact.location.country.toUpperCase());
  });

  it('4. should generate valid phone and fax formats', () => {
    const contact = factoryFn(faker);
    
    expect(typeof contact.phone).toBe('string');
    expect(typeof contact.fax).toBe('string');
    expect(contact.phone.length).toBeGreaterThan(5);
  });

  it('5. should produce unique data on subsequent calls', () => {
    const contact1 = factoryFn(faker);
    const contact2 = factoryFn(faker);
    
    expect(contact1.fullName).not.toEqual(contact2.fullName);
    expect(contact1.email).not.toEqual(contact2.email);
  });
});
