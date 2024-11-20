import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { graphcontext } from './Dashboard';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

function Chart05() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;
    const disks = dashboard_data.disks;

    // Aggregate the data
    const aggregatedData = aggregateData(vms, disks);

    return (
        <div style={{ width: '300px', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={aggregatedData}
                        dataKey="vmCount"
                        nameKey="userId"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {aggregatedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Pie
                        data={aggregatedData}
                        dataKey="diskCount"
                        nameKey="userId"
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={110}
                        fill="#82ca9d"
                        label
                    >
                        {aggregatedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                <p>{`User ID: ${label}`}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`}>{`${entry.name}: ${entry.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const aggregateData = (vms, disks) => {
    const userMap = new Map();

    // Aggregate VM counts
    vms.forEach(vm => {
        if (userMap.has(vm.userId)) {
            userMap.get(vm.userId).vmCount += 1;
        } else {
            userMap.set(vm.userId, { userId: vm.userId, vmCount: 1, diskCount: 0 });
        }
    });

    // Aggregate Disk counts
    disks.forEach(disk => {
        if (userMap.has(disk.userId)) {
            userMap.get(disk.userId).diskCount += 1;
        } else {
            userMap.set(disk.userId, { userId: disk.userId, vmCount: 0, diskCount: 1 });
        }
    });

    // Convert Map to Array
    return Array.from(userMap.values());
};

export default Chart05;
