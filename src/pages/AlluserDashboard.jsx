
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
//           <div style={styles.cardHeader}>
//             <h6 style={styles.cardTitle}>
//               {activeTab === 'team' ? "Performance Rankings" : 
//                activeTab === 'individual' ? "Analyst Details" : "Your Pending Incidents"}
//             </h6>
//             {activeTab === 'pending' && <span style={styles.badge}>{totalPending} Records Found</span>}
//           </div>

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

// const styles = {
//   // Existing styles...
//   container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', position: 'relative' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
//   titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
//   logo: { margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.4px', color: '#1e293b' },
//   tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
//   activeTab: { padding: '5px 12px', background: '#fff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },
//   inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '12px' },
//   filterStrip: { display: 'flex', gap: '6px' },

// premiumFilterWrapper: {
//     display: 'flex',
//     alignItems: 'center',
//     background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
//     padding: '4px 12px',
//     borderRadius: '12px',
//     border: '1px solid #e2e8f0',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   statusIndicator: {
//     width: '8px',
//     height: '8px',
//     borderRadius: '50%',
//     marginRight: '10px',
//     backgroundColor: '#4f46e5',
//     boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)',
//   },
//   premiumSelect: {
//     border: 'none',
//     background: 'transparent',
//     fontSize: '13px',
//     fontWeight: '600',
//     color: '#1e293b',
//     padding: '8px 4px',
//     cursor: 'pointer',
//     outline: 'none',
//     minWidth: '160px',
//     appearance: 'none',
//   },
//   selectChevron: {
//     marginLeft: '8px',
//     color: '#64748b',
//     fontSize: '12px',
//     transition: 'transform 0.3s ease'
//   }, 

//   // Add these to your styles object
//   scrollableMenu: {
//     position: 'absolute',
//     top: '120%',
//     left: '-20px',
//     width: '200px',
//     maxHeight: '300px', // Limit height for long user lists
//     overflowY: 'auto',
//     background: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '16px',
//     border: '1px solid rgba(255, 255, 255, 0.3)',
//     boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//     zIndex: 1000,
//     padding: '8px',
//   },
//   premiumDateInput: {
//     padding: '6px 14px',
//     borderRadius: '14px',
//     border: '1px solid #d1d5db',
//     fontSize: '13px',
//     fontWeight: '600',
//     color: '#1e293b',
//     background: '#ffffff',
//     outline: 'none',
//     transition: 'all 0.3s ease',
//     cursor: 'pointer',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
//   },
//   noDataWrapper: {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '20px',
//   background: '#f8fafc',
//   borderRadius: '12px',
//   border: '2px dashed #e2e8f0',
//   animation: 'fadeInUp 0.3s ease-out'
// },
// resetBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
//   kpiRow: { display: 'flex', backgroundColor: '#fff', borderRadius: '10px', marginBottom: '12px', padding: '30px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
//   metricBox: { flex: 1, padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '2px' },
//   metricLabelArea: { display: 'flex', alignItems: 'center', gap: '6px' },
//   metricLabel: { fontSize: '9px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.6px' },
//   metricValue: { margin: 0, fontSize: '20px', fontWeight: '900' },
//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '12px', flex: 1, minHeight: 0 },
//   fullView: { display: 'block', flex: 1, minHeight: 0 }, // Used for Pending tab
//   card: { background: '#fff', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
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
//   loader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
// // Add these to your styles object
//   dropdownContainer: {
//     position: 'relative',
//     display: 'inline-block',
//   },

//   premiumButton: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     background: 'linear-gradient(145deg, #ffffff, #f0f4ff)',
//     padding: '5px 15px',
//     borderRadius: '14px',
//     border: '1px solid #d1d5db',
//     cursor: 'pointer',
//     boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
//     transition: 'all 0.3s ease',
//   },
//   statusDot: {
//     width: '10px',
//     height: '10px',
//     borderRadius: '50%',
//     boxShadow: '0 0 8px rgba(79, 70, 229, 0.4)',
//   },
//   selectedText: {
//     fontSize: '14px',
//     fontWeight: '700',
//     color: '#1e293b',
//     minWidth: '80px',
//     textAlign: 'left'
//   },
//   customMenu: {
//     position: 'absolute',
//     top: '120%',
//     left: '0',
//     width: '200px',
//     background: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '16px',
//     border: '1px solid rgba(255, 255, 255, 0.3)',
//     boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//     overflow: 'hidden',
//     zIndex: 1000,
//     padding: '8px',
//     animation: 'fadeInUp 0.2s ease-out',
//   },
//   menuItem: {
//     padding: '10px 14px',
//     fontSize: '13px',
//     fontWeight: '600',
//     color: '#475569',
//     borderRadius: '10px',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px'
//   },
//   // ✅ Pagination Styles
//   paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', padding: '20px 0' },
//   pagBtn: { border: '1px solid #e2e8f0', background: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: '#4f46e5' },
//   pagBtnDisabled: { border: '1px solid #f1f5f9', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', color: '#cbd5e1', cursor: 'not-allowed' },
//   pagNum: { border: '1px solid #e2e8f0', background: '#fff', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: '#64748b' },
//   pagNumActive: { background: '#4f46e5', color: '#fff', border: '1px solid #4f46e5', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: '700', fontSize: '12px' },
// };

// export default AllusersDashboard;


// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // Dashboard Data States
//   const [data, setData] = useState(null);
//   const [userList, setUserList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Subtract Screen (Modal) States
//   const [showSubtract, setShowSubtract] = useState(false);
//   const [selectedAgentData, setSelectedAgentData] = useState(null);
//   const [pendingTickets, setPendingTickets] = useState([]);
//   const [modalLoading, setModalLoading] = useState(false);

//   const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

//   // 1. Fetch Main Dashboard and User List
//   useEffect(() => {
//     const initDashboard = async () => {
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const headers = { Authorization: `Bearer ${token}` };

//         // Fetch both Dashboard and User List (to get SIDs)
//         const [dashRes, userRes] = await Promise.all([
//           api.get('/users/admin/dashboard', { headers }),
//           api.get('/users/get/list_users', { headers })
//         ]);

//         setData(dashRes.data);
//         setUserList(userRes.data || []);
//       } catch (err) {
//         console.error("Initialization Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initDashboard();
//   }, [user]);

//   // 2. Fetch Pending Tickets when an agent is selected
//   const openSubtractScreen = async (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setShowSubtract(true);
//     setModalLoading(true);

//     try {
//       const token = user?.token || localStorage.getItem("session_token");

//       // Find the SID from the userList based on the name
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());

//       if (foundUser) {
//         const res = await api.post('/users/get-pending/incidents/all', 
//           { user_sid: foundUser.sid, page: 1, per_page: 50 },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setPendingTickets(res.data.response || []);
//       } else {
//         setPendingTickets([]);
//       }
//     } catch (err) {
//       console.error("Error fetching agent pending list:", err);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {/* Main Dashboard Header */}
//       <div style={styles.header}>
//         <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
//         <div style={styles.tabGroup}>
//           <div style={styles.activeTab}>Team View</div>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div style={styles.kpiRow}>
//         <MetricBox label="TOTAL TICKETS" value={summary.total_tickets} color="#334155" icon="bi-collection" />
//         <MetricBox label="PASSED" value={summary.passed} color="#10b981" icon="bi-check-circle" />
//         <MetricBox label="FAILED" value={summary.failed} color="#f43f5e" icon="bi-x-circle" />
//         <MetricBox label="PENDING" value={summary.pending} color="#f59e0b" icon="bi-clock" />
//         <MetricBox label="PASS RATE" value={`${summary.pass_percentage}%`} color="#4f46e5" icon="bi-percent" isLast />
//       </div>

//       <div style={styles.mainGrid}>
//         {/* Left: Chart */}
//         <div style={styles.card}>
//           <div style={styles.cardHeader}>Quality Distribution</div>
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie data={[{name:'P', value:summary.passed}, {name:'F', value:summary.failed}, {name:'Pend', value:summary.pending}]} innerRadius={60} outerRadius={80} dataKey="value">
//                 {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Right: Performance Rankings */}
//         <div style={styles.card}>
//           <div style={styles.cardHeader}>Performance Rankings</div>
//           <div style={styles.tableScroll}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Analyst</th>
//                   <th style={styles.th}>Tickets</th>
//                   <th style={styles.th}>Success</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {agentsList.map((a, i) => (
//                   <tr key={i} style={styles.tr} onClick={() => openSubtractScreen(a)}>
//                     <td style={styles.td}>
//                       <div style={styles.agentName}><i className="bi bi-person-circle"></i> {a.agent}</div>
//                     </td>
//                     <td style={styles.td}>{a.total_tickets}</td>
//                     <td style={styles.td}>
//                       <div style={styles.progressContainer}>
//                         <div style={{ ...styles.progressBar, width: `${a.pass_percentage}%` }}></div>
//                         <span style={styles.progressText}>{a.pass_percentage || 0}%</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* SUBTRACT SCREEN (SIDE PANEL) */}
//       {showSubtract && (
//         <div style={styles.overlay} onClick={() => setShowSubtract(false)}>
//           <div style={styles.subtractScreen} onClick={e => e.stopPropagation()}>
//             <div style={styles.subtractHeader}>
//               <div>
//                 <h3 style={{ margin: 0 }}>{selectedAgentData?.agent}</h3>
//                 <span style={styles.badge}>Analyst Profile</span>
//               </div>
//               <button onClick={() => setShowSubtract(false)} style={styles.closeBtn}>&times;</button>
//             </div>

//             <div style={styles.subtractBody}>
//               {/* Agent Stats Sub-Grid */}
//               <div style={styles.subGrid}>
//                 <div style={styles.subStatBox}>
//                   <label>Avg Score</label>
//                   <div style={{ color: '#4f46e5', fontWeight: 'bold' }}>{selectedAgentData?.average_score}%</div>
//                 </div>
//                 <div style={styles.subStatBox}>
//                   <label>Pending</label>
//                   <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>{selectedAgentData?.pending}</div>
//                 </div>
//                 <div style={styles.subStatBox}>
//                   <label>Status</label>
//                   <div style={{ color: selectedAgentData?.needs_training ? '#f43f5e' : '#10b981', fontWeight: 'bold' }}>
//                     {selectedAgentData?.needs_training ? 'Coaching Needed' : 'Certified'}
//                   </div>
//                 </div>
//               </div>

//               <h5 style={{ marginTop: '20px', fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
//                 Pending Incidents List
//               </h5>

//               <div style={styles.modalTableScroll}>
//                 {modalLoading ? (
//                   <div style={{ textAlign: 'center', padding: '20px' }}>Loading Tickets...</div>
//                 ) : (
//                   <table style={styles.table}>
//                     <thead>
//                       <tr>
//                         <th style={styles.th}>Incident</th>
//                         <th style={styles.th}>Description</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {pendingTickets.map((t, idx) => (
//                         <tr key={idx}>
//                           <td style={{ ...styles.td, fontWeight: 'bold', color: '#4f46e5' }}>{t.incident_number}</td>
//                           <td style={styles.td}>{t.short_description}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading && <div style={styles.loader}>Loading Dashboard...</div>}
//     </div>
//   );
// };

// const MetricBox = ({ label, value, color, icon, isLast }) => (
//   <div style={{ ...styles.metricBox, borderRight: isLast ? 'none' : '1px solid #eee' }}>
//     <div style={styles.metricLabel}><i className={`bi ${icon}`} style={{ color }}></i> {label}</div>
//     <div style={{ ...styles.metricValue, color }}>{value}</div>
//   </div>
// );

