import React, { useContext } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { graphcontext } from './Dashboard';

function Chart01() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;
    const disks = dashboard_data.disks;

    // Aggregate the data
    const aggregatedData = aggregateData(vms, disks);

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aggregatedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="userId" />
                    <YAxis />
                    <Tooltip content={custom_tooltip} />
                    <Legend />
                    <Area type="monotone" dataKey="vmCount" fill="#8884d8" stroke="#8884d8" name="VM Count" />
                    <Area type="monotone" dataKey="diskCount" fill="#82ca9d" stroke="#82ca9d" name="Disk Count" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

const custom_tooltip = ({ active, payload, label }) => {
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

export default Chart01;
