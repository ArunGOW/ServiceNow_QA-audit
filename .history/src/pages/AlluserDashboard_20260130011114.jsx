 



// // import React, { useState, useEffect } from 'react';
// // import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
// // import api from "../api/axois";
// // import { useAuth } from "../context/AuthContext";

// // const AllusersDashboard = () => {
// //   const { user } = useAuth();

// //   // States
// //   const [activeTab, setActiveTab] = useState('team');
// //   const [selectedAgent, setSelectedAgent] = useState(''); // Stores the SID
// //   const [fromDate, setFromDate] = useState('2025-12-13');
// //   const [toDate, setToDate] = useState('2026-01-12');
// //   const [userList, setUserList] = useState([]);
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [activeIndex, setActiveIndex] = useState(0);

// //   // 1. Initial Fetch: Get the User List only once
// //   useEffect(() => {
// //     const fetchUserList = async () => {
// //       try {
// //         const token = user?.token || localStorage.getItem("session_token");
// //         const res = await api.get('/users/get/list_users', {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });
// //         setUserList(res.data || []);
// //         // Set default agent to the first one in the list
// //         if (res.data?.length > 0) setSelectedAgent(res.data[0].sid);
// //       } catch (err) {
// //         console.error("User List Error:", err);
// //       }
// //     };
// //     fetchUserList();
// //   }, [user]);

// //   // 2. Data Fetch: Triggers EVERY time tab, agent, or dates change
// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       // Don't call if we are in individual mode but have no SID yet
// //       if (activeTab === 'individual' && !selectedAgent) return;

// //       setLoading(true);
// //       try {
// //         const token = user?.token || localStorage.getItem("session_token");
// //         const params = {};

// //         if (activeTab === 'individual') {
// //           params.agent_sid = selectedAgent; // Using the key from your Swagger

// //           // Only add dates to params if they are actually filled
// //           if (fromDate) params.from_date = fromDate;
// //           if (toDate) params.to_date = toDate;
// //         }

// //         const res = await api.get('/users/admin/dashboard', {
// //           headers: { Authorization: `Bearer ${token}` },
// //           params: params
// //         });

// //         console.log("New API Response:", res.data);
// //         setData(res.data);
// //       } catch (err) {
// //         console.error("Dashboard Fetch Error:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, [activeTab, selectedAgent, fromDate, toDate, user]); // <--- React watches these!

// //   // --- Data Logic (Initializes summary before usage) ---
// //   const emptySummary = { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
// //   let summary = emptySummary;
// //   let agentsList = [];

// //   if (data) {
// //     if (activeTab === 'individual' && data.filtered) {
// //       summary = data.filtered.summary || emptySummary;
// //       agentsList = data.filtered.agent_performance || [];
// //     } else {
// //       summary = data.all_time?.summary || emptySummary;
// //       agentsList = data.all_time?.agent_performance || [];
// //     }
// //   }

// //   const pieData = [
// //     { name: 'Passed', value: summary.passed },
// //     { name: 'Failed', value: summary.failed },
// //     { name: 'Pending', value: summary.pending }
// //   ];
// //   const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

// //   const renderActiveShape = (props) => {
// //     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
// //     return (
// //       <g>
// //         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#1e293b" style={{ fontSize: '18px', fontWeight: 'bold' }}>{payload.name}</text>
// //         <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#64748b" style={{ fontSize: '12px' }}>{`${value} Tickets`}</text>
// //         <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
// //       </g>
// //     );
// //   };

// //   return (
// //     <div style={styles.wrapper}>
// //       {/* Navbar */}
// //       <nav style={styles.navbar}>
// //         <div>
// //           <h2 style={styles.logo}>Ticket<span style={{ color: '#6366f1' }}>Metrics</span></h2>
// //           <div style={styles.tabContainer}>
// //             <button onClick={() => setActiveTab('team')} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team Overview</button>
// //             <button onClick={() => setActiveTab('individual')} style={activeTab === 'individual' ? styles.activeTab : styles.inactiveTab}>Individual Analysis</button>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Filters for Individual Tab */}
// //       {activeTab === 'individual' && (
// //         <div style={styles.filterBar}>
// //           <div style={styles.filterGroup}>
// //             <label style={styles.filterLabel}>Select Analyst</label>
// //             <select style={styles.select} value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
// //               {userList.map(u => <option key={u.sid} value={u.sid}>{u.full_name}</option>)}
// //             </select>
// //           </div>
// //           <div style={styles.filterGroup}>
// //             <label style={styles.filterLabel}>From Date</label>
// //             <input type="date" style={styles.dateInput} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
// //           </div>
// //           <div style={styles.filterGroup}>
// //             <label style={styles.filterLabel}>To Date</label>
// //             <input type="date" style={styles.dateInput} value={toDate} onChange={(e) => setToDate(e.target.value)} />
// //           </div>
// //           <div style={{ alignSelf: 'flex-end' }}>
// //             <button
// //               className="btn btn-outline-secondary btn-sm mb-1"
// //               style={styles.resetBtn}
// //               onClick={() => {
// //                 setFromDate('');
// //                 setToDate('');
// //               }}
// //             >
// //               Reset Dates
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Stats Row with Overlay Spinner */}
// //       <div style={{ position: 'relative' }}>
// //         {loading && <div style={styles.overlayLoader}><div style={styles.spinner}></div></div>}

