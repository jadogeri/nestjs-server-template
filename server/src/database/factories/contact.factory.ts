import { setSeederFactory } from 'typeorm-extension';
import { Contact } from '../../modules/contact/entities/contact.entity';
import { Location } from '../../common/entities/location.entity';

export default setSeederFactory(Contact, (faker) => {
  const contact = new Contact();

  // 1. Generate the core identity first
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  // 2. Set the Full Name
  contact.fullName = `${firstName} ${lastName}`;

  // 3. Generate a "human-style" email using those same names
  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  
  const emailPrefix = faker.helpers.arrayElement([
    `${f}.${l}`,                // john.doe
    `${f}${l}`,                 // johndoe
    `${f}_${l}`,                // john_doe
    `${f.charAt(0)}${l}`,       // jdoe
    `${f}${l.charAt(0)}`,       // johnd
  ]);

  const domain = faker.internet.domainName();
  contact.email = `${emailPrefix}@${domain}`;

  // 4. Other fields
  contact.phone = faker.phone.number();
  contact.fax = faker.phone.number();

  const location: any = {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    country: faker.string.alpha({ length: 2, casing: 'upper' })
  };
  
  contact.location = location as Location;  
  return contact;
});
