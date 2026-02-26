import { 
  Create, 
  SimpleForm, 
  TextInput, 
  PasswordInput, 
  useNotify, 
  useRedirect 
} from 'react-admin';

export const AuthCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Create 
      /* 1. We override the resource here to force the URL to /register */
      resource="register" 
      
      /* 2. Standard success/error handling */
      mutationOptions={{
        onSuccess: () => {
          notify('User registered successfully');
          redirect('/auths'); // Redirect back to your main list
        },
        onError: (error: any) => notify(`Error: ${error.message}`, { type: 'error' }),
      }}
    >
      <SimpleForm>
        <TextInput source="email" type="email" fullWidth required />
        <PasswordInput source="password" fullWidth required />
        
        {/* Optional: Mapping to your TypeORM StatusEnum */}
        <TextInput source="status" defaultValue="disabled" />
      </SimpleForm>
    </Create>
  );
};