// //         <div style={styles.statsRow}>
// //           <MetricCard label="Total Tickets" value={summary.total_tickets} color="#1e293b" icon="📑" />
// //           <MetricCard label="Passed" value={summary.passed} color="#10b981" icon="✅" />
// //           <MetricCard label="Failed" value={summary.failed} color="#f43f5e" icon="❌" />
// //           <MetricCard label="Pending" value={summary.pending} color="#f59e0b" icon="⏳" />
// //           <MetricCard label="Pass Rate" value={`${summary.pass_percentage}%`} color="#6366f1" icon="📈" />
// //         </div>

// //         <div style={styles.contentGrid}>
// //           <div style={styles.chartCard}>
// //             <h3 style={styles.cardHeader}>Distribution Analysis</h3>
// //             <div style={{ width: '100%', height: 350 }}>
// //               <ResponsiveContainer>
// //                 <PieChart>
// //                   <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} onMouseEnter={(_, index) => setActiveIndex(index)} dataKey="value">
// //                     {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
// //                   </Pie>
// //                   <Tooltip />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>

// //           <div style={styles.tableCard}>
// //             <h3 style={styles.cardHeader}>{activeTab === 'team' ? "Team Rankings" : "Analyst Profile"}</h3>
// //             {activeTab === 'team' ? (
// //               <table style={styles.table}>
// //                 <thead><tr><th style={styles.th}>Agent</th><th style={styles.th}>Total</th><th style={styles.th}>Result</th></tr></thead>
// //                 <tbody>
// //                   {agentsList.map((a, i) => (
// //                     <tr key={i} style={styles.tr}>
// //                       <td style={styles.td}>
// //                         <strong>
// //                           {a.agent.charAt(0).toUpperCase() + a.agent.slice(1)}
// //                         </strong>
// //                       </td>
// //                       <td style={styles.td}>{a.total_tickets}</td>
// //                       <td style={styles.td}>{a.pass_percentage}%</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             ) : (
// //               <div style={styles.profileDetail}>
// //                 <div style={styles.pItem}><span>Avg. Score:</span> <strong>{agentsList[0]?.average_score || 0}%</strong></div>
// //                 <div style={styles.pItem}><span>Training Status:</span> <strong>{agentsList[0]?.needs_training ? "Required" : "Sufficient"}</strong></div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const MetricCard = ({ label, value, color, icon }) => (
// //   <div style={styles.metricCard}>
// //     <div style={styles.metricTop}><span style={styles.metricLabel}>{label}</span><span>{icon}</span></div>
// //     <h2 style={{ ...styles.metricValue, color }}>{value}</h2>
// //   </div>
// // );

// // const styles = {
// //   wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px', fontFamily: "'Inter', sans-serif" },
// //   navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
// //   logo: { margin: 0, fontSize: '24px', fontWeight: '800' },
// //   tabContainer: { display: 'flex', gap: '10px', marginTop: '10px' },
// //   activeTab: { padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
// //   inactiveTab: { padding: '8px 16px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' },
// //   filterBar: { display: 'flex', gap: '20px', background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
// //   filterLabel: { fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', display: 'block' },
// //   select: { padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', minWidth: '150px' },
// //   dateInput: { padding: '7px', borderRadius: '6px', border: '1px solid #e2e8f0' },
// //   statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' },
// //   metricCard: { background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' },
// //   metricTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
// //   metricLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600' },
// //   metricValue: { fontSize: '26px', fontWeight: '800', margin: 0 },
// //   contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px' },
// //   chartCard: { background: '#fff', padding: '25px', borderRadius: '20px' },
// //   tableCard: { background: '#fff', padding: '25px', borderRadius: '20px' },
// //   table: { width: '100%', borderCollapse: 'collapse' },
// //   th: { textAlign: 'left', padding: '10px', fontSize: '11px', color: '#94a3b8' },
// //   td: { padding: '10px', fontSize: '13px', borderBottom: '1px solid #f8fafc' },
// //   overlayLoader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px' },
// //   spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
// //   pItem: { display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f8fafc', borderRadius: '10px', marginBottom: '10px' }
// // };

// // // Add this to your Global CSS or a <style> tag in index.html
// // // @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

// // export default AllusersDashboard;


// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // States
//   const [activeTab, setActiveTab] = useState('team');
//   const [selectedAgent, setSelectedAgent] = useState('');
//   const [fromDate, setFromDate] = useState('2025-12-13');
//   const [toDate, setToDate] = useState('2026-01-12');
//   const [userList, setUserList] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/get/list_users', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUserList(res.data || []);
//         if (res.data?.length > 0) setSelectedAgent(res.data[0].sid);
//       } catch (err) { console.error("User List Error:", err); }
//     };
//     fetchUserList();
//   }, [user]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (activeTab === 'individual' && !selectedAgent) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const params = {};
//         if (activeTab === 'individual') {
//           params.agent_sid = selectedAgent;
//           if (fromDate) params.from_date = fromDate;
//           if (toDate) params.to_date = toDate;
//         }
//         const res = await api.get('/users/admin/dashboard', {
//           headers: { Authorization: `Bearer ${token}` },
//           params: params
//         });
//         setData(res.data);
//       } catch (err) { console.error("Dashboard Fetch Error:", err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, selectedAgent, fromDate, toDate, user]);

//   const emptySummary = { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   let summary = emptySummary;
//   let agentsList = [];

