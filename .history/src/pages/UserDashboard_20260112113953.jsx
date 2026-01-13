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


//  import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const UsersDashboard = () => {
//   const { user } = useAuth();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/admin/dashboard', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setData(res.data);
//       } catch (err) {
//         console.error("Dashboard Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, [user]);

//   // Custom active shape for the Pie Chart to make it interactive
//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
//     return (
//       <g>
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#1e293b" style={{ fontSize: '18px', fontWeight: 'bold' }}>{payload.name}</text>
//         <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#64748b" style={{ fontSize: '14px' }}>{`${value} Tickets`}</text>
//         <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
//       </g>
//     );
//   };

//   if (loading) return <div style={styles.loader}>Initializing Secure Dashboard...</div>;

//   const agents = data?.all_time?.agent_performance || [];
//   const summary = data?.all_time?.summary;
//   const pieData = [
//     { name: 'Passed', value: summary?.passed || 0 },
//     { name: 'Failed', value: summary?.failed || 0 },
//     { name: 'Pending', value: summary?.pending || 0 }
//   ];
//   const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

//   return (
//     <div style={styles.wrapper}>
//       {/* Navbar Section */}
//       <nav style={styles.navbar}>
//         <div>
//           <h2 style={styles.logo}>Service<span style={{ color: '#6366f1' }}>Now</span> Analytics</h2>
//           <p style={styles.subtext}>Executive Overview • {new Date().toLocaleDateString()}</p>
//         </div>
//         <div style={styles.profileBox}>
//           <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=6366f1&color=fff`} style={styles.avatar} alt="admin" />
//           <div style={styles.profileText}>
//             <span style={styles.userName}>{user?.name || "Administrator"}</span>
//             <span style={styles.userRole}>System Admin</span>
//           </div>
//         </div>
//       </nav>

//       {/* Stats Cards Row */}
//       <div style={styles.statsRow}>
//         <MetricCard label="Total Handled" value={summary?.total_tickets} icon="📊" trend="+12% from last month" />
//         <MetricCard label="Success Rate" value={`${summary?.pass_percentage}%`} icon="✅" trend="Stable" isSuccess />
//         <MetricCard label="Active Agents" value={agents.length} icon="👥" trend="Online" />
//         <MetricCard label="Failed Audits" value={summary?.failed} icon="⚠️" trend="Needs Review" isDanger />
//       </div>

//       <div style={styles.contentGrid}>
//         {/* Main Interactive Chart */}
//         <div style={styles.chartCard}>
//           <h3 style={styles.cardHeader}>Global Quality Distribution</h3>
//           <div style={{ width: '100%', height: 350 }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   activeIndex={activeIndex}
//                   activeShape={renderActiveShape}
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={85}
//                   outerRadius={110}
//                   onMouseEnter={(_, index) => setActiveIndex(index)}
//                   dataKey="value"
//                 >
//                   {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Agent Performance Table */}
//         <div style={styles.tableCard}>
//           <h3 style={styles.cardHeader}>Agent Performance Ranking</h3>
//           <div style={styles.tableWrapper}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Agent</th>
//                   <th style={styles.th}>Tickets</th>
//                   <th style={styles.th}>Score</th>
//                   <th style={styles.th}>Training</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {agents.map((agent, i) => (
//                   <tr key={i} style={styles.tr}>
//                     <td style={styles.td}>
//                        <div style={styles.agentInfo}>
//                           <div style={styles.dot}></div>
//                           {agent.agent}
//                        </div>
//                     </td>
//                     <td style={styles.td}>{agent.total_tickets}</td>
//                     <td style={styles.td}>
//                       <div style={{...styles.scoreBar, width: `${agent.average_score}%` }}></div>
//                       <span style={{ fontSize: '12px' }}>{agent.average_score}%</span>
//                     </td>
//                     <td style={styles.td}>
//                       <span style={agent.needs_training ? styles.badgeRed : styles.badgeGreen}>
//                         {agent.needs_training ? "Mandatory" : "Optimal"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Metric Card Component
// const MetricCard = ({ label, value, icon, trend, isSuccess, isDanger }) => (
//   <div style={styles.metricCard}>
//     <div style={styles.metricHeader}>
//       <span style={styles.metricIcon}>{icon}</span>
//       <span style={{...styles.trend, color: isDanger ? '#f43f5e' : isSuccess ? '#10b981' : '#64748b'}}>{trend}</span>
//     </div>
//     <h2 style={styles.metricValue}>{value}</h2>
//     <p style={styles.metricLabel}>{label}</p>
//   </div>
// );

