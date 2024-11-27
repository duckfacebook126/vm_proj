import React, { useContext } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { graphcontext } from './Dashboard';
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

function Chart02() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;
    const disks = dashboard_data.disks;
    const users= dashboard_data.users;

    // Aggregate the data
    const aggregatedData = aggregateData(vms, disks);

    return (
        <div style={{ width: '350px', height: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
         
          data={vms}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dataKey="cores" yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis dataKey="name" yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="cores" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="name" fill="#82ca9d" />
        </BarChart>
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

export default Chart02;