//   if (data) {
//     if (activeTab === 'individual' && data.filtered) {
//       summary = data.filtered.summary || emptySummary;
//       agentsList = data.filtered.agent_performance || [];
//     } else {
//       summary = data.all_time?.summary || emptySummary;
//       agentsList = data.all_time?.agent_performance || [];
//     }
//   }

//   const pieData = [
//     { name: 'Passed', value: summary.passed },
//     { name: 'Failed', value: summary.failed },
//     { name: 'Pending', value: summary.pending }
//   ];
//   const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
//     return (
//       <g>
//         <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="#1e293b" style={{ fontSize: '14px', fontWeight: '800' }}>{payload.name}</text>
//         <text x={cx} y={cy} dy={12} textAnchor="middle" fill="#64748b" style={{ fontSize: '10px' }}>{`${value} Tickets`}</text>
//         <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} />
//       </g>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       {/* External CSS for Icons */}
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {/* Header Area */}
//       <header style={styles.header}>
//         <div style={styles.titleArea}>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
//           <div style={styles.tabGroup}>
//             <button onClick={() => setActiveTab('team')} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
//             <button onClick={() => setActiveTab('individual')} style={activeTab === 'individual' ? styles.activeTab : styles.inactiveTab}>Individual</button>
//           </div>
//         </div>

//         {activeTab === 'individual' && (
//           <div style={styles.filterStrip}>
//             <select style={styles.inputSlim} value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
//               {userList.map(u => <option key={u.sid} value={u.sid}>{u.full_name}</option>)}
//             </select>
//             <input type="date" style={styles.inputSlim} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//             <input type="date" style={styles.inputSlim} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//             <button style={styles.resetBtn} onClick={() => { setFromDate(''); setToDate(''); }}>Reset</button>
//           </div>
//         )}
//       </header>

//       {/* KPI Stats Row */}
//       <div style={styles.kpiRow}>
//         <MetricBox label="TOTAL TICKETS" value={summary.total_tickets} color="#334155" icon="bi-collection-fill" />
//         <MetricBox label="PASSED" value={summary.passed} color="#10b981" icon="bi-patch-check-fill" />
//         <MetricBox label="FAILED" value={summary.failed} color="#f43f5e" icon="bi-patch-exclamation-fill" />
//         <MetricBox label="PENDING" value={summary.pending} color="#f59e0b" icon="bi-hourglass-split" />
//         <MetricBox label="PASS RATE" value={`${summary.pass_percentage}%`} color="#4f46e5" icon="bi-speedometer2" isLast />
//       </div>

//       {/* Main Content Area */}
//       <div style={styles.mainGrid}>
//         <section style={styles.card}>
//           <div style={styles.cardHeader}>
//             <h6 style={styles.cardTitle}>Quality Distribution</h6>
//             <i className="bi bi-three-dots-vertical text-muted"></i>
//           </div>
//           <div style={{ height: '230px' }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} onMouseEnter={(_, index) => setActiveIndex(index)} dataKey="value">
//                   {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </section>

//         <section style={styles.card}>
//           <div style={styles.cardHeader}>
//             <h6 style={styles.cardTitle}>{activeTab === 'team' ? "Performance Rankings" : "Analyst Details"}</h6>
//             <span style={styles.badge}>Live Sync</span>
//           </div>
//           <div style={styles.tableScroll}>
//             {activeTab === 'team' ? (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Analyst</th>
//                     <th style={styles.th}>Total Tickets</th>
//                     <th style={styles.th}>Success Rate</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {agentsList.map((a, i) => (
//                     <tr key={i} style={styles.tr}>
//                       <td style={styles.td}>
//                         <div style={styles.avatarRow}>
//                           <div style={styles.miniAvatar}>{a.agent.charAt(0).toUpperCase()}</div>
//                           {a.agent}
//                         </div>
//                       </td>
//                       <td style={styles.td}>{a.total_tickets}</td>
//                       <td style={styles.td}>
//                         <div style={styles.barContainer}>
//                           <div style={{...styles.progressBar, width: `${a.pass_percentage}%`, backgroundColor: a.pass_percentage > 80 ? '#10b981' : '#6366f1'}}></div>
//                           <span style={styles.barText}>{a.pass_percentage}%</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div style={styles.profileContainer}>
//                 <ProfileItem label="Quality Score" value={`${agentsList[0]?.average_score || 0}%`} icon="bi-award-fill" />
//                 <ProfileItem 
//                   label="Status" 
//                   value={agentsList[0]?.needs_training ? "Needs Coaching" : "Certified"} 
//                   color={agentsList[0]?.needs_training ? "#f43f5e" : "#10b981"} 
//                   icon="bi-shield-check"
//                 />
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//       {loading && <div style={styles.loader}><div className="spinner-border text-primary border-4"></div></div>}
//     </div>
//   );
// };

// const MetricBox = ({ label, value, color, icon, isLast }) => (
//   <div style={{...styles.metricBox, borderRight: isLast ? 'none' : '1px solid #e2e8f0'}}>
//     <div style={styles.metricLabelArea}>
//       <i className={`bi ${icon}`} style={{color, fontSize: '15px'}}></i>
//       <span style={styles.metricLabel}>{label}</span>
//     </div>
//     <h3 style={{...styles.metricValue, color}}>{value}</h3>
//   </div>
// );

// const ProfileItem = ({ label, value, color="#1e293b", icon }) => (
//   <div style={styles.profileItem}>
//     <div style={styles.profileIcon}><i className={`bi ${icon}`}></i></div>
//     <div>
//       <div style={styles.pLabel}>{label}</div>
//       <div style={{...styles.pValue, color}}>{value}</div>
//     </div>
//   </div>
// );

