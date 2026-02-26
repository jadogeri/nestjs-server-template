import { List, Datagrid, TextField, DeleteButton, DateInput, FunctionField, DateField } from "react-admin"

const formatDate = (value: any) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    // Check if the date is valid before calling toISOString
    return date instanceof Date && !isNaN(date.getTime()) 
        ? date.toISOString().split('T')[0] 
        : '';
};


export const UserList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                {/* Virtual Full Name Property */}
                <FunctionField 
                    label="Full Name" 
                    render={(record: any) => `${record.firstName} ${record.lastName}`} 
                    sortBy="lastName" 
                />
                <DateField source="dateOfBirth" locales="en-GB" />
                <TextField source="createdAt" />
                <TextField source="updatedAt" />
                <DeleteButton />
            </Datagrid>
        </List>
    )
}