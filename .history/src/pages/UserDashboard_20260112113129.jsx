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

// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// const UsersDashboard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         // Retrieve the token from your login storage
//         const token = localStorage.getItem('session_token');

//         const response = await fetch('http://18.130.235.113:8010/api/users/admin/dashboard', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}` 
//           }
//         });

//         if (!response.ok) throw new Error(`Error ${response.status}: Access Denied or Server Error`);

//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   if (loading) return <div style={styles.loader}>Accessing ServiceNow Records...</div>;
//   if (error) return <div style={styles.errorContainer}>⚠️ {error} <br/> <small>Ensure you are logged in as Admin</small></div>;

//   // Global Summary Data
//   const globalSummary = data?.all_time?.summary;
//   const agents = data?.all_time?.agent_performance || [];

//   const pieData = [
//     { name: 'Passed', value: globalSummary?.passed || 0 },
//     { name: 'Failed', value: globalSummary?.failed || 0 },
//     { name: 'Pending', value: globalSummary?.pending || 0 },
//   ];

//   const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

//   return (
//     <div style={styles.page}>
//       <header style={styles.header}>
//         <h1>Admin Team Dashboard</h1>
//         <p>Real-time Ticket Oversight</p>
//       </header>

//       {/* Top Section: Team Totals */}
//       <div style={styles.topGrid}>
//         <div style={styles.chartCard}>
//           <h3>Total Team Distribution</h3>
//           <div style={{ height: 250 }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
//                   {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div style={styles.summaryStats}>
//           <div style={styles.miniCard}><h4>Total Tickets</h4><p>{globalSummary?.total_tickets}</p></div>
//           <div style={styles.miniCard}><h4>Avg Pass Rate</h4><p>{globalSummary?.pass_percentage}%</p></div>
//         </div>
//       </div>

//       {/* Bottom Section: Individual Agent Table */}
//       <div style={styles.tableContainer}>
//         <h3>Agent Performance List</h3>
//         <table style={styles.table}>
//           <thead>
//             <tr style={styles.tableHeader}>
//               <th>Agent Name</th>
//               <th>Tickets</th>
//               <th>Passed</th>
//               <th>Failed</th>
//               <th>Score</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agents.map((agent, index) => (
//               <tr key={index} style={styles.tableRow}>
//                 <td style={{ fontWeight: '600', textTransform: 'capitalize' }}>{agent.agent}</td>
//                 <td>{agent.total_tickets}</td>
//                 <td style={{ color: '#22c55e' }}>{agent.passed}</td>
//                 <td style={{ color: '#ef4444' }}>{agent.failed}</td>
//                 <td>{agent.average_score}</td>
//                 <td>
//                   <span style={agent.needs_training ? styles.badTag : styles.goodTag}>
//                     {agent.needs_training ? "Needs Training" : "Optimal"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // Modern Styles
// const styles = {
//   page: { padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif' },
//   header: { marginBottom: '30px' },
//   topGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' },
//   chartCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
//   summaryStats: { display: 'flex', flexDirection: 'column', gap: '15px' },
//   miniCard: { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
//   tableContainer: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
//   table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
//   tableHeader: { textAlign: 'left', borderBottom: '2px solid #f0f2f5', color: '#64748b' },
//   tableRow: { borderBottom: '1px solid #f0f2f5', height: '50px' },
//   goodTag: { padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '12px' },
//   badTag: { padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '12px' },
//   loader: { textAlign: 'center', marginTop: '100px', fontSize: '20px' },
//   errorContainer: { margin: '50px', padding: '20px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', textAlign: 'center' }
// };

// export default UsersDashboard;


import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from "../api/axois"; // ✅ Use your existing Axios instance
import { useAuth } from "../context/AuthContext"; // ✅ Access user state

const UsersDashboard = () => {
  const { user } = useAuth(); // Get user info from context
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // We use the token from the user object or localStorage
        const token = user?.token || localStorage.getItem("session_token");

        const res = await api.get('/users/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setData(res.data);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(err.response?.status === 403 
          ? "Admin access required. Your account does not have permission." 
          : "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <div style={styles.centerMsg}>Loading Premium Dashboard...</div>;
  if (error) return <div style={styles.errorCard}>{error}</div>;

  const agents = data?.all_time?.agent_performance || [];
  const summary = data?.all_time?.summary;

  // Pie Data for the Team
  const pieData = [
    { name: 'Passed', value: summary?.passed || 0 },
    { name: 'Failed', value: summary?.failed || 0 },
    { name: 'Pending', value: summary?.pending || 0 }
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>ServiceNow Agent Oversight</h2>
        <div style={styles.userBadge}>Admin: {user?.name || "Administrator"}</div>
      </div>

      <div style={styles.mainGrid}>
        {/* Left: Global Pie Chart */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Global Ticket Quality</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Summary Metrics */}
        <div style={styles.statsCol}>
          <div style={styles.miniCard}>
            <span>Total Tickets</span>
            <h3>{summary?.total_tickets}</h3>
          </div>
          <div style={styles.miniCard}>
            <span>Pass Rate</span>
            <h3 style={{color: '#10b981'}}>{summary?.pass_percentage}%</h3>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ ...styles.card, marginTop: '30px' }}>
        <h3 style={styles.cardTitle}>Agent Ranking</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Total</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Training</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 'bold' }}>{agent.agent}</td>
                <td>{agent.total_tickets}</td>
                <td>{agent.passed}</td>
                <td>{agent.failed}</td>
                <td>
                  <span style={agent.needs_training ? styles.tagRed : styles.tagGreen}>
                    {agent.needs_training ? "Required" : "Optimal"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inline Styles for a Professional Look
const styles = {
  container: { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  userBadge: { background: '#fff', padding: '8px 15px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '14px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
  card: { background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  cardTitle: { margin: '0 0 20px 0', fontSize: '16px', color: '#64748b' },
  statsCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
  miniCard: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tagRed: { background: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' },
  tagGreen: { background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' },
  centerMsg: { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#64748b' },
  errorCard: { background: '#fef2f2', color: '#b91c1c', padding: '20px', borderRadius: '12px', textAlign: 'center', margin: '40px' }
};

export default UsersDashboard;