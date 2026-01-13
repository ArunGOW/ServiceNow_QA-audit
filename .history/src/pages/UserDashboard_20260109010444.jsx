 import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const UserDashboard = () => {
  // DUMMY DATA - Simulating a ServiceNow User Record
  const userStats = {
    user: {
      name: "Arun Kumar",
      role: "ITSM Senior Analyst",
      dept: "Cloud Infrastructure",
      img: "https://ui-avatars.com/api/?name=Arun+Kumar&background=0D8ABC&color=fff"
    },
    summary: [
      { label: "Total Handled", value: 142, color: "#3b82f6" },
      { label: "SLA Met", value: "98.2%", color: "#22c55e" },
      { label: "Avg Resolution", value: "2.4h", color: "#8b5cf6" },
      { label: "CSAT Score", value: "4.8/5", color: "#f59e0b" }
    ],
    chartData: [
      { name: 'Resolved', value: 85 },
      { name: 'Escalated', value: 12 },
      { name: 'Pending Vendor', value: 25 },
      { name: 'Work in Progress', value: 20 }
    ]
  };

  const COLORS = ['#22c55e', '#ef4444', '#6366f1', '#f59e0b'];

  return (
    <div style={{ backgroundColor: '#f1f5f9', padding: '40px', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. Header & Profile Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={userStats.user.img} alt="profile" style={{ borderRadius: '50%', width: '70px', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{userStats.user.name}</h1>
            <p style={{ margin: 0, color: '#64748b' }}>{userStats.user.role} • {userStats.user.dept}</p>
          </div>
        </div>
        <button style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Export Report
        </button>
      </div>

      {/* 2. Top Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {userStats.summary.map((item, i) => (
          <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
            <h2 style={{ margin: '10px 0 0 0', fontSize: '28px', color: item.color }}>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* 3. Main Content: Pie Chart & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
        {/* Pie Chart Card */}
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Ticket Status Breakdown</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={userStats.chartData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {userStats.chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List (ServiceNow Style) */}
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Recent Ticket Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { id: 'INC00102', task: 'Password Reset', status: 'Resolved' },
              { id: 'INC00105', task: 'VPN Connectivity', status: 'Escalated' },
              { id: 'INC00108', task: 'Laptop Deployment', status: 'In Progress' }
            ].map((ticket, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#3b82f6' }}>{ticket.id}</span>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{ticket.task}</div>
                </div>
                <span style={{ 
                  fontSize: '11px', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  backgroundColor: ticket.status === 'Resolved' ? '#dcfce7' : '#fee2e2',
                  color: ticket.status === 'Resolved' ? '#166534' : '#991b1b',
                  height: 'fit-content'
                }}>{ticket.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;