// const styles = {
//   container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', position: 'relative' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
//   titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
//   logo: { margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.4px', color: '#1e293b' },
//   tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
//   activeTab: { padding: '5px 12px', background: '#fff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },
//   inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '12px' },
//   filterStrip: { display: 'flex', gap: '6px' },
//   inputSlim: { padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#f8fafc' },
//   resetBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
//   kpiRow: { display: 'flex', backgroundColor: '#fff', borderRadius: '10px', marginBottom: '12px', padding: '30px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
//   metricBox: { flex: 1, padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '2px' },
//   metricLabelArea: { display: 'flex', alignItems: 'center', gap: '6px' },
//   metricLabel: { fontSize: '9px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.6px' },
//   metricValue: { margin: 0, fontSize: '20px', fontWeight: '900' },
//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '12px', flex: 1, minHeight: 0 },
//   card: { background: '#fff', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9' },
//   cardHeader: { padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
//   td: { padding: '8px', fontSize: '11px', borderBottom: '1px solid #f8fafc', color: '#475569' },
//   avatarRow: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' },
//   miniAvatar: { width: '22px', height: '22px', background: '#eef2ff', color: '#4f46e5', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800' },
//   barContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
//   progressBar: { height: '5px', borderRadius: '3px' },
//   barText: { fontSize: '10px', fontWeight: '700', minWidth: '28px' },
//   profileContainer: { padding: '8px', display: 'flex', flexDirection: 'column', gap: '10px' },
//   profileItem: { display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '8px' },
//   profileIcon: { width: '32px', height: '32px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
//   pLabel: { fontSize: '10px', color: '#64748b', fontWeight: '500' },
//   pValue: { fontSize: '14px', fontWeight: '800' },
//   badge: { fontSize: '9px', background: '#e0e7ff', color: '#4338ca', padding: '1px 6px', borderRadius: '8px', fontWeight: '700' },
//   loader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }
// };

// export default AllusersDashboard;

// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // Standard States
//   const [activeTab, setActiveTab] = useState('team');
//   const [selectedAgent, setSelectedAgent] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [userList, setUserList] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isUserOpen, setIsUserOpen] = useState(false);

//   // ✅ New States for Pending Incidents
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPending, setTotalPending] = useState(0);
//   const perPage = 10;

//   const [isOpen, setIsOpen] = useState(false);

// const options = [
//   { id: '', label: 'All Incidents', color: '#4f46e5', icon: 'bi-grid-fill' },
//   { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//   { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
//   { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
//   { id: 'on hold', label: 'On Hold', color: '#64748b', icon: 'bi-pause-circle-fill' },
// ];

// const selectedOption = options.find(opt => opt.id === statusFilter) || options[0];



// // Find the label of the currently selected user
// const selectedUserName = userList.find(u => u.sid === selectedAgent)?.full_name || "Select Analyst";

//   // 1. Fetch User List
//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/get/list_users', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUserList(res.data || []);
//         if (res.data?.length > 0) setSelectedAgent(res.data[0].sid);
//       } catch (err) { console.error("User List Error:", err); }
//     };
//     fetchUserList();
//   }, [user]);

//   // 2. Fetch Dashboard Data (Team/Individual)
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (activeTab === 'pending' || (activeTab === 'individual' && !selectedAgent)) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const params = {};
//         if (activeTab === 'individual') {
//           params.agent_sid = selectedAgent;
//           if (fromDate) params.from_date = fromDate;
//           if (toDate) params.to_date = toDate;
//         }
//         const res = await api.get('/users/admin/dashboard', {
//           headers: { Authorization: `Bearer ${token}` },
//           params: params
//         });
//         setData(res.data);
//       } catch (err) { console.error("Dashboard Fetch Error:", err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, selectedAgent, fromDate, toDate, user]);

//   // ✅ 3. Fetch Personal Pending Incidents (POST Request)
//  useEffect(() => {
//     const fetchPendingIncidents = async () => {
//       if (activeTab !== 'pending') return;

//       const currentSid = user?.sid || user?.user_sid;
//       if (!currentSid) return;

//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const payload = {
//           page: currentPage,
//           per_page: perPage,
//           user_sid: currentSid
//         };

//         // Added statusFilter as a query parameter
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { resolution_status: statusFilter || undefined } // Only send if not empty
//         });

//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) {
//         console.error("Pending API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPendingIncidents();
//   }, [activeTab, currentPage, user, statusFilter]);

//   const emptySummary = { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   let summary = emptySummary;
//   let agentsList = [];

//   if (data) {
//     if (activeTab === 'individual' && data.filtered) {
//       summary = data.filtered.summary || emptySummary;
//       agentsList = data.filtered.agent_performance || [];
//     } else {
//       summary = data.all_time?.summary || emptySummary;
//       agentsList = data.all_time?.agent_performance || [];
//     }
//   }

