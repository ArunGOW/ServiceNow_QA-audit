 



// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // States
//   const [activeTab, setActiveTab] = useState('team');
//   const [selectedAgent, setSelectedAgent] = useState(''); // Stores the SID
//   const [fromDate, setFromDate] = useState('2025-12-13');
//   const [toDate, setToDate] = useState('2026-01-12');
//   const [userList, setUserList] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   // 1. Initial Fetch: Get the User List only once
//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/get/list_users', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUserList(res.data || []);
//         // Set default agent to the first one in the list
//         if (res.data?.length > 0) setSelectedAgent(res.data[0].sid);
//       } catch (err) {
//         console.error("User List Error:", err);
//       }
//     };
//     fetchUserList();
//   }, [user]);

//   // 2. Data Fetch: Triggers EVERY time tab, agent, or dates change
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       // Don't call if we are in individual mode but have no SID yet
//       if (activeTab === 'individual' && !selectedAgent) return;

//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const params = {};

//         if (activeTab === 'individual') {
//           params.agent_sid = selectedAgent; // Using the key from your Swagger

//           // Only add dates to params if they are actually filled
//           if (fromDate) params.from_date = fromDate;
//           if (toDate) params.to_date = toDate;
//         }

//         const res = await api.get('/users/admin/dashboard', {
//           headers: { Authorization: `Bearer ${token}` },
//           params: params
//         });

//         console.log("New API Response:", res.data);
//         setData(res.data);
//       } catch (err) {
//         console.error("Dashboard Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [activeTab, selectedAgent, fromDate, toDate, user]); // <--- React watches these!

//   // --- Data Logic (Initializes summary before usage) ---
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
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#1e293b" style={{ fontSize: '18px', fontWeight: 'bold' }}>{payload.name}</text>
//         <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#64748b" style={{ fontSize: '12px' }}>{`${value} Tickets`}</text>
//         <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
//       </g>
//     );
//   };

//   return (
//     <div style={styles.wrapper}>
//       {/* Navbar */}
//       <nav style={styles.navbar}>
//         <div>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#6366f1' }}>Metrics</span></h2>
//           <div style={styles.tabContainer}>
//             <button onClick={() => setActiveTab('team')} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team Overview</button>
//             <button onClick={() => setActiveTab('individual')} style={activeTab === 'individual' ? styles.activeTab : styles.inactiveTab}>Individual Analysis</button>
//           </div>
//         </div>
//       </nav>

//       {/* Filters for Individual Tab */}
//       {activeTab === 'individual' && (
//         <div style={styles.filterBar}>
//           <div style={styles.filterGroup}>
//             <label style={styles.filterLabel}>Select Analyst</label>
//             <select style={styles.select} value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
//               {userList.map(u => <option key={u.sid} value={u.sid}>{u.full_name}</option>)}
//             </select>
//           </div>
//           <div style={styles.filterGroup}>
//             <label style={styles.filterLabel}>From Date</label>
//             <input type="date" style={styles.dateInput} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//           </div>
//           <div style={styles.filterGroup}>
//             <label style={styles.filterLabel}>To Date</label>
//             <input type="date" style={styles.dateInput} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//           </div>
//           <div style={{ alignSelf: 'flex-end' }}>
//             <button
//               className="btn btn-outline-secondary btn-sm mb-1"
//               style={styles.resetBtn}
//               onClick={() => {
//                 setFromDate('');
//                 setToDate('');
//               }}
//             >
//               Reset Dates
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Stats Row with Overlay Spinner */}
//       <div style={{ position: 'relative' }}>
//         {loading && <div style={styles.overlayLoader}><div style={styles.spinner}></div></div>}

//         <div style={styles.statsRow}>
//           <MetricCard label="Total Tickets" value={summary.total_tickets} color="#1e293b" icon="📑" />
//           <MetricCard label="Passed" value={summary.passed} color="#10b981" icon="✅" />
//           <MetricCard label="Failed" value={summary.failed} color="#f43f5e" icon="❌" />
//           <MetricCard label="Pending" value={summary.pending} color="#f59e0b" icon="⏳" />
//           <MetricCard label="Pass Rate" value={`${summary.pass_percentage}%`} color="#6366f1" icon="📈" />
//         </div>

