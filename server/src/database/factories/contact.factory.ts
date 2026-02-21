import { setSeederFactory } from 'typeorm-extension';
import { Contact } from '../../modules/contact/entities/contact.entity';
import { Location } from '../../common/entities/location.entity';

export default setSeederFactory(Contact, (faker) => {
  const contact = new Contact();
  contact.phone = faker.phone.number();
  contact.email = faker.internet.email();
  contact.fax = faker.phone.number();
  contact.fullName = faker.person.fullName();
  const location: Location = {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    country: faker.location.countryCode('alpha-2')
  };
  
  contact.location = location;  
  return contact;
});
