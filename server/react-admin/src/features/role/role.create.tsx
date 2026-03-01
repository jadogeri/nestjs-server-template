import { Create, SimpleForm, TextInput, SelectInput, ReferenceArrayInput, SelectArrayInput } from 'react-admin';

const ActionOptions = [
    { id: 'create', name: 'CREATE' },
    { id: 'read', name: 'READ' },
    { id: 'update', name: 'UPDATE' },
    { id: 'delete', name: 'DELETE' },
    { id: '*', name: 'ALL' },
];

export const RoleCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" fullWidth />
            <TextInput source="description" multiline fullWidth />
            
            {/* If 'action' is a field on your Role (logic depends on your schema) */}
            <SelectInput source="action" choices={ActionOptions} />

            {/* Many-to-Many Permission Selection */}
            <ReferenceArrayInput source="permissions" reference="permission">
                <SelectArrayInput optionText="name" label="Assign Permissions" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);