//   const pieData = [
//     { name: 'Passed', value: summary.passed },
//     { name: 'Failed', value: summary.failed },
//     { name: 'Pending', value: summary.pending }
//   ];
//   const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
//     return (
//       <g>
//         <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="#1e293b" style={{ fontSize: '14px', fontWeight: '800' }}>{payload.name}</text>
//         <text x={cx} y={cy} dy={12} textAnchor="middle" fill="#64748b" style={{ fontSize: '10px' }}>{`${value} Tickets`}</text>
//         <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} />
//       </g>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//      <header style={styles.header}>
//         <div style={styles.titleArea}>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
//           <div style={styles.tabGroup}>
//             <button onClick={() => setActiveTab('team')} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
//             <button onClick={() => setActiveTab('individual')} style={activeTab === 'individual' ? styles.activeTab : styles.inactiveTab}>Individual</button>
//             <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}>My Pending</button>
//           </div>
//         </div>

//         {/* ✅ Dynamic Filter Strip */}
//         <div style={styles.filterStrip}>
//            {activeTab === 'individual' && (
//   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    
//     {/* --- Premium Analyst Dropdown --- */}
//     <div style={styles.dropdownContainer}>
//       <div 
//         style={{
//           ...styles.premiumButton, 
//           borderColor: isUserOpen ? '#4f46e5' : '#d1d5db',
//           background: 'linear-gradient(145deg, #ffffff, #f9fafb)'
//         }}
//         onClick={() => setIsUserOpen(!isUserOpen)}
//       >
//         <div style={{ ...styles.statusDot, backgroundColor: '#6366f1' }} />
//         <span style={styles.selectedText}>{selectedUserName}</span>
//         <i className={`bi bi-chevron-${isUserOpen ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '11px' }}></i>
//       </div>

//       {isUserOpen && (
//         <div style={styles.scrollableMenu}>
//           {userList.map((u) => (
//             <div 
//               key={u.sid}
//               style={{
//                 ...styles.menuItem,
//                 background: selectedAgent === u.sid ? '#f0f4ff' : 'transparent',
//                 color: selectedAgent === u.sid ? '#4f46e5' : '#475569'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = selectedAgent === u.sid ? '#e0e7ff' : '#f1f5f9';
//                 e.currentTarget.style.transform = 'translateX(4px)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = selectedAgent === u.sid ? '#f0f4ff' : 'transparent';
//                 e.currentTarget.style.transform = 'translateX(0px)';
//               }}
//               onClick={() => {
//                 setSelectedAgent(u.sid);
//                 setIsUserOpen(false);
//               }}
//             >
//               <div style={{
//                 width: '24px', height: '24px', borderRadius: '6px', background: '#e0e7ff', 
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800'
//               }}>
//                 {u.full_name.charAt(0)}
//               </div>
//               {u.full_name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>

//     {/* --- Premium Date Inputs --- */}
//     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//       <input 
//         type="date" 
//         style={styles.premiumDateInput} 
//         value={fromDate} 
//         onChange={(e) => setFromDate(e.target.value)}
//         onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
//         onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
//       />
//       <span style={{ color: '#94a3b8', fontWeight: '800', fontSize: '10px' }}>TO</span>
//       <input 
//         type="date" 
//         style={styles.premiumDateInput} 
//         value={toDate} 
//         onChange={(e) => setToDate(e.target.value)} 
//         onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
//         onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
//       />
//     </div>

//     {/* --- Reset Button --- */}
//     <button 
//       style={{
//         ...styles.resetBtn,
//         padding: '8px 12px',
//         borderRadius: '10px',
//         fontSize: '13px',
//         transition: 'all 0.2s'
//       }} 
//       onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
//       onMouseLeave={(e) => e.target.style.color = '#ef4444'}
//       onClick={() => { setFromDate(''); setToDate(''); }}
//     >
//       <i className="bi bi-arrow-counterclockwise"></i> Reset
//     </button>
//   </div>
// )}

//           {/* ✅ New Status Filter for Pending Tab */}
// {activeTab === 'pending' && (

  
//   <div style={styles.dropdownContainer}>
//     <label style={styles.filterLabelLite}>Filter Status</label>
//     {/* The Trigger Button */}
//     <div 
//       style={{
//         ...styles.premiumButton, 
//         borderColor: isOpen ? '#4f46e5' : '#d1d5db',
//         transform: isOpen ? 'translateY(-2px)' : 'none'
//       }}
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       <div style={{ ...styles.statusDot, backgroundColor: selectedOption.color }} />
//       <span style={styles.selectedText}>{selectedOption.label}</span>
//       <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '12px' }}></i>
//     </div>

//     {/* The Custom Menu */}
//     {isOpen && (
//       <div style={styles.customMenu}>
//         {options.map((opt) => (
//           <div 
//             key={opt.id}
//             style={{
//               ...styles.menuItem,
//               background: statusFilter === opt.id ? '#f0f4ff' : 'transparent',
//               color: statusFilter === opt.id ? '#4f46e5' : '#475569'
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
//             onMouseLeave={(e) => e.currentTarget.style.background = statusFilter === opt.id ? '#f0f4ff' : 'transparent'}
//             onClick={() => {
//               setStatusFilter(opt.id);
//               setCurrentPage(1);
//               setIsOpen(false);
//             }}
//           >
//             <i className={`bi ${opt.icon}`} style={{ color: opt.color, fontSize: '14px' }}></i>
//             {opt.label}
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
  
// )}
//         </div>
//       </header>