// const styles = {
//   container: { padding: '20px', backgroundColor: '#f8fafc', height: '100vh', fontFamily: 'sans-serif' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '10px' },
//   logo: { margin: 0, fontSize: '20px', fontWeight: 'bold' },
//   tabGroup: { display: 'flex', backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '8px' },
//   activeTab: { padding: '5px 15px', backgroundColor: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', color: '#4f46e5' },
//   kpiRow: { display: 'flex', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
//   metricBox: { flex: 1, padding: '0 15px' },
//   metricLabel: { fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' },
//   metricValue: { fontSize: '22px', fontWeight: 'bold' },
//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' },
//   card: { backgroundColor: '#fff', borderRadius: '10px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
//   cardHeader: { fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', color: '#1e293b' },
//   tableScroll: { maxHeight: '400px', overflowY: 'auto' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', fontSize: '11px', color: '#94a3b8', padding: '10px', borderBottom: '1px solid #f1f5f9' },
//   td: { padding: '10px', fontSize: '12px', borderBottom: '1px solid #f8fafc' },
//   tr: { cursor: 'pointer', transition: '0.2s' },
//   agentName: { color: '#4f46e5', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' },
//   progressContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
//   progressBar: { height: '6px', backgroundColor: '#4f46e5', borderRadius: '3px' },
//   progressText: { fontSize: '10px', fontWeight: 'bold' },

//   // SUBTRACT SCREEN STYLES
//   overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 },
//   subtractScreen: { width: '450px', backgroundColor: '#fff', height: '100%', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out' },
//   subtractHeader: { padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' },
//   closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' },
//   badge: { fontSize: '10px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' },
//   subtractBody: { padding: '20px', flex: 1, overflowY: 'auto' },
//   subGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' },
//   subStatBox: { padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center', border: '1px solid #f1f5f9' },
//   modalTableScroll: { marginTop: '10px' },
//   loader: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }
// };

// export default AllusersDashboard;


// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // Navigation States
//   const [activeTab, setActiveTab] = useState('team'); // 'team' or 'pending'
//   const [viewMode, setViewMode] = useState('list'); // 'list' (the table) or 'detail' (the analyst view)

//   // Data States
//   const [data, setData] = useState(null);
//   const [userList, setUserList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Detail View States
//   const [selectedAgentData, setSelectedAgentData] = useState(null);
//   const [pendingTickets, setPendingTickets] = useState([]);
//   const [detailLoading, setDetailLoading] = useState(false);

//   const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

//   // Fetch Initialization
//   useEffect(() => {
//     const initDashboard = async () => {
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const headers = { Authorization: `Bearer ${token}` };
//         const [dashRes, userRes] = await Promise.all([
//           api.get('/users/admin/dashboard', { headers }),
//           api.get('/users/get/list_users', { headers })
//         ]);
//         setData(dashRes.data);
//         setUserList(userRes.data || []);
//       } catch (err) {
//         console.error("Initialization Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initDashboard();
//   }, [user]);

//   // Handle clicking an analyst name
//   const handleAnalystClick = async (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail'); // Switch view inside the tab
//     setDetailLoading(true);

//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());

//       if (foundUser) {
//         const res = await api.post('/users/get-pending/incidents/all', 
//           { user_sid: foundUser.sid, page: 1, per_page: 50 },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setPendingTickets(res.data.response || []);
//       }
//     } catch (err) {
//       console.error("Error fetching agent pending list:", err);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {/* Header with Navigation */}
//       <div style={styles.header}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//             <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
//             <div style={styles.tabGroup}>
//                 <button 
//                     onClick={() => { setActiveTab('team'); setViewMode('list'); }} 
//                     style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}
//                 >Team Overview</button>
//                 <button 
//                     onClick={() => setActiveTab('pending')} 
//                     style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}
//                 >My Pending</button>
//             </div>
//         </div>

//         {/* Dynamic Detail Breadcrumb/Tab */}
//         {viewMode === 'detail' && activeTab === 'team' && (
//             <div style={styles.detailBadge}>
//                 <i className="bi bi-person-fill"></i> {selectedAgentData?.agent}
//             </div>
//         )}
//       </div>

//       {/* Conditional Rendering based on viewMode */}
//       {activeTab === 'team' && (
//         <>
//           {viewMode === 'list' ? (
//             /* --- REGULAR TEAM VIEW --- */
//             <>
//               <div style={styles.kpiRow}>
//                 <MetricBox label="TOTAL TICKETS" value={summary.total_tickets} color="#334155" icon="bi-collection" />
//                 <MetricBox label="PASSED" value={summary.passed} color="#10b981" icon="bi-check-circle" />
//                 <MetricBox label="FAILED" value={summary.failed} color="#f43f5e" icon="bi-x-circle" />
//                 <MetricBox label="PENDING" value={summary.pending} color="#f59e0b" icon="bi-clock" />
//                 <MetricBox label="PASS RATE" value={`${summary.pass_percentage}%`} color="#4f46e5" icon="bi-percent" isLast />
//               </div>

//               <div style={styles.mainGrid}>
//                 <div style={styles.card}>
//                   <div style={styles.cardHeader}>Quality Distribution</div>
//                   <ResponsiveContainer width="100%" height={250}>
//                     <PieChart>
//                       <Pie data={[{name:'P', value:summary.passed}, {name:'F', value:summary.failed}, {name:'Pend', value:summary.pending}]} innerRadius={60} outerRadius={80} dataKey="value">
//                         {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div style={styles.card}>
//                   <div style={styles.cardHeader}>Performance Rankings</div>
//                   <div style={styles.tableScroll}>
//                     <table style={styles.table}>
//                       <thead>
//                         <tr>
//                           <th style={styles.th}>Analyst</th>
//                           <th style={styles.th}>Tickets</th>
//                           <th style={styles.th}>Success</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {agentsList.map((a, i) => (
//                           <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
//                             <td style={styles.td}>
//                               <div style={styles.agentName}><i className="bi bi-person-circle"></i> {a.agent}</div>
//                             </td>
//                             <td style={styles.td}>{a.total_tickets}</td>
//                             <td style={styles.td}>
//                               <div style={styles.progressContainer}>
//                                 <div style={{ ...styles.progressBar, width: `${a.pass_percentage}%` }}></div>
//                                 <span style={styles.progressText}>{a.pass_percentage || 0}%</span>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* --- ANALYST DETAIL VIEW (REPLACES TABLE) --- */
//             <div style={styles.card}>
//               <div style={styles.detailHeader}>
//                 <button onClick={() => setViewMode('list')} style={styles.backBtn}>
//                     <i className="bi bi-arrow-left"></i> Back to Overview
//                 </button>
//                 <h3 style={{ margin: 0 }}>{selectedAgentData?.agent}'s Performance</h3>
//               </div>

//               <div style={styles.subGrid}>
//                 <div style={styles.subStatBox}>
//                   <label style={styles.pLabel}>Quality Score</label>
//                   <div style={styles.pValue}>{selectedAgentData?.average_score}%</div>
//                 </div>
//                 <div style={styles.subStatBox}>
//                   <label style={styles.pLabel}>Pending Incidents</label>
//                   <div style={{...styles.pValue, color: '#f59e0b'}}>{selectedAgentData?.pending}</div>
//                 </div>
//                 <div style={styles.subStatBox}>
//                   <label style={styles.pLabel}>Audit Status</label>
//                   <div style={{ ...styles.pValue, color: selectedAgentData?.needs_training ? '#f43f5e' : '#10b981' }}>
//                     {selectedAgentData?.needs_training ? 'Coaching Needed' : 'Certified'}
//                   </div>
//                 </div>
//               </div>

//               <div style={{padding: '20px'}}>
//                 <h5 style={styles.sectionTitle}>Detailed Pending Tickets</h5>
//                 <div style={styles.tableScroll}>
//                     {detailLoading ? (
//                         <div style={styles.loaderInline}>Fetching live ticket data...</div>
//                     ) : (
//                         <table style={styles.table}>
//                             <thead>
//                                 <tr>
//                                     <th style={styles.th}>Incident No</th>
//                                     <th style={styles.th}>Short Description</th>
//                                     <th style={styles.th}>Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pendingTickets.map((t, idx) => (
//                                     <tr key={idx} style={styles.trDetail}>
//                                         <td style={{ ...styles.td, fontWeight: 'bold', color: '#4f46e5' }}>{t.incident_number}</td>
//                                         <td style={styles.td}>{t.short_description}</td>
//                                         <td style={styles.td}>
//                                             <span style={styles.miniBadge}>PENDING</span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 {pendingTickets.length === 0 && (
//                                     <tr><td colSpan="3" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>No pending tickets found for this analyst.</td></tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {activeTab === 'pending' && (
//           <div style={styles.card}>
//               <div style={styles.cardHeader}>My Personal Pending Queue</div>
//               <div style={{padding: '20px'}}>Pending logic for current user goes here...</div>
//           </div>
//       )}

//       {loading && <div style={styles.loader}>Loading Dashboard Data...</div>}
//     </div>
//   );
// };

// const MetricBox = ({ label, value, color, icon, isLast }) => (
//   <div style={{ ...styles.metricBox, borderRight: isLast ? 'none' : '1px solid #eee' }}>
//     <div style={styles.metricLabel}><i className={`bi ${icon}`} style={{ color }}></i> {label}</div>
//     <div style={{ ...styles.metricValue, color }}>{value}</div>
//   </div>
// );

// const styles = {
//   container: { padding: '20px', backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
//   logo: { margin: 0, fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' },

//   // Tab Styling
//   tabGroup: { display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' },
//   activeTab: { padding: '6px 16px', backgroundColor: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', color: '#4f46e5', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' },
//   inactiveTab: { padding: '6px 16px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', fontWeight: '500', fontSize: '12px', color: '#64748b', cursor: 'pointer' },

//   detailBadge: { backgroundColor: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #e0e7ff' },

//   kpiRow: { display: 'flex', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' },
//   metricBox: { flex: 1, padding: '0 15px' },
//   metricLabel: { fontSize: '10px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase' },
//   metricValue: { fontSize: '24px', fontWeight: '900' },

//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', flex: 1, minHeight: 0 },
//   card: { backgroundColor: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', overflow: 'hidden', flex: 1 },
//   cardHeader: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: '700', fontSize: '14px' },

//   tableScroll: { flex: 1, overflowY: 'auto', padding: '0 10px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', fontSize: '10px', color: '#94a3b8', padding: '12px 10px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', fontWeight: '800' },
//   td: { padding: '12px 10px', fontSize: '13px', borderBottom: '1px solid #f8fafc' },
//   tr: { cursor: 'pointer', transition: '0.2s', ':hover': { backgroundColor: '#f8fafc' } },
//   agentName: { color: '#4f46e5', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' },

//   progressContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
//   progressBar: { height: '6px', backgroundColor: '#4f46e5', borderRadius: '10px' },
//   progressText: { fontSize: '11px', fontWeight: '700', minWidth: '35px' },

//   // Detail View Specific
//   detailHeader: { padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px', background: '#f8fafc' },
//   backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#64748b' },
//   subGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', padding: '20px', background: '#fff' },
//   subStatBox: { padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' },
//   pLabel: { display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '5px' },
//   pValue: { fontSize: '18px', fontWeight: '800', color: '#1e293b' },
//   sectionTitle: { fontSize: '14px', fontWeight: '700', marginBottom: '15px', color: '#475569' },
//   miniBadge: { backgroundColor: '#fff7ed', color: '#c2410c', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' },

//   loader: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 2000 },
//   loaderInline: { textAlign: 'center', padding: '50px', color: '#94a3b8', fontSize: '14px' }
// };

// export default AllusersDashboard;



/// code 1

// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // --- NAVIGATION & TAB STATES ---
//   const [activeTab, setActiveTab] = useState('team'); // Only 'team' and 'pending' now
//   const [userList, setUserList] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   // --- MY PENDING TAB STATES (Original Logic) ---
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPending, setTotalPending] = useState(0);
//   const [statusFilter, setStatusFilter] = useState(''); // Status dropdown for "My Pending"
//   const [isOpen, setIsOpen] = useState(false);
//   const perPage = 10;

//   // --- ANALYST DETAIL VIEW STATES ---
//   const [viewMode, setViewMode] = useState('list'); 
//   const [selectedAgentData, setSelectedAgentData] = useState(null);
//   const [agentTickets, setAgentTickets] = useState([]);
//   const [detailPage, setDetailPage] = useState(1);
//   const [totalDetailTickets, setTotalDetailTickets] = useState(0);
//   const [detailFromDate, setDetailFromDate] = useState('');
//   const [detailToDate, setDetailToDate] = useState('');
//   const [qaState, setQaState] = useState('pending'); // NEW: qa_state filter
//   const [isQaOpen, setIsQaOpen] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);

