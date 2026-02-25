// import { Admin } from "react-admin";
// import { Layout } from "./Layout.js";

// export const App = () => <Admin layout={Layout}></Admin>;
/*
import * as React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server'; // Example provider

const dataProvider = jsonServerProvider('/api'); // Replace with your NestJS API endpoint

export const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="user" list={ListGuesser} />
        <Resource name="profile" list={ListGuesser} />
        <Resource name="role" list={ListGuesser} />
        <Resource name="contact" list={ListGuesser} />
        <Resource name="permission" list={ListGuesser} />
        <Resource name="session" list={ListGuesser} />
        <Resource name="auth" list={ListGuesser} />
    </Admin>
);

*/

import * as React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const baseProvider = jsonServerProvider('/api');

const clientSideDataProvider = {
    ...baseProvider,
    getList: async (resource: any, params: any) => {
        // 1. Fetch ALL data from the backend (no pagination params)
        const { data: allData } = await baseProvider.getList(resource, {
            pagination: { page: 1, perPage: 10000 }, // Fetch a large enough 'all'
            sort: params.sort,
            filter: params.filter,
        });

        // 2. Perform frontend pagination (Slicing)
        const { page, perPage } = params.pagination;
        const start = (page - 1) * perPage;
        const end = page * perPage;
        const pagedData = allData.slice(start, end);

        return {
            data: pagedData,
            total: allData.length,
        };
    },
};

export const App = () => (
    <Admin dataProvider={clientSideDataProvider}>
        <Resource name="user" list={ListGuesser} />
        <Resource name="profile" list={ListGuesser} />
        <Resource name="role" list={ListGuesser} />
        <Resource name="contact" list={ListGuesser} />
        <Resource name="permission" list={ListGuesser} />
        <Resource name="session" list={ListGuesser} />
        <Resource name="auth" list={ListGuesser} />
    </Admin>
);