//       {/* KPI Stats Row (Hide on Pending tab to focus on list) */}
//       {activeTab !== 'pending' && (
//         <div style={styles.kpiRow}>
//           <MetricBox label="TOTAL TICKETS" value={summary.total_tickets} color="#334155" icon="bi-collection-fill" />
//           <MetricBox label="PASSED" value={summary.passed} color="#10b981" icon="bi-patch-check-fill" />
//           <MetricBox label="FAILED" value={summary.failed} color="#f43f5e" icon="bi-patch-exclamation-fill" />
//           <MetricBox label="PENDING" value={summary.pending} color="#f59e0b" icon="bi-hourglass-split" />
//           <MetricBox label="PASS RATE" value={`${summary.pass_percentage}%`} color="#4f46e5" icon="bi-speedometer2" isLast />
//         </div>
//       )}

//       {/* Main Content Area */}
//       <div style={activeTab === 'pending' ? styles.fullView : styles.mainGrid}>
        
//         {/* Only show Distribution chart if NOT in pending tab */}
//         {activeTab !== 'pending' && (
//           <section style={styles.card}>
//             <div style={styles.cardHeader}>
//               <h6 style={styles.cardTitle}>Quality Distribution</h6>
//               <i className="bi bi-three-dots-vertical text-muted"></i>
//             </div>
//             <div style={{ height: '230px' }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} onMouseEnter={(_, index) => setActiveIndex(index)} dataKey="value">
//                     {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </section>
//         )}

//         <section style={styles.card}>
//          <div style={activeTab === 'pending' ? styles.mediumBanner : styles.cardHeader}>
//   <div style={styles.bannerLeft}>
//     {activeTab === 'pending' && (
//       <div style={styles.bannerIconSmall}>
//         <i className="bi bi-clipboard-data-fill"></i>
//       </div>
//     )}
//     <h6 style={activeTab === 'pending' ? styles.bannerTitleMedium : styles.cardTitle}>
//       {activeTab === 'team' ? "Performance Rankings" : 
//        activeTab === 'individual' ? "Analyst Details" : "Your Pending Incidents"}
//     </h6>
//   </div>
  
//   {activeTab === 'pending' && (
//     <div style={styles.glassBadge}>
//       <span style={styles.pulseDot}></span>
//       {totalPending} Records Found
//     </div>
//   )}
// </div>

//           <div style={styles.tableScroll}>
//             {activeTab === 'pending' ? (
//               <>
//                 <table style={styles.table}>
//   <thead>
//     <tr>
//       <th style={styles.th}>Incident No</th>
//       <th style={styles.th}>Short Description</th>
//       <th style={styles.th}>Status</th>
//       <th style={styles.th}>Resolution</th>
//     </tr>
//   </thead>
//  <tbody>
//   {pendingIncidents.length > 0 ? (
//     pendingIncidents.map((incident, i) => (
//       <tr key={i} style={styles.tr}>
//         <td style={styles.td}>
//           <span style={{ fontWeight: '700', color: '#4f46e5' }}>
//             {incident.incident_number}
//           </span>
//         </td>
//         <td style={styles.td}>
//           <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//             {incident.short_description}
//           </div>
//         </td>
//         <td style={styles.td}>
//           <span style={{
//             padding: '2px 8px',
//             borderRadius: '12px',
//             fontSize: '10px',
//             fontWeight: 'bold',
//             textTransform: 'uppercase',
//             backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2',
//             color: incident.status === 'resolved' ? '#166534' : '#991b1b'
//           }}>
//             {incident.status}
//           </span>
//         </td>
//         <td style={styles.td}>
//           <span style={{ fontStyle: 'italic', color: '#64748b' }}>
//             {incident.resolution_shared || "Pending..." }
//           </span>
//         </td>
//       </tr>
//     ))
//   ) : (
//     // ✅ This is the "No Data Found" message
//     <tr>
//       <td colSpan="4" style={{ padding: '40px 0', textAlign: 'center' }}>
//         <div style={styles.noDataWrapper}>
//           <i className={`bi ${selectedOption.icon}`} style={{ fontSize: '24px', color: '#cbd5e1', marginBottom: '10px', display: 'block' }}></i>
//           <p style={{ margin: 0, fontWeight: '700', color: '#64748b', fontSize: '14px' }}>
//             No data found in <span style={{ color: selectedOption.color }}>{selectedOption.label}</span>
//           </p>
//           <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
//             There are currently no incidents recorded for this status.
//           </p>
//         </div>
//       </td>
//     </tr>
//   )}
// </tbody>
// </table>

//                 {/* ✅ Premium Pagination */}
//                 <div style={styles.paginationArea}>
//                    <button 
//                      disabled={currentPage === 1} 
//                      onClick={() => setCurrentPage(p => p - 1)}
//                      style={currentPage === 1 ? styles.pagBtnDisabled : styles.pagBtn}
//                    >
//                      <i className="bi bi-chevron-left"></i>
//                    </button>
                   
//                    {[...Array(Math.ceil(totalPending / perPage))].slice(0, 5).map((_, i) => (
//                      <button 
//                        key={i} 
//                        onClick={() => setCurrentPage(i + 1)}
//                        style={currentPage === i + 1 ? styles.pagNumActive : styles.pagNum}
//                      >
//                        {i + 1}
//                      </button>
//                    ))}