//   const statusOptions = [
//     { id: '', label: 'All Incidents', color: '#4f46e5', icon: 'bi-grid-fill' },
//     { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
//     { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
//   ];

//   const qaOptions = [
//     { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
//     { id: 'done', label: 'Done QA', color: '#10b981', icon: 'bi-check-all' },
//   ];

//   const selectedQa = qaOptions.find(opt => opt.id === qaState);

//   // 1. Fetch User List
//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${token}` } });
//         setUserList(res.data || []);
//       } catch (err) { console.error("User List Error:", err); }
//     };
//     fetchUserList();
//   }, [user]);

//   // 2. Fetch Dashboard Data (Overview Only)
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (activeTab !== 'team' || viewMode === 'detail') return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
//         setData(res.data);
//       } catch (err) { console.error("Dashboard Fetch Error:", err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, viewMode, user]);

//   // 3. Fetch My Personal Pending (Original Tab Logic)
//   useEffect(() => {
//     const fetchPendingIncidents = async () => {
//       if (activeTab !== 'pending') return;
//       const currentSid = user?.sid || user?.user_sid;
//       if (!currentSid) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const payload = { page: currentPage, per_page: perPage, user_sid: currentSid };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { resolution_status: statusFilter || undefined }
//         });
//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) { console.error("Pending API Error:", err); }
//       finally { setLoading(false); }
//     };
//     fetchPendingIncidents();
//   }, [activeTab, currentPage, user, statusFilter]);

//   // 4. Fetch Specific Analyst Detail Data (With qa_state filter)
//   const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
//     setDetailLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
//       if (foundUser) {
//         const payload = { 
//             user_sid: foundUser.sid, 
//             page: pageNum, 
//             per_page: 10,
//             from_date: detailFromDate || undefined,
//             to_date: detailToDate || undefined
//         };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { qa_state: qaState } // Adding the qa_state filter here
//         });
//         setAgentTickets(res.data.response || []);
//         setTotalDetailTickets(res.data.total || 0);
//       }
//     } catch (err) { console.error("Agent detail error:", err); }
//     finally { setDetailLoading(false); }
//   };

//   useEffect(() => {
//     if (viewMode === 'detail' && selectedAgentData) {
//         fetchAnalystDetails(selectedAgentData, detailPage);
//     }
//   }, [detailPage, detailFromDate, detailToDate, qaState]);

//   const handleAnalystClick = (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail');
//     setDetailPage(1);
//     setQaState('pending'); // Reset to default when opening new analyst
//     fetchAnalystDetails(agentStat, 1);
//   };

//   // Data processing for Summary
//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];

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
//         <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="#1e293b" style={{ fontSize: '13px', fontWeight: '800' }}>{payload.name}</text>
//         <text x={cx} y={cy} dy={12} textAnchor="middle" fill="#64748b" style={{ fontSize: '10px' }}>{`${value} Tks`}</text>
//         <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} />
//       </g>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       <header style={styles.header}>
//         <div style={styles.titleArea}>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
//           <div style={styles.tabGroup}>
//             <button onClick={() => { setActiveTab('team'); setViewMode('list'); }} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
//             <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}>My Pending</button>
//           </div>
//         </div>

//         <div style={styles.filterStrip}>
//           {/* Detail View Specific Filters */}
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 {/* QA STATE DROPDOWN */}
//                 <div style={styles.dropdownContainer}>
//                   <div style={styles.premiumButton} onClick={() => setIsQaOpen(!isQaOpen)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedQa.color }} />
//                     <span style={styles.selectedText}>{selectedQa.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isQaOpen && (
//                     <div style={styles.customMenu}>
//                       {qaOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <input type="date" style={styles.premiumDateInput} value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
//                 <input type="date" style={styles.premiumDateInput} value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
//                 <button onClick={() => {setDetailFromDate(''); setDetailToDate('');}} style={styles.clearBtn}><i className="bi bi-x-circle"></i></button>
//             </div>
//           )}

//           {activeTab === 'pending' && (
//             <div style={styles.dropdownContainer}>
//                 <div style={styles.premiumButton} onClick={() => setIsOpen(!isOpen)}>
//                   <span style={styles.selectedText}>Status Filter</span>
//                 </div>
//                 {isOpen && (
//                   <div style={styles.customMenu}>
//                     {statusOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* KPI Row */}
//       {activeTab === 'team' && viewMode === 'list' && (
//         <div style={styles.kpiRow}>
//           <MetricBox label="TOTAL TICKETS" value={summary.total_tickets} color="#334155" icon="bi-collection-fill" />
//           <MetricBox label="PASSED" value={summary.passed} color="#10b981" icon="bi-patch-check-fill" />
//           <MetricBox label="FAILED" value={summary.failed} color="#f43f5e" icon="bi-patch-exclamation-fill" />
//           <MetricBox label="PENDING" value={summary.pending} color="#f59e0b" icon="bi-hourglass-split" />
//           <MetricBox label="PASS RATE" value={`${summary.pass_percentage}%`} color="#4f46e5" icon="bi-speedometer2" isLast />
//         </div>
//       )}

//       <div style={activeTab === 'pending' || viewMode === 'detail' ? styles.fullView : styles.mainGrid}>

//         {/* TEAM VIEW LIST */}
//         {activeTab === 'team' && viewMode === 'list' && (
//           <>
//             <section style={styles.card}>
//               <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Distribution</h6></div>
//               <div style={{ height: '230px' }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} onMouseEnter={(_, index) => setActiveIndex(index)} dataKey="value">
//                       {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </section>

//             <section style={styles.card}>
//               <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Rankings</h6></div>
//               <div style={styles.tableScroll}>
//                 <table style={styles.table}>
//                   <thead><tr><th style={styles.th}>Analyst</th><th style={styles.th}>Tickets</th><th style={styles.th}>Success Rate</th></tr></thead>
//                   <tbody>
//                     {agentsList.map((a, i) => (
//                       <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
//                         <td style={styles.td}><div style={styles.avatarRow}><div style={styles.miniAvatar}>{a.agent.charAt(0)}</div>{a.agent}</div></td>
//                         <td style={styles.td}>{a.total_tickets}</td>
//                         <td style={styles.td}>
//                           <div style={styles.barContainer}>
//                             <div style={{...styles.progressBar, width: `${a.pass_percentage}%`, backgroundColor: a.pass_percentage > 80 ? '#10b981' : '#6366f1'}}></div>
//                             <span style={styles.barText}>{a.pass_percentage}%</span>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </>
//         )}

//         {/* ANALYST DETAIL VIEW */}
//         {activeTab === 'team' && viewMode === 'detail' && (
//            <section style={styles.card}>
//              <div style={styles.detailHeader}>
//                <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back</button>
//                <h3 style={{margin:0, fontSize: '15px'}}>{selectedAgentData?.agent}'s Audit History</h3>
//                <span style={{...styles.badge, backgroundColor: selectedQa.color + '22', color: selectedQa.color}}>{selectedQa.label}</span>
//              </div>
//              <div style={styles.subGrid}>
//                 <div style={styles.subStatBox}><label style={styles.pLabel}>Score</label><div style={styles.pValue}>{selectedAgentData?.pass_percentage}%</div></div>
//                 <div style={styles.subStatBox}><label style={styles.pLabel}>Pending</label><div style={{...styles.pValue, color:'#f59e0b'}}>{selectedAgentData?.pending}</div></div>
//                 <div style={styles.subStatBox}><label style={styles.pLabel}>Audit Status</label><div style={{ ...styles.pValue, color: selectedAgentData?.needs_training ? '#f43f5e' : '#10b981' }}>{selectedAgentData?.needs_training ? 'Coaching' : 'Passed'}</div></div>
//              </div>
//              <div style={styles.tableScroll}>
//                 {detailLoading ? <div style={styles.loaderInline}>Loading {qaState} tickets...</div> : (
//                   <>
//                   <table style={styles.table}>
//                     <thead><tr><th style={styles.th}>Incident ID</th><th style={styles.th}>Short Description</th><th style={styles.th}>State</th></tr></thead>
//                     <tbody>
//                       {agentTickets.map((t, idx) => (
//                         <tr key={idx} style={styles.tr}>
//                           <td style={{...styles.td, fontWeight:'bold', color:'#4f46e5'}}>{t.incident_number}</td>
//                           <td style={styles.td}>{t.short_description}</td>
//                           <td style={styles.td}><span style={styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   <div style={styles.paginationArea}>
//                         <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                         <span style={{fontSize:11, color:'#64748b', fontWeight:'700'}}>Page {detailPage} of {Math.ceil(totalDetailTickets / 10) || 1}</span>
//                         <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                     </div>
//                   </>
//                 )}
//              </div>
//            </section>
//         )}

//         {/* MY PENDING TAB */}
//         {activeTab === 'pending' && (
//             <section style={styles.card}>
//                 <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Queue</h6><span style={styles.badge}>{totalPending} Records</span></div>
//                 <div style={styles.tableScroll}>
//                     <table style={styles.table}>
//                         <thead><tr><th style={styles.th}>Incident No</th><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
//                         <tbody>
//                             {pendingIncidents.map((incident, i) => (
//                                 <tr key={i} style={styles.tr}>
//                                     <td style={styles.td}><span style={{ fontWeight: '700', color: '#4f46e5' }}>{incident.incident_number}</span></td>
//                                     <td style={styles.td}>{incident.short_description}</td>
//                                     <td style={styles.td}><span style={{...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2'}}>{incident.status}</span></td>
//                                     <td style={styles.td}>{incident.resolution_shared || "Pending..."}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div style={styles.paginationArea}>
//                         <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                         <span style={{fontSize:12, color:'#64748b'}}>Page {currentPage}</span>
//                         <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                     </div>
//                 </div>
//             </section>
//         )}
//       </div>
//       {loading && <div style={styles.loader}>Processing...</div>}
//     </div>
//   );
// };

// const MetricBox = ({ label, value, color, icon, isLast }) => (
//   <div style={{...styles.metricBox, borderRight: isLast ? 'none' : '1px solid #e2e8f0'}}>
//     <div style={styles.metricLabelArea}><i className={`bi ${icon}`} style={{color, fontSize: '14px'}}></i><span style={styles.metricLabel}>{label}</span></div>
//     <h3 style={{...styles.metricValue, color}}>{value}</h3>
//   </div>
// );

// const styles = {
//   container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', position: 'relative' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
//   titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
//   logo: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' },
//   tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
//   activeTab: { padding: '5px 12px', background: '#fff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },
//   inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
//   filterStrip: { display: 'flex', gap: '8px' },
//   kpiRow: { display: 'flex', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '12px', padding: '15px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
//   metricBox: { flex: 1, padding: '0 15px' },
//   metricLabelArea: { display: 'flex', alignItems: 'center', gap: '6px' },
//   metricLabel: { fontSize: '9px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px' },
//   metricValue: { margin: 0, fontSize: '19px', fontWeight: '900' },
//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', flex: 1, minHeight: 0 },
//   fullView: { display: 'block', flex: 1, minHeight: 0 },
//   card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
//   cardHeader: { padding: '10px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '10px 8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #f1f5f9' },
//   td: { padding: '10px 8px', fontSize: '12px', borderBottom: '1px solid #f8fafc', color: '#475569' },
//   tr: { cursor: 'pointer', transition: '0.15s', ':hover': { backgroundColor: '#f8fafc' } },
//   avatarRow: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#1e293b' },
//   miniAvatar: { width: '22px', height: '22px', background: '#eef2ff', color: '#4f46e5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800' },
//   barContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
//   progressBar: { height: '5px', borderRadius: '4px' },
//   barText: { fontSize: '10px', fontWeight: '800', minWidth: '30px' },
//   badge: { fontSize: '9px', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' },
//   miniBadge: { padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' },
//   miniBadgeGray: { background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '700' },

//   detailHeader: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '15px', alignItems: 'center', background: '#f8fafc' },
//   backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#64748b' },
//   subGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '15px 20px' },
//   subStatBox: { padding: '10px', background: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9' },
//   pLabel: { display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginBottom: '3px' },
//   pValue: { fontSize: '17px', fontWeight: '900', color: '#1e293b' },

