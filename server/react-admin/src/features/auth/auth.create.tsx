import { 
  Create, SimpleForm, TextInput, PasswordInput, 
  DateInput, useRedirect, useNotify
} from 'react-admin';
import { format, parse, isValid } from 'date-fns';

const dateToServer = (value: string | null): string | null => {
    if (!value) return null;
    const date = new Date(value);
    // Added .toUpperCase() to ensure '05-FEB-2026'
    return isValid(date) ? format(date, 'dd-MMM-yyyy').toUpperCase() : null;
};

const dateFromFormatter = (value: string | null): string => {
    if (!value) return '';
    // Use parse() for custom dd-MMM-yyyy format
    const date = parse(value?.toUpperCase() || '', 'dd-MMM-yyyy', new Date());
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
};

export const AuthCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data: any) => {
    notify(data.message || 'Registration successful!', { type: 'info' });
    // Manually redirect since the API doesn't return an ID for RA to track
    redirect('/auths'); 
  };

  return (
    /* Change redirect to false to prevent RA from trying to find an ID */
    <Create 
      resource="auths/register" 
      redirect={false} 
      mutationOptions={{ onSuccess }}
    >
      <SimpleForm>
        <TextInput source="email" type="email" fullWidth required />
        <PasswordInput source="password" fullWidth required />
        <TextInput source="firstName" label="First Name" fullWidth required />
        <TextInput source="lastName" label="Last Name" fullWidth required />
        <DateInput 
            source="dateOfBirth" 
            parse={dateToServer} 
            format={dateFromFormatter} 
        />
      </SimpleForm>
    </Create>
  );
};
