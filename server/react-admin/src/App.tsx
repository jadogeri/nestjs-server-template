// import { Admin } from "react-admin";
// import { Layout } from "./Layout.js";

// export const App = () => <Admin layout={Layout}></Admin>;
import * as React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server'; // Example provider

const dataProvider = jsonServerProvider('/api'); // Replace with your NestJS API endpoint

export const App = () => (
    <Admin dataProvider={dataProvider}>
        {/* At least one resource is needed */}
        <Resource name="user" list={ListGuesser} />
        <Resource name="profile" list={ListGuesser} />
        <Resource name="role" list={ListGuesser} />
        <Resource name="contact" list={ListGuesser} />
        <Resource name="permission" list={ListGuesser} />
        <Resource name="session" list={ListGuesser} />
        <Resource name="auth" list={ListGuesser} />
    </Admin>
);

