import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { graphcontext } from './Dashboard3';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Chart02() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;

    // Transform VM data for pie chart
    const pieData = vms.map(vm => ({
        name: vm.NAME,
        value: vm.cores
    }));

    return (
        <div style={{ width: '350px', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name) => [`${value} cores`, name]}
                        labelFormatter={(label) => `VM: ${label}`}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Chart02;
