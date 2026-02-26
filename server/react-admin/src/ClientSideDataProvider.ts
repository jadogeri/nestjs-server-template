
import jsonServerProvider from 'ra-data-json-server';


const baseProvider = jsonServerProvider('/api');

export const clientSideDataProvider = {
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