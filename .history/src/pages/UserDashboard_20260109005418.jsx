import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

const UserDashboard = () => {
  // DUMMY DATA: Replace this object with your API response later
  const userData = {
    name: "Arun",
    employeeId: "SN-9921",
    totalHandled: 150,
    stats: [
      { name: 'Resolved', value: 95 },
      { name: 'Escalated', value: 25 },
      { name: 'In Progress', value: 30 }
    ]
  };

  // Colors: Green for Resolved, Red for Escalated, Orange for In Progress
  const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    }}>
      {/* User Header Section */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0', pb: '10px' }}>
        <h1 style={{ color: '#1e293b', margin: '0' }}>User Performance: {userData.name}</h1>
        <p style={{ color: '#64748b' }}>Total Tickets Handled: <strong>{userData.totalHandled}</strong></p>
      </div>

      {/* Chart Section */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={userData.stats}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {userData.stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '20px' }}>
        {userData.stats.map((item, idx) => (
          <div key={idx} style={{ 
            background: '#fff', 
            padding: '10px', 
            borderRadius: '8px', 
            textAlign: 'center',
            borderLeft: `5px solid ${COLORS[idx]}`
          }}>
            <small style={{ color: '#64748b', display: 'block' }}>{item.name}</small>
            <strong style={{ fontSize: '1.2rem' }}>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;