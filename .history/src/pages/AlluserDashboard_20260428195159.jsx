// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from 'react-router-dom';

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

//   const navigate = useNavigate();

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

//   const [selectedIncident, setSelectedIncident] = useState(null);
// const [isModalOpen, setIsModalOpen] = useState(false);

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


//  const openIncidentModal = (incident) => {
//   // Pulling name from the selected agent state
//   const agentName = selectedAgentData?.agent || incident.done_by || "System Processed";

//   setSelectedIncident({
//     ...incident,
//     display_name: agentName 
//   });
//   setIsModalOpen(true);
// };

 
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
//           user_sid: currentSid, page: currentPage, per_page: perPage,
//           from_date: pendingFromDate || undefined, to_date: pendingToDate || undefined
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
//           user_sid: foundUser.sid, page: pageNum, per_page: 10,
//           from_date: detailFromDate || undefined, to_date: detailToDate || undefined
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
//       fetchAnalystDetails(selectedAgentData, detailPage);
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
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>Audit Phase</label>
//                 <div style={styles.premiumButton} onClick={() => setIsQaOpen(!isQaOpen)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedQaDetail.color }} />
//                   <span style={styles.selectedText}>{selectedQaDetail.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isQaOpen && (
//                   <div style={styles.customMenu}>
//                     {qaOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <input type="date" style={styles.premiumDateInput} value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
//               <input type="date" style={styles.premiumDateInput} value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
//               <button onClick={resetDetailDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}

//           {activeTab === 'pending' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>QA Status</label>
//                 <div style={styles.premiumButton} onClick={() => setIsQaOpenPending(!isQaOpenPending)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedQaPending.color }} />
//                   <span style={styles.selectedText}>{selectedQaPending.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isQaOpenPending && (
//                   <div style={styles.customMenu}>
//                     {qaOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setPendingQaState(opt.id); setCurrentPage(1); setIsQaOpenPending(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>Incident State</label>
//                 <div style={styles.premiumButton} onClick={() => setIsStatusOpen(!isStatusOpen)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedStatus.color }} />
//                   <span style={styles.selectedText}>{selectedStatus.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isStatusOpen && (
//                   <div style={styles.customMenu}>
//                     {statusOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsStatusOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <input type="date" style={styles.premiumDateInput} value={pendingFromDate} onChange={(e) => setPendingFromDate(e.target.value)} />
//               <input type="date" style={styles.premiumDateInput} value={pendingToDate} onChange={(e) => setPendingToDate(e.target.value)} />
//               <button onClick={resetPendingDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}
//         </div>
//       </header>

//       <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>

//         {activeTab === 'team' && (
//           <div style={styles.bannerContainer}>
//             <div style={styles.statBox}>
//               <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-ticket-perforated-fill"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Total Tickets</span>
//                 <span style={styles.statValue}>{viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}</span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{ ...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className="bi bi-shield-check"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Passed / Audited</span>
//                 <span style={{ ...styles.statValue, color: '#10b981' }}>{viewMode === 'list' ? summary.passed : selectedAgentData?.passed}</span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-stars"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Average Score</span>
//                 <span style={{ ...styles.statValue, color: '#6366f1' }}>{viewMode === 'detail' ? selectedAgentData?.average_score?.toFixed(1) : '---'}</span>
//               </div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{ ...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className="bi bi-graph-up-arrow"></i></div>
//               <div style={styles.statInfo}>
//                 <span style={styles.statLabel}>Quality Rate</span>
//                 <span style={{ ...styles.statValue, color: '#f59e0b' }}>{viewMode === 'list' ? `${summary.pass_percentage}%` : (selectedAgentData?.pass_percentage ? `${selectedAgentData?.pass_percentage}%` : '0%')}</span>
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
//                       <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
//                         {chartData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
//                         ))}
//                       </Pie>
//                       <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
//                       <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </section>

//               <section style={styles.card}>
//                 <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Performance</h6></div>
//                 <div style={styles.tableScroll}>
//                   <table style={styles.table}>
//                     <thead>
//                       <tr><th style={styles.th}>Analyst</th><th style={styles.th}>Total</th><th style={styles.th}>Avg Score</th><th style={styles.th}>Pass %</th></tr>
//                     </thead>
//                     <tbody>
//                       {agentsList.map((a, i) => (
//                         <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
//                           <td style={styles.td}>
//                             <div style={styles.avatarRow}>
//                               <div style={styles.miniAvatar}>{a.agent.charAt(0).toUpperCase()}</div>
//                               <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{formatName(a.agent)} {a.needs_training && <i className="bi bi-exclamation-triangle-fill" style={{ color: '#f43f5e', fontSize: '11px' }}></i>}</span>
//                             </div>
//                           </td>
//                           <td style={styles.td}>{a.total_tickets}</td>
//                           <td style={styles.td}><span style={{ fontWeight: '700' }}>{a.average_score?.toFixed(1) || 0}</span></td>
//                           <td style={styles.td}><span style={{ fontWeight: '700', color: (a.pass_percentage >= 90 ? '#10b981' : '#f59e0b') }}>{a.pass_percentage !== null ? `${a.pass_percentage}%` : '---'}</span></td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>
//             </>
//           )}

//           {activeTab === 'team' && viewMode === 'detail' && (
//             <section style={styles.card}>
//               <div style={styles.detailHeader}>
//                 <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back to Team</button>
//                 <h3 style={{ margin: 0, fontSize: '15px' }}>{formatName(selectedAgentData?.agent)} Overview</h3>
//               </div>
//               <div style={styles.tableScroll}>
//                 <table style={styles.table}>
//                   <thead><tr><th style={styles.th}>Incident</th><th style={styles.th}>Description</th><th style={styles.th}>State</th></tr></thead>
//                   <tbody>
//                     {agentTickets.map((t, idx) => (
//                       <tr key={idx} style={styles.tr}>
// <td 
//   style={{ ...styles.td, fontWeight: 'bold', color: '#6366f1', cursor: 'pointer', textDecoration: 'underline' }}
//   onClick={() => openIncidentModal(t)}
// >
//   {t.incident_number}
// </td>                      <td style={styles.td}>{t.short_description}</td>
//                         <td style={styles.td}><span style={styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <div style={styles.paginationArea}>
//                   <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                   <span style={{ fontSize: 11 }}>Page {detailPage}</span>
//                   <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                 </div>
//               </div>
//             </section>
//           )}

