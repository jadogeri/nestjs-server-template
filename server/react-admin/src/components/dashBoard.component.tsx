import React, { useEffect, useState } from 'react';
import { useDataProvider, Title, DataProvider } from 'react-admin';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface RoleStat {
    name: string;
    value: number;
}

interface SummaryStats {
    users: number;
    roles: number;
}

interface CustomDataProvider extends DataProvider {
    getStats: (resource: string) => Promise<any>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#FEB019', '#FF66C3', '#2f5e4e', '#4c1820', '#3b2975', '#6b5220', '#66faff', '#e30090'];



export const Dashboard: React.FC = () => {
    const dataProvider = useDataProvider<CustomDataProvider>();
    const [roleData, setRoleData] = useState<RoleStat[]>([]);
    const [summary, setSummary] = useState<SummaryStats>({ users: 0, roles: 0 });
    const [loading, setLoading] = useState<boolean>(true);

    const visibleData = roleData.filter(d => d.value > 0);
    

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [roles, counts] = await Promise.all([
                    dataProvider.getStats('role-distribution'),
                    dataProvider.getStats('summary')
                ]);
                setRoleData(roles.map((r: any) => ({ name: r.name, value: Number(r.value) })));
                setSummary(counts);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [dataProvider]);

    if (loading) return <Box p={2}>Loading...</Box>;

    return (
        <Box p={2}>
            <Title title="System Overview" />
            {/* Flexbox Layout: No Grid Errors */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                
                {/* Total Users Card */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Users</Typography>
                            <Typography variant="h3">{summary.users}</Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Pie Chart Card */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 65%' } }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Roles Distribution</Typography>
                            <Box sx={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie 
                                            data={visibleData} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%" cy="50%" 
                                            outerRadius={100} 
                                            label={({name}) => name}
                                        >
                                            {visibleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                            <Legend 
                                                layout="horizontal"     
                                                verticalAlign="bottom" 
                                                align="center"
                                            />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

            </Box>
        </Box>
    );
};
