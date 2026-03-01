import { List, Datagrid, TextField, ReferenceArrayField, SingleFieldList, ChipField } from 'react-admin';

export const RoleList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="description" />
            {/* Displays permissions as clickable chips */}
            <ReferenceArrayField source="permissions" reference="permission">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>
        </Datagrid>
    </List>
);