//                    <button 
//                      disabled={currentPage >= Math.ceil(totalPending / perPage)} 
//                      onClick={() => setCurrentPage(p => p + 1)}
//                      style={currentPage >= Math.ceil(totalPending / perPage) ? styles.pagBtnDisabled : styles.pagBtn}
//                    >
//                      <i className="bi bi-chevron-right"></i>
//                    </button>
//                 </div>
//               </>
//             ) : activeTab === 'team' ? (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Analyst</th>
//                     <th style={styles.th}>Total Tickets</th>
//                     <th style={styles.th}>Success Rate</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {agentsList.map((a, i) => (
//                     <tr key={i} style={styles.tr}>
//                       <td style={styles.td}>
//                         <div style={styles.avatarRow}>
//                           <div style={styles.miniAvatar}>{a.agent.charAt(0).toUpperCase()}</div>
//                           {a.agent}
//                         </div>
//                       </td>
//                       <td style={styles.td}>{a.total_tickets}</td>
//                       <td style={styles.td}>
//                         <div style={styles.barContainer}>
//                           <div style={{...styles.progressBar, width: `${a.pass_percentage}%`, backgroundColor: a.pass_percentage > 80 ? '#10b981' : '#6366f1'}}></div>
//                           <span style={styles.barText}>{a.pass_percentage}%</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div style={styles.profileContainer}>
//                 <ProfileItem label="Quality Score" value={`${agentsList[0]?.average_score || 0}%`} icon="bi-award-fill" />
//                 <ProfileItem 
//                   label="Status" 
//                   value={agentsList[0]?.needs_training ? "Needs Coaching" : "Certified"} 
//                   color={agentsList[0]?.needs_training ? "#f43f5e" : "#10b981"} 
//                   icon="bi-shield-check"
//                 />
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//       {loading && <div style={styles.loader}><div className="spinner-border text-primary border-4"></div></div>}
//     </div>
//   );
// };

// // ... MetricBox and ProfileItem components remain the same ...
// const MetricBox = ({ label, value, color, icon, isLast }) => (
//   <div style={{...styles.metricBox, borderRight: isLast ? 'none' : '1px solid #e2e8f0'}}>
//     <div style={styles.metricLabelArea}>
//       <i className={`bi ${icon}`} style={{color, fontSize: '15px'}}></i>
//       <span style={styles.metricLabel}>{label}</span>
//     </div>
//     <h3 style={{...styles.metricValue, color}}>{value}</h3>
//   </div>
// );

