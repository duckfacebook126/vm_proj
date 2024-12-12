import React, { useContext } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
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

function Chart01() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;
    const disks = dashboard_data.disks;

    // Aggregate the data
    const aggregatedData = aggregateData(vms, disks);

    return (
        <div style={{ width: '350px', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
    
      data={vms}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 10
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="NAME" 
        angle={-45}
        textAnchor="end"
        
        interval={0}
      />
      <YAxis />
      <Bar dataKey="ram" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
        {vms.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
        ))}
      </Bar>
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

export default Chart01;

/**
 * @function Chart01
 * @description This component renders a bar chart which displays the number of VMs and Disks for each user.
 * @param {object} props - Component props
 * @param {array} props.vms - List of VMs
 * @param {array} props.disks - List of Disks
 * @returns {React.Component} A React component containing the bar chart
 *
 * @example
 * import Chart01 from './Chart01';
 * 
 * const vms = [{userId: '1', name: 'vm1'}, {userId: '2', name: 'vm2'}];
 * const disks = [{userId: '1', name: 'disk1'}, {userId: '2', name: 'disk2'}];
 * 
 * <Chart01 vms={vms} disks={disks} />
 */
