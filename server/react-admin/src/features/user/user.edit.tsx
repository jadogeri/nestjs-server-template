import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  DateInput, 
  BooleanInput, 
  SelectInput, 
  ReferenceArrayInput, 
  SelectArrayInput,
  NumberInput
} from 'react-admin';

// Importing your Enums to build the dropdowns
enum StatusEnum {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  LOCKED = 'locked',
}

const enumToChoices = (obj: object) => 
  Object.entries(obj).map(([key, value]) => ({ id: value, name: key }));

export const UserEdit = () => (
  <Edit title="Edit User Profile">
    <SimpleForm>
      {/* --- User Entity Fields --- */}
      <TextInput source="id" disabled />
      <div style={{ display: 'flex', gap: '1em' }}>
        <TextInput source="firstName" />
        <TextInput source="lastName" />
      </div>
      <DateInput source="dateOfBirth" />

      {/* --- Nested Auth Entity Fields (@OneToOne) --- */}
      <TextInput source="auth.email" label="Email Address" fullWidth disabled/>
      
      <SelectInput 
        source="auth.status" 
        label="Account Status"
        choices={enumToChoices(StatusEnum)} 
      />

      <div style={{ display: 'flex', gap: '2em' }}>
        <BooleanInput source="auth.isEnabled" label="Login Enabled" />
        <BooleanInput source="auth.isVerified" label="Email Verified" />
      </div>

      <NumberInput source="auth.failedLoginAttempts" label="Failed Logins" disabled />

      {/* --- Roles Relationship (@ManyToMany) --- */}
      <ReferenceArrayInput source="roles" reference="roles">
        <SelectArrayInput optionText="name" label="Assigned Roles" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);
