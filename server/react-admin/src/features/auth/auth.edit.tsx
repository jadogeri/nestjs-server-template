import { 
  Edit, SimpleForm, TextInput, PasswordInput, 
  BooleanInput, SelectInput, DateTimeInput 
} from 'react-admin';

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'disabled', name: 'Disabled' },
  { id: 'pending', name: 'Pending' },
];

export const AuthEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="email" fullWidth />
      <PasswordInput source="password" helperText="Leave empty to keep unchanged" fullWidth />
      <SelectInput source="status" choices={statusChoices} />
      <BooleanInput source="isEnabled" />
      <BooleanInput source="isVerified" />
      <DateTimeInput source="verifiedAt" />
      <TextInput source="verificationToken" fullWidth />
    </SimpleForm>
  </Edit>
);

