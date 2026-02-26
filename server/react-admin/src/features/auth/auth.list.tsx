import { 
  List, Datagrid, TextField, EmailField, 
  BooleanField, DateField, ChipField, NumberField 
} from 'react-admin';

export const AuthList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <EmailField source="email" />
      <ChipField source="status" />
      <BooleanField source="isVerified" />
      <BooleanField source="isEnabled" label="Active" />
      <NumberField source="failedLoginAttempts" label="Failures" />
      <DateField source="lastLoginAt" showTime />
    </Datagrid>
  </List>
);
