import { Edit, SimpleForm, TextInput, DateField } from 'react-admin';

export const ProfileEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="bio" multiline fullWidth />
            <TextInput source="avatarUrl" />
            <TextInput source="website" />
            <TextInput source="gender" />
            {/* Edit Embedded Location */}
            <TextInput source="location.city" label="City" />
            <TextInput source="location.zipCode" label="Zip Code" />
            
            {/* Preferences handled as JSON string in simple form */}
            <TextInput source="preferences" multiline label="Preferences (JSON)" 
                format={v => JSON.stringify(v)} 
                parse={v => JSON.parse(v)} 
            />
            
            <DateField source="updatedAt" label="Last Updated" showTime />
        </SimpleForm>
    </Edit>
);
