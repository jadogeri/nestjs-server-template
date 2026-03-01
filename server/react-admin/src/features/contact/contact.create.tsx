import { 
    Create, SimpleForm, TextInput, 
    ReferenceInput, SelectInput, required 
} from 'react-admin';

export const ContactCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="fullName" validate={required()} fullWidth />
            <TextInput source="email" type="email" />
            <TextInput source="phone" />
            
            {/* Dropdown to select the User (Owner) */}
            <ReferenceInput source="userId" reference="users">
                <SelectInput 
                    label="User Owner" 
                    optionText={(record) => `${record.firstName} ${record.lastName}`} 
                    validate={required()}
                />
            </ReferenceInput>

            <TextInput source="location.city" label="City" />
            <TextInput source="location.state" label="State" />
        </SimpleForm>
    </Create>
);
