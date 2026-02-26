

import * as React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser, addRefreshAuthToDataProvider, addRefreshAuthToAuthProvider } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from './features/user/user.list.js';
import { UserEdit } from './features/user/user.edit.js';
import { UserCreate } from './features/user/user.create.js';
import {  dataProvider } from './dataProvider.js';
import { AuthList } from './features/auth/auth.list.js';
import { AuthEdit } from './features/auth/auth.edit.js';
import { AuthCreate } from './features/auth/auth.create.js';
import { SessionList } from './features/session/session.list.js';
import { SessionEdit } from './features/session/session.edit.js';
import PeopleIcon from '@mui/icons-material/People'; // Useful for User list
// Identity & Security
import SecurityIcon from '@mui/icons-material/Security';      // For Auth
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // For Profile
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'; // For Contact

// Access Management
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // For Role
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // For Permission
import TimerIcon from '@mui/icons-material/Timer'; // For Session
import { authProvider } from './authProvider.js';
import { refreshAuth } from './utils/refresh-auth.util.js';

const appAuthProvider = addRefreshAuthToAuthProvider(authProvider, refreshAuth);
const appDataProvider = addRefreshAuthToDataProvider(dataProvider, refreshAuth);

    
export const App = () => (
    <Admin dataProvider={appDataProvider} authProvider={appAuthProvider}>
        <Resource name="user" list={UserList} edit={EditGuesser} create={UserCreate} icon={PeopleIcon}/>
        <Resource name="profile" list={ListGuesser} icon={AccountCircleIcon}/>
        <Resource name="role" list={ListGuesser} icon={SupervisorAccountIcon}/>
        <Resource name="contact" list={ListGuesser} icon={ContactPhoneIcon}/>
        <Resource name="permission" list={ListGuesser} icon={VerifiedUserIcon}/>
        <Resource name="session" list={SessionList} edit={SessionEdit} icon={TimerIcon}/>
        <Resource name="auth" list={ListGuesser}  edit={EditGuesser} create={AuthCreate} icon={SecurityIcon}/>
    </Admin>

);

