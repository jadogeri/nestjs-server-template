// import { Admin } from "react-admin";
// import { Layout } from "./Layout.js";

// export const App = () => <Admin layout={Layout}></Admin>;
import * as React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server'; // Example provider

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com'); // Replace with your NestJS API endpoint

export const App = () => (
    <Admin dataProvider={dataProvider}>
        {/* At least one resource is needed */}
        <Resource name="users" list={ListGuesser} />
    </Admin>
);