//           {activeTab === 'pending' && (
//             <section style={styles.card}>
//               <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Pending Queue</h6><span style={styles.badge}>{totalPending} Records Found</span></div>
//               <div style={styles.tableScroll}>
//                 {pendingIncidents.length === 0 ? (
//                   <div style={styles.noDataContainer}>
//                     <i className="bi bi-inbox" style={styles.noDataIcon}></i>
//                     <p style={styles.noDataText}>No Data Found</p>
//                     <p style={styles.noDataSubText}>Adjust your filters or check back later.</p>
//                   </div>
//                 ) : (
//                   <>
//                     <table style={styles.table}>
//                       <thead><tr><th style={styles.th}>Incident No</th ><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
//                       {/* <tbody>
//                                   {pendingIncidents.map((incident, i) => (
//                                       <tr key={i} style={styles.tr}>
//                                           <td style={styles.td}><span style={{ fontWeight: '700', color: '#6366f1' }}>{incident.incident_number}</span></td>
//                                           <td style={styles.td}>{incident.short_description}</td>
//                                           <td style={styles.td}><span style={{...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2'}}>{incident.status}</span></td>
//                                           <td style={styles.td}>{incident.resolution_shared || "---"}</td>
//                                       </tr>
//                                   ))}
//                               </tbody> */}
//                       {/* inside the activeTab === 'pending' section */}
//                       <tbody>
//                         {pendingIncidents.map((incident, i) => {
//                           // Check if QA is already done
//                           const isDone = incident.qa_state === 'done';

//                           return (
//                             <tr key={i} style={styles.tr}>
//                               <td style={styles.td}>
//                                 <span
//                                   style={{
//                                     fontWeight: '700',
//                                     color: isDone ? '#94a3b8' : '#6366f1', // Gray out if done
//                                     cursor: isDone ? 'not-allowed' : 'pointer',
//                                     textDecoration: isDone ? 'none' : 'underline'
//                                   }}
//                                   onClick={() => {
//                                     if (!isDone) {
      
//                                       navigate('/dashboard/update-incident', {
//                                         state: {
//                                           incidentData: {
//           ...incident,
//           // If the API forgot to send the name, we fallback to an empty string 
//           // or a known key to avoid 'undefined'
//           done_by: incident.done_by || incident.agent || "" 
//         },
//                                           fromPending: true
//                                         }
//                                       });
//                                     }
//                                   }}
//                                   title={isDone ? "Audited incidents cannot be edited" : "Click to edit"}
//                                 >
//                                   {incident.incident_number}
//                                   {isDone && <i className="bi bi-lock-fill ms-1" style={{ fontSize: '10px' }}></i>}
//                                 </span>
//                               </td>

//                               <td style={styles.td}>{incident.short_description}</td>
//                               <td style={styles.td}>
//                                 <span style={{ ...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2' }}>
//                                   {incident.status}
//                                 </span>
//                               </td>
//                               <td style={styles.td}>{incident.resolution_shared || "---"}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                     <div style={styles.paginationArea}>
//                       <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                       <span style={{ fontSize: 12 }}>Page {currentPage}</span>
//                       <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </section>
//           )}
//         </div>
//       </div>
// {isModalOpen && selectedIncident && (
//   <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
//     {/* StopPropagation prevents the modal from closing when clicking inside the white area */}
//     <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
      
//       {/* Header with Dark Premium Look */}
//       <div style={styles.modalHeaderPremium}>
//         <div>
//           <span style={styles.microLabelLight}>Internal Record</span>
//           <h2 style={styles.modalTitleText}>{selectedIncident.incident_number}</h2>
//         </div>
//         <button style={styles.closeCircleBtn} onClick={() => setIsModalOpen(false)}>
//           <i className="bi bi-x-lg"></i>
//         </button>
//       </div>

//       <div style={styles.modalBodyScroll}>
//         {/* Agent Info Card */}
//         <div style={styles.agentInfoCard}>
//           <div style={styles.agentAvatarLarge}>
//             {selectedIncident.display_name.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <label style={styles.fieldLabel}>Actioned By</label>
//             <div style={styles.agentNameLarge}>{formatName(selectedIncident.display_name)}</div>
//           </div>
//           <div style={styles.statusBadgePremium}>
//              <i className="bi bi-shield-check"></i> Verified
//           </div>
//         </div>

//         {/* Data Grid */}
//         <div style={styles.premiumDataGrid}>
//           <div style={{ gridColumn: '1 / span 2' }}>
//             <label style={styles.fieldLabel}>Short Description</label>
//             <div style={styles.staticValueText}>{selectedIncident.short_description}</div>
//           </div>

//           <div>
//             <label style={styles.fieldLabel}>Status</label>
//             <div style={{...styles.pill, background: selectedIncident.status === 'resolved' ? '#dcfce7' : '#fff7ed', color: selectedIncident.status === 'resolved' ? '#166534' : '#9a3412'}}>
//               {selectedIncident.status?.toUpperCase()}
//             </div>
//           </div>

//           <div>
//             <label style={styles.fieldLabel}>QA Phase</label>
//             <div style={{...styles.pill, background: '#f1f5f9', color: '#475569'}}>
//               <i className="bi bi-lock-fill" style={{marginRight: '5px'}}></i>
//               {selectedIncident.qa_state?.toUpperCase() || 'PENDING'}
//             </div>
//           </div>

//           <div style={{ gridColumn: '1 / span 2' }}>
//             <label style={styles.fieldLabel}>Resolution Logic</label>
//             <div style={styles.resolutionQuoteBox}>
//               {selectedIncident.resolution_shared || "No specific resolution notes recorded for this entry."}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style={styles.modalFooterPremium}>
//         <button style={styles.doneBtn} onClick={() => setIsModalOpen(false)}>
//           Close Record
//         </button>
//       </div>
//     </div>
//   </div>
// )}
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
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px', position: 'relative' },
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

//   // No Data Styling
//   noDataContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', padding: '40px' },
//   noDataIcon: { fontSize: '48px', color: '#e2e8f0', marginBottom: '10px' },
//   noDataText: { fontSize: '16px', fontWeight: '700', color: '#94a3b8', margin: 0 },
//   noDataSubText: { fontSize: '12px', color: '#cbd5e1', margin: '5px 0 0' },

//   dropdownContainer: { position: 'relative', display: 'flex', flexDirection: 'column' },
//   premiumLabel: { fontSize: '8px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', marginBottom: '2px', marginLeft: '4px' },
//   premiumButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' },
//   statusDot: { width: '7px', height: '7px', borderRadius: '50%' },
//   selectedText: { fontSize: '11px', fontWeight: '700' },
//   customMenu: { position: 'absolute', top: '105%', right: '0', width: '160px', background: '#fff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, padding: '5px' },
//   menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
//   premiumDateInput: { padding: '6px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600', alignSelf: 'flex-end' },
//   resetBtn: { padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b', alignSelf: 'flex-end' },
 

//    modalOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(15, 23, 42, 0.75)', // Dark dimming
//     backdropFilter: 'blur(6px)', // Blurs the dashboard behind the modal
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 9999, // Ensures it is above everything
//     animation: 'fadeIn 0.3s ease'
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     width: '95%',
//     maxWidth: '500px',
//     borderRadius: '24px',
//     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   modalHeaderPremium: {
//     background: '#1e293b',
//     padding: '24px 30px',
//     color: '#fff',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   modalTitleText: { margin: 0, fontSize: '22px', fontWeight: '800' },
//   microLabelLight: { fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#94a3b8' },
//   closeCircleBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' },
  
//   modalBodyScroll: { padding: '30px', maxHeight: '70vh', overflowY: 'auto' },
  
