import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { graphcontext } from '../AdminAnalytics';
import { DataContext } from '../contexts/DashboardContext';

const colors = ['#0088FE', '#00C49F', '#FFBB28'];

function AdminPieChartComponent() {
  const { dashboardData } = useContext(DataContext);
  const vms = dashboardData.vms || [];
  const disks = dashboardData.disks || [];
  const users = dashboard_data.users || [];

  console.log(` users:${users}`);
  console.log(`vms${vms}`);
  console.log(`disks${disks}`);

  // Aggregate the data
  const aggregatedData = [
    { name: 'Users', value: users.length },
    { name: 'VMs', value: vms.length },
    { name: 'Disks', value: disks.length },
  ];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={aggregatedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {aggregatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminPieChartComponent;
