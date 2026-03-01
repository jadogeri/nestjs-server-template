import { List, Datagrid, TextField, UrlField, DateField, ReferenceField, FunctionField } from 'react-admin';

export const ProfileList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            
            {/* Map to the nested user object */}
            <ReferenceField source="user.id" reference="users" label="User" link="show">
                <FunctionField 
                    render={(record: any) => {
                        console.log("User Record in FunctionField:", record);
                        return `${record.firstName} ${record.lastName}`;
                    }} 
                />
            </ReferenceField>

            <TextField source="bio" />
            <UrlField source="website" />
            
            {/* Embedded Location */}
            <TextField source="location.city" label="City" />
            <DateField source="updatedAt" showTime />
        </Datagrid>
    </List>
);