//   agentInfoCard: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '15px',
//     padding: '15px',
//     background: '#f8fafc',
//     borderRadius: '16px',
//     border: '1px solid #f1f5f9',
//     marginBottom: '25px'
//   },
//   agentAvatarLarge: { width: '50px', height: '50px', background: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' },
//   agentNameLarge: { fontSize: '17px', fontWeight: '700', color: '#334155' },
//   statusBadgePremium: { marginLeft: 'auto', fontSize: '11px', color: '#10b981', fontWeight: '700' },

//   fieldLabel: { display: 'block', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' },
//   premiumDataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
//   staticValueText: { fontSize: '14px', color: '#1e293b', fontWeight: '500', lineHeight: '1.5' },
//   pill: { padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center' },
//   resolutionQuoteBox: { padding: '15px', background: '#f1f5f9', borderLeft: '4px solid #6366f1', borderRadius: '8px', color: '#475569', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.6' },

//   modalFooterPremium: { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' },
//   doneBtn: { width: '100%', padding: '14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
//   infoGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
//   infoLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
//   infoValue: { fontSize: '13px', color: '#1e293b', margin: '4px 0 0', lineHeight: '1.5' },
//   closeBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' },
//   paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '12px', borderTop: '1px solid #f1f5f9' },
//   pagBtn: { padding: '4px 12px', fontSize: '10px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' },
//   shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.4)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' },
//   spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }
// };

// const styleSheet = document.createElement("style");
// styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
// document.head.appendChild(styleSheet);

// export default AllusersDashboard;


// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from 'react-router-dom';

// const AllusersDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const formatName = (str) => {
//     if (!str) return "";
//     return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   };

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
//   const [pendingSlaFilter, setPendingSlaFilter] = useState('all'); // NEW
//   const [isSlaOpenPending, setIsSlaOpenPending] = useState(false); // NEW
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
//   const [slaFilter, setSlaFilter] = useState('all'); 
//   const [isSlaOpen, setIsSlaOpen] = useState(false);

//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

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

//   const slaOptions = [
//     { id: 'all', label: 'All SLAs', color: '#6366f1', icon: 'bi-clock' },
//     { id: 'breached', label: 'SLA Breached', color: '#f43f5e', icon: 'bi-exclamation-octagon' },
//   ];

//   const selectedStatus = statusOptions.find(opt => opt.id === statusFilter) || statusOptions[0];
//   const selectedQaPending = qaOptions.find(opt => opt.id === pendingQaState);
//   const selectedQaDetail = qaOptions.find(opt => opt.id === qaState);
//   const selectedSlaDetail = slaOptions.find(opt => opt.id === slaFilter);
//   const selectedSlaPending = slaOptions.find(opt => opt.id === pendingSlaFilter);

//   const resetPendingDates = () => { setPendingFromDate(''); setPendingToDate(''); setCurrentPage(1); setPendingSlaFilter('all'); };
//   const resetDetailDates = () => { setDetailFromDate(''); setDetailToDate(''); setDetailPage(1); setSlaFilter('all'); };

//   const openIncidentModal = (incident) => {
//     const agentName = selectedAgentData?.agent || incident.done_by || "System Processed";
//     setSelectedIncident({ ...incident, display_name: agentName });
//     setIsModalOpen(true);
//   };

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

//   // --- UPDATED: FETCH MY PENDING WITH SLA LOGIC ---
//   useEffect(() => {
//     const fetchMyPending = async () => {
//       if (activeTab !== 'pending') return;
//       const currentSid = user?.sid || user?.user_sid;
//       if (!currentSid) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const payload = {
//           user_sid: currentSid, page: currentPage, per_page: perPage,
//           from_date: pendingFromDate || undefined, to_date: pendingToDate || undefined
//         };
//         // Switch endpoint if SLA Breached is selected
//         const endpoint = pendingSlaFilter === 'breached' 
//           ? '/users/get/sla-breached/incidents' 
//           : '/users/get-pending/incidents/all';

//         const res = await api.post(endpoint, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { resolution_status: statusFilter || undefined, qa_state: pendingQaState }
//         });
//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) { console.error(err); setPendingIncidents([]); }
//       finally { setLoading(false); }
//     };
//     fetchMyPending();
//   }, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, pendingSlaFilter, user]);

//   const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
//     setDetailLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
//       if (foundUser) {
//         const payload = {
//           user_sid: foundUser.sid, page: pageNum, per_page: 10,
//           from_date: detailFromDate || undefined, to_date: detailToDate || undefined
//         };
//         const endpoint = slaFilter === 'breached' 
//           ? '/users/get/sla-breached/incidents' 
//           : '/users/get-pending/incidents/all';

//         const res = await api.post(endpoint, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { qa_state: qaState }
//         });
//         setAgentTickets(res.data.response || []);
//         setTotalDetailTickets(res.data.total || 0);
//       }
//     } catch (err) { console.error(err); setAgentTickets([]); }
//     finally { setDetailLoading(false); }
//   };

//   useEffect(() => {
//     if (viewMode === 'detail' && selectedAgentData) {
//       fetchAnalystDetails(selectedAgentData, detailPage);
//     }
//   }, [detailPage, detailFromDate, detailToDate, qaState, slaFilter]);

//   const handleAnalystClick = (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail');
//     setDetailPage(1);
//     fetchAnalystDetails(agentStat, 1);
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];
//   const chartData = [{ name: 'Passed', value: summary.passed, color: '#10b981' }, { name: 'Failed', value: summary.failed, color: '#f43f5e' }, { name: 'Pending', value: summary.pending, color: '#f59e0b' }].filter(d => d.value > 0);

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
//       {(loading || detailLoading) && <div style={styles.shimmerOverlay}><div style={styles.spinner}></div></div>}

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
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>SLA Status</label>
//                 <div style={styles.premiumButton} onClick={() => setIsSlaOpen(!isSlaOpen)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedSlaDetail.color }} />
//                   <span style={styles.selectedText}>{selectedSlaDetail.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isSlaOpen && (
//                   <div style={styles.customMenu}>
//                     {slaOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setSlaFilter(opt.id); setDetailPage(1); setIsSlaOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>Audit Phase</label>
//                 <div style={styles.premiumButton} onClick={() => setIsQaOpen(!isQaOpen)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedQaDetail.color }} />
//                   <span style={styles.selectedText}>{selectedQaDetail.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isQaOpen && (
//                   <div style={styles.customMenu}>
//                     {qaOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <input type="date" style={styles.premiumDateInput} value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
//               <input type="date" style={styles.premiumDateInput} value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
//               <button onClick={resetDetailDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}

