

import * as React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from './features/user/user.list.js';
import { UserEdit } from './features/user/user.edit.js';
import { UserCreate } from './features/user/user.create.js';
import { clientSideDataProvider } from './ClientSideDataProvider.js';
import { AuthList } from './features/auth/auth.list.js';
import { AuthEdit } from './features/auth/auth.edit.js';
import { AuthCreate } from './features/auth/auth.create.js';

export const App = () => (
    <Admin dataProvider={clientSideDataProvider}>
        <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate}/>
        <Resource name="profile" list={ListGuesser} />
        <Resource name="role" list={ListGuesser} />
        <Resource name="contact" list={ListGuesser} />
        <Resource name="permission" list={ListGuesser} />
        <Resource name="session" list={ListGuesser} />
        <Resource name="auth" list={AuthList}  edit={AuthEdit} create={AuthCreate}/>
    </Admin>

);

