

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
import { ProfileList } from './features/profile/profile.list.js';
import { ProfileEdit } from './features/profile/profile.edit.js';
import { ProfileCreate } from './features/profile/profile.create.js';
const appAuthProvider = addRefreshAuthToAuthProvider(authProvider, refreshAuth);
const appDataProvider = addRefreshAuthToDataProvider(dataProvider, refreshAuth);

    
export const App = () => (
    <Admin dataProvider={appDataProvider} authProvider={appAuthProvider}>
        <Resource name="users" list={UserList} edit={EditGuesser} create={UserCreate} icon={PeopleIcon}/>
        <Resource name="profiles" list={ProfileList} edit={ProfileEdit} create={ProfileCreate} icon={AccountCircleIcon}/>
        <Resource name="roles" list={ListGuesser} edit={EditGuesser} icon={SupervisorAccountIcon}/>
        <Resource name="contacts" list={ListGuesser} edit={EditGuesser} icon={ContactPhoneIcon}/>
        <Resource name="permissions" list={ListGuesser} edit={EditGuesser} icon={VerifiedUserIcon}/>
        <Resource name="sessions" list={SessionList} edit={SessionEdit} icon={TimerIcon}/>
        <Resource name="auths" list={AuthList}  edit={AuthEdit} create={AuthCreate} icon={SecurityIcon}/>
    </Admin>

);