//           {activeTab === 'pending' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               {/* NEW: SLA FILTER FOR PENDING TAB */}
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>SLA Status</label>
//                 <div style={styles.premiumButton} onClick={() => setIsSlaOpenPending(!isSlaOpenPending)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedSlaPending.color }} />
//                   <span style={styles.selectedText}>{selectedSlaPending.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isSlaOpenPending && (
//                   <div style={styles.customMenu}>
//                     {slaOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setPendingSlaFilter(opt.id); setCurrentPage(1); setIsSlaOpenPending(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>QA Status</label>
//                 <div style={styles.premiumButton} onClick={() => setIsQaOpenPending(!isQaOpenPending)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedQaPending.color }} />
//                   <span style={styles.selectedText}>{selectedQaPending.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isQaOpenPending && (
//                   <div style={styles.customMenu}>
//                     {qaOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setPendingQaState(opt.id); setCurrentPage(1); setIsQaOpenPending(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>Incident State</label>
//                 <div style={styles.premiumButton} onClick={() => setIsStatusOpen(!isStatusOpen)}>
//                   <div style={{ ...styles.statusDot, backgroundColor: selectedStatus.color }} />
//                   <span style={styles.selectedText}>{selectedStatus.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isStatusOpen && (
//                   <div style={styles.customMenu}>
//                     {statusOptions.map((opt) => (
//                       <div key={opt.id} style={styles.menuItem} onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsStatusOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <input type="date" style={styles.premiumDateInput} value={pendingFromDate} onChange={(e) => setPendingFromDate(e.target.value)} />
//               <input type="date" style={styles.premiumDateInput} value={pendingToDate} onChange={(e) => setPendingToDate(e.target.value)} />
//               <button onClick={resetPendingDates} style={styles.resetBtn} title="Reset Dates"><i className="bi bi-arrow-counterclockwise"></i></button>
//             </div>
//           )}
//         </div>
//       </header>

//       <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
//         {activeTab === 'team' && (
//           <div style={styles.bannerContainer}>
//             <div style={styles.statBox}><div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-ticket-perforated-fill"></i></div><div style={styles.statInfo}><span style={styles.statLabel}>Total Tickets</span><span style={styles.statValue}>{viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}</span></div></div>
//             <div style={styles.statBox}><div style={{ ...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className="bi bi-shield-check"></i></div><div style={styles.statInfo}><span style={styles.statLabel}>Passed / Audited</span><span style={{ ...styles.statValue, color: '#10b981' }}>{viewMode === 'list' ? summary.passed : selectedAgentData?.passed}</span></div></div>
//             <div style={styles.statBox}><div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-stars"></i></div><div style={styles.statInfo}><span style={styles.statLabel}>Average Score</span><span style={{ ...styles.statValue, color: '#6366f1' }}>{viewMode === 'detail' ? selectedAgentData?.average_score?.toFixed(1) : '---'}</span></div></div>
//             <div style={styles.statBox}><div style={{ ...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className="bi bi-graph-up-arrow"></i></div><div style={styles.statInfo}><span style={styles.statLabel}>Quality Rate</span><span style={{ ...styles.statValue, color: '#f59e0b' }}>{viewMode === 'list' ? `${summary.pass_percentage}%` : (selectedAgentData?.pass_percentage ? `${selectedAgentData?.pass_percentage}%` : '0%')}</span></div></div>
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
//                       <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
//                         {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </section>
//               <section style={styles.card}>
//                 <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Performance</h6></div>
//                 <div style={styles.tableScroll}>
//                   <table style={styles.table}>
//                     <thead><tr><th style={styles.th}>Analyst</th><th style={styles.th}>Total</th><th style={styles.th}>Avg Score</th><th style={styles.th}>Pass %</th></tr></thead>
//                     <tbody>
//                       {agentsList.map((a, i) => (
//                         <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
//                           <td style={styles.td}><div style={styles.avatarRow}><div style={styles.miniAvatarIcon}>{a.agent.charAt(0).toUpperCase()}</div><span>{formatName(a.agent)}</span></div></td>
//                           <td style={styles.td}>{a.total_tickets}</td>
//                           <td style={styles.td}>{a.average_score?.toFixed(1) || 0}</td>
//                           <td style={styles.td}>{a.pass_percentage}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>
//             </>
//           )}

//           {activeTab === 'team' && viewMode === 'detail' && (
//             <section style={styles.card}>
//               <div style={styles.detailHeader}>
//                 <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back to Team</button>
//                 <h3 style={{ margin: 0, fontSize: '15px' }}>{formatName(selectedAgentData?.agent)} Overview</h3>
//               </div>
//               <div style={styles.tableScroll}>
//                 {agentTickets.length === 0 ? (
//                   <div style={styles.noDataContainer}>
//                     <i className="bi bi-patch-check" style={{ ...styles.noDataIcon, color: slaFilter === 'breached' ? '#10b981' : '#cbd5e1' }}></i>
//                     <p style={styles.noDataText}>
//                       {slaFilter === 'breached' ? "No SLA Breaches Found" : "No Records Found"}
//                     </p>
//                     <p style={styles.noDataSubText}>
//                       {slaFilter === 'breached' ? "This analyst has resolved all tickets within the target SLA." : "Adjust your filters to see more results."}
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     <table style={styles.table}>
//                       <thead><tr><th style={styles.th}>Incident</th><th style={styles.th}>Description</th><th style={styles.th}>State</th></tr></thead>
//                       <tbody>
//                         {agentTickets.map((t, idx) => (
//                           <tr key={idx} style={styles.tr}>
//                             <td style={{ ...styles.td, fontWeight: 'bold', color: '#6366f1' }} onClick={() => openIncidentModal(t)}>
//                               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                                 {t.incident_number}
//                                 {t.sla_breached && <i className="bi bi-clock-history" style={{ color: '#f43f5e', fontSize: '12px' }}></i>}
//                               </div>
//                             </td>
//                             <td style={styles.td}>{t.short_description}</td>
//                             <td style={styles.td}><span style={t.sla_breached ? styles.miniBadgeRed : styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     <div style={styles.paginationArea}>
//                       <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
//                       <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </section>
//           )}

//           {activeTab === 'pending' && (
//             <section style={styles.card}>
//               <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Pending Queue</h6><span style={styles.badge}>{totalPending} Records Found</span></div>
//               <div style={styles.tableScroll}>
//                 {pendingIncidents.length === 0 ? (
//                   <div style={styles.noDataContainer}>
//                     <i className="bi bi-inbox" style={styles.noDataIcon}></i>
//                     <p style={styles.noDataText}>
//                       {pendingSlaFilter === 'breached' ? "No Breached Tickets Found" : "No Data Found"}
//                     </p>
//                     <p style={styles.noDataSubText}>Great job! All your tickets are currently within SLA.</p>
//                   </div>
//                 ) : (
//                   <>
//                     <table style={styles.table}>
//                       <thead><tr><th style={styles.th}>Incident No</th><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
//                       <tbody>
//                         {pendingIncidents.map((incident, i) => (
//                           <tr key={i} style={styles.tr}>
//                             <td style={styles.td}>
//                               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                                 <span style={{ fontWeight: '700', color: '#6366f1' }} onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: incident, fromPending: true } })}>
//                                   {incident.incident_number}
//                                 </span>
//                                 {incident.sla_breached && <i className="bi bi-clock-history" style={{ color: '#f43f5e', fontSize: '12px' }} title="SLA Breached"></i>}
//                               </div>
//                             </td>
//                             <td style={styles.td}>{incident.short_description}</td>
//                             <td style={styles.td}><span style={{ ...styles.miniBadge, backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2' }}>{incident.status}</span></td>
//                             <td style={styles.td}>{incident.resolution_shared || "---"}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
                    // <div style={styles.paginationArea}>
                    //   <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
                    //   <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
                    // </div>
