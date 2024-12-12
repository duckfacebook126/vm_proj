import React, { useContext } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,ComposedChart,Line, AreaChart, Area } from 'recharts';
import { graphcontext } from './Dashboard3';
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };
  
  //custom bar chart styling
  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
  
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

function Chart04() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;
    const disks = dashboard_data.disks;

    // Aggregate the data
    const aggregatedData = aggregateData(vms, disks);

    return (
        <div style={{ width: '800px', height: '320px' }}>
             <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
           
            textAnchor="end"
            interval={0}

            text
          />
          <YAxis dataKey="size" />
          <Tooltip />
          <Area type="monotone" dataKey="size" stroke="#8884d8" fill="#8884d8" />
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

export default Chart04;

/**
 * Chart04 component
 * 
 * This component renders a bar chart with the aggregated data of number of VMs and disks
 * 
 * @summary
 * - Renders a bar chart with the aggregated data of number of VMs and disks
 * - Contains a custom tooltip that shows the VM and disk count for each user
 * 
 * @workflow
 * 1. The component fetches the VM and disk data from the context.
 * 2. It aggregates the data by user ID.
 * 3. It renders the bar chart with the aggregated data.
 * 4. The chart contains a custom tooltip that shows the VM and disk count for each user.
 */