//         <div style={styles.contentGrid}>
//           <div style={styles.chartCard}>
//             <h3 style={styles.cardHeader}>Distribution Analysis</h3>
//             <div style={{ width: '100%', height: 350 }}>
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} onMouseEnter={(_, index) => setActiveIndex(index)} dataKey="value">
//                     {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div style={styles.tableCard}>
//             <h3 style={styles.cardHeader}>{activeTab === 'team' ? "Team Rankings" : "Analyst Profile"}</h3>
//             {activeTab === 'team' ? (
//               <table style={styles.table}>
//                 <thead><tr><th style={styles.th}>Agent</th><th style={styles.th}>Total</th><th style={styles.th}>Result</th></tr></thead>
//                 <tbody>
//                   {agentsList.map((a, i) => (
//                     <tr key={i} style={styles.tr}>
//                       <td style={styles.td}>
//                         <strong>
//                           {a.agent.charAt(0).toUpperCase() + a.agent.slice(1)}
//                         </strong>
//                       </td>
//                       <td style={styles.td}>{a.total_tickets}</td>
//                       <td style={styles.td}>{a.pass_percentage}%</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div style={styles.profileDetail}>
//                 <div style={styles.pItem}><span>Avg. Score:</span> <strong>{agentsList[0]?.average_score || 0}%</strong></div>
//                 <div style={styles.pItem}><span>Training Status:</span> <strong>{agentsList[0]?.needs_training ? "Required" : "Sufficient"}</strong></div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value, color, icon }) => (
//   <div style={styles.metricCard}>
//     <div style={styles.metricTop}><span style={styles.metricLabel}>{label}</span><span>{icon}</span></div>
//     <h2 style={{ ...styles.metricValue, color }}>{value}</h2>
//   </div>
// );

// const styles = {
//   wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px', fontFamily: "'Inter', sans-serif" },
//   navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
//   logo: { margin: 0, fontSize: '24px', fontWeight: '800' },
//   tabContainer: { display: 'flex', gap: '10px', marginTop: '10px' },
//   activeTab: { padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
//   inactiveTab: { padding: '8px 16px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' },
//   filterBar: { display: 'flex', gap: '20px', background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
//   filterLabel: { fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', display: 'block' },
//   select: { padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', minWidth: '150px' },
//   dateInput: { padding: '7px', borderRadius: '6px', border: '1px solid #e2e8f0' },
//   statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' },
//   metricCard: { background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' },
//   metricTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
//   metricLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600' },
//   metricValue: { fontSize: '26px', fontWeight: '800', margin: 0 },
//   contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px' },
//   chartCard: { background: '#fff', padding: '25px', borderRadius: '20px' },
//   tableCard: { background: '#fff', padding: '25px', borderRadius: '20px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '10px', fontSize: '11px', color: '#94a3b8' },
//   td: { padding: '10px', fontSize: '13px', borderBottom: '1px solid #f8fafc' },
//   overlayLoader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px' },
//   spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
//   pItem: { display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f8fafc', borderRadius: '10px', marginBottom: '10px' }
// };

// // Add this to your Global CSS or a <style> tag in index.html
// // @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

// export default AllusersDashboard;


