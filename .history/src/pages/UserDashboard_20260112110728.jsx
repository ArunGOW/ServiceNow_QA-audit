//  import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// const UserDashboard = () => {
//   // DUMMY DATA - Simulating a ServiceNow User Record
//   const userStats = {
//     user: {
//       name: "Arun Kumar",
//       role: "Service Desk Analyst IT",
//       dept: "IT SD L1",
//       img: "https://ui-avatars.com/api/?name=Arun+Kumar&background=0D8ABC&color=fff"
//     },
//     summary: [
//       { label: "Total Handled", value: 142, color: "#3b82f6" },
//       { label: "Resolved", value: "97.2%", color: "#22c55e" },
//       { label: "Escalated", value: "2.4%", color: "#8b5cf6" },
//       { label: "In-progress", value: "1.8%", color: "#f59e0b" }
//     ],
//     chartData: [
//       { name: 'Resolved', value: 85 },
//       { name: 'Escalated', value: 12 },
//       { name: 'Pending Vendor', value: 25 },
//       { name: 'Work in Progress', value: 20 }
//     ]
//   };

//   const COLORS = ['#22c55e', '#ef4444', '#6366f1', '#f59e0b'];

//   return (
//     <div style={{ backgroundColor: '#f1f5f9', padding: '40px', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
//       {/* 1. Header & Profile Section */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//           <img src={userStats.user.img} alt="profile" style={{ borderRadius: '50%', width: '70px', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
//           <div>
//             <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{userStats.user.name}</h1>
//             <p style={{ margin: 0, color: '#64748b' }}>{userStats.user.role} • {userStats.user.dept}</p>
//           </div>
//         </div>
//         <button style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
//           Export Report
//         </button>
//       </div>

//       {/* 2. Top Metrics Grid */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
//         {userStats.summary.map((item, i) => (
//           <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//             <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
//             <h2 style={{ margin: '10px 0 0 0', fontSize: '28px', color: item.color }}>{item.value}</h2>
//           </div>
//         ))}
//       </div>

//       {/* 3. Main Content: Pie Chart & Details */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
//         {/* Pie Chart Card */}
//         <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
//           <h3 style={{ marginTop: 0, color: '#1e293b' }}>Ticket Status Breakdown</h3>
//           <div style={{ width: '100%', height: '300px' }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={userStats.chartData}
//                   innerRadius={80}
//                   outerRadius={120}
//                   paddingAngle={8}
//                   dataKey="value"
//                 >
//                   {userStats.chartData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend iconType="circle" />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Activity List (ServiceNow Style) */}
//         <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
//           <h3 style={{ marginTop: 0, color: '#1e293b' }}>Recent Ticket Log</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//             {[
//               { id: 'INC00102', task: 'Password Reset', status: 'Resolved' },
//               { id: 'INC00105', task: 'VPN Connectivity', status: 'Escalated' },
//               { id: 'INC00108', task: 'Laptop Deployment', status: 'In Progress' }
//             ].map((ticket, i) => (
//               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
//                 <div>
//                   <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#3b82f6' }}>{ticket.id}</span>
//                   <div style={{ fontSize: '13px', color: '#64748b' }}>{ticket.task}</div>
//                 </div>
//                 <span style={{ 
//                   fontSize: '11px', 
//                   padding: '4px 8px', 
//                   borderRadius: '12px', 
//                   backgroundColor: ticket.status === 'Resolved' ? '#dcfce7' : '#fee2e2',
//                   color: ticket.status === 'Resolved' ? '#166534' : '#991b1b',
//                   height: 'fit-content'
//                 }}>{ticket.status}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const UserDashboard = ({ agentName = "sagnik" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      // IMPORTANT: Get your token from wherever you store it (localStorage, Cookies, etc.)
      const token = localStorage.getItem('token'); 

      try {
        const response = await fetch(
          `http://18.130.235.113:8010/api/users/admin/dashboard?agent=${agentName}&from_date=2025-12-13&to_date=2026-01-12`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add Authorization if your API requires login
              'Authorization': `Bearer ${token}` 
            }
          }
        );

        if (response.status === 403) {
          throw new Error("Access Denied (403): You don't have permission or your token expired.");
        }

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentName]);

  // 1. Loading State
  if (loading) return <div style={styles.centerMsg}>Loading Agent Data...</div>;

  // 2. Error State (Prevents the "Cannot read properties" crash)
  if (error) return (
    <div style={styles.errorCard}>
      <h3>⚠️ Dashboard Error</h3>
      <p>{error}</p>
      <small>Check if you are logged in or if the API URL is accessible.</small>
    </div>
  );

  // 3. Data Safety Check: Ensure the arrays exist before mapping
  const performance = data?.filtered?.agent_performance?.[0];
  
  if (!performance) return <div style={styles.centerMsg}>No data available for {agentName}.</div>;

  const chartData = [
    { name: 'Passed', value: performance.passed || 0 },
    { name: 'Failed', value: performance.failed || 0 },
    { name: 'Pending', value: performance.pending || 0 },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Performance: {performance.agent}</h1>
          <span style={styles.badge}>{performance.needs_training ? "Training Recommended" : "High Performer"}</span>
        </div>
        <div style={styles.dateRange}>Period: {data.filtered.date_range.from} - {data.filtered.date_range.to}</div>
      </header>

      <div style={styles.statsGrid}>
        <MetricCard label="Total Tickets" value={performance.total_tickets} color="#1e293b" />
        <MetricCard label="Pass Rate" value={`${performance.pass_percentage}%`} color="#10b981" />
        <MetricCard label="Avg Score" value={performance.average_score} color="#6366f1" />
      </div>

      <div style={styles.chartCard}>
        <h3>Ticket Status Quality Breakdown</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={10}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Simple Component for Stat Cards
const MetricCard = ({ label, value, color }) => (
  <div style={styles.card}>
    <p style={styles.cardLabel}>{label}</p>
    <h2 style={{ ...styles.cardValue, color }}>{value}</h2>
  </div>
);

// Styles
const styles = {
  container: { padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' },
  title: { fontSize: '24px', margin: 0, textTransform: 'capitalize' },
  badge: { fontSize: '12px', background: '#e2e8f0', padding: '4px 10px', borderRadius: '12px', color: '#475569' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  card: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  cardLabel: { fontSize: '14px', color: '#64748b', margin: 0 },
  cardValue: { fontSize: '28px', margin: '10px 0 0 0' },
  chartCard: { background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  centerMsg: { padding: '50px', textAlign: 'center', fontSize: '18px', color: '#64748b' },
  errorCard: { padding: '30px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#991b1b', margin: '20px' }
};

export default UserDashboard;