import { 
    List, Datagrid, TextField, EmailField, 
    ReferenceField, EditButton, DeleteButton 
} from 'react-admin';

export const ContactList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="fullName" label="Contact Name" />
            <EmailField source="email" />
            <TextField source="phone" />
            {/* Display the User who owns this contact */}
            <ReferenceField source="userId" reference="users" label="Assigned User">
                <TextField source="firstName" render={(record: any) => `${record.firstName} ${record.lastName}`} />
            </ReferenceField>
            <TextField source="location.city" label="City" />
            <EditButton />
        </Datagrid>
    </List>
);
