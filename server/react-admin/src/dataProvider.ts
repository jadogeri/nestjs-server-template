
import jsonServerProvider from 'ra-data-json-server';
import { fetchUtils } from 'react-admin';

const apiUrl = 'http://localhost:3000/api';

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
};

const baseProvider = jsonServerProvider('/api', httpClient);


export const dataProvider = {
    ...baseProvider,
    
    // Add this create method logic
    create: async (resource: string, params: any) => {
        const response = await baseProvider.create(resource, params);
        
        // Check if we are registering and if the ID is missing
        if (resource === 'auths/register' && !response.data.id) {
            return {
                ...response,
                data: { 
                    ...response.data, 
                    id: 'temp-id-' + Date.now() // Inject fake ID to satisfy React Admin
                },
            };
        }
        return response;
    },
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
    getOne: (resource: any, params: any) => {
        return baseProvider.getOne(resource, params).then(response => {
            // Log to Windows Console (F12) to verify what NestJS is sending
            console.log(`getOne ${resource} response:`, response);
            return response;
        });
    },
    getStats: async (resource: string) => {
        const url = `${apiUrl}/stats/${resource}`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.json();
    }

};