//   dropdownContainer: { position: 'relative' },
//   premiumButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '5px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' },
//   statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
//   selectedText: { fontSize: '11px', fontWeight: '700' },
//   customMenu: { position: 'absolute', top: '110%', right: '0', width: '150px', background: '#fff', borderRadius: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', zIndex: 1000, padding: '5px' },
//   menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px' },
//   premiumDateInput: { padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600' },
//   paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '12px', borderTop: '1px solid #f1f5f9' },
//   pagBtn: { padding: '4px 12px', fontSize: '10px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px', fontWeight: '700' },
//   clearBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '15px' },
//   loader: { position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
//   loaderInline: { padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '11px', fontWeight: '600' }
// };

// export default AllusersDashboard;

// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // --- NAVIGATION & GENERAL STATES ---
//   const [activeTab, setActiveTab] = useState('team');
//   const [userList, setUserList] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   // --- MY PENDING TAB STATES ---
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPending, setTotalPending] = useState(0);
//   const [statusFilter, setStatusFilter] = useState(''); 
//   const [pendingQaState, setPendingQaState] = useState('pending'); 
//   const [pendingFromDate, setPendingFromDate] = useState('');
//   const [pendingToDate, setPendingToDate] = useState('');
//   const [isQaOpenPending, setIsQaOpenPending] = useState(false);
//   const [isStatusOpen, setIsStatusOpen] = useState(false);
//   const perPage = 10;

//   // --- ANALYST DETAIL VIEW STATES ---
//   const [viewMode, setViewMode] = useState('list'); 
//   const [selectedAgentData, setSelectedAgentData] = useState(null);
//   const [agentTickets, setAgentTickets] = useState([]);
//   const [detailPage, setDetailPage] = useState(1);
//   const [totalDetailTickets, setTotalDetailTickets] = useState(0);
//   const [detailFromDate, setDetailFromDate] = useState('');
//   const [detailToDate, setDetailToDate] = useState('');
//   const [qaState, setQaState] = useState('pending');
//   const [isQaOpen, setIsQaOpen] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);

//   // Status Options with Icons (Restored from your original code)
//   const statusOptions = [
//     { id: '', label: 'All Incidents', color: '#4f46e5', icon: 'bi-grid-fill' },
//     { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
//     { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
//     { id: 'on hold', label: 'On Hold', color: '#64748b', icon: 'bi-pause-circle-fill' },
//   ];

//   const qaOptions = [
//     { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
//     { id: 'done', label: 'Done QA', color: '#10b981', icon: 'bi-check-all' },
//   ];

//   const selectedStatus = statusOptions.find(opt => opt.id === statusFilter) || statusOptions[0];
//   const selectedQaPending = qaOptions.find(opt => opt.id === pendingQaState);
//   const selectedQaDetail = qaOptions.find(opt => opt.id === qaState);

//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${token}` } });
//         setUserList(res.data || []);
//       } catch (err) { console.error(err); }
//     };
//     fetchUserList();
//   }, [user]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (activeTab !== 'team' || viewMode === 'detail') return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
//         setData(res.data);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, viewMode, user]);

//   useEffect(() => {
//     const fetchMyPending = async () => {
//       if (activeTab !== 'pending') return;
//       const currentSid = user?.sid || user?.user_sid;
//       if (!currentSid) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const payload = { 
//             user_sid: currentSid, page: currentPage, per_page: perPage,
//             from_date: pendingFromDate || undefined, to_date: pendingToDate || undefined
//         };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { resolution_status: statusFilter || undefined, qa_state: pendingQaState }
//         });
//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchMyPending();
//   }, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, user]);

//   const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
//     setDetailLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
//       if (foundUser) {
//         const payload = { 
//             user_sid: foundUser.sid, page: pageNum, per_page: 10,
//             from_date: detailFromDate || undefined, to_date: detailToDate || undefined
//         };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { qa_state: qaState }
//         });
//         setAgentTickets(res.data.response || []);
//         setTotalDetailTickets(res.data.total || 0);
//       }
//     } catch (err) { console.error(err); }
//     finally { setDetailLoading(false); }
//   };

//   useEffect(() => {
//     if (viewMode === 'detail' && selectedAgentData) {
//         fetchAnalystDetails(selectedAgentData, detailPage);
//     }
//   }, [detailPage, detailFromDate, detailToDate, qaState]);

//   const handleAnalystClick = (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail');
//     setDetailPage(1);
//     fetchAnalystDetails(agentStat, 1);
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {/* LOADER - Changed to absolute transparent overlay to stop shaking */}
//       {(loading || detailLoading) && (
//         <div style={styles.shimmerOverlay}>
//             <div style={styles.spinner}></div>
//         </div>
//       )}

//       <header style={styles.header}>
//         <div style={styles.titleArea}>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
//           <div style={styles.tabGroup}>
//             <button onClick={() => { setActiveTab('team'); setViewMode('list'); }} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
//             <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}>My Pending</button>
//           </div>
//         </div>

//         <div style={styles.filterStrip}>
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <div style={styles.dropdownContainer}>
//                   <div style={styles.premiumButton} onClick={() => setIsQaOpen(!isQaOpen)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedQaDetail.color }} />
//                     <span style={styles.selectedText}>{selectedQaDetail.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isQaOpen && (
//                     <div style={styles.customMenu}>
//                       {qaOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <input type="date" style={styles.premiumDateInput} value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
//                 <input type="date" style={styles.premiumDateInput} value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
//             </div>
//           )}

//           {activeTab === 'pending' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 {/* QA State Dropdown */}
//                 <div style={styles.dropdownContainer}>
//                   <div style={styles.premiumButton} onClick={() => setIsQaOpenPending(!isQaOpenPending)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedQaPending.color }} />
//                     <span style={styles.selectedText}>{selectedQaPending.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isQaOpenPending && (
//                     <div style={styles.customMenu}>
//                       {qaOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setPendingQaState(opt.id); setCurrentPage(1); setIsQaOpenPending(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 {/* Status Dropdown with RESTORED ICONS */}
//                 <div style={styles.dropdownContainer}>
//                   <div style={styles.premiumButton} onClick={() => setIsStatusOpen(!isStatusOpen)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedStatus.color }} />
//                     <span style={styles.selectedText}>{selectedStatus.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isStatusOpen && (
//                     <div style={styles.customMenu}>
//                       {statusOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsStatusOpen(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <input type="date" style={styles.premiumDateInput} value={pendingFromDate} onChange={(e) => setPendingFromDate(e.target.value)} />
//                 <input type="date" style={styles.premiumDateInput} value={pendingToDate} onChange={(e) => setPendingToDate(e.target.value)} />
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Main Container - Keeps constant height to prevent shaking */}
//       <div style={{flex: 1, minHeight: 0, position: 'relative'}}>
//           <div style={activeTab === 'pending' || viewMode === 'detail' ? styles.fullView : styles.mainGrid}>

//             {/* TEAM VIEW */}
//             {activeTab === 'team' && viewMode === 'list' && (
//               <>
//                 <section style={styles.card}>
//                   <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Quality Distribution</h6></div>
//                   <div style={{ flex: 1 }}>
//                     <ResponsiveContainer width="100%" height={230}>
//                       <PieChart>
//                         <Pie data={[{ name: 'Passed', value: summary.passed }, { name: 'Failed', value: summary.failed }, { name: 'Pending', value: summary.pending }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
//                           <Cell fill="#10b981" stroke="none" /><Cell fill="#f43f5e" stroke="none" /><Cell fill="#f59e0b" stroke="none" />
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </section>
//                 <section style={styles.card}>
//                   <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Performance</h6></div>
//                   <div style={styles.tableScroll}>
//                     <table style={styles.table}>
//                       <thead><tr><th style={styles.th}>Analyst</th><th style={styles.th}>Total</th><th style={styles.th}>Success</th></tr></thead>
//                       <tbody>
//                         {agentsList.map((a, i) => (
//                           <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
//                             <td style={styles.td}><div style={styles.avatarRow}><div style={styles.miniAvatar}>{a.agent.charAt(0)}</div>{a.agent}</div></td>
//                             <td style={styles.td}>{a.total_tickets}</td>
//                             <td style={styles.td}><span style={{fontWeight: '700', color: '#10b981'}}>{a.pass_percentage}%</span></td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </section>
//               </>
//             )}

//             {/* DETAIL VIEW */}
//             {activeTab === 'team' && viewMode === 'detail' && (
//                <section style={styles.card}>
//                  <div style={styles.detailHeader}>
//                    <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back</button>
//                    <h3 style={{margin:0, fontSize: '15px'}}>{selectedAgentData?.agent}</h3>
//                  </div>
//                  <div style={styles.tableScroll}>
//                     <table style={styles.table}>
//                       <thead><tr><th style={styles.th}>Incident</th><th style={styles.th}>Description</th><th style={styles.th}>State</th></tr></thead>
//                       <tbody>
//                         {agentTickets.map((t, idx) => (
//                           <tr key={idx} style={styles.tr}>
//                             <td style={{...styles.td, fontWeight:'bold', color:'#4f46e5'}}>{t.incident_number}</td>
//                             <td style={styles.td}>{t.short_description}</td>
//                             <td style={styles.td}><span style={styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     <div style={styles.paginationArea}>
//                         <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                         <span style={{fontSize:11}}>Page {detailPage}</span>
//                         <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                     </div>
//                  </div>
//                </section>
//             )}

//             {/* MY PENDING TAB */}
//             {activeTab === 'pending' && (
//                 <section style={styles.card}>
//                     <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Audits</h6><span style={styles.badge}>{totalPending} Records</span></div>
//                     <div style={styles.tableScroll}>
//                         <table style={styles.table}>
//                             <thead><tr><th style={styles.th}>Incident No</th><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
//                             <tbody>
//                                 {pendingIncidents.map((incident, i) => (
//                                     <tr key={i} style={styles.tr}>
//                                         <td style={styles.td}><span style={{ fontWeight: '700', color: '#4f46e5' }}>{incident.incident_number}</span></td>
//                                         <td style={styles.td}>{incident.short_description}</td>
//                                         <td style={styles.td}><span style={{...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2'}}>{incident.status}</span></td>
//                                         <td style={styles.td}>{incident.resolution_shared || "---"}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <div style={styles.paginationArea}>
//                             <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                             <span style={{fontSize:12}}>Page {currentPage}</span>
//                             <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                         </div>
//                     </div>
//                 </section>
//             )}
//           </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', display: 'flex', flexDirection: 'column', position: 'relative' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', flexShrink: 0 },
//   titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
//   logo: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' },
//   tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
//   activeTab: { padding: '5px 12px', background: '#fff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
//   inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
//   filterStrip: { display: 'flex', gap: '8px' },
//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', height: '100%' },
//   fullView: { display: 'block', height: '100%' },
//   card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
//   cardHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '10px 8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
//   td: { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f8fafc' },
//   tr: { cursor: 'pointer', ':hover': { backgroundColor: '#f8fafc' } },
//   avatarRow: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' },
//   miniAvatar: { width: '22px', height: '22px', background: '#eef2ff', color: '#4f46e5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' },
//   badge: { fontSize: '9px', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', background: '#e0e7ff', color: '#4338ca' },
//   miniBadge: { padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' },
//   miniBadgeGray: { background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' },
//   detailHeader: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '15px', alignItems: 'center' },
//   backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
//   dropdownContainer: { position: 'relative' },
//   premiumButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' },
//   statusDot: { width: '7px', height: '7px', borderRadius: '50%' },
//   selectedText: { fontSize: '11px', fontWeight: '700' },
//   customMenu: { position: 'absolute', top: '115%', right: '0', width: '160px', background: '#fff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, padding: '5px' },
//   menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
//   premiumDateInput: { padding: '6px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600' },
//   paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '12px', borderTop: '1px solid #f1f5f9' },
//   pagBtn: { padding: '4px 12px', fontSize: '10px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' },

//   // FIX FOR SHAKING: Use absolute overlay with spinner
//   shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' },
//   spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }
// };

// // CSS for the spinner (inject this if your environment allows or use a standard gif)
// const styleSheet = document.createElement("style");
// styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
// document.head.appendChild(styleSheet);

// export default AllusersDashboard;



// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // --- NAVIGATION & GENERAL STATES ---
//   const [activeTab, setActiveTab] = useState('team');
//   const [userList, setUserList] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // --- MY PENDING TAB STATES ---
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPending, setTotalPending] = useState(0);
//   const [statusFilter, setStatusFilter] = useState(''); 
//   const [pendingQaState, setPendingQaState] = useState('pending'); 
//   const [pendingFromDate, setPendingFromDate] = useState('');
//   const [pendingToDate, setPendingToDate] = useState('');
//   const [isQaOpenPending, setIsQaOpenPending] = useState(false);
//   const [isStatusOpen, setIsStatusOpen] = useState(false);
//   const perPage = 10;

//   // --- ANALYST DETAIL VIEW STATES ---
//   const [viewMode, setViewMode] = useState('list'); 
//   const [selectedAgentData, setSelectedAgentData] = useState(null);
//   const [agentTickets, setAgentTickets] = useState([]);
//   const [detailPage, setDetailPage] = useState(1);
//   const [totalDetailTickets, setTotalDetailTickets] = useState(0);
//   const [detailFromDate, setDetailFromDate] = useState('');
//   const [detailToDate, setDetailToDate] = useState('');
//   const [qaState, setQaState] = useState('pending');
//   const [isQaOpen, setIsQaOpen] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);

//   const statusOptions = [
//     { id: '', label: 'All Incidents', color: '#4f46e5', icon: 'bi-grid-fill' },
//     { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
//     { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
//     { id: 'on hold', label: 'On Hold', color: '#64748b', icon: 'bi-pause-circle-fill' },
//   ];

//   const qaOptions = [
//     { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
//     { id: 'done', label: 'Done QA', color: '#10b981', icon: 'bi-check-all' },
//   ];

//   const selectedStatus = statusOptions.find(opt => opt.id === statusFilter) || statusOptions[0];
//   const selectedQaPending = qaOptions.find(opt => opt.id === pendingQaState);
//   const selectedQaDetail = qaOptions.find(opt => opt.id === qaState);

//   const resetPendingDates = () => { setPendingFromDate(''); setPendingToDate(''); setCurrentPage(1); };
//   const resetDetailDates = () => { setDetailFromDate(''); setDetailToDate(''); setDetailPage(1); };

//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${token}` } });
//         setUserList(res.data || []);
//       } catch (err) { console.error(err); }
//     };
//     fetchUserList();
//   }, [user]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (activeTab !== 'team' || viewMode === 'detail') return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
//         setData(res.data);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, viewMode, user]);

//   useEffect(() => {
//     const fetchMyPending = async () => {
//       if (activeTab !== 'pending') return;
//       const currentSid = user?.sid || user?.user_sid;
//       if (!currentSid) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const payload = { 
//             user_sid: currentSid, page: currentPage, per_page: perPage,
//             from_date: pendingFromDate || undefined, to_date: pendingToDate || undefined
//         };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { resolution_status: statusFilter || undefined, qa_state: pendingQaState }
//         });
//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchMyPending();
//   }, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, user]);

//   const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
//     setDetailLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
//       if (foundUser) {
//         const payload = { 
//             user_sid: foundUser.sid, page: pageNum, per_page: 10,
//             from_date: detailFromDate || undefined, to_date: detailToDate || undefined
//         };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { qa_state: qaState }
//         });
//         setAgentTickets(res.data.response || []);
//         setTotalDetailTickets(res.data.total || 0);
//       }
//     } catch (err) { console.error(err); }
//     finally { setDetailLoading(false); }
//   };

//   useEffect(() => {
//     if (viewMode === 'detail' && selectedAgentData) {
//         fetchAnalystDetails(selectedAgentData, detailPage);
//     }
//   }, [detailPage, detailFromDate, detailToDate, qaState]);

//   const handleAnalystClick = (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail');
//     setDetailPage(1);
//     fetchAnalystDetails(agentStat, 1);
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {(loading || detailLoading) && (
//         <div style={styles.shimmerOverlay}><div style={styles.spinner}></div></div>
//       )}

//       <header style={styles.header}>
//         <div style={styles.titleArea}>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#4f46e5' }}>Metrics</span></h2>
//           <div style={styles.tabGroup}>
//             <button onClick={() => { setActiveTab('team'); setViewMode('list'); }} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
//             <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}>My Pending</button>
//           </div>
//         </div>

//         <div style={styles.filterStrip}>
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <div style={styles.dropdownContainer}>
//                   <label style={styles.premiumLabel}>Audit Phase</label>
//                   <div style={styles.premiumButton} onClick={() => setIsQaOpen(!isQaOpen)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedQaDetail.color }} />
//                     <span style={styles.selectedText}>{selectedQaDetail.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isQaOpen && (
//                     <div style={styles.customMenu}>
//                       {qaOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <input type="date" style={styles.premiumDateInput} value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
//                 <input type="date" style={styles.premiumDateInput} value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
//                 <button onClick={resetDetailDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}

//           {activeTab === 'pending' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <div style={styles.dropdownContainer}>
//                   <label style={styles.premiumLabel}>QA Status</label>
//                   <div style={styles.premiumButton} onClick={() => setIsQaOpenPending(!isQaOpenPending)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedQaPending.color }} />
//                     <span style={styles.selectedText}>{selectedQaPending.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isQaOpenPending && (
//                     <div style={styles.customMenu}>
//                       {qaOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setPendingQaState(opt.id); setCurrentPage(1); setIsQaOpenPending(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <div style={styles.dropdownContainer}>
//                   <label style={styles.premiumLabel}>Incident State</label>
//                   <div style={styles.premiumButton} onClick={() => setIsStatusOpen(!isStatusOpen)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedStatus.color }} />
//                     <span style={styles.selectedText}>{selectedStatus.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isStatusOpen && (
//                     <div style={styles.customMenu}>
//                       {statusOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsStatusOpen(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <input type="date" style={styles.premiumDateInput} value={pendingFromDate} onChange={(e) => setPendingFromDate(e.target.value)} />
//                 <input type="date" style={styles.premiumDateInput} value={pendingToDate} onChange={(e) => setPendingToDate(e.target.value)} />
//                 <button onClick={resetPendingDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}
//         </div>
//       </header>

//       <div style={{flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column'}}>

//         {/* PREMIUM STAT BANNER - ONLY FOR TEAM VIEW (LIST OR DETAIL) */}
//         {activeTab === 'team' && (
//           <div style={styles.bannerContainer}>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5'}}><i className="bi bi-ticket-perforated-fill"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Total Tickets</span>
//                 <span style={styles.statValue}>
//                   {viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}
//                 </span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}><i className="bi bi-shield-check"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Passed / Audited</span>
//                 <span style={{...styles.statValue, color: '#10b981'}}>
//                   {viewMode === 'list' ? summary.passed : selectedAgentData?.passed}
//                 </span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1'}}><i className="bi bi-stars"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Average Score</span>
//                 <span style={{...styles.statValue, color: '#4f46e5'}}>
//                   {viewMode === 'detail' ? selectedAgentData?.average_score?.toFixed(1) : '---'}
//                 </span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'}}><i className="bi bi-graph-up-arrow"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Quality Rate</span>
//                 <span style={{...styles.statValue, color: '#f59e0b'}}>
//                   {viewMode === 'list' ? `${summary.pass_percentage}%` : (selectedAgentData?.pass_percentage ? `${selectedAgentData?.pass_percentage}%` : '0%')}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div style={activeTab === 'pending' || viewMode === 'detail' ? styles.fullView : styles.mainGrid}>
//           {activeTab === 'team' && viewMode === 'list' && (
//             <>
//               <section style={styles.card}>
//                 <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Quality Distribution</h6></div>
//                 <div style={{ flex: 1 }}>
//                   <ResponsiveContainer width="100%" height={230}>
//                     <PieChart>
//                       <Pie data={[{ name: 'Passed', value: summary.passed }, { name: 'Failed', value: summary.failed }, { name: 'Pending', value: summary.pending }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
//                         <Cell fill="#10b981" stroke="none" /><Cell fill="#f43f5e" stroke="none" /><Cell fill="#f59e0b" stroke="none" />
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </section>

//               <section style={styles.card}>
//                 <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Performance</h6></div>
//                 <div style={styles.tableScroll}>
//                   <table style={styles.table}>
//                     <thead>
//                       <tr>
//                         <th style={styles.th}>Analyst</th>
//                         <th style={styles.th}>Total</th>
//                         <th style={styles.th}>Avg Score</th>
//                         <th style={styles.th}>Pass %</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {agentsList.map((a, i) => (
//                         <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
//                           <td style={styles.td}>
//                             <div style={styles.avatarRow}>
//                               <div style={styles.miniAvatar}>{a.agent.charAt(0)}</div>
//                               <span style={{display:'flex', alignItems:'center', gap: '5px'}}>
//                                 {a.agent}
//                                 {a.needs_training && <i className="bi bi-exclamation-triangle-fill" style={{color:'#f43f5e', fontSize:'11px'}}></i>}
//                               </span>
//                             </div>
//                           </td>
//                           <td style={styles.td}>{a.total_tickets}</td>
//                           <td style={styles.td}><span style={{fontWeight:'700'}}>{a.average_score?.toFixed(1) || 0}</span></td>
//                           <td style={styles.td}>
//                             <span style={{fontWeight: '700', color: (a.pass_percentage >= 90 ? '#10b981' : '#f59e0b')}}>
//                               {a.pass_percentage !== null ? `${a.pass_percentage}%` : '---'}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>
//             </>
//           )}

//           {activeTab === 'team' && viewMode === 'detail' && (
//              <section style={styles.card}>
//                <div style={styles.detailHeader}>
//                  <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back to Team</button>
//                  <h3 style={{margin:0, fontSize: '15px'}}>{selectedAgentData?.agent} Overview</h3>
//                </div>
//                <div style={styles.tableScroll}>
//                   <table style={styles.table}>
//                     <thead><tr><th style={styles.th}>Incident</th><th style={styles.th}>Description</th><th style={styles.th}>State</th></tr></thead>
//                     <tbody>
//                       {agentTickets.map((t, idx) => (
//                         <tr key={idx} style={styles.tr}>
//                           <td style={{...styles.td, fontWeight:'bold', color:'#4f46e5'}}>{t.incident_number}</td>
//                           <td style={styles.td}>{t.short_description}</td>
//                           <td style={styles.td}><span style={styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   <div style={styles.paginationArea}>
//                       <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                       <span style={{fontSize:11}}>Page {detailPage}</span>
//                       <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                   </div>
//                </div>
//              </section>
//           )}

//           {activeTab === 'pending' && (
//               <section style={styles.card}>
//                   <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Pending Queue</h6><span style={styles.badge}>{totalPending} Records Found</span></div>
//                   <div style={styles.tableScroll}>
//                       <table style={styles.table}>
//                           <thead><tr><th style={styles.th}>Incident No</th><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
//                           <tbody>
//                               {pendingIncidents.map((incident, i) => (
//                                   <tr key={i} style={styles.tr}>
//                                       <td style={styles.td}><span style={{ fontWeight: '700', color: '#4f46e5' }}>{incident.incident_number}</span></td>
//                                       <td style={styles.td}>{incident.short_description}</td>
//                                       <td style={styles.td}><span style={{...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2'}}>{incident.status}</span></td>
//                                       <td style={styles.td}>{incident.resolution_shared || "---"}</td>
//                                   </tr>
//                               ))}
//                           </tbody>
//                       </table>
//                       <div style={styles.paginationArea}>
//                           <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                           <span style={{fontSize:12}}>Page {currentPage}</span>
//                           <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                       </div>
//                   </div>
//               </section>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', display: 'flex', flexDirection: 'column', position: 'relative' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', flexShrink: 0 },
//   titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
//   logo: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' },
//   tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
//   activeTab: { padding: '5px 12px', background: '#fff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
//   inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
//   filterStrip: { display: 'flex', gap: '8px' },

//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', height: '100%', minHeight: 0 },
//   fullView: { display: 'block', height: '100%' },

//   bannerContainer: { display: 'flex', gap: '12px', marginBottom: '12px', flexShrink: 0 },
//   statBox: { flex: 1, background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease' },
//   iconCircle: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
//   statInfo: { display: 'flex', flexDirection: 'column' },
//   statLabel: { fontSize: '8.5px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' },
//   statValue: { fontSize: '18px', fontWeight: '900', color: '#1e293b' },

//   card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
//   cardHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '10px 8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
//   td: { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f8fafc' },
//   tr: { cursor: 'pointer', transition: 'background 0.2s', ':hover': { backgroundColor: '#f8fafc' } },
//   avatarRow: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' },
//   miniAvatar: { width: '22px', height: '22px', background: '#eef2ff', color: '#4f46e5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' },
//   badge: { fontSize: '9px', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', background: '#e0e7ff', color: '#4338ca' },
//   miniBadge: { padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' },
//   miniBadgeGray: { background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' },
//   detailHeader: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '15px', alignItems: 'center' },
//   backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },

//   dropdownContainer: { position: 'relative', display: 'flex', flexDirection: 'column' },
//   premiumLabel: { fontSize: '8px', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '2px', marginLeft: '4px' },
//   premiumButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' },
//   statusDot: { width: '7px', height: '7px', borderRadius: '50%' },
//   selectedText: { fontSize: '11px', fontWeight: '700' },
//   customMenu: { position: 'absolute', top: '105%', right: '0', width: '160px', background: '#fff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, padding: '5px' },
//   menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
//   premiumDateInput: { padding: '6px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600', alignSelf: 'flex-end' },
//   resetBtn: { padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b', alignSelf: 'flex-end' },

//   paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '12px', borderTop: '1px solid #f1f5f9' },
//   pagBtn: { padding: '4px 12px', fontSize: '10px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' },
//   shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' },
//   spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }
// };

// const styleSheet = document.createElement("style");
// styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
// document.head.appendChild(styleSheet);

// export default AllusersDashboard;


// perfect working code----------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const AllusersDashboard = () => {
//   const { user } = useAuth();

//   // --- HELPER FOR CAPITALIZATION ---
//   const formatName = (str) => {
//     if (!str) return "";
//     return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   };

//   // --- NAVIGATION & GENERAL STATES ---
//   const [activeTab, setActiveTab] = useState('team');
//   const [userList, setUserList] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // --- MY PENDING TAB STATES ---
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPending, setTotalPending] = useState(0);
//   const [statusFilter, setStatusFilter] = useState(''); 
//   const [pendingQaState, setPendingQaState] = useState('pending'); 
//   const [pendingFromDate, setPendingFromDate] = useState('');
//   const [pendingToDate, setPendingToDate] = useState('');
//   const [isQaOpenPending, setIsQaOpenPending] = useState(false);
//   const [isStatusOpen, setIsStatusOpen] = useState(false);
//   const perPage = 10;

//   // --- ANALYST DETAIL VIEW STATES ---
//   const [viewMode, setViewMode] = useState('list'); 
//   const [selectedAgentData, setSelectedAgentData] = useState(null);
//   const [agentTickets, setAgentTickets] = useState([]);
//   const [detailPage, setDetailPage] = useState(1);
//   const [totalDetailTickets, setTotalDetailTickets] = useState(0);
//   const [detailFromDate, setDetailFromDate] = useState('');
//   const [detailToDate, setDetailToDate] = useState('');
//   const [qaState, setQaState] = useState('pending');
//   const [isQaOpen, setIsQaOpen] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);

//   const statusOptions = [
//     { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
//     { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
//     { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
//     { id: 'on hold', label: 'On Hold', color: '#64748b', icon: 'bi-pause-circle-fill' },
//   ];

//   const qaOptions = [
//     { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
//     { id: 'done', label: 'Done QA', color: '#10b981', icon: 'bi-check-all' },
//   ];

//   const selectedStatus = statusOptions.find(opt => opt.id === statusFilter) || statusOptions[0];
//   const selectedQaPending = qaOptions.find(opt => opt.id === pendingQaState);
//   const selectedQaDetail = qaOptions.find(opt => opt.id === qaState);

//   const resetPendingDates = () => { setPendingFromDate(''); setPendingToDate(''); setCurrentPage(1); };
//   const resetDetailDates = () => { setDetailFromDate(''); setDetailToDate(''); setDetailPage(1); };

//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${token}` } });
//         setUserList(res.data || []);
//       } catch (err) { console.error(err); }
//     };
//     fetchUserList();
//   }, [user]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (activeTab !== 'team' || viewMode === 'detail') return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
//         setData(res.data);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, viewMode, user]);

//   useEffect(() => {
//     const fetchMyPending = async () => {
//       if (activeTab !== 'pending') return;
//       const currentSid = user?.sid || user?.user_sid;
//       if (!currentSid) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const payload = { 
//             user_sid: currentSid, page: currentPage, per_page: perPage,
//             from_date: pendingFromDate || undefined, to_date: pendingToDate || undefined
//         };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { resolution_status: statusFilter || undefined, qa_state: pendingQaState }
//         });
//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchMyPending();
//   }, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, user]);

//   const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
//     setDetailLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
//       if (foundUser) {
//         const payload = { 
//             user_sid: foundUser.sid, page: pageNum, per_page: 10,
//             from_date: detailFromDate || undefined, to_date: detailToDate || undefined
//         };
//         const res = await api.post('/users/get-pending/incidents/all', payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { qa_state: qaState }
//         });
//         setAgentTickets(res.data.response || []);
//         setTotalDetailTickets(res.data.total || 0);
//       }
//     } catch (err) { console.error(err); }
//     finally { setDetailLoading(false); }
//   };

//   useEffect(() => {
//     if (viewMode === 'detail' && selectedAgentData) {
//         fetchAnalystDetails(selectedAgentData, detailPage);
//     }
//   }, [detailPage, detailFromDate, detailToDate, qaState]);

//   const handleAnalystClick = (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail');
//     setDetailPage(1);
//     fetchAnalystDetails(agentStat, 1);
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];