//                   </>
//                 )}
//               </div>
//             </section>
//           )}
//         </div>
//       </div>

//       {isModalOpen && selectedIncident && (
//         <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
//           <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
//             <div style={styles.modalHeaderPremium}>
//               <div><span style={styles.microLabelLight}>Internal Record</span><h2 style={styles.modalTitleText}>{selectedIncident.incident_number}</h2></div>
//               <button style={styles.closeCircleBtn} onClick={() => setIsModalOpen(false)}><i className="bi bi-x-lg"></i></button>
//             </div>
//             <div style={styles.modalBodyScroll}>
//               {selectedIncident.sla_breached && (
//                 <div style={{ padding: '0 20px', marginBottom: '15px' }}>
//                   <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', fontSize: '11px', fontWeight: '700' }}>
//                     <i className="bi bi-exclamation-triangle-fill"></i>
//                     SLA BREACHED: This ticket was not resolved within the defined timeframe.
//                   </div>
//                 </div>
//               )}
//               <div style={styles.agentInfoCard}>
//                 <div style={styles.agentAvatarLarge}>{selectedIncident.display_name.charAt(0).toUpperCase()}</div>
//                 <div><label style={styles.fieldLabel}>Actioned By</label><div style={styles.agentNameLarge}>{formatName(selectedIncident.display_name)}</div></div>
//               </div>
//               <div style={styles.premiumDataGrid}>
//                 <div style={{ gridColumn: '1 / span 2' }}><label style={styles.fieldLabel}>Short Description</label><div style={styles.staticValueText}>{selectedIncident.short_description}</div></div>
//                 <div><label style={styles.fieldLabel}>Status</label><div style={styles.pill}>{selectedIncident.status?.toUpperCase()}</div></div>
//                 <div style={{ gridColumn: '1 / span 2' }}><label style={styles.fieldLabel}>Resolution Logic</label><div style={styles.resolutionQuoteBox}>{selectedIncident.resolution_shared || "No notes."}</div></div>
//               </div>
//             </div>
//             <div style={styles.modalFooterPremium}><button style={styles.doneBtn} onClick={() => setIsModalOpen(false)}>Close Record</button></div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Inter', sans-serif" },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', flexShrink: 0 },
//   titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
//   logo: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' },
//   tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
//   activeTab: { padding: '5px 12px', background: '#fff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' },
//   inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
//   filterStrip: { display: 'flex', gap: '8px' },
//   mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', height: '100%', minHeight: 0 },
//   fullView: { display: 'block', height: '100%' },
//   bannerContainer: { display: 'flex', gap: '12px', marginBottom: '12px', flexShrink: 0 },
//   statBox: { flex: 1, background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' },
//   iconCircle: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
//   statInfo: { display: 'flex', flexDirection: 'column' },
//   statLabel: { fontSize: '8.5px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
//   statValue: { fontSize: '18px', fontWeight: '900', color: '#1e293b' },
//   card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
//   cardHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px', position: 'relative' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '10px 8px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' },
//   td: { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f8fafc',fontWeight: '600', },
//   tr: { cursor: 'pointer', ':hover': { backgroundColor: '#f8fafc' } },
//   detailHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px' },
//   backBtn: { border: 'none', background: '#f1f5f9', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
//   dropdownContainer: { position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px' },
//   premiumLabel: { fontSize: '8px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
//   premiumButton: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
//   statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
//   selectedText: { fontSize: '11px', fontWeight: '700', color: '#1e293b' },
//   customMenu: { position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 100, minWidth: '150px' },
//   menuItem: { padding: '10px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
//   premiumDateInput: { border: '1px solid #e2e8f0', padding: '6px', borderRadius: '8px', fontSize: '11px', background: '#f8fafc' },
//   resetBtn: { background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' },
//   paginationArea: { padding: '10px', display: 'flex', justifyContent: 'center', gap: '15px' },
//   pagBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '6px', fontSize: '11px' },
//   shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
//   spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
//   noDataContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' },
//   noDataIcon: { fontSize: '48px', color: '#cbd5e1', marginBottom: '15px' },
//   noDataText: { fontSize: '16px', fontWeight: '700', color: '#475569', margin: '0 0 5px 0' },
//   noDataSubText: { fontSize: '12px', color: '#94a3b8', margin: 0 },
//   miniBadgeRed: { padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '700', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' },
//   miniBadgeGray: { padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '700', backgroundColor: '#f1f5f9', color: '#64748b' },
//   modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
//   modalContent: { width: '550px', background: '#fff', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' },
//   modalHeaderPremium: { background: '#1e293b', padding: '25px 30px', display: 'flex', justifyContent: 'space-between' },
//   modalTitleText: { color: '#fff', margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800' },
//   modalBodyScroll: { padding: '20px 0', overflowY: 'auto' },
//   agentInfoCard: { margin: '0 30px 25px 30px', padding: '15px 20px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px' },
//   premiumDataGrid: { padding: '0 30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
//   pill: { background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' },


//   avatarRow: { 
//     display: 'flex', 
//     alignItems: 'center', 
//     gap: '12px' 
//   },
//   miniAvatarIcon: { 
//     width: '28px', 
//     height: '28px', 
//     borderRadius: '8px', 
//     background: '#eef2ff', // Light indigo background
//     color: '#6366f1',      // Darker indigo icon
//     fontSize: '14px', 
//     display: 'flex', 
//     alignItems: 'center', 
//     justifyContent: 'center',
//     border: '1px solid #e0e7ff'
//   },
//   resolutionQuoteBox: { background: '#f1f5f9', padding: '15px', borderRadius: '12px', fontSize: '12px', fontStyle: 'italic', borderLeft: '4px solid #6366f1' },
//   modalFooterPremium: { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' },
//   doneBtn: { background: '#1e293b', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
// };

// export default AllusersDashboard;

import React, { useState, useEffect } from 'react';
 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import '../pages/AlluserDashboard.css';

const AllusersDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatName = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const [activeTab, setActiveTab] = useState('team');
  const [userList, setUserList] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // SLA View (Team View only - Full Screen)
  const [showGlobalSla, setShowGlobalSla] = useState(false);
  const [globalSlaData, setGlobalSlaData] = useState([]);
  const [globalSlaTotal, setGlobalSlaTotal] = useState(0);
  const [globalSlaPage, setGlobalSlaPage] = useState(1);

  // My Pending Tab
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

  // Analyst Detail View
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
const [timeframe, setTimeframe] = useState('overall');

  const statusOptions = [
    { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
    { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
    { id: 'escalated', label: 'Escalated', color: '#b20f2a', icon: 'bi-fire' },
    { id: 'in progress', label: 'In Progress', color: '#52be00', icon: 'bi-clock-history' },
     
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
    const agentName = selectedAgentData?.agent || incident.done_by || "System Processed";
    setSelectedIncident({ ...incident, display_name: agentName });
    setIsModalOpen(true);
  };

  const fetchGlobalSlaBreaches = async (page = 1) => {
    setLoading(true);
    try {
      const token = user?.token || localStorage.getItem("session_token");
      const currentSid = user?.sid || user?.user_sid;
      const res = await api.post('/users/get/sla-breached/incidents', 
        { user_sid: currentSid, page: page, per_page: 10 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGlobalSlaData(res.data.response || []);
      setGlobalSlaTotal(res.data.total || 0);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if (showGlobalSla && activeTab === 'team') fetchGlobalSlaBreaches(globalSlaPage); }, [showGlobalSla, globalSlaPage, activeTab]);

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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [activeTab, viewMode, user]);

  useEffect(() => {
  const fetchMyPending = async () => {
    if (activeTab !== 'pending') return;
    setLoading(true);
    try {
      const token = user?.token || localStorage.getItem("session_token");
      
      // Construct the payload carefully
      const payload = {
        user_sid: user?.sid || user?.user_sid,
        page: currentPage,
        per_page: perPage,
      };

      // Only add dates if they have a value to avoid sending empty strings
      if (pendingFromDate) payload.from_date = pendingFromDate;
      if (pendingToDate) payload.to_date = pendingToDate;

      const res = await api.post('/users/get-pending/incidents/all', 
        payload,
        { 
          headers: { Authorization: `Bearer ${token}` }, 
          params: { 
            resolution_status: statusFilter || undefined, 
            qa_state: pendingQaState 
          } 
        }
      );
      setPendingIncidents(res.data.response || []);
      setTotalPending(res.data.total || 0);
    } catch (err) { 
      console.error("Fetch Error:", err); 
      setPendingIncidents([]); 
    } finally { 
      setLoading(false); 
    }
  };
  fetchMyPending();
}, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, user]);

  const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
    setDetailLoading(true);
    try {
      const token = user?.token || localStorage.getItem("session_token");
      const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
      if (foundUser) {
        const res = await api.post('/users/get-pending/incidents/all', 
          { user_sid: foundUser.sid, page: pageNum, per_page: 10, from_date: detailFromDate || undefined, to_date: detailToDate || undefined },
          { headers: { Authorization: `Bearer ${token}` }, params: { qa_state: qaState } }
        );
        setAgentTickets(res.data.response || []);
        setTotalDetailTickets(res.data.total || 0);
      }
    } catch (err) { console.error(err); setAgentTickets([]); } finally { setDetailLoading(false); }
  };

  useEffect(() => { if (viewMode === 'detail' && selectedAgentData) fetchAnalystDetails(selectedAgentData, detailPage); }, [detailPage, detailFromDate, detailToDate, qaState]);

  const handleAnalystClick = (agentStat) => {
    setSelectedAgentData(agentStat);
    setViewMode('detail');
    setDetailPage(1);
    fetchAnalystDetails(agentStat, 1);
  };

  const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
  const agentsList = data?.all_time?.agent_performance || [];
  const chartData = [{ name: 'Passed', value: summary.passed, color: '#10b981' }, { name: 'Failed', value: summary.failed, color: '#f43f5e' }, { name: 'Pending', value: summary.pending, color: '#f59e0b' }].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '10px', 
          fontWeight: '800', 
          color: '#94a3b8', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Analyst
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: '700', 
          color: '#1e293b' 
        }}>
          {label}
        </p>
        <div style={{ 
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#6366f1' 
          }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>
            {payload[0].value} Tickets Handled
          </span>
        </div>
      </div>
    );
  }
  return null;
};

  return (
    <div style={styles.container}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      {(loading || detailLoading) && <div style={styles.shimmerOverlay}><div style={styles.spinner}></div></div>}

      <header style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.logo}>Ticket<span style={{ color: '#6366f1' }}>Metrics</span></h2>
          <div style={styles.tabGroup}>
            <button onClick={() => { setActiveTab('team'); setViewMode('list'); setShowGlobalSla(false); }} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
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
              <button onClick={resetDetailDates} style={styles.resetBtn}><i className="bi bi-arrow-counterclockwise"></i></button>
            </div>
          )}

          {activeTab === 'pending' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  {/* QA Status Dropdown */}
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

  {/* Incident State Dropdown */}
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

  {/* From Date */}
  <div style={styles.dropdownContainer}>
    <label style={styles.premiumLabel}>From Date</label>
    <input 
      type="date" 
      style={styles.premiumDateInput} 
      value={pendingFromDate} 
      onChange={(e) => setPendingFromDate(e.target.value)} 
    />
  </div>

  {/* To Date */}
  <div style={styles.dropdownContainer}>
    <label style={styles.premiumLabel}>To Date</label>
    <input 
      type="date" 
      style={styles.premiumDateInput} 
      value={pendingToDate} 
      onChange={(e) => setPendingToDate(e.target.value)} 
    />
  </div>

  {/* Reset Button */}
  <div style={styles.dropdownContainer}>
    <label style={styles.premiumLabel}>Reset</label>
    <button onClick={resetPendingDates} style={{ ...styles.resetBtn, height: '31px' }}>
      <i className="bi bi-arrow-counterclockwise"></i>
    </button>
  </div>
</div>
          )}
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'team' && (
          <div style={styles.bannerContainer}>
            <div onClick={() => setShowGlobalSla(false)} style={{ ...styles.statBox, cursor: 'pointer', border: !showGlobalSla && viewMode === 'list' ? '1px solid #6366f1' : '1px solid #f1f5f9' }}>
              <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-ticket-perforated-fill"></i></div>
              <div style={styles.statInfo}><span style={styles.statLabel}>Total Tickets</span><span style={styles.statValue}>{viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}</span></div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className="bi bi-shield-check"></i></div>
              <div style={styles.statInfo}><span style={styles.statLabel}>Passed / Audited</span><span style={{ ...styles.statValue, color: '#10b981' }}>{viewMode === 'list' ? summary.passed : selectedAgentData?.passed}</span></div>
            </div>

            {/* SLA / AVG SCORE BOX */}
            {viewMode === 'list' ? (
              <div onClick={() => setShowGlobalSla(true)} style={{ ...styles.statBox, cursor: 'pointer', border: showGlobalSla ? '1px solid #ef4444' : '1px solid #f1f5f9' }}>
                <div style={{ ...styles.iconCircle, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><i className="bi bi-exclamation-octagon-fill"></i></div>
                <div style={styles.statInfo}><span style={styles.statLabel}>Team Health</span><span style={{ ...styles.statValue, color: '#ef4444' }}>BREACHED SLA</span></div>
              </div>
            ) : (
              <div style={styles.statBox}>
                <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-stars"></i></div>
                <div style={styles.statInfo}><span style={styles.statLabel}>Avg Score</span><span style={{ ...styles.statValue, color: '#6366f1' }}>{selectedAgentData?.average_score?.toFixed(1) || 0}</span></div>
              </div>
            )}

            <div style={styles.statBox}>
              <div style={{ ...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className="bi bi-graph-up-arrow"></i></div>
              <div style={styles.statInfo}><span style={styles.statLabel}>Quality Rate</span><span style={{ ...styles.statValue, color: '#f59e0b' }}>{viewMode === 'list' ? `${summary.pass_percentage}%` : `${selectedAgentData?.pass_percentage || 0}%`}</span></div>
            </div>
          </div>
        )}

        <div style={activeTab === 'pending' || viewMode === 'detail' || (activeTab === 'team' && showGlobalSla) ? styles.fullView : styles.mainGrid}>
          
          {/* FULL SCREEN SLA VIEW */}
          {activeTab === 'team' && viewMode === 'list' && showGlobalSla && (
  <section style={styles.card}>
    <div style={styles.cardHeader}>
      <h6 style={styles.cardTitle}>Global SLA Breaches</h6>
      <button onClick={() => setShowGlobalSla(false)} style={styles.backBtn}>
        <i className="bi bi-arrow-left"></i> Back to Chart
      </button>
    </div>
    <div style={styles.tableScroll}>
      {/* Check if there is data */}
      {globalSlaData.length > 0 ? (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Incident No</th>
                <th style={styles.th}>Actioned By</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {globalSlaData.map((item, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={{ ...styles.td, color: '#6366f1' }}>{item.incident_number}</td>
                  <td style={styles.td}>{formatName(item.done_by)}</td>
                  <td style={styles.td}>{item.short_description}</td>
                  <td style={styles.td}><span style={styles.miniBadgeRed}>SLA BREACHED</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Your existing pagination keeps its place here */}
          <div style={styles.paginationArea}>
            <button 
              disabled={globalSlaPage === 1} 
              onClick={() => setGlobalSlaPage(p => p - 1)} 
              style={styles.pagBtn}
            >
              Prev
            </button>
            <button 
              disabled={globalSlaPage >= Math.ceil(globalSlaTotal / 10)} 
              onClick={() => setGlobalSlaPage(p => p + 1)} 
              style={styles.pagBtn}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        /* The "No Data" message shown when globalSlaData is empty */
        <div style={styles.noDataContainer}>
          <i className="bi bi-patch-check" style={styles.noDataIcon}></i>
          <p style={styles.noDataText}>No SLA breaches found</p>
          <span style={styles.noDataSubtext}>All incidents are currently within their service level targets.</span>
        </div>
      )}
    </div>
  </section>
)}

          {/* NORMAL TEAM LIST VIEW */}
          {activeTab === 'team' && viewMode === 'list' && !showGlobalSla && (
            <>
              {/* <section style={styles.card}>
                <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Quality Overview</h6></div>
                <div style={styles.tableScroll}>
                    <ResponsiveContainer width="100%" height={230}>
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                </div>
              </section> */}

  
{/* --- REPLACE THE PIE CHART SECTION WITH THIS --- */}
 
{/* --- BAR CHART SHOWING USER HANDLED TICKETS --- */}
<section style={styles.card}>
  <div style={styles.cardHeader}>
    <h6 style={styles.cardTitle}>Tickets Handled by User</h6>
    <span style={styles.pill}>Volume View</span>
  </div>
  <div style={{ ...styles.tableScroll, padding: '10px' }}>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={agentsList}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
         <XAxis 
  dataKey="agent" 
  axisLine={false} 
  tickLine={false} 
  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
  interval={0}
  angle={-25}      // Keeps names from overlapping
  textAnchor="end" // Aligns slanted text
  // This line fixes the capitalization:
  tickFormatter={(name) => formatName(name.split(' ')[0])} 
/>
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
        />
        <Tooltip 
  content={<CustomTooltip />}
  cursor={{ fill: '#f8fafc', radius: [6, 6, 0, 0] }} // Subtle hover background for the bar area
/>
       <Bar 
  dataKey="total_tickets" 
  name="Tickets Handled"
  fill="url(#barGradient)" 
  radius={[6, 6, 0, 0]} 
  barSize={30}
  // This adds a subtle glow on hover
  activeBar={{ 
    fill: '#4f46e5', 
    filter: 'drop-shadow(0px 4px 8px rgba(99, 102, 241, 0.4))' 
  }}
/>
      </BarChart>
    </ResponsiveContainer>
  </div>
</section>




              {/* <section style={styles.card}>
                <div style={styles.cardHeader}><h6 style={styles.cardTitle}>Analyst Performance</h6></div>
                <div style={styles.tableScroll}>
                  <table style={styles.table}>
                    <thead><tr><th style={styles.th}>Analyst</th><th style={styles.th}>Total</th><th style={styles.th}>Avg Score</th><th style={styles.th}>Pass %</th></tr></thead>
                    <tbody>
                      {agentsList.map((a, i) => (
                        <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
                          <td style={styles.td}><div style={styles.avatarRow}><div style={styles.miniAvatarIcon}>{a.agent.charAt(0).toUpperCase()}</div><span>{formatName(a.agent)}</span></div></td>
                          <td style={styles.td}>{a.total_tickets}</td>
                          <td style={styles.td}>{a.average_score?.toFixed(1) || 0}</td>
                          <td style={styles.td}>{a.pass_percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section> */}

              <section style={{ 
    ...styles.card, 
    flex: 1, 
    minHeight: 0, // Critical for internal scrolling
    display: 'flex', 
    flexDirection: 'column' 
  }}>
    <div style={styles.cardHeader}>
      <h6 style={styles.cardTitle}>Analyst Performance Directory</h6>
      <span style={styles.pill}>{agentsList.length} Active</span>
    </div>
    <div style={{ ...styles.tableScroll, flex: 1, overflowY: 'auto' }}>
      <table style={styles.table}>
        <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
          <tr>
            <th style={styles.th}>Analyst</th>
            <th style={styles.th}>Tickets</th>
            <th style={styles.th}>Avg Score</th>
            <th style={styles.th}>Quality Rate</th>
          </tr>
        </thead>
        <tbody>
          {agentsList.map((a, i) => (
            <tr key={i} style={styles.tr} onClick={() => handleAnalystClick(a)}>
              <td style={styles.td}>
                <div style={styles.avatarRow}>
                  <div style={styles.miniAvatarIcon}>{a.agent.charAt(0).toUpperCase()}</div>
                  <span>{formatName(a.agent)}</span>
                </div>
              </td>
              <td style={styles.td}>{a.total_tickets}</td>
              <td style={styles.td}>⭐ {a.average_score?.toFixed(1) || 0}</td>
              <td style={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '10px', minWidth: '60px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${a.pass_percentage}%`, background: '#6366f1', borderRadius: '10px' }}></div>
                  </div>
                  <span style={{ fontWeight: '800', width: '35px' }}>{a.pass_percentage}%</span>
                </div>
              </td>
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
                <button onClick={() => setViewMode('list')} style={styles.backBtn}><i className="bi bi-arrow-left"></i> Back</button>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800' }}>{formatName(selectedAgentData?.agent)} Tickets</h3>
              </div>
              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Incident No</th><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Phase</th></tr></thead>
                  <tbody>
                    {agentTickets.map((t, idx) => (
                      <tr key={idx} style={styles.tr} onClick={() => openIncidentModal(t)}>
                        <td style={{ ...styles.td, color: '#6366f1' }}>{t.incident_number}</td>
                        <td style={styles.td}>{t.short_description}</td>
                        <td style={styles.td}><span style={styles.miniBadgeGray}>{t.status}</span></td>
                        <td style={styles.td}><span style={styles.miniBadgeGray}>{qaState.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.paginationArea}>
                  <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
                  <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} style={styles.pagBtn}>Next</button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'pending' && (
            <section style={styles.card}>
              <div style={styles.cardHeader}><h6 style={styles.cardTitle}>My Pending Queue</h6><span style={styles.pill}>{totalPending} Records</span></div>
              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Incident No</th><th style={styles.th}>Description</th><th style={styles.th}>Status</th><th style={styles.th}>Resolution</th></tr></thead>
                  <tbody>
                    {pendingIncidents.map((incident, i) => (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={{ color: '#6366f1' }} onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: incident, fromPending: true } })}>
                            {incident.incident_number}
                          </span>
                        </td>
                        <td style={styles.td}>{incident.short_description}</td>
 <td style={styles.td}>
  <span style={{
    ...styles.compactBadge,
    ...(incident.status === 'resolved' ? styles.bgResolved : 
        incident.status === 'escalated' ? styles.bgEscalated : 
        styles.bgDefault)
  }}>
    <i className="bi bi-circle-fill" style={{ fontSize: '5px', marginRight: '5px' }}></i>
    {incident.status}
  </span>
</td>
                        <td style={styles.td}>{incident.resolution_shared || "---"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.paginationArea}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={styles.pagBtn}>Prev</button>
                  <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={styles.pagBtn}>Next</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {isModalOpen && selectedIncident && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeaderPremium}>
              <h2 style={styles.modalTitleText}>{selectedIncident.incident_number}</h2>
              <button style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}} onClick={() => setIsModalOpen(false)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div style={styles.modalBodyScroll}>
              <div style={styles.agentInfoCard}>
                <div style={styles.miniAvatarIcon}>{selectedIncident.display_name.charAt(0).toUpperCase()}</div>
                <div><div style={{fontSize:'10px', color:'#94a3b8'}}>ACTIONED BY</div><div style={{fontWeight:'800'}}>{formatName(selectedIncident.display_name)}</div></div>
              </div>
              <div style={styles.premiumDataGrid}>
                <div style={{ gridColumn: '1 / span 2' }}><label style={styles.premiumLabel}>Description</label><div style={{fontSize:'12px', fontWeight:'600'}}>{selectedIncident.short_description}</div></div>
                <div><label style={styles.premiumLabel}>Status</label><div style={styles.pill}>{selectedIncident.status?.toUpperCase()}</div></div>
                <div style={{ gridColumn: '1 / span 2' }}><label style={styles.premiumLabel}>Resolution Notes</label><div style={styles.resolutionQuoteBox}>{selectedIncident.resolution_shared || "No details provided."}</div></div>
              </div>
            </div>
            <div style={styles.modalFooterPremium}><button style={styles.doneBtn} onClick={() => setIsModalOpen(false)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f4f7fa', height: '100vh', overflow: 'hidden', padding: '12px 20px', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Inter', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', flexShrink: 0 },
  titleArea: { display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' },
  tabGroup: { background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex' },
  activeTab: { padding: '5px 12px', background: '#fff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' },
  inactiveTab: { padding: '5px 12px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px' },
  filterStrip: { display: 'flex', gap: '8px' },
  // mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', height: '100%', minHeight: 0 },
  // Change this in your styles object
mainGrid: { 
  display: 'grid', 
  gridTemplateColumns: '0.80fr 1fr', // Increased the first fraction for the chart
  gap: '12px', 
  height: '100%', 
  minHeight: 0 
},
  fullView: { display: 'block', height: '100%' },
  bannerContainer: { display: 'flex', gap: '12px', marginBottom: '12px', flexShrink: 0 },
  statBox: { flex: 1, background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' },
  iconCircle: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  statInfo: { display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: '8.5px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  statValue: { fontSize: '16px', fontWeight: '800', color: '#1e293b' },
  card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
  cardHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px', position: 'relative' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' },
  td: { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f8fafc', fontWeight: '600' },
  tr: { cursor: 'pointer', ':hover': { backgroundColor: '#f8fafc' } },
  detailHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px' },
  backBtn: { border: 'none', background: '#f1f5f9', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  dropdownContainer: { position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px' },
  premiumLabel: { fontSize: '8px', fontWeight: '800', color: '#6366f1 ', textTransform: 'uppercase' },
  premiumButton: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  selectedText: { fontSize: '11px', fontWeight: '700', color: '#1e293b' },
  customMenu: { position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 100, minWidth: '150px' },
  menuItem: { padding: '10px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  premiumDateInput: {
  padding: '4px 8px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '12px',
  fontWeight: '700',
  color:'#1e293b',
  outline: 'none',
  height: '31px', // Matches your buttons
  cursor: 'pointer'
},
  resetBtn: { background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' },
  paginationArea: { padding: '10px', display: 'flex', justifyContent: 'center', gap: '15px' },
  pagBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '6px', fontSize: '11px' },
  shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  miniBadgeRed: { padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '700', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' },
  miniBadgeGray: { padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '700', backgroundColor: '#f1f5f9', color: '#64748b' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { width: '550px', background: '#fff', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' },
  modalHeaderPremium: { background: '#1e293b', padding: '25px 30px', display: 'flex', justifyContent: 'space-between' },
  modalTitleText: { color: '#fff', margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800' },
  modalBodyScroll: { padding: '20px 0', overflowY: 'auto' },
  agentInfoCard: { margin: '0 30px 25px 30px', padding: '15px 20px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px' },
  premiumDataGrid: { padding: '0 30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  pill: { background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  miniAvatarIcon: { width: '28px', height: '28px', borderRadius: '8px', background: '#eef2ff', color: '#6366f1', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e7ff' },
  resolutionQuoteBox: { background: '#f1f5f9', padding: '15px', borderRadius: '12px', fontSize: '12px', fontStyle: 'italic', borderLeft: '4px solid #6366f1' },
  modalFooterPremium: { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' },
  doneBtn: { background: '#1e293b', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

  noDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
  noDataIcon: {
    fontSize: '50px',
    color: '#10b981', // Green suggests a positive status
    marginBottom: '15px',
    opacity: 0.6
  },
  noDataText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 5px 0'
  },
  noDataSubtext: {
    fontSize: '13px',
    color: '#64748b',
    maxWidth: '300px',
    lineHeight: '1.5'
  },
  statusBadgeBase: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
   compactBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',      // Slimmer padding
    borderRadius: '4px',     // Modern subtle curve instead of a pill
    fontSize: '10px',        // Smaller, cleaner text
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },

  // Resolved - Success Green
  bgResolved: {
    backgroundColor: '#dcfce7', // Light mint
    color: '#15803d',           // Forest green
    border: '1px solid #bbf7d0',
  },

  // Escalated - Urgent Red
  bgEscalated: {
    backgroundColor: '#fee2e2', // Light rose
    color: '#b91c1c',           // Deep red
    border: '1px solid #fecaca',
  },

  // In Progress / Others - Neutral Blue/Gray
  bgDefault: {
    backgroundColor: '#f1f5f9', 
    color: '#475569',
    border: '1px solid #e2e8f0',
  },
};

export default AllusersDashboard;