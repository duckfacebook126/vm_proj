import React, { useContext } from 'react';
import {LineChart ,ScatterChart, Scatter,Area,AreaChart,BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,ComposedChart,Line } from 'recharts';
import { graphcontext } from './Dashboard3';
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };
  
  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
  
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

function Chart03() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;
    const disks = dashboard_data.disks;

    // Format the VMs data for the chart
    const formattedVMData = vms.map(vm => ({
        NAME: vm.NAME || 'Unknown',
        CPU: vm.CPU || 0,
        RAM: vm.RAM || 0,
        FLAVOR: vm.FLAVOR || 'N/A'
    }));

    console.log('Formatted VM Data:', formattedVMData);

    return (
        <div style={{ width: '350px', height: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={formattedVMData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="NAME" label={{ value: 'Virtual Machine Name', position: 'bottom', offset: 5 }} scale="band" />
          <YAxis  />
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="top" align="center" />
          <Bar dataKey="CPU" name="CPUs" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="RAM" name="RAM (GB)" stroke="#ff7300" />
        </ComposedChart>
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

export default Chart03;
