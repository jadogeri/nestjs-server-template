import { Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput } from 'react-admin';

export const ContactEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="fullName" validate={required()} />
            
            <ReferenceInput source="userId" reference="users">
                <SelectInput 
                    label="User Owner" 
                    optionText={(record) => `${record.firstName} ${record.lastName}`} 
                />
            </ReferenceInput>

            <TextInput source="email" />
            <TextInput source="phone" />
            <TextInput source="location.city" />
        </SimpleForm>
    </Edit>
);
    