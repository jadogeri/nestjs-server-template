import React, { useEffect, useState } from 'react';
import { useDataProvider, Title, DataProvider } from 'react-admin';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

// Define the shape of your specific stats
interface RoleStat {
    name: string;
    value: number;
}

interface SummaryStats {
    users: number;
    roles: number;
}

// Extend the base DataProvider to recognize your custom method
interface CustomDataProvider extends DataProvider {
    getStats: (resource: string) => Promise<any>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC = () => {
    // Cast the dataProvider to your custom interface
    const dataProvider = useDataProvider<CustomDataProvider>();
    
    const [roleData, setRoleData] = useState<RoleStat[]>([]);
    const [summary, setSummary] = useState<SummaryStats>({ users: 0, roles: 0 });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [roles, counts] = await Promise.all([
                    dataProvider.getStats('role-distribution'),
                    dataProvider.getStats('summary')
                ]);
                
                // NestJS getRawMany often returns counts as strings, 
                // we map them to numbers for Recharts
                setRoleData(roles.map((r: any) => ({
                    name: r.name,
                    value: Number(r.value)
                })));
                
                setSummary(counts);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dataProvider]);

    if (loading) return <div>Loading Stats...</div>;

    return (
        <Card sx={{ mt: 2, p: 2 }}>
            <Title title="System Administration Dashboard" />
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total System Users
                            </Typography>
                            <Typography variant="h4" component="div">
                                {summary.users}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        User Distribution by Role
                    </Typography>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie 
                                    data={roleData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={80} 
                                    label={(entry) => entry.name}
                                >
                                    {roleData.map((_, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>
            </Grid>
        </Card>
    );
};
