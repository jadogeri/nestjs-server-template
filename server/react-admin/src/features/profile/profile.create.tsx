import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput } from 'react-admin';

export const ProfileCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users" label="User Account">
                <SelectInput optionText="username" label="User Account" />
            </ReferenceInput>
            <TextInput source="bio" multiline fullWidth />
            <TextInput source="avatarUrl" type="url" />
            <TextInput source="website" type="url" />
            {/* Inputs for Embedded Location */}
            <TextInput source="location.address" label="Address" />
            <TextInput source="location.city" label="City" />
            <TextInput source="location.country" label="Country" />
        </SimpleForm>
    </Create>
);
