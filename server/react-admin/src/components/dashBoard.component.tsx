import React, { useEffect, useState } from 'react';
import { useDataProvider, Title, DataProvider } from 'react-admin';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

// --- Interfaces ---
interface RoleStat {
    name: string;
    value: number;
}

interface SummaryStats {
    users: number;
    roles: number;
}

// Added interface for Contact Stats
interface ContactStats {
    regions: { name: string; value: number }[];
    completeness: number;
    channels: { name: string; value: number }[];
    topOwners: { name: string; value: number }[];
    totalContacts: number;
}

interface CustomDataProvider extends DataProvider {
    getStats: (resource: string) => Promise<any>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#FEB019', '#FF66C3', '#2f5e4e'];

export const Dashboard: React.FC = () => {
    const dataProvider = useDataProvider<CustomDataProvider>();
    
    // --- State Functions ---
    const [roleData, setRoleData] = useState<RoleStat[]>([]);
    const [summary, setSummary] = useState<SummaryStats>({ users: 0, roles: 0 });
    const [contactStats, setContactStats] = useState<ContactStats | null>(null); // New state for contacts
    const [loading, setLoading] = useState<boolean>(true);

    // Filtered data for clean charts
    const visibleRoles = roleData.filter(d => d.value > 0);
    const visibleRegions = contactStats?.regions.filter(r => r.value > 0) || [];

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                // Fetching all 3 endpoints from your StatsController
                const [roles, counts, contacts] = await Promise.all([
                    dataProvider.getStats('role-distribution'),
                    dataProvider.getStats('summary'),
                    dataProvider.getStats('contacts')
                ]);

                setRoleData(roles.map((r: any) => ({ name: r.name, value: Number(r.value) })));
                setSummary(counts);
                setContactStats(contacts);
            } catch (e) {
                console.error("Fetch Error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAllStats();
    }, [dataProvider]);

    if (loading) return <Box p={4}><LinearProgress /></Box>;

    return (
        <Box p={2}>
            <Title title="System Overview" />
            
            {/* ROW 1: SUMMARY CARDS */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ flex: '1 1 23%' }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom variant="overline">Total Users</Typography>
                            <Typography variant="h4">{summary.users}</Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: '1 1 23%' }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom variant="overline">Total Contacts</Typography>
                            <Typography variant="h4">{contactStats?.totalContacts || 0}</Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: '1 1 23%' }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom variant="overline">Data Health</Typography>
                            <Typography variant="h4" color="primary">{contactStats?.completeness}%</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* ROW 2: PIE CHARTS */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {/* Roles Distribution */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Roles Distribution</Typography>
                            <Box sx={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={visibleRoles} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {visibleRoles.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Contacts by City */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Contacts by City</Typography>
                            <Box sx={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={visibleRegions} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                                            {visibleRegions.map((_, i) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* ROW 3: BAR CHARTS */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {/* Communication Reach */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Communication Reach</Typography>
                            <Box sx={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={contactStats?.channels || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#82ca9d" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Top Owners */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Top Owners</Typography>
                            <Box sx={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart layout="vertical" data={contactStats?.topOwners || []}>
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};