//   // Chart Data Preparation
//   const chartData = [
//     { name: 'Passed', value: summary.passed, color: '#10b981' },
//     { name: 'Failed', value: summary.failed, color: '#f43f5e' },
//     { name: 'Pending', value: summary.pending, color: '#f59e0b' }
//   ].filter(d => d.value > 0);

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {(loading || detailLoading) && (
//         <div style={styles.shimmerOverlay}><div style={styles.spinner}></div></div>
//       )}

//       <header style={styles.header}>
//         <div style={styles.titleArea}>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#6366f1' }}>Metrics</span></h2>
//           <div style={styles.tabGroup}>
//             <button onClick={() => { setActiveTab('team'); setViewMode('list'); }} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
//             <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}>My Pending</button>
//           </div>
//         </div>

//         <div style={styles.filterStrip}>
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <div style={styles.dropdownContainer}>
//                   <label style={styles.premiumLabel}>Audit Phase</label>
//                   <div style={styles.premiumButton} onClick={() => setIsQaOpen(!isQaOpen)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedQaDetail.color }} />
//                     <span style={styles.selectedText}>{selectedQaDetail.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isQaOpen && (
//                     <div style={styles.customMenu}>
//                       {qaOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <input type="date" style={styles.premiumDateInput} value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
//                 <input type="date" style={styles.premiumDateInput} value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
//                 <button onClick={resetDetailDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}

//           {activeTab === 'pending' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <div style={styles.dropdownContainer}>
//                   <label style={styles.premiumLabel}>QA Status</label>
//                   <div style={styles.premiumButton} onClick={() => setIsQaOpenPending(!isQaOpenPending)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedQaPending.color }} />
//                     <span style={styles.selectedText}>{selectedQaPending.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isQaOpenPending && (
//                     <div style={styles.customMenu}>
//                       {qaOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setPendingQaState(opt.id); setCurrentPage(1); setIsQaOpenPending(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <div style={styles.dropdownContainer}>
//                   <label style={styles.premiumLabel}>Incident State</label>
//                   <div style={styles.premiumButton} onClick={() => setIsStatusOpen(!isStatusOpen)}>
//                     <div style={{ ...styles.statusDot, backgroundColor: selectedStatus.color }} />
//                     <span style={styles.selectedText}>{selectedStatus.label}</span>
//                     <i className="bi bi-chevron-down" style={{fontSize: '10px', marginLeft: '5px'}}></i>
//                   </div>
//                   {isStatusOpen && (
//                     <div style={styles.customMenu}>
//                       {statusOptions.map((opt) => (
//                         <div key={opt.id} style={styles.menuItem} onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsStatusOpen(false); }}>
//                           <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <input type="date" style={styles.premiumDateInput} value={pendingFromDate} onChange={(e) => setPendingFromDate(e.target.value)} />
//                 <input type="date" style={styles.premiumDateInput} value={pendingToDate} onChange={(e) => setPendingToDate(e.target.value)} />
//                 <button onClick={resetPendingDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}
//         </div>
//       </header>

//       <div style={{flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column'}}>

//         {activeTab === 'team' && (
//           <div style={styles.bannerContainer}>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1'}}><i className="bi bi-ticket-perforated-fill"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Total Tickets</span>
//                 <span style={styles.statValue}>
//                   {viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}
//                 </span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}><i className="bi bi-shield-check"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Passed / Audited</span>
//                 <span style={{...styles.statValue, color: '#10b981'}}>
//                   {viewMode === 'list' ? summary.passed : selectedAgentData?.passed}
//                 </span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1'}}><i className="bi bi-stars"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Average Score</span>
//                 <span style={{...styles.statValue, color: '#6366f1'}}>
//                   {viewMode === 'detail' ? selectedAgentData?.average_score?.toFixed(1) : '---'}
//                 </span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'}}><i className="bi bi-graph-up-arrow"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Quality Rate</span>
//                 <span style={{...styles.statValue, color: '#f59e0b'}}>
//                   {viewMode === 'list' ? `${summary.pass_percentage}%` : (selectedAgentData?.pass_percentage ? `${selectedAgentData?.pass_percentage}%` : '0%')}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div style={activeTab === 'pending' || viewMode === 'detail' ? styles.fullView : styles.mainGrid}>
//           {activeTab === 'team' && viewMode === 'list' && (
//             <>
//               <section style={styles.card}>
//                 <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Quality Overview</h6></div>
//                 <div style={{ flex: 1, padding: '10px' }}>
//                   <ResponsiveContainer width="100%" height={230}>
//                     <PieChart>
//                       <Pie 
//                         data={chartData} 
//                         cx="50%" cy="50%" 
//                         innerRadius={65} 
//                         outerRadius={85} 
//                         paddingAngle={5}
//                         dataKey="value"
//                         stroke="none"
//                       >
//                         {chartData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))'}} />
//                         ))}
//                       </Pie>
//                       <Tooltip 
//                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//                       />
//                       <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </section>

//               <section style={styles.card}>
//                 <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Performance</h6></div>
//                 <div style={styles.tableScroll}>
//                   <table style={styles.table}>
//                     <thead>
//                       <tr>
//                         <th style={styles.th}>Analyst</th>
//                         <th style={styles.th}>Total</th>
//                         <th style={styles.th}>Avg Score</th>
//                         <th style={styles.th}>Pass %</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {agentsList.map((a, i) => (
//                         <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
//                           <td style={styles.td}>
//                             <div style={styles.avatarRow}>
//                               <div style={styles.miniAvatar}>{a.agent.charAt(0).toUpperCase()}</div>
//                               <span style={{display:'flex', alignItems:'center', gap: '5px'}}>
//                                 {formatName(a.agent)}
//                                 {a.needs_training && <i className="bi bi-exclamation-triangle-fill" style={{color:'#f43f5e', fontSize:'11px'}}></i>}
//                               </span>
//                             </div>
//                           </td>
//                           <td style={styles.td}>{a.total_tickets}</td>
//                           <td style={styles.td}><span style={{fontWeight:'700'}}>{a.average_score?.toFixed(1) || 0}</span></td>
//                           <td style={styles.td}>
//                             <span style={{fontWeight: '700', color: (a.pass_percentage >= 90 ? '#10b981' : '#f59e0b')}}>
//                               {a.pass_percentage !== null ? `${a.pass_percentage}%` : '---'}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>
//             </>
//           )}

//           {activeTab === 'team' && viewMode === 'detail' && (
//              <section style={styles.card}>
//                <div style={styles.detailHeader}>
//                  <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back to Team</button>
//                  <h3 style={{margin:0, fontSize: '15px'}}>{formatName(selectedAgentData?.agent)} Overview</h3>
//                </div>
//                <div style={styles.tableScroll}>
//                   <table style={styles.table}>
//                     <thead><tr><th style={styles.th}>Incident</th><th style={styles.th}>Description</th><th style={styles.th}>State</th></tr></thead>
//                     <tbody>
//                       {agentTickets.map((t, idx) => (
//                         <tr key={idx} style={styles.tr}>
//                           <td style={{...styles.td, fontWeight:'bold', color:'#6366f1'}}>{t.incident_number}</td>
//                           <td style={styles.td}>{t.short_description}</td>
//                           <td style={styles.td}><span style={styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   <div style={styles.paginationArea}>
//                       <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                       <span style={{fontSize:11}}>Page {detailPage}</span>
//                       <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                   </div>
//                </div>
//              </section>
//           )}

//           {activeTab === 'pending' && (
//               <section style={styles.card}>
//                   <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Pending Queue</h6><span style={styles.badge}>{totalPending} Records Found</span></div>
//                   <div style={styles.tableScroll}>
//                       <table style={styles.table}>
//                           <thead><tr><th style={styles.th}>Incident No</th><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
//                           <tbody>
//                               {pendingIncidents.map((incident, i) => (
//                                   <tr key={i} style={styles.tr}>
//                                       <td style={styles.td}><span style={{ fontWeight: '700', color: '#6366f1' }}>{incident.incident_number}</span></td>
//                                       <td style={styles.td}>{incident.short_description}</td>
//                                       <td style={styles.td}><span style={{...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2'}}>{incident.status}</span></td>
//                                       <td style={styles.td}>{incident.resolution_shared || "---"}</td>
//                                   </tr>
//                               ))}
//                           </tbody>
//                       </table>
//                       <div style={styles.paginationArea}>
//                           <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                           <span style={{fontSize:12}}>Page {currentPage}</span>
//                           <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                       </div>
//                   </div>
//               </section>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Inter', sans-serif" },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
//   titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
//   logo: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' },
//   tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
//   activeTab: { padding: '5px 12px', background: '#fff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
//   inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
//   filterStrip: { display: 'flex', gap: '8px' },

//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', height: '100%', minHeight: 0 },
//   fullView: { display: 'block', height: '100%' },

//   bannerContainer: { display: 'flex', gap: '12px', marginBottom: '12px', flexShrink: 0 },
//   statBox: { flex: 1, background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
//   iconCircle: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
//   statInfo: { display: 'flex', flexDirection: 'column' },
//   statLabel: { fontSize: '8.5px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' },
//   statValue: { fontSize: '18px', fontWeight: '900', color: '#1e293b' },

//   card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
//   cardHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '10px 8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
//   td: { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f8fafc' },
//   tr: { cursor: 'pointer', transition: 'background 0.2s', ':hover': { backgroundColor: '#f8fafc' } },
//   avatarRow: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' },
//   miniAvatar: { width: '22px', height: '22px', background: '#eef2ff', color: '#6366f1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' },
//   badge: { fontSize: '9px', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', background: '#e0e7ff', color: '#4338ca' },
//   miniBadge: { padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' },
//   miniBadgeGray: { background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' },
//   detailHeader: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '15px', alignItems: 'center' },
//   backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },

//   dropdownContainer: { position: 'relative', display: 'flex', flexDirection: 'column' },
//   premiumLabel: { fontSize: '8px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', marginBottom: '2px', marginLeft: '4px' },
//   premiumButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' },
//   statusDot: { width: '7px', height: '7px', borderRadius: '50%' },
//   selectedText: { fontSize: '11px', fontWeight: '700' },
//   customMenu: { position: 'absolute', top: '105%', right: '0', width: '160px', background: '#fff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, padding: '5px' },
//   menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
//   premiumDateInput: { padding: '6px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600', alignSelf: 'flex-end' },
//   resetBtn: { padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b', alignSelf: 'flex-end' },

//   paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '12px', borderTop: '1px solid #f1f5f9' },
//   pagBtn: { padding: '4px 12px', fontSize: '10px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' },
//   shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' },
//   spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }
// };

// const styleSheet = document.createElement("style");
// styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
// document.head.appendChild(styleSheet);

// export default AllusersDashboard;

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const AllusersDashboard = () => {
  const { user } = useAuth();

  // --- HELPER FOR CAPITALIZATION ---
  const formatName = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // --- NAVIGATION & GENERAL STATES ---
  const [activeTab, setActiveTab] = useState('team');
  const [userList, setUserList] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- MY PENDING TAB STATES ---
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [pendingQaState, setPendingQaState] = useState('pending');
  const [pendingFromDate, setPendingFromDate] = useState('');
  const [pendingToDate, setPendingToDate] = useState('');
  const [isQaOpenPending, setIsQaOpenPending] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const perPage = 10;

  const navigate = useNavigate();

  // --- ANALYST DETAIL VIEW STATES ---
  const [viewMode, setViewMode] = useState('list');
  const [selectedAgentData, setSelectedAgentData] = useState(null);
  const [agentTickets, setAgentTickets] = useState([]);
  const [detailPage, setDetailPage] = useState(1);
  const [totalDetailTickets, setTotalDetailTickets] = useState(0);
  const [detailFromDate, setDetailFromDate] = useState('');
  const [detailToDate, setDetailToDate] = useState('');
  const [qaState, setQaState] = useState('pending');
  const [isQaOpen, setIsQaOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [selectedIncident, setSelectedIncident] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
    { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
    { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
    { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
    { id: 'on hold', label: 'On Hold', color: '#64748b', icon: 'bi-pause-circle-fill' },
  ];

  const qaOptions = [
    { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
    { id: 'done', label: 'Done QA', color: '#10b981', icon: 'bi-check-all' },
  ];

  const selectedStatus = statusOptions.find(opt => opt.id === statusFilter) || statusOptions[0];
  const selectedQaPending = qaOptions.find(opt => opt.id === pendingQaState);
  const selectedQaDetail = qaOptions.find(opt => opt.id === qaState);

  const resetPendingDates = () => { setPendingFromDate(''); setPendingToDate(''); setCurrentPage(1); };
  const resetDetailDates = () => { setDetailFromDate(''); setDetailToDate(''); setDetailPage(1); };


 const openIncidentModal = (incident) => {
  // Pulling name from the selected agent state
  const agentName = selectedAgentData?.agent || incident.done_by || "System Processed";

  setSelectedIncident({
    ...incident,
    display_name: agentName 
  });
  setIsModalOpen(true);
};

 
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${token}` } });
        setUserList(res.data || []);
      } catch (err) { console.error(err); }
    };
    fetchUserList();
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (activeTab !== 'team' || viewMode === 'detail') return;
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [activeTab, viewMode, user]);

  useEffect(() => {
    const fetchMyPending = async () => {
      if (activeTab !== 'pending') return;
      const currentSid = user?.sid || user?.user_sid;
      if (!currentSid) return;
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const payload = {
          user_sid: currentSid, page: currentPage, per_page: perPage,
          from_date: pendingFromDate || undefined, to_date: pendingToDate || undefined
        };
        const res = await api.post('/users/get-pending/incidents/all', payload, {
          headers: { Authorization: `Bearer ${token}` },
          params: { resolution_status: statusFilter || undefined, qa_state: pendingQaState }
        });
        setPendingIncidents(res.data.response || []);
        setTotalPending(res.data.total || 0);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchMyPending();
  }, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, user]);

  const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
    setDetailLoading(true);
    try {
      const token = user?.token || localStorage.getItem("session_token");
      const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
      if (foundUser) {
        const payload = {
          user_sid: foundUser.sid, page: pageNum, per_page: 10,
          from_date: detailFromDate || undefined, to_date: detailToDate || undefined
        };
        const res = await api.post('/users/get-pending/incidents/all', payload, {
          headers: { Authorization: `Bearer ${token}` },
          params: { qa_state: qaState }
        });
        setAgentTickets(res.data.response || []);
        setTotalDetailTickets(res.data.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  };

  useEffect(() => {
    if (viewMode === 'detail' && selectedAgentData) {
      fetchAnalystDetails(selectedAgentData, detailPage);
    }
  }, [detailPage, detailFromDate, detailToDate, qaState]);

  const handleAnalystClick = (agentStat) => {
    setSelectedAgentData(agentStat);
    setViewMode('detail');
    setDetailPage(1);
    fetchAnalystDetails(agentStat, 1);
  };

  const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
  const agentsList = data?.all_time?.agent_performance || [];

  const chartData = [
    { name: 'Passed', value: summary.passed, color: '#10b981' },
    { name: 'Failed', value: summary.failed, color: '#f43f5e' },
    { name: 'Pending', value: summary.pending, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  return (
    <div style={styles.container}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

      {(loading || detailLoading) && (
        <div style={styles.shimmerOverlay}><div style={styles.spinner}></div></div>
      )}

      <header style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.logo}>Ticket<span style={{ color: '#6366f1' }}>Metrics</span></h2>
          <div style={styles.tabGroup}>
            <button onClick={() => { setActiveTab('team'); setViewMode('list'); }} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
            <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}>My Pending</button>
          </div>
        </div>

        <div style={styles.filterStrip}>
          {activeTab === 'team' && viewMode === 'detail' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={styles.dropdownContainer}>
                <label style={styles.premiumLabel}>Audit Phase</label>
                <div style={styles.premiumButton} onClick={() => setIsQaOpen(!isQaOpen)}>
                  <div style={{ ...styles.statusDot, backgroundColor: selectedQaDetail.color }} />
                  <span style={styles.selectedText}>{selectedQaDetail.label}</span>
                  <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
                </div>
                {isQaOpen && (
                  <div style={styles.customMenu}>
                    {qaOptions.map((opt) => (
                      <div key={opt.id} style={styles.menuItem} onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
                        <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input type="date" style={styles.premiumDateInput} value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
              <input type="date" style={styles.premiumDateInput} value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
              <button onClick={resetDetailDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
            </div>
          )}

          {activeTab === 'pending' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={styles.dropdownContainer}>
                <label style={styles.premiumLabel}>QA Status</label>
                <div style={styles.premiumButton} onClick={() => setIsQaOpenPending(!isQaOpenPending)}>
                  <div style={{ ...styles.statusDot, backgroundColor: selectedQaPending.color }} />
                  <span style={styles.selectedText}>{selectedQaPending.label}</span>
                  <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
                </div>
                {isQaOpenPending && (
                  <div style={styles.customMenu}>
                    {qaOptions.map((opt) => (
                      <div key={opt.id} style={styles.menuItem} onClick={() => { setPendingQaState(opt.id); setCurrentPage(1); setIsQaOpenPending(false); }}>
                        <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={styles.dropdownContainer}>
                <label style={styles.premiumLabel}>Incident State</label>
                <div style={styles.premiumButton} onClick={() => setIsStatusOpen(!isStatusOpen)}>
                  <div style={{ ...styles.statusDot, backgroundColor: selectedStatus.color }} />
                  <span style={styles.selectedText}>{selectedStatus.label}</span>
                  <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
                </div>
                {isStatusOpen && (
                  <div style={styles.customMenu}>
                    {statusOptions.map((opt) => (
                      <div key={opt.id} style={styles.menuItem} onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsStatusOpen(false); }}>
                        <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input type="date" style={styles.premiumDateInput} value={pendingFromDate} onChange={(e) => setPendingFromDate(e.target.value)} />
              <input type="date" style={styles.premiumDateInput} value={pendingToDate} onChange={(e) => setPendingToDate(e.target.value)} />
              <button onClick={resetPendingDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
            </div>
          )}
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {activeTab === 'team' && (
          <div style={styles.bannerContainer}>
            <div style={styles.statBox}>
              <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-ticket-perforated-fill"></i></div>
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Total Tickets</span>
                <span style={styles.statValue}>{viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}</span>
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className="bi bi-shield-check"></i></div>
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Passed / Audited</span>
                <span style={{ ...styles.statValue, color: '#10b981' }}>{viewMode === 'list' ? summary.passed : selectedAgentData?.passed}</span>
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-stars"></i></div>
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Average Score</span>
                <span style={{ ...styles.statValue, color: '#6366f1' }}>{viewMode === 'detail' ? selectedAgentData?.average_score?.toFixed(1) : '---'}</span>
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className="bi bi-graph-up-arrow"></i></div>
              <div style={styles.statInfo}>
                <span style={styles.statLabel}>Quality Rate</span>
                <span style={{ ...styles.statValue, color: '#f59e0b' }}>{viewMode === 'list' ? `${summary.pass_percentage}%` : (selectedAgentData?.pass_percentage ? `${selectedAgentData?.pass_percentage}%` : '0%')}</span>
              </div>
            </div>
          </div>
        )}

        <div style={activeTab === 'pending' || viewMode === 'detail' ? styles.fullView : styles.mainGrid}>
          {activeTab === 'team' && viewMode === 'list' && (
            <>
              <section style={styles.card}>
                <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Quality Overview</h6></div>
                <div style={{ flex: 1, padding: '10px' }}>
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section style={styles.card}>
                <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Performance</h6></div>
                <div style={styles.tableScroll}>
                  <table style={styles.table}>
                    <thead>
                      <tr><th style={styles.th}>Analyst</th><th style={styles.th}>Total</th><th style={styles.th}>Avg Score</th><th style={styles.th}>Pass %</th></tr>
                    </thead>
                    <tbody>
                      {agentsList.map((a, i) => (
                        <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
                          <td style={styles.td}>
                            <div style={styles.avatarRow}>
                              <div style={styles.miniAvatar}>{a.agent.charAt(0).toUpperCase()}</div>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{formatName(a.agent)} {a.needs_training && <i className="bi bi-exclamation-triangle-fill" style={{ color: '#f43f5e', fontSize: '11px' }}></i>}</span>
                            </div>
                          </td>
                          <td style={styles.td}>{a.total_tickets}</td>
                          <td style={styles.td}><span style={{ fontWeight: '700' }}>{a.average_score?.toFixed(1) || 0}</span></td>
                          <td style={styles.td}><span style={{ fontWeight: '700', color: (a.pass_percentage >= 90 ? '#10b981' : '#f59e0b') }}>{a.pass_percentage !== null ? `${a.pass_percentage}%` : '---'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeTab === 'team' && viewMode === 'detail' && (
            <section style={styles.card}>
              <div style={styles.detailHeader}>
                <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back to Team</button>
                <h3 style={{ margin: 0, fontSize: '15px' }}>{formatName(selectedAgentData?.agent)} Overview</h3>
              </div>
              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Incident</th><th style={styles.th}>Description</th><th style={styles.th}>State</th></tr></thead>
                  <tbody>
                    {agentTickets.map((t, idx) => (
                      <tr key={idx} style={styles.tr}>
<td 
  style={{ ...styles.td, fontWeight: 'bold', color: '#6366f1', cursor: 'pointer', textDecoration: 'underline' }}
  onClick={() => openIncidentModal(t)}
>
  {t.incident_number}
</td>                      <td style={styles.td}>{t.short_description}</td>
                        <td style={styles.td}><span style={styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.paginationArea}>
                  <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
                  <span style={{ fontSize: 11 }}>Page {detailPage}</span>
                  <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'pending' && (
            <section style={styles.card}>
              <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Pending Queue</h6><span style={styles.badge}>{totalPending} Records Found</span></div>
              <div style={styles.tableScroll}>
                {pendingIncidents.length === 0 ? (
                  <div style={styles.noDataContainer}>
                    <i className="bi bi-inbox" style={styles.noDataIcon}></i>
                    <p style={styles.noDataText}>No Data Found</p>
                    <p style={styles.noDataSubText}>Adjust your filters or check back later.</p>
                  </div>
                ) : (
                  <>
                    <table style={styles.table}>
                      <thead><tr><th style={styles.th}>Incident No</th ><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
                      {/* <tbody>
                                  {pendingIncidents.map((incident, i) => (
                                      <tr key={i} style={styles.tr}>
                                          <td style={styles.td}><span style={{ fontWeight: '700', color: '#6366f1' }}>{incident.incident_number}</span></td>
                                          <td style={styles.td}>{incident.short_description}</td>
                                          <td style={styles.td}><span style={{...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2'}}>{incident.status}</span></td>
                                          <td style={styles.td}>{incident.resolution_shared || "---"}</td>
                                      </tr>
                                  ))}
                              </tbody> */}
                      {/* inside the activeTab === 'pending' section */}
                      <tbody>
                        {pendingIncidents.map((incident, i) => {
                          // Check if QA is already done
                          const isDone = incident.qa_state === 'done';

                          return (
                            <tr key={i} style={styles.tr}>
                              <td style={styles.td}>
                                <span
                                  style={{
                                    fontWeight: '700',
                                    color: isDone ? '#94a3b8' : '#6366f1', // Gray out if done
                                    cursor: isDone ? 'not-allowed' : 'pointer',
                                    textDecoration: isDone ? 'none' : 'underline'
                                  }}
                                  onClick={() => {
                                    if (!isDone) {
      
                                      navigate('/dashboard/update-incident', {
                                        state: {
                                          incidentData: {
          ...incident,
          // If the API forgot to send the name, we fallback to an empty string 
          // or a known key to avoid 'undefined'
          done_by: incident.done_by || incident.agent || "" 
        },
                                          fromPending: true
                                        }
                                      });
                                    }
                                  }}
                                  title={isDone ? "Audited incidents cannot be edited" : "Click to edit"}
                                >
                                  {incident.incident_number}
                                  {isDone && <i className="bi bi-lock-fill ms-1" style={{ fontSize: '10px' }}></i>}
                                </span>
                              </td>

                              <td style={styles.td}>{incident.short_description}</td>
                              <td style={styles.td}>
                                <span style={{ ...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2' }}>
                                  {incident.status}
                                </span>
                              </td>
                              <td style={styles.td}>{incident.resolution_shared || "---"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div style={styles.paginationArea}>
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
                      <span style={{ fontSize: 12 }}>Page {currentPage}</span>
                      <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
{isModalOpen && selectedIncident && (
  <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
    {/* StopPropagation prevents the modal from closing when clicking inside the white area */}
    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
      
      {/* Header with Dark Premium Look */}
      <div style={styles.modalHeaderPremium}>
        <div>
          <span style={styles.microLabelLight}>Internal Record</span>
          <h2 style={styles.modalTitleText}>{selectedIncident.incident_number}</h2>
        </div>
        <button style={styles.closeCircleBtn} onClick={() => setIsModalOpen(false)}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div style={styles.modalBodyScroll}>
        {/* Agent Info Card */}
        <div style={styles.agentInfoCard}>
          <div style={styles.agentAvatarLarge}>
            {selectedIncident.display_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <label style={styles.fieldLabel}>Actioned By</label>
            <div style={styles.agentNameLarge}>{formatName(selectedIncident.display_name)}</div>
          </div>
          <div style={styles.statusBadgePremium}>
             <i className="bi bi-shield-check"></i> Verified
          </div>
        </div>

        {/* Data Grid */}
        <div style={styles.premiumDataGrid}>
          <div style={{ gridColumn: '1 / span 2' }}>
            <label style={styles.fieldLabel}>Short Description</label>
            <div style={styles.staticValueText}>{selectedIncident.short_description}</div>
          </div>

          <div>
            <label style={styles.fieldLabel}>Status</label>
            <div style={{...styles.pill, background: selectedIncident.status === 'resolved' ? '#dcfce7' : '#fff7ed', color: selectedIncident.status === 'resolved' ? '#166534' : '#9a3412'}}>
              {selectedIncident.status?.toUpperCase()}
            </div>
          </div>

          <div>
            <label style={styles.fieldLabel}>QA Phase</label>
            <div style={{...styles.pill, background: '#f1f5f9', color: '#475569'}}>
              <i className="bi bi-lock-fill" style={{marginRight: '5px'}}></i>
              {selectedIncident.qa_state?.toUpperCase() || 'PENDING'}
            </div>
          </div>

          <div style={{ gridColumn: '1 / span 2' }}>
            <label style={styles.fieldLabel}>Resolution Logic</label>
            <div style={styles.resolutionQuoteBox}>
              {selectedIncident.resolution_shared || "No specific resolution notes recorded for this entry."}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.modalFooterPremium}>
        <button style={styles.doneBtn} onClick={() => setIsModalOpen(false)}>
          Close Record
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

const styles = {
  container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Inter', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' },
  tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
  activeTab: { padding: '5px 12px', background: '#fff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
  filterStrip: { display: 'flex', gap: '8px' },

  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', height: '100%', minHeight: 0 },
  fullView: { display: 'block', height: '100%' },

  bannerContainer: { display: 'flex', gap: '12px', marginBottom: '12px', flexShrink: 0 },
  statBox: { flex: 1, background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  iconCircle: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  statInfo: { display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: '8.5px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' },
  statValue: { fontSize: '18px', fontWeight: '900', color: '#1e293b' },

  card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  cardHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px', position: 'relative' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
  td: { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f8fafc' },
  tr: { cursor: 'pointer', transition: 'background 0.2s', ':hover': { backgroundColor: '#f8fafc' } },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' },
  miniAvatar: { width: '22px', height: '22px', background: '#eef2ff', color: '#6366f1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' },
  badge: { fontSize: '9px', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', background: '#e0e7ff', color: '#4338ca' },
  miniBadge: { padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' },
  miniBadgeGray: { background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' },
  detailHeader: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '15px', alignItems: 'center' },
  backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },

  // No Data Styling
  noDataContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', padding: '40px' },
  noDataIcon: { fontSize: '48px', color: '#e2e8f0', marginBottom: '10px' },
  noDataText: { fontSize: '16px', fontWeight: '700', color: '#94a3b8', margin: 0 },
  noDataSubText: { fontSize: '12px', color: '#cbd5e1', margin: '5px 0 0' },

  dropdownContainer: { position: 'relative', display: 'flex', flexDirection: 'column' },
  premiumLabel: { fontSize: '8px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', marginBottom: '2px', marginLeft: '4px' },
  premiumButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' },
  statusDot: { width: '7px', height: '7px', borderRadius: '50%' },
  selectedText: { fontSize: '11px', fontWeight: '700' },
  customMenu: { position: 'absolute', top: '105%', right: '0', width: '160px', background: '#fff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, padding: '5px' },
  menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
  premiumDateInput: { padding: '6px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600', alignSelf: 'flex-end' },
  resetBtn: { padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b', alignSelf: 'flex-end' },
 

   modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)', // Dark dimming
    backdropFilter: 'blur(6px)', // Blurs the dashboard behind the modal
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensures it is above everything
    animation: 'fadeIn 0.3s ease'
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '95%',
    maxWidth: '500px',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    position: 'relative',
  },
  modalHeaderPremium: {
    background: '#1e293b',
    padding: '24px 30px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitleText: { margin: 0, fontSize: '22px', fontWeight: '800' },
  microLabelLight: { fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#94a3b8' },
  closeCircleBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' },
  
  modalBodyScroll: { padding: '30px', maxHeight: '70vh', overflowY: 'auto' },
  
  agentInfoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    marginBottom: '25px'
  },
  agentAvatarLarge: { width: '50px', height: '50px', background: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' },
  agentNameLarge: { fontSize: '17px', fontWeight: '700', color: '#334155' },
  statusBadgePremium: { marginLeft: 'auto', fontSize: '11px', color: '#10b981', fontWeight: '700' },

  fieldLabel: { display: 'block', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' },
  premiumDataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  staticValueText: { fontSize: '14px', color: '#1e293b', fontWeight: '500', lineHeight: '1.5' },
  pill: { padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center' },
  resolutionQuoteBox: { padding: '15px', background: '#f1f5f9', borderLeft: '4px solid #6366f1', borderRadius: '8px', color: '#475569', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.6' },

  modalFooterPremium: { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' },
  doneBtn: { width: '100%', padding: '14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  infoLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  infoValue: { fontSize: '13px', color: '#1e293b', margin: '4px 0 0', lineHeight: '1.5' },
  closeBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' },
  paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '12px', borderTop: '1px solid #f1f5f9' },
  pagBtn: { padding: '4px 12px', fontSize: '10px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' },
  shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' },
  spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default AllusersDashboard;