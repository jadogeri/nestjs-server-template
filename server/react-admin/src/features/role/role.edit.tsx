import { Edit, SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput } from 'react-admin';

export const RoleEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
            <TextInput source="description" multiline fullWidth />
            
            <ReferenceArrayInput source="permissions" reference="permission">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);
