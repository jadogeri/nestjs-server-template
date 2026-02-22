// src/database/factories/profile.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Profile } from '../../modules/profile/entities/profile.entity';

export default setSeederFactory(Profile, (faker) => {
  const profile = new Profile();
  
  profile.bio = faker.lorem.sentence();
  profile.avatarUrl = faker.image.avatar();
  profile.website = faker.internet.url();
  profile.socialMedia = `@${faker.internet.username()}`;
  profile.gender = faker.helpers.arrayElement(['Male']);
  
  profile.preferences = {
    theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
    notifications: faker.datatype.boolean(),
    language: 'en'
  };

  const location = {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    country: faker.string.alpha({ length: 2, casing: 'upper' })
  };
  
  profile.location = location ; // Cast to Location type
  return profile;
});
