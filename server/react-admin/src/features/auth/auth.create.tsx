import { 
  Create, SimpleForm, TextInput, PasswordInput, 
  BooleanInput, SelectInput
} from 'react-admin';

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'disabled', name: 'Disabled' },
  { id: 'pending', name: 'Pending' },
];

export const AuthCreate = () => (
  <Create resource="auths/register" redirect="list">
    <SimpleForm>
      <TextInput source="email" type="email" fullWidth required />
      <PasswordInput source="password" fullWidth required />
      <TextInput source="user.firstName" label="First Name" />
      <TextInput source="user.lastName" label="Last Name" />
    </SimpleForm>
  </Create>
);
