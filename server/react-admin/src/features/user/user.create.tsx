import { 
  Create, SimpleForm, TextInput, DateInput, 
  PasswordInput, BooleanInput, SelectInput 
} from 'react-admin';

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="firstName" fullWidth />
      <TextInput source="lastName" fullWidth />
      <DateInput source="dateOfBirth" />
      
      {/* Fields for the nested Auth entity */}
      <TextInput source="auth.email" label="Email" type="email" fullWidth />
      <PasswordInput source="auth.password" label="Password" fullWidth />
      
      <SelectInput source="auth.status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'disabled', name: 'Disabled' },
      ]} defaultValue="disabled" />
      <BooleanInput source="auth.isEnabled" label="Enabled" defaultValue={false} />
    </SimpleForm>
  </Create>
);