// // CSS-in-JS Styles
// const styles = {
//   wrapper: { backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '0 40px 40px 40px', fontFamily: "'Inter', sans-serif" },
//   navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '30px' },
//   logo: { margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: '#1e293b' },
//   subtext: { margin: 0, fontSize: '13px', color: '#94a3b8' },
//   profileBox: { display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '8px 15px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
//   avatar: { width: '35px', height: '35px', borderRadius: '10px' },
//   profileText: { display: 'flex', flexDirection: 'column' },
//   userName: { fontSize: '14px', fontWeight: '700', color: '#1e293b' },
//   userRole: { fontSize: '11px', color: '#94a3b8' },
//   statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
//   metricCard: { background: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)', border: '1px solid #fff' },
//   metricHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
//   metricValue: { fontSize: '28px', fontWeight: '800', margin: 0, color: '#1e293b' },
//   metricLabel: { fontSize: '14px', color: '#64748b', margin: '5px 0 0 0' },
//   trend: { fontSize: '11px', fontWeight: '600' },
//   contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px' },
//   chartCard: { background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' },
//   tableCard: { background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' },
//   cardHeader: { margin: '0 0 25px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' },
//   tableWrapper: { overflowX: 'auto' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '12px 15px', fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' },
//   td: { padding: '15px', fontSize: '14px', borderBottom: '1px solid #f8fafc', color: '#475569' },
//   agentInfo: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', textTransform: 'capitalize' },
//   dot: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' },
//   scoreBar: { height: '4px', background: '#6366f1', borderRadius: '2px', marginBottom: '4px' },
//   badgeGreen: { padding: '5px 12px', background: '#ecfdf5', color: '#059669', borderRadius: '8px', fontSize: '11px', fontWeight: '700' },
//   badgeRed: { padding: '5px 12px', background: '#fff1f2', color: '#e11d48', borderRadius: '8px', fontSize: '11px', fontWeight: '700' },
//   loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', color: '#6366f1', fontWeight: '600' }
// };

// export default UsersDashboard;


import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const UsersDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.get('/users/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#1e293b" style={{ fontSize: '20px', fontWeight: 'bold' }}>{payload.name}</text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#64748b" style={{ fontSize: '14px' }}>{`${value} Tickets`}</text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      </g>
    );
  };

  if (loading) return <div style={styles.loader}>Syncing with ServiceNow...</div>;

  const agents = data?.all_time?.agent_performance || [];
  const summary = data?.all_time?.summary;

  const pieData = [
    { name: 'Passed', value: summary?.passed || 0 },
    { name: 'Failed', value: summary?.failed || 0 },
    { name: 'Pending', value: summary?.pending || 0 }
  ];
  const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div style={styles.wrapper}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div>
          <h2 style={styles.logo}>Ticket<span style={{ color: '#6366f1' }}>Metrics</span></h2>
          <p style={styles.subtext}>ServiceNow Integration • Global Overview</p>
        </div>
        <div style={styles.profileBox}>
          <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=6366f1&color=fff`} style={styles.avatar} alt="admin" />
          <div style={styles.profileText}>
            <span style={styles.userName}>{user?.name || "Administrator"}</span>
            <span style={styles.userRole}>System Admin</span>
          </div>
        </div>
      </nav>

      {/* Primary Metrics Top Row */}
      <div style={styles.statsRow}>
        <MetricCard label="Total Tickets" value={summary?.total_tickets} color="#1e293b" icon="📑" />
        <MetricCard label="Passed" value={summary?.passed} color="#10b981" icon="✅" />
        <MetricCard label="Failed" value={summary?.failed} color="#f43f5e" icon="❌" />
        <MetricCard label="Pending" value={summary?.pending} color="#f59e0b" icon="⏳" />
        <MetricCard label="Pass Rate" value={`${summary?.pass_percentage}%`} color="#6366f1" icon="📈" />
      </div>

      <div style={styles.contentGrid}>
        {/* Pie Chart Card */}
        <div style={styles.chartCard}>
          <h3 style={styles.cardHeader}>Distribution Analysis</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  dataKey="value"
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Card */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardHeader}>Agent Performance Details</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Agent Name</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Passed</th>
                  <th style={styles.th}>Failed</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}><strong>{agent.agent}</strong></td>
                    <td style={styles.td}>{agent.total_tickets}</td>
                    <td style={{ ...styles.td, color: '#10b981', fontWeight: 'bold' }}>{agent.passed}</td>
                    <td style={{ ...styles.td, color: '#f43f5e', fontWeight: 'bold' }}>{agent.failed}</td>
                    <td style={styles.td}>
                      <span style={agent.needs_training ? styles.badgeRed : styles.badgeGreen}>
                        {agent.needs_training ? "Training Req." : "Standard"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Metric Card
const MetricCard = ({ label, value, color, icon }) => (
  <div style={styles.metricCard}>
    <div style={styles.metricTop}>
      <span style={styles.metricLabel}>{label}</span>
      <span style={styles.metricIcon}>{icon}</span>
    </div>
    <h2 style={{ ...styles.metricValue, color }}>{value}</h2>
  </div>
);

const styles = {
  wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '0 40px 40px 40px', fontFamily: "'Inter', sans-serif" },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', marginBottom: '30px', borderBottom: '1px solid #e2e8f0' },
  logo: { margin: 0, fontSize: '24px', fontWeight: '800', color: '#1e293b' },
  subtext: { margin: 0, fontSize: '12px', color: '#94a3b8' },
  profileBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '5px 15px', borderRadius: '30px', border: '1px solid #e2e8f0' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%' },
  userName: { fontSize: '13px', fontWeight: '600' },
  userRole: { fontSize: '10px', color: '#94a3b8', display: 'block' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' },
  metricCard: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #fff' },
  metricTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  metricLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' },
  metricValue: { fontSize: '26px', fontWeight: '800', margin: 0 },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px' },
  chartCard: { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
  tableCard: { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' },
  cardHeader: { margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px', fontSize: '13px', borderBottom: '1px solid #f8fafc' },
  badgeGreen: { padding: '4px 8px', background: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '11px' },
  badgeRed: { padding: '4px 8px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '11px' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', color: '#6366f1' }
};

export default UsersDashboard;