import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const AllusersDashboard = () => {
  const { user } = useAuth();

  // States
  const [activeTab, setActiveTab] = useState('team');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [fromDate, setFromDate] = useState('2025-12-13');
  const [toDate, setToDate] = useState('2026-01-12');
  const [userList, setUserList] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.get('/users/get/list_users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserList(res.data || []);
        if (res.data?.length > 0) setSelectedAgent(res.data[0].sid);
      } catch (err) { console.error("User List Error:", err); }
    };
    fetchUserList();
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (activeTab === 'individual' && !selectedAgent) return;
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
          params: params
        });
        setData(res.data);
      } catch (err) { console.error("Dashboard Fetch Error:", err); }
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [activeTab, selectedAgent, fromDate, toDate, user]);

  const emptySummary = { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
  let summary = emptySummary;
  let agentsList = [];

  if (data) {
    if (activeTab === 'individual' && data.filtered) {
      summary = data.filtered.summary || emptySummary;
      agentsList = data.filtered.agent_performance || [];
    } else {
      summary = data.all_time?.summary || emptySummary;
      agentsList = data.all_time?.agent_performance || [];
    }
  }

  const pieData = [
    { name: 'Passed', value: summary.passed },
    { name: 'Failed', value: summary.failed },
    { name: 'Pending', value: summary.pending }
  ];
  const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="#1e293b" style={{ fontSize: '14px', fontWeight: '800' }}>{payload.name}</text>
        <text x={cx} y={cy} dy={12} textAnchor="middle" fill="#64748b" style={{ fontSize: '10px' }}>{`${value} Tickets`}</text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      </g>
    );
  };

  return (
    <div style={styles.container}>
      {/* External CSS for Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

      {/* Header Area */}
      <header style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
          <div style={styles.tabGroup}>
            <button onClick={() => setActiveTab('team')} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
            <button onClick={() => setActiveTab('individual')} style={activeTab === 'individual' ? styles.activeTab : styles.inactiveTab}>Individual</button>
          </div>
        </div>

        {activeTab === 'individual' && (
          <div style={styles.filterStrip}>
            <select style={styles.inputSlim} value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
              {userList.map(u => <option key={u.sid} value={u.sid}>{u.full_name}</option>)}
            </select>
            <input type="date" style={styles.inputSlim} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <input type="date" style={styles.inputSlim} value={toDate} onChange={(e) => setToDate(e.target.value)} />
            <button style={styles.resetBtn} onClick={() => { setFromDate(''); setToDate(''); }}>Reset</button>
          </div>
        )}
      </header>

      {/* KPI Stats Row */}
      <div style={styles.kpiRow}>
        <MetricBox label="TOTAL TICKETS" value={summary.total_tickets} color="#334155" icon="bi-collection-fill" />
        <MetricBox label="PASSED" value={summary.passed} color="#10b981" icon="bi-patch-check-fill" />
        <MetricBox label="FAILED" value={summary.failed} color="#f43f5e" icon="bi-patch-exclamation-fill" />
        <MetricBox label="PENDING" value={summary.pending} color="#f59e0b" icon="bi-hourglass-split" />
        <MetricBox label="PASS RATE" value={`${summary.pass_percentage}%`} color="#4f46e5" icon="bi-speedometer2" isLast />
      </div>

      {/* Main Content Area */}
      <div style={styles.mainGrid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h6 style={styles.cardTitle}>Quality Distribution</h6>
            <i className="bi bi-three-dots-vertical text-muted"></i>
          </div>
          <div style={{ height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} onMouseEnter={(_, index) => setActiveIndex(index)} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h6 style={styles.cardTitle}>{activeTab === 'team' ? "Performance Rankings" : "Analyst Details"}</h6>
            <span style={styles.badge}>Live Sync</span>
          </div>
          <div style={styles.tableScroll}>
            {activeTab === 'team' ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Analyst</th>
                    <th style={styles.th}>Total Tickets</th>
                    <th style={styles.th}>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {agentsList.map((a, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.avatarRow}>
                          <div style={styles.miniAvatar}>{a.agent.charAt(0).toUpperCase()}</div>
                          {a.agent}
                        </div>
                      </td>
                      <td style={styles.td}>{a.total_tickets}</td>
                      <td style={styles.td}>
                        <div style={styles.barContainer}>
                          <div style={{...styles.progressBar, width: `${a.pass_percentage}%`, backgroundColor: a.pass_percentage > 80 ? '#10b981' : '#6366f1'}}></div>
                          <span style={styles.barText}>{a.pass_percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.profileContainer}>
                <ProfileItem label="Quality Score" value={`${agentsList[0]?.average_score || 0}%`} icon="bi-award-fill" />
                <ProfileItem 
                  label="Status" 
                  value={agentsList[0]?.needs_training ? "Needs Coaching" : "Certified"} 
                  color={agentsList[0]?.needs_training ? "#f43f5e" : "#10b981"} 
                  icon="bi-shield-check"
                />
              </div>
            )}
          </div>
        </section>
      </div>
      {loading && <div style={styles.loader}><div className="spinner-border text-primary border-4"></div></div>}
    </div>
  );
};

const MetricBox = ({ label, value, color, icon, isLast }) => (
  <div style={{...styles.metricBox, borderRight: isLast ? 'none' : '1px solid #e2e8f0'}}>
    <div style={styles.metricLabelArea}>
      <i className={`bi ${icon}`} style={{color, fontSize: '15px'}}></i>
      <span style={styles.metricLabel}>{label}</span>
    </div>
    <h3 style={{...styles.metricValue, color}}>{value}</h3>
  </div>
);

const ProfileItem = ({ label, value, color="#1e293b", icon }) => (
  <div style={styles.profileItem}>
    <div style={styles.profileIcon}><i className={`bi ${icon}`}></i></div>
    <div>
      <div style={styles.pLabel}>{label}</div>
      <div style={{...styles.pValue, color}}>{value}</div>
    </div>
  </div>
);

const styles = {
  container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
  titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.4px', color: '#1e293b' },
  tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
  activeTab: { padding: '5px 12px', background: '#fff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },
  inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '12px' },
  filterStrip: { display: 'flex', gap: '6px' },
  inputSlim: { padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#f8fafc' },
  resetBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  kpiRow: { display: 'flex', backgroundColor: '#fff', borderRadius: '10px', marginBottom: '12px', padding: '30px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
  metricBox: { flex: 1, padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '2px' },
  metricLabelArea: { display: 'flex', alignItems: 'center', gap: '6px' },
  metricLabel: { fontSize: '9px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.6px' },
  metricValue: { margin: 0, fontSize: '20px', fontWeight: '900' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '12px', flex: 1, minHeight: 0 },
  card: { background: '#fff', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9' },
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
  loader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }
};

export default AllusersDashboard;


