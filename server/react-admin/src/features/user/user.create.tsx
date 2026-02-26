import { 
  Create, SimpleForm, TextInput, DateInput, 
  PasswordInput, BooleanInput, SelectInput,
  useDataProvider,
  useNotify,    
  useRedirect,
  SaveButton,
  Toolbar,
  useCreate
} from 'react-admin';
import { enumToChoices } from '../../utils/enumToChoices.util.js';
import { StatusEnum } from '../../enums/user-status.enum.js';

const AuthCreateToolbar = () => {
  const [create] = useCreate();
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSave = (data: any) => {
    // This forces the request to 'register' instead of 'auths'
    create(
      'register', 
      { data }, 
      {
        onSuccess: () => {
          notify('Registration successful');
          redirect('/auths');
        },
        onError: (error: any) => notify(`Error: ${error.message}`, { type: 'warning' }),
      }
    );
  };

  return (
    <Toolbar>
      {/* We use a button that triggers our custom handleSave instead of the default submit */}
      <SaveButton mutationOptions={{ onSuccess: handleSave }} type="button" />
    </Toolbar>
  );
};

export const UserCreate = () => {

  return (
    <Create>
      <SimpleForm toolbar={<AuthCreateToolbar />}>
        {/* User Profile Info */}
        <TextInput source="firstName" fullWidth />
        <TextInput source="lastName" fullWidth />
      <DateInput source="dateOfBirth" />
      
      {/* Nested Auth Info */}
      <TextInput source="auth.email" label="Email" type="email" fullWidth />
      <PasswordInput source="auth.password" label="Password" fullWidth />
      
      <SelectInput 
        source="auth.status" 
        label="Account Status"
        choices={enumToChoices(StatusEnum)} 
        defaultValue={StatusEnum.DISABLED}
      />
      
      <BooleanInput source="auth.isEnabled" label="Login Enabled" defaultValue={false} />
    </SimpleForm>
  </Create>
);
}
