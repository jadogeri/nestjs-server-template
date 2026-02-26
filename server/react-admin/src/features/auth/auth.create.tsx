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
  <Create>
    <SimpleForm>
      <TextInput source="email" fullWidth />
      <PasswordInput source="password" fullWidth />
      <SelectInput source="status" choices={statusChoices} defaultValue="disabled" />
      <BooleanInput source="isEnabled" defaultValue={true} />
    </SimpleForm>
  </Create>
);
