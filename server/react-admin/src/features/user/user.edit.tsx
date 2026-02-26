import { 
  Edit, SimpleForm, TextInput, DateInput, 
  BooleanInput, SelectInput, ReferenceArrayInput, SelectArrayInput 
} from 'react-admin';

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <DateInput source="dateOfBirth" />

      {/* Auth Settings */}
      <TextInput source="auth.email" label="Email" fullWidth />
      <SelectInput source="auth.status" label="Account Status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'disabled', name: 'Disabled' },
      ]} />
      <BooleanInput source="auth.isEnabled" label="Login Enabled" />

      {/* Role Assignment (ManyToMany) */}
      <ReferenceArrayInput source="roles" reference="roles">
        <SelectArrayInput optionText="name" label="Assigned Roles" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);
