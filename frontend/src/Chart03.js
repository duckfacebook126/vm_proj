import React, { useContext } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,ComposedChart,Line } from 'recharts';
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

function Chart03() {
    const dashboard_data = useContext(graphcontext);
    const vms = dashboard_data.vms;

    
   

    return (
        <div style={{ width: '350px', height: '350px' }}>
<ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={350}
          height={350}
          data={vms}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="auto" />
          <YAxis dataKey="cpu" scale="auto" />
          <Tooltip />
          <Legend />
          <Bar dataKey="cpu" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="cpu" stroke="#ff7300" />
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


export default Chart03;

