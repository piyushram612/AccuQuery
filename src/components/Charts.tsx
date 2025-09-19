import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { orders } from '@/data/mockData';
import { useTheme } from "@/components/theme-provider";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const OrdersBySearchTypeChart: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#a1a1aa' : '#71717a'; // zinc-400 dark, zinc-500 light

    const data = [
        { name: 'CRIM', value: orders.filter(o => o.search_type === 'CRIM').length },
        { name: 'EDU', value: orders.filter(o => o.search_type === 'EDU').length },
        { name: 'EMP', value: orders.filter(o => o.search_type === 'EMP').length },
        { name: 'MVR', value: orders.filter(o => o.search_type === 'MVR').length },
        { name: 'DHS', value: orders.filter(o => o.search_type === 'DHS').length },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
                        borderColor: theme === 'dark' ? '#27272a' : '#e5e7eb'
                    }}
                />
                <Legend wrapperStyle={{ color: tickColor }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const OrderStatusDistributionChart: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#a1a1aa' : '#71717a';
    const gridColor = theme === 'dark' ? '#27272a' : '#e5e7eb';

    const data = [
        { name: 'Draft', value: orders.filter(o => o.status === 'Draft').length },
        { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length },
        { name: 'Completed', value: orders.filter(o => o.status === 'Completed').length },
        { name: 'Discrepancy', value: orders.filter(o => o.status === 'Discrepancy Found').length },
        { name: 'Dispute', value: orders.filter(o => o.status === 'Dispute').length },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: tickColor }} tickLine={{ stroke: tickColor }} />
                <YAxis tick={{ fill: tickColor }} tickLine={{ stroke: tickColor }} />
                <Tooltip
                    cursor={{fill: theme === 'dark' ? 'rgba(113, 113, 122, 0.2)' : 'rgba(209, 213, 219, 0.4)'}}
                    contentStyle={{
                        backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
                        borderColor: theme === 'dark' ? '#27272a' : '#e5e7eb'
                    }}
                />
                <Legend wrapperStyle={{ color: tickColor }} />
                <Bar dataKey="value" fill="#8884d8">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