// const ProfileItem = ({ label, value, color="#1e293b", icon }) => (
//   <div style={styles.profileItem}>
//     <div style={styles.profileIcon}><i className={`bi ${icon}`}></i></div>
//     <div>
//       <div style={styles.pLabel}>{label}</div>
//       <div style={{...styles.pValue, color}}>{value}</div>
//     </div>
//   </div>
// );
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const AllusersDashboard = () => {
  const { user } = useAuth();

  // ================= USER TYPE =================
  const userType = user?.type; // ✅ qa_admin | agent
  const isQAAdmin = userType === "qa_admin";
  const isAgent = userType === "agent";

  // ================= STATES =================
  const [activeTab, setActiveTab] = useState('team');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userList, setUserList] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserOpen, setIsUserOpen] = useState(false);

  // Pending
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const perPage = 10;
  const [isOpen, setIsOpen] = useState(false);

  // ================= FORCE AGENT TAB =================
  useEffect(() => {
    if (isAgent) {
      setActiveTab("team");
    }
  }, [isAgent]);

  // ================= FETCH USER LIST (QA ADMIN ONLY) =================
  useEffect(() => {
    if (!isQAAdmin) return;

    const fetchUserList = async () => {
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.get('/users/get/list_users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserList(res.data || []);
        if (res.data?.length) setSelectedAgent(res.data[0].sid);
      } catch (err) {
        console.error("User list error:", err);
      }
    };

    fetchUserList();
  }, [user, isQAAdmin]);

  // ================= DASHBOARD DATA =================
  useEffect(() => {
    if (isAgent && activeTab !== "team") return;
    if (activeTab === 'pending') return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const params = {};

        if (activeTab === 'individual') {
          params.agent_sid = selectedAgent;
          if (fromDate) params.from_date = fromDate;
          if (toDate) params.to_date = toDate;
        }

        const res = await api.get('/users/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
          params
        });

        setData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab, selectedAgent, fromDate, toDate, user, isAgent]);

  // ================= PENDING (QA ADMIN ONLY) =================
  useEffect(() => {
    if (!isQAAdmin || activeTab !== 'pending') return;

    const fetchPending = async () => {
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("session_token");

        const res = await api.post(
          '/users/get-pending/incidents/all',
          {
            page: currentPage,
            per_page: perPage,
            user_sid: user?.sid || user?.user_sid
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { resolution_status: statusFilter || undefined }
          }
        );

        setPendingIncidents(res.data.response || []);
        setTotalPending(res.data.total || 0);
      } catch (err) {
        console.error("Pending error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [activeTab, currentPage, statusFilter, isQAAdmin, user]);

  // ================= UI =================
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>TicketMetrics</h2>

        {/* ================= USER TYPE BASED TABS ================= */}
        <div style={styles.tabGroup}>
          {/* Team View → ALL */}
          <button
            onClick={() => setActiveTab('team')}
            style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}
          >
            Team View
          </button>

          {/* QA ADMIN ONLY */}
          {isQAAdmin && (
            <>
              <button
                onClick={() => setActiveTab('individual')}
                style={activeTab === 'individual' ? styles.activeTab : styles.inactiveTab}
              >
                Individual
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}
              >
                My Pending
              </button>
            </>
          )}
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      {activeTab === "team" && <div>✅ Team View Content</div>}

      {isQAAdmin && activeTab === "individual" && (
        <div>✅ Individual Content</div>
      )}

      {isQAAdmin && activeTab === "pending" && (
        <div>✅ Pending Content</div>
      )}

      {loading && <div>Loading...</div>}
    </div>
  );
};
const styles = {
  // Existing styles...
  container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
  titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.4px', color: '#1e293b' },
  tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
  activeTab: { padding: '5px 12px', background: '#fff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },
  inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '12px' },
  filterStrip: { display: 'flex', gap: '6px' },
// inputSlim: {
//     padding: '8px 12px',
//     borderRadius: '8px',
//     border: '1px solid #e2e8f0',
//     fontSize: '13px',
//     background: '#ffffff',
//     color: '#1e293b',
//     fontWeight: '500',
//     outline: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//     minWidth: '150px',
//     appearance: 'none', // Removes default browser arrow
//     backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'right 8px center',
//     backgroundSize: '16px',
//     paddingRight: '32px'
//   },
//   filterLabel: {
//     fontSize: '11px',
//     fontWeight: '700',
//     color: '#64748b',
//     textTransform: 'uppercase',
//     marginBottom: '4px',
//     display: 'block',
//     letterSpacing: '0.5px'
//   },
//   filterContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center'
//   },
    
premiumFilterWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
    padding: '4px 12px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginRight: '10px',
    backgroundColor: '#4f46e5',
    boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)',
  },
  premiumSelect: {
    border: 'none',
    background: 'transparent',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    padding: '8px 4px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '160px',
    appearance: 'none',
  },
  selectChevron: {
    marginLeft: '8px',
    color: '#64748b',
    fontSize: '12px',
    transition: 'transform 0.3s ease'
  }, 

  // --- New Medium Banner Styles ---
  mediumBanner: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '20px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 'none',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.15)',
  },
  bannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  bannerIconSmall: {
    width: '32px',
    height: '32px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
  },
  bannerTitleMedium: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.3px',
  },
  glassBadge: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
  },
  pulseDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#34d399', // Bright Green
    borderRadius: '50%',
    boxShadow: '0 0 8px #34d399',
  },

  // Add these to your styles object
  scrollableMenu: {
    position: 'absolute',
    top: '120%',
    left: '-20px',
    width: '200px',
    maxHeight: '300px', // Limit height for long user lists
    overflowY: 'auto',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    zIndex: 1000,
    padding: '8px',
  },
  premiumDateInput: {
    padding: '6px 14px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    background: '#ffffff',
    outline: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
  },
  noDataWrapper: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  background: '#f8fafc',
  borderRadius: '12px',
  border: '2px dashed #e2e8f0',
  animation: 'fadeInUp 0.3s ease-out'
},
resetBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  kpiRow: { display: 'flex', backgroundColor: '#fff', borderRadius: '10px', marginBottom: '12px', padding: '30px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
  metricBox: { flex: 1, padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '2px' },
  metricLabelArea: { display: 'flex', alignItems: 'center', gap: '6px' },
  metricLabel: { fontSize: '9px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.6px' },
  metricValue: { margin: 0, fontSize: '20px', fontWeight: '900' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '12px', flex: 1, minHeight: 0 },
  fullView: { display: 'block', flex: 1, minHeight: 0 }, // Used for Pending tab
  card: { background: '#fff', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
  cardHeader: { padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
  td: { padding: '8px', fontSize: '11px', borderBottom: '1px solid #f8fafc', color: '#475569' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' },
  miniAvatar: { width: '22px', height: '22px', background: '#eef2ff', color: '#4f46e5', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800' },
  barContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  progressBar: { height: '5px', borderRadius: '3px' },
  barText: { fontSize: '10px', fontWeight: '700', minWidth: '28px' },
  profileContainer: { padding: '8px', display: 'flex', flexDirection: 'column', gap: '10px' },
  profileItem: { display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '8px' },
  profileIcon: { width: '32px', height: '32px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  pLabel: { fontSize: '10px', color: '#64748b', fontWeight: '500' },
  pValue: { fontSize: '14px', fontWeight: '800' },
  badge: { fontSize: '9px', background: '#e0e7ff', color: '#4338ca', padding: '1px 6px', borderRadius: '8px', fontWeight: '700' },
  loader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
// Add these to your styles object
  dropdownContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  
  premiumButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'linear-gradient(145deg, #ffffff, #f0f4ff)',
    padding: '5px 15px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(79, 70, 229, 0.4)',
  },
  selectedText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    minWidth: '80px',
    textAlign: 'left'
  },
  customMenu: {
    position: 'absolute',
    top: '120%',
    left: '0',
    width: '200px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    zIndex: 1000,
    padding: '8px',
    animation: 'fadeInUp 0.2s ease-out',
  },
  menuItem: {
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  filterLabelLite: { fontSize: '9px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: '4px' },
  glassButton: { 
    display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.15)', 
    backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' 
  },
  // ✅ Pagination Styles
  paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', padding: '20px 0' },
  pagBtn: { border: '1px solid #e2e8f0', background: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: '#4f46e5' },
  pagBtnDisabled: { border: '1px solid #f1f5f9', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', color: '#cbd5e1', cursor: 'not-allowed' },
  pagNum: { border: '1px solid #e2e8f0', background: '#fff', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: '#64748b' },
  pagNumActive: { background: '#4f46e5', color: '#fff', border: '1px solid #4f46e5', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: '700', fontSize: '12px' },
};

export default AllusersDashboard;