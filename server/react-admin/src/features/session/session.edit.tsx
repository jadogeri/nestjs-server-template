import { 
  Edit, SimpleForm, TextInput, DateTimeInput, 
  ReferenceInput, SelectInput 
} from 'react-admin';

export const SessionEdit = () => (
  <Edit title="Manage Session">
    <SimpleForm>
      <TextInput source="id" disabled label="Session ID" />
      
      {/* Usually read-only as sessions are system-generated */}
      <TextInput source="refreshTokenHash" disabled label="Token Hash" fullWidth />
      
      <ReferenceInput source="auth.id" reference="auths">
        <SelectInput optionText="email" disabled label="Associated Account" />
      </ReferenceInput>

      <DateTimeInput source="createdAt" disabled />
      <DateTimeInput source="expiresAt" label="Expiration Date" />
    </SimpleForm>
  </Edit>
);
