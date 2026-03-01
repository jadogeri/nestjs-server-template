import { 
  List, Datagrid, TextField, DateField, 
  ReferenceField, EmailField, FunctionField, 
  ReferenceInput,
  SelectInput
} from 'react-admin';

export const SessionList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="Session ID" />
      {/* Link back to the Auth/User owner */}
      <ReferenceField source="auth.id" reference="auths" label="User Email">
         <EmailField source="email" />
      </ReferenceField>
      <ReferenceInput source="auth.id" reference="auths">
        <SelectInput optionText="email" disabled label="Associated Account" />
      </ReferenceInput>
      <ReferenceField source="auth.id" reference="auths" label="User Email">
          <EmailField source="email" />
      </ReferenceField>
      <DateField source="createdAt" showTime />
      <DateField source="expiresAt" showTime />
      {/* Visual indicator for expiration */}
      <FunctionField 
        label="Status"
        render={record => new Date(record.expiresAt) > new Date() ? "Active" : "Expired"} 
      />
    </Datagrid>
  </List>
);
