


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


// current working code

// import React, { useState, useEffect } from 'react';

// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Cell, ResponsiveContainer, Tooltip, Legend
// } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from 'react-router-dom';
// import '../pages/AlluserDashboard.css';

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
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   // SLA View (Team View only - Full Screen)
//   const [showGlobalSla, setShowGlobalSla] = useState(false);
//   const [globalSlaData, setGlobalSlaData] = useState([]);
//   const [globalSlaTotal, setGlobalSlaTotal] = useState(0);
//   const [globalSlaPage, setGlobalSlaPage] = useState(1);

//   // My Pending Tab
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

//   // Analyst Detail View
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
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [timeframe, setTimeframe] = useState('overall');

//   const statusOptions = [
//     { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
//     { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated', label: 'Escalated', color: '#b20f2a', icon: 'bi-fire' },
//     { id: 'in progress', label: 'In Progress', color: '#52be00', icon: 'bi-clock-history' },

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

//   const openIncidentModal = (incident) => {
//     const agentName = selectedAgentData?.agent || incident.done_by || "System Processed";
//     setSelectedIncident({ ...incident, display_name: agentName });
//     setIsModalOpen(true);
//   };

//   const fetchGlobalSlaBreaches = async (page = 1) => {
//     setLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const currentSid = user?.sid || user?.user_sid;
//       const res = await api.post('/users/get/sla-breached/incidents',
//         { user_sid: currentSid, page: page, per_page: 10 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setGlobalSlaData(res.data.response || []);
//       setGlobalSlaTotal(res.data.total || 0);
//     } catch (err) { console.error(err); } finally { setLoading(false); }
//   };

//   useEffect(() => { if (showGlobalSla && activeTab === 'team') fetchGlobalSlaBreaches(globalSlaPage); }, [showGlobalSla, globalSlaPage, activeTab]);

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
//       } catch (err) { console.error(err); } finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, viewMode, user]);

//   const getStatusStyle = (status) => {
//     const s = status?.toLowerCase();
//     switch (s) {
//       case 'resolved':
//         return { backgroundColor: '#e26d24', color: '#ffffff', border: '1px solid #bbf7d0' };
//       case 'escalated':
//         return { backgroundColor: '#e65b5b', color: '#ffffff', border: '1px solid #fecaca' };
//       case 'in progress':
//         return { backgroundColor: '#fef9c3', color: '#a16207', border: '1px solid #fef08a' };
//       default:
//         return { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
//     }
//   };

//   useEffect(() => {
//     const fetchMyPending = async () => {
//       if (activeTab !== 'pending') return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");

//         // 1. Keep only essential identifiers in the body
//         const payload = {
//           user_sid: user?.sid || user?.user_sid,
//           page: currentPage,
//           per_page: perPage,
//         };

//         // 2. Move filters to the 'params' object so they appear in the URL
//         const res = await api.post('/users/get-pending/incidents/all',
//           payload,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             params: {
//               resolution_status: statusFilter || undefined,
//               qa_state: pendingQaState,
//               // ADD THESE TWO LINES BELOW:
//               from_date: pendingFromDate || undefined,
//               to_date: pendingToDate || undefined
//             }
//           }
//         );

//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setPendingIncidents([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMyPending();
//   }, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, user]);

//   const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
//     setDetailLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
//       if (foundUser) {
//         const res = await api.post('/users/get-pending/incidents/all',
//           { user_sid: foundUser.sid, page: pageNum, per_page: 10, from_date: detailFromDate || undefined, to_date: detailToDate || undefined },
//           { headers: { Authorization: `Bearer ${token}` }, params: { qa_state: qaState } }
//         );
//         setAgentTickets(res.data.response || []);
//         setTotalDetailTickets(res.data.total || 0);
//       }
//     } catch (err) { console.error(err); setAgentTickets([]); } finally { setDetailLoading(false); }
//   };

//   useEffect(() => { if (viewMode === 'detail' && selectedAgentData) fetchAnalystDetails(selectedAgentData, detailPage); }, [detailPage, detailFromDate, detailToDate, qaState]);

//   const handleAnalystClick = (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail');
//     setDetailPage(1);
//     fetchAnalystDetails(agentStat, 1);
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];
//   const chartData = [{ name: 'Passed', value: summary.passed, color: '#10b981' }, { name: 'Failed', value: summary.failed, color: '#f43f5e' }, { name: 'Pending', value: summary.pending, color: '#f59e0b' }].filter(d => d.value > 0);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           backdropFilter: 'blur(8px)',
//           padding: '12px 16px',
//           border: '1px solid #e2e8f0',
//           borderRadius: '12px',
//           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '4px'
//         }}>
//           <p style={{
//             margin: 0,
//             fontSize: '10px',
//             fontWeight: '800',
//             color: '#94a3b8',
//             textTransform: 'uppercase',
//             letterSpacing: '0.05em'
//           }}>
//             Analyst
//           </p>
//           <p style={{
//             margin: 0,
//             fontSize: '14px',
//             fontWeight: '700',
//             color: '#1e293b'
//           }}>
//             {label}
//           </p>
//           <div style={{
//             marginTop: '8px',
//             paddingTop: '8px',
//             borderTop: '1px solid #f1f5f9',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px'
//           }}>
//             <div style={{
//               width: '8px',
//               height: '8px',
//               borderRadius: '50%',
//               backgroundColor: '#6366f1'
//             }} />
//             <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>
//               {payload[0].value} Tickets Handled
//             </span>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div style={styles.container}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
//       {(loading || detailLoading) && <div style={styles.shimmerOverlay}><div style={styles.spinner}></div></div>}

//       <header style={styles.header}>
//         <div style={styles.titleArea}>
//           <h2 style={styles.logo}>Ticket<span style={{ color: '#6366f1' }}>Metrics</span></h2>
//           <div style={styles.tabGroup}>
//             <button onClick={() => { setActiveTab('team'); setViewMode('list'); setShowGlobalSla(false); }} style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>Team View</button>
//             <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.inactiveTab}>My Pending</button>
//           </div>
//         </div>

//         <div style={styles.filterStrip}>
//           {activeTab === 'team' && viewMode === 'detail' && (

//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               {/* Audit Phase Dropdown */}
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

//               {/* From Date Label & Input */}
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>From Date</label>
//                 <input
//                   type="date"
//                   style={styles.premiumDateInput}
//                   value={detailFromDate}
//                   onChange={(e) => setDetailFromDate(e.target.value)}
//                 />
//               </div>

//               {/* To Date Label & Input */}
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>To Date</label>
//                 <input
//                   type="date"
//                   style={styles.premiumDateInput}
//                   value={detailToDate}
//                   onChange={(e) => setDetailToDate(e.target.value)}
//                 />
//               </div>

//               {/* Reset Button with Label */}
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>Reset</label>
//                 <button
//                   onClick={resetDetailDates}
//                   style={{ ...styles.resetBtn, height: '32px' }} // Adjusted height to match inputs
//                 >
//                   <i className="bi bi-arrow-counterclockwise"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'pending' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               {/* QA Status Dropdown */}
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

//               {/* Incident State Dropdown */}
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

//               {/* From Date */}
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>From Date</label>
//                 <input
//                   type="date"
//                   style={styles.premiumDateInput}
//                   value={pendingFromDate}
//                   onChange={(e) => setPendingFromDate(e.target.value)}
//                 />
//               </div>

//               {/* To Date */}
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>To Date</label>
//                 <input
//                   type="date"
//                   style={styles.premiumDateInput}
//                   value={pendingToDate}
//                   onChange={(e) => setPendingToDate(e.target.value)}
//                 />
//               </div>

//               {/* Reset Button */}
//               <div style={styles.dropdownContainer}>
//                 <label style={styles.premiumLabel}>Reset</label>
//                 <button onClick={resetPendingDates} style={{ ...styles.resetBtn, height: '31px' }}>
//                   <i className="bi bi-arrow-counterclockwise"></i>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>

//       <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
//         {activeTab === 'team' && (
//           <div style={styles.bannerContainer}>
//             <div onClick={() => setShowGlobalSla(false)} style={{ ...styles.statBox, cursor: 'pointer', border: !showGlobalSla && viewMode === 'list' ? '1px solid #6366f1' : '1px solid #f1f5f9' }}>
//               <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-ticket-perforated-fill"></i></div>
//               <div style={styles.statInfo}><span style={styles.statLabel}>Total Tickets</span><span style={styles.statValue}>{viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}</span></div>
//             </div>
//             <div style={styles.statBox}>
//               <div style={{ ...styles.iconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className="bi bi-shield-check"></i></div>
//               <div style={styles.statInfo}><span style={styles.statLabel}>Passed / Audited</span><span style={{ ...styles.statValue, color: '#10b981' }}>{viewMode === 'list' ? summary.passed : selectedAgentData?.passed}</span></div>
//             </div>

//             {/* SLA / AVG SCORE BOX */}
//             {viewMode === 'list' ? (
//               <div onClick={() => setShowGlobalSla(true)} style={{ ...styles.statBox, cursor: 'pointer', border: showGlobalSla ? '1px solid #ef4444' : '1px solid #f1f5f9' }}>
//                 <div style={{ ...styles.iconCircle, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><i className="bi bi-exclamation-octagon-fill"></i></div>
//                 <div style={styles.statInfo}><span style={styles.statLabel}>Team Health</span><span style={{ ...styles.statValue, color: '#ef4444' }}>BREACHED SLA</span></div>
//               </div>
//             ) : (
//               <div style={styles.statBox}>
//                 <div style={{ ...styles.iconCircle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="bi bi-stars"></i></div>
//                 <div style={styles.statInfo}><span style={styles.statLabel}>Avg Score</span><span style={{ ...styles.statValue, color: '#6366f1' }}>{selectedAgentData?.average_score?.toFixed(1) || 0}</span></div>
//               </div>
//             )}

//             <div style={styles.statBox}>
//               <div style={{ ...styles.iconCircle, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><i className="bi bi-graph-up-arrow"></i></div>
//               <div style={styles.statInfo}><span style={styles.statLabel}>Quality Rate</span><span style={{ ...styles.statValue, color: '#f59e0b' }}>{viewMode === 'list' ? `${summary.pass_percentage}%` : `${selectedAgentData?.pass_percentage || 0}%`}</span></div>
//             </div>
//           </div>
//         )}

//         <div style={activeTab === 'pending' || viewMode === 'detail' || (activeTab === 'team' && showGlobalSla) ? styles.fullView : styles.mainGrid}>

//           {/* FULL SCREEN SLA VIEW */}
//           {activeTab === 'team' && viewMode === 'list' && showGlobalSla && (
//             <section style={styles.card}>
//               <div style={styles.cardHeader}>
//                 <h6 style={styles.cardTitle}>Global SLA Breaches</h6>
//                 <button onClick={() => setShowGlobalSla(false)} style={styles.backBtn}>
//                   <i className="bi bi-arrow-left"></i> Back to Chart
//                 </button>
//               </div>
//               <div style={styles.tableScroll}>
//                 {/* Check if there is data */}
//                 {globalSlaData.length > 0 ? (
//                   <>
//                     <table style={styles.table}>
//                       <thead>
//                         <tr>
//                           <th style={styles.th}>Incident No</th>
//                           <th style={styles.th}>Actioned By</th>
//                           <th style={styles.th}>Description</th>
//                           <th style={styles.th}>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {globalSlaData.map((item, i) => (
//                           <tr key={i} style={styles.tr}>
//                             <td style={{ ...styles.td, color: '#6366f1' }}>{item.incident_number}</td>
//                             <td style={styles.td}>{formatName(item.done_by)}</td>
//                             <td style={styles.td}>{item.short_description}</td>
//                             <td style={styles.td}><span style={styles.miniBadgeRed}>SLA BREACHED</span></td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                     {/* Your existing pagination keeps its place here */}
//                     <div style={styles.paginationArea}>
//                       <button
//                         disabled={globalSlaPage === 1}
//                         onClick={() => setGlobalSlaPage(p => p - 1)}
//                         style={styles.pagBtn}
//                       >
//                         Prev
//                       </button>
//                       <button
//                         disabled={globalSlaPage >= Math.ceil(globalSlaTotal / 10)}
//                         onClick={() => setGlobalSlaPage(p => p + 1)}
//                         style={styles.pagBtn}
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   /* The "No Data" message shown when globalSlaData is empty */
//                   <div style={styles.noDataContainer}>
//                     <i className="bi bi-patch-check" style={styles.noDataIcon}></i>
//                     <p style={styles.noDataText}>No SLA breaches found</p>
//                     <span style={styles.noDataSubtext}>All incidents are currently within their service level targets.</span>
//                   </div>
//                 )}
//               </div>
//             </section>
//           )}

//           {/* NORMAL TEAM LIST VIEW */}
//           {activeTab === 'team' && viewMode === 'list' && !showGlobalSla && (
//             <>





//               {/* --- BAR CHART SHOWING USER HANDLED TICKETS --- */}
//               <section style={styles.card}>
//                 <div style={styles.cardHeader}>
//                   <h6 style={styles.cardTitle}>Tickets Handled by User</h6>
//                   <span style={styles.pill}>Volume View</span>
//                 </div>
//                 <div style={{ ...styles.tableScroll, padding: '10px' }}>
//                   <ResponsiveContainer width="100%" height={250}>
//                     <BarChart
//                       data={agentsList}
//                       margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
//                     >
//                       <defs>
//                         <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
//                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3} />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                       <XAxis
//                         dataKey="agent"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
//                         interval={0}
//                         angle={-25}      // Keeps names from overlapping
//                         textAnchor="end" // Aligns slanted text
//                         // This line fixes the capitalization:
//                         tickFormatter={(name) => formatName(name.split(' ')[0])}
//                       />
//                       <YAxis
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
//                       />
//                       <Tooltip
//                         content={<CustomTooltip />}
//                         cursor={{ fill: '#f8fafc', radius: [6, 6, 0, 0] }} // Subtle hover background for the bar area
//                       />
//                       <Bar
//                         dataKey="total_tickets"
//                         name="Tickets Handled"
//                         fill="url(#barGradient)"
//                         radius={[6, 6, 0, 0]}
//                         barSize={30}
//                         // This adds a subtle glow on hover
//                         activeBar={{
//                           fill: '#4f46e5',
//                           filter: 'drop-shadow(0px 4px 8px rgba(99, 102, 241, 0.4))'
//                         }}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </section>






//               <section style={{
//                 ...styles.card,
//                 flex: 1,
//                 minHeight: 0, // Critical for internal scrolling
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}>
//                 <div style={styles.cardHeader}>
//                   <h6 style={styles.cardTitle}>Analyst Performance Directory</h6>
//                   <span style={styles.pill}>{agentsList.length} Active</span>
//                 </div>
//                 <div style={{ ...styles.tableScroll, flex: 1, overflowY: 'auto' }}>
//                   <table style={styles.table} className="align-middle mb-0 refined-table compact-view">
//                     <thead style={{ top: 0, background: '#f8fafc', zIndex: 10 }}>
//                       <tr>
//                         {/* Adjusted padding in header to match slim rows */}
//                         <th style={{ ...styles.th, padding: '8px 16px' }} className="small-header ps-4">ANALYST</th>
//                         <th style={{ ...styles.th, padding: '8px 16px' }} className="small-header">TICKETS</th>
//                         <th style={{ ...styles.th, padding: '8px 16px' }} className="small-header">AVG SCORE</th>
//                         <th style={{ ...styles.th, padding: '8px 16px' }} className="small-header pe-4">QUALITY RATE</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {agentsList.map((a, i) => (
//                         <tr
//                           key={i}
//                           style={{ ...styles.tr, cursor: 'pointer' }}
//                           className="density-row"
//                           onClick={() => handleAnalystClick(a)}
//                         >
//                           {/* Using 4px or 6px padding for a "tight" look */}
//                           <td style={{ ...styles.td, padding: '4px 16px' }} className="ps-4">
//                             <div style={{ ...styles.avatarRow, margin: '0' }}>
//                               <div style={{
//                                 ...styles.miniAvatarIcon,
//                                 width: '24px',
//                                 height: '24px',
//                                 fontSize: '10px',
//                                 fontWeight: 'bolder'
//                               }} className="bg-light-primary text-primary">
//                                 {a.agent ? a.agent.charAt(0).toUpperCase() : 'A'}
//                               </div>
//                               <span className="fw-medium text-dark" style={{ fontSize: '12px' }}>
//                                 {formatName(a.agent)}
//                               </span>
//                             </div>
//                           </td>

//                           <td style={{ ...styles.td, padding: '4px 16px' }} className="fw-bold">
//                             <div className="incident-link-slim" style={{ fontSize: '12px' }}>
//                               <span className="text-muted fw-normal me-1">#</span>
//                               <span className="link-text" style={{ color: '#6366f1' }}>{a.total_tickets || 0}</span>
//                             </div>
//                           </td>

//                           <td style={{ ...styles.td, padding: '4px 16px' }}>
//                             <span style={{ fontSize: '12px', color: '#475569' }}>
//                               ⭐ {a.average_score?.toFixed(1) || "0.0"}
//                             </span>
//                           </td>

//                           <td style={{ ...styles.td, padding: '4px 16px' }} className="pe-4">
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                               <div style={{ flex: 1, height: '4px', background: '#f1f5f9', borderRadius: '10px', minWidth: '60px', overflow: 'hidden' }}>
//                                 <div
//                                   style={{
//                                     height: '100%',
//                                     width: `${a.pass_percentage || 0}%`,
//                                     background: '#6366f1',
//                                     borderRadius: '10px'
//                                   }}
//                                 />
//                               </div>
//                               <span style={{ fontWeight: '700', width: '30px', fontSize: '10px', color: '#475569' }}>
//                                 {a.pass_percentage || 0}%
//                               </span>
//                             </div>
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
//             <section style={styles.card}>
//               <div style={styles.detailHeader}>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '6px',
//                     padding: '5px 12px',
//                     borderRadius: '6px',
//                     border: '1px solid #e2e8f0',
//                     background: '#fff',
//                     color: '#475569',
//                     fontSize: '11px',
//                     fontWeight: '700',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
//                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//                 >
//                   <i className="bi bi-arrow-left"></i> BACK
//                 </button>
//                 <div style={{ textAlign: 'right' }}>

//                   <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
//                     {formatName(selectedAgentData?.agent)} <span style={{ color: '#6366f1' }}>Tickets</span>
//                   </h3>
//                 </div>
//               </div>
//               <div style={styles.tableScroll}>

//                 <table style={styles.table}>
//                   <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10 }}>
//                     <tr>
//                       <th style={styles.th}>Incident No</th>
//                       <th style={styles.th}>Description</th>
//                       <th style={styles.th}>Status</th>
//                       <th style={styles.th}>Phase</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {agentTickets.map((t, idx) => (
//                       <tr key={idx} style={styles.tr} onClick={() => openIncidentModal(t)}>
//                         {/* <td style={{ ...styles.td, color: '#6366f1', fontWeight: '600' }}>{t.incident_number}</td> */}
//                         <td
//                           style={{
//                             ...styles.td,
//                             color: '#6366f1',
//                             cursor: 'pointer',
//                             textDecoration: hoveredIndex === t ? 'underline' : 'none' // Use the index 'i' from map
//                           }}
//                           onMouseEnter={() => setHoveredIndex(t)}
//                           onMouseLeave={() => setHoveredIndex(null)}
//                         >
//                           # {t.incident_number}
//                         </td>
//                         <td style={{
//                           maxWidth: '280px',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap',
//                           fontSize: '11px',
//                           color: '#475569'
//                         }}>{t.short_description}</td>
//                         <td style={styles.td}>
//                           <span style={{
//                             ...styles.miniBadgeGray,
//                             ...getStatusStyle(t.status),
//                             padding: '2px 8px',
//                             borderRadius: '50px',
//                             fontSize: '9px',
//                             fontWeight: '600',
//                             textTransform: 'uppercase'
//                           }}>
//                             {t.status}
//                           </span>
//                         </td>
//                         <td style={styles.td}>
//                           <span style={{
//                             ...styles.premiumPill,
//                             backgroundColor: selectedQaDetail.color + '15',
//                             color: selectedQaDetail.color
//                           }}>
//                             {qaState.toUpperCase()}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <div style={styles.paginationArea}>
//                   <button
//                     disabled={detailPage === 1}
//                     onClick={() => setDetailPage(p => p - 1)}
//                     style={{
//                       ...styles.pagBtn,
//                       ...(detailPage === 1 ? styles.pagBtnDisabled : {})
//                     }}
//                   >
//                     <i className="bi bi-chevron-left"></i> Previous
//                   </button>

//                   <div style={styles.pageIndicator}>
//                     Page <span style={styles.pageNumber}>{detailPage}</span>
//                     of {Math.ceil((totalDetailTickets || 0) / 10) || 1}
//                   </div>

//                   <button
//                     disabled={detailPage >= Math.ceil(totalDetailTickets / 10)}
//                     onClick={() => setDetailPage(p => p + 1)}
//                     style={{
//                       ...styles.pagBtn,
//                       ...(detailPage >= Math.ceil(totalDetailTickets / 10) ? styles.pagBtnDisabled : {})
//                     }}
//                   >
//                     Next <i className="bi bi-chevron-right"></i>
//                   </button>
//                 </div>
//               </div>
//             </section>
//           )}

//           {activeTab === 'pending' && (
//             <section style={styles.card}>
//               <div style={styles.cardHeader}>
//                 <h6 style={styles.cardTitle}>My Pending Queue</h6>
//                 <span style={styles.pill}>{totalPending} Records</span>
//               </div>

//               <div style={styles.tableScroll}>
//                 {/* Check if there is data in the pending list */}
//                 {pendingIncidents.length > 0 ? (
//                   <>
//                     <table style={styles.table}>
//                       <thead>
//                         <tr>
//                           <th style={styles.th}>Incident No</th>
//                           <th style={styles.th}>Description</th>
//                           <th style={styles.th}>Status</th>
//                           <th style={styles.th}>Resolution</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {pendingIncidents.map((incident, i) => (
//                           <tr key={i} style={styles.tr}>

//                             <td
//                               style={{
//                                 ...styles.td,
//                                 color: '#6366f1',
//                                 cursor: 'pointer',

//                                 textDecoration: hoveredIndex === incident ? 'underline' : 'none' // Use the index 'i' from map
//                               }}
//                               onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: incident, fromPending: true } })}

//                               onMouseEnter={() => setHoveredIndex(incident)}
//                               onMouseLeave={() => setHoveredIndex(null)}
//                             >
//                               # {incident.incident_number}
//                             </td>

//                             <td style={{ ...styles, padding: '4px 16px' }}>
//                               <div style={{
//                                 maxWidth: '280px',
//                                 overflow: 'hidden',
//                                 textOverflow: 'ellipsis',
//                                 whiteSpace: 'nowrap',
//                                 fontSize: '11px',
//                                 color: '#475569'
//                               }}>
//                                 {incident.short_description || "No description provided"}
//                               </div>
//                             </td>
//                             <td style={styles.td}>
//                               <span style={{
//                                 ...styles.premiumPill,
//                                 ...(incident.status === 'resolved' ? styles.pillResolved :
//                                   incident.status === 'escalated' ? styles.pillEscalated :
//                                     styles.pillDefault)
//                               }}>
//                                 <i className="bi bi-circle-fill" style={{ fontSize: '4px', marginRight: '6px' }}></i>
//                                 {incident.status}
//                               </span>
//                             </td>
//                             <td style={styles.td}>{incident.resolution_shared || "---"}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                     <div style={styles.paginationArea}>
//                       <button
//                         disabled={detailPage === 1}
//                         onClick={() => setDetailPage(p => p - 1)}
//                         style={{
//                           ...styles.pagBtn,
//                           ...(detailPage === 1 ? styles.pagBtnDisabled : {})
//                         }}
//                       >
//                         <i className="bi bi-chevron-left"></i> Previous
//                       </button>

//                       <div style={styles.pageIndicator}>
//                         Page <span style={styles.pageNumber}>{detailPage}</span>
//                         of {Math.ceil((totalDetailTickets || 0) / 10) || 1}
//                       </div>

//                       <button
//                         disabled={detailPage >= Math.ceil(totalDetailTickets / 10)}
//                         onClick={() => setDetailPage(p => p + 1)}
//                         style={{
//                           ...styles.pagBtn,
//                           ...(detailPage >= Math.ceil(totalDetailTickets / 10) ? styles.pagBtnDisabled : {})
//                         }}
//                       >
//                         Next <i className="bi bi-chevron-right"></i>
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   /* This is shown when pendingIncidents is empty */
//                   <div style={styles.noDataContainer}>
//                     <i className="bi bi-inbox" style={styles.noDataIcon}></i>
//                     <p style={styles.noDataText}>No records found</p>
//                     <span style={styles.noDataSubtext}>
//                       There are no incidents matching the "{selectedQaPending.label}" status for the selected criteria.
//                     </span>
//                   </div>
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
//               <h2 style={styles.modalTitleText}>{selectedIncident.incident_number}</h2>
//               <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}><i className="bi bi-x-lg"></i></button>
//             </div>
//             <div style={styles.modalBodyScroll}>
//               <div style={styles.agentInfoCard}>
//                 <div style={styles.miniAvatarIcon}>{selectedIncident.display_name.charAt(0).toUpperCase()}</div>
//                 <div><div style={{ fontSize: '10px', color: '#94a3b8' }}>ACTIONED BY</div><div style={{ fontWeight: '800' }}>{formatName(selectedIncident.display_name)}</div></div>
//               </div>
//               <div style={styles.premiumDataGrid}>
//                 <div style={{ gridColumn: '1 / span 2' }}><label style={styles.premiumLabel}>Description</label><div style={{ fontSize: '12px', fontWeight: '600' }}>{selectedIncident.short_description}</div></div>
//                 <div><label style={styles.premiumLabel}>Status</label><div style={styles.pill}>{selectedIncident.status?.toUpperCase()}</div></div>
//                 <div style={{ gridColumn: '1 / span 2' }}><label style={styles.premiumLabel}>Resolution Notes</label><div style={styles.resolutionQuoteBox}>{selectedIncident.resolution_shared || "No details provided."}</div></div>
//               </div>
//             </div>
//             <div style={styles.modalFooterPremium}><button style={styles.doneBtn} onClick={() => setIsModalOpen(false)}>Close</button></div>
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
//   // mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '12px', height: '100%', minHeight: 0 },
//   // Change this in your styles object
//   mainGrid: {
//     display: 'grid',
//     gridTemplateColumns: '0.80fr 1fr', // Increased the first fraction for the chart
//     gap: '12px',
//     height: '100%',
//     minHeight: 0
//   },
//   fullView: { display: 'block', height: '100%' },
//   bannerContainer: { display: 'flex', gap: '12px', marginBottom: '12px', flexShrink: 0 },
//   statBox: { flex: 1, background: '#fff', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' },
//   iconCircle: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
//   statInfo: { display: 'flex', flexDirection: 'column' },
//   statLabel: { fontSize: '8.5px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
//   statValue: { fontSize: '16px', fontWeight: '800', color: '#1e293b' },
//   card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', height: '100%' },
//   cardHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   cardTitle: { margin: 0, fontSize: '13px', fontWeight: '600', color: '#334155' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '6px 14px', position: 'relative' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' },
//   td: { padding: '10px 8px', fontSize: '11px', borderBottom: '1px solid #f8fafc', fontWeight: '600' },
//   tr: { cursor: 'pointer', ':hover': { backgroundColor: '#f8fafc' } },
//   detailHeader: { padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px' },
//   backBtn: { border: 'none', background: '#f1f5f9', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
//   dropdownContainer: { position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px' },
//   premiumLabel: { fontSize: '8px', fontWeight: '800', color: '#6366f1 ', textTransform: 'uppercase' },
//   premiumButton: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
//   statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
//   selectedText: { fontSize: '11px', fontWeight: '700', color: '#1e293b' },
//   customMenu: { position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 100, minWidth: '150px' },
//   menuItem: { padding: '10px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
//   premiumDateInput: {
//     padding: '4px 8px',
//     borderRadius: '6px',
//     border: '1px solid #e2e8f0',
//     fontSize: '12px',
//     fontWeight: '700',
//     color: '#1e293b',
//     outline: 'none',
//     height: '31px', // Matches your buttons
//     cursor: 'pointer'
//   },
//   resetBtn: { background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' },
//   paginationArea: { padding: '10px', display: 'flex', justifyContent: 'center', gap: '15px' },
//   pagBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '6px', fontSize: '11px' },
//   shimmerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
//   spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
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
//   avatarRow: { display: 'flex', alignItems: 'center', gap: '12px' },
//   miniAvatarIcon: { width: '28px', height: '28px', borderRadius: '8px', background: '#eef2ff', color: '#6366f1', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e7ff' },
//   resolutionQuoteBox: { background: '#f1f5f9', padding: '15px', borderRadius: '12px', fontSize: '12px', fontStyle: 'italic', borderLeft: '4px solid #6366f1' },
//   modalFooterPremium: { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' },
//   doneBtn: { background: '#1e293b', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

//   noDataContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '80px 20px',
//     textAlign: 'center',
//   },
//   noDataIcon: {
//     fontSize: '50px',
//     color: '#10b981', // Green suggests a positive status
//     marginBottom: '15px',
//     opacity: 0.6
//   },
//   noDataText: {
//     fontSize: '16px',
//     fontWeight: '700',
//     color: '#1e293b',
//     margin: '0 0 5px 0'
//   },
//   noDataSubtext: {
//     fontSize: '13px',
//     color: '#64748b',
//     maxWidth: '300px',
//     lineHeight: '1.5'
//   },
//   statusBadgeBase: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     padding: '4px 10px',
//     borderRadius: '15px',
//     fontSize: '9px',
//     fontWeight: '700',
//     letterSpacing: '0.3px',
//     textTransform: 'uppercase',
//   },
//   premiumPill: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     padding: '2px 6px',
//     borderRadius: '50px',    // This creates the perfect "Pill" shape
//     fontSize: '8px',         // Small and sharp
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: '0.5px',
//     boxShadow: '0 1px 2px rgba(0,0,0,0.1)', // Subtle depth
//     borderWidth: '1.5px',    // Bit thicker border for "Premium" feel
//     borderStyle: 'solid',
//   },

//   // Deep Forest Green for Resolved
//   pillResolved: {
//     backgroundColor: '#e26d24', // Dark green
//     color: '#ffffff',           // White text for high contrast
//     borderColor: '#1f8b46',     // Slightly lighter border
//   },

//   // Deep Crimson/Ruby for Escalated
//   pillEscalated: {
//     backgroundColor: '#e65b5b', // Dark red
//     color: '#ffffff',           // White text
//     borderColor: '#b91c1c',     // Slightly lighter border
//   },

//   // Slate/Charcoal for others
//   pillDefault: {
//     backgroundColor: '#fef9c3',
//     color: '#a16207',
//     borderColor: '#475569',
//   },
//   paginationArea: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '15px',
//     padding: '20px 0',
//     borderTop: '1px solid #f1f5f9', // Creates a clean separation from the table
//     marginTop: '10px'
//   },
//   pagBtn: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '8px 18px',
//     borderRadius: '12px',
//     border: '1px solid #e2e8f0',
//     background: '#fff',
//     color: '#475569',
//     fontSize: '13px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
//   },
//   pagBtnDisabled: {
//     background: '#f8fafc',
//     color: '#cbd5e1',
//     cursor: 'not-allowed',
//     borderColor: '#f1f5f9',
//     boxShadow: 'none'
//   },
//   pageIndicator: {
//     fontSize: '13px',
//     fontWeight: '700',
//     color: '#64748b',
//   },
//   pageNumber: {
//     color: '#6366f1',
//     background: 'rgba(99, 102, 241, 0.1)',
//     padding: '4px 10px',
//     borderRadius: '8px',
//     margin: '0 4px',
//     display: 'inline-block',
//     minWidth: '28px',
//     textAlign: 'center'
//   },
// };

// export default AllusersDashboard;


// WITHOUT CSS CODE


// import React, { useState, useEffect } from 'react';

// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Cell, ResponsiveContainer, Tooltip, Legend
// } from 'recharts';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from 'react-router-dom';
// import '../pages/AlluserDashboard.css';

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
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   // SLA View (Team View only - Full Screen)
//   const [showGlobalSla, setShowGlobalSla] = useState(false);
//   const [globalSlaData, setGlobalSlaData] = useState([]);
//   const [globalSlaTotal, setGlobalSlaTotal] = useState(0);
//   const [globalSlaPage, setGlobalSlaPage] = useState(1);

//   // My Pending Tab
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

//   // Analyst Detail View
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
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const statusOptions = [
//     { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
//     { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated', label: 'Escalated', color: '#b20f2a', icon: 'bi-fire' },
//     { id: 'in progress', label: 'In Progress', color: '#52be00', icon: 'bi-clock-history' },
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

//   const openIncidentModal = (incident) => {
//     const agentName = selectedAgentData?.agent || incident.done_by || "System Processed";
//     setSelectedIncident({ ...incident, display_name: agentName });
//     setIsModalOpen(true);
//   };

//   const getStatusBadgeClass = (status) => {
//     const s = status?.toLowerCase();
//     if (s === 'resolved') return 'status-badge-resolved';
//     if (s === 'escalated') return 'status-badge-escalated';
//     if (s === 'in progress') return 'status-badge-progress';
//     return 'status-badge-default';
//   };

//   const fetchGlobalSlaBreaches = async (page = 1) => {
//     setLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const currentSid = user?.sid || user?.user_sid;
//       const res = await api.post('/users/get/sla-breached/incidents',
//         { user_sid: currentSid, page: page, per_page: 10 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setGlobalSlaData(res.data.response || []);
//       setGlobalSlaTotal(res.data.total || 0);
//     } catch (err) { console.error(err); } finally { setLoading(false); }
//   };

//   useEffect(() => {
//     if (showGlobalSla && activeTab === 'team') fetchGlobalSlaBreaches(globalSlaPage);
//   }, [showGlobalSla, globalSlaPage, activeTab]);

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
//       } catch (err) { console.error(err); } finally { setLoading(false); }
//     };
//     fetchDashboardData();
//   }, [activeTab, viewMode, user]);

//   useEffect(() => {
//     const fetchMyPending = async () => {
//       if (activeTab !== 'pending') return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const payload = {
//           user_sid: user?.sid || user?.user_sid,
//           page: currentPage,
//           per_page: perPage,
//         };
//         const res = await api.post('/users/get-pending/incidents/all',
//           payload,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             params: {
//               resolution_status: statusFilter || undefined,
//               qa_state: pendingQaState,
//               from_date: pendingFromDate || undefined,
//               to_date: pendingToDate || undefined
//             }
//           }
//         );
//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setPendingIncidents([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMyPending();
//   }, [activeTab, currentPage, statusFilter, pendingQaState, pendingFromDate, pendingToDate, user]);

//   const fetchAnalystDetails = async (agentStat, pageNum = 1) => {
//     setDetailLoading(true);
//     try {
//       const token = user?.token || localStorage.getItem("session_token");
//       const foundUser = userList.find(u => u.full_name.toLowerCase() === agentStat.agent.toLowerCase());
//       if (foundUser) {
//         const res = await api.post('/users/get-pending/incidents/all',
//           { user_sid: foundUser.sid, page: pageNum, per_page: 10, from_date: detailFromDate || undefined, to_date: detailToDate || undefined },
//           { headers: { Authorization: `Bearer ${token}` }, params: { qa_state: qaState } }
//         );
//         setAgentTickets(res.data.response || []);
//         setTotalDetailTickets(res.data.total || 0);
//       }
//     } catch (err) { console.error(err); setAgentTickets([]); } finally { setDetailLoading(false); }
//   };

//   useEffect(() => {
//     if (viewMode === 'detail' && selectedAgentData) fetchAnalystDetails(selectedAgentData, detailPage);
//   }, [detailPage, detailFromDate, detailToDate, qaState]);

//   const handleAnalystClick = (agentStat) => {
//     setSelectedAgentData(agentStat);
//     setViewMode('detail');
//     setDetailPage(1);
//     fetchAnalystDetails(agentStat, 1);
//   };

//   const summary = data?.all_time?.summary || { total_tickets: 0, passed: 0, failed: 0, pending: 0, pass_percentage: 0 };
//   const agentsList = data?.all_time?.agent_performance || [];

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           backdropFilter: 'blur(8px)',
//           padding: '12px 16px',
//           border: '1px solid #e2e8f0',
//           borderRadius: '12px',
//           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '4px'
//         }}>
//           <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analyst</p>
//           <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{label}</p>
//           <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366f1' }} />
//             <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>{payload[0].value} Tickets Handled</span>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="dashboard-container">
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {(loading || detailLoading) && (
//         <div className="shimmer-overlay">
//           <div className="spinner"></div>
//         </div>
//       )}

//       {/* ── HEADER ── */}
//       <header className="dashboard-header">
//         <div className="title-area">
//           <h2 className="logo">Ticket<span>Metrics</span></h2>
//           <div className="tab-group">
//             <button
//               onClick={() => { setActiveTab('team'); setViewMode('list'); setShowGlobalSla(false); }}
//               className={activeTab === 'team' ? 'tab-active' : 'tab-inactive'}
//             >
//               Team View
//             </button>
//             <button
//               onClick={() => setActiveTab('pending')}
//               className={activeTab === 'pending' ? 'tab-active' : 'tab-inactive'}
//             >
//               My Pending
//             </button>
//           </div>
//         </div>

//         <div className="filter-strip">
//           {/* ── Detail view filters ── */}
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               {/* Audit Phase */}
//               <div className="dropdown-container">
//                 <label className="filter-label">Audit Phase</label>
//                 <div className="premium-button" onClick={() => setIsQaOpen(!isQaOpen)}>
//                   <div className="status-dot" style={{ backgroundColor: selectedQaDetail.color }} />
//                   <span className="selected-text">{selectedQaDetail.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isQaOpen && (
//                   <div className="custom-menu">
//                     {qaOptions.map((opt) => (
//                       <div key={opt.id} className="menu-item" onClick={() => { setQaState(opt.id); setDetailPage(1); setIsQaOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* From Date */}
//               <div className="dropdown-container">
//                 <label className="filter-label">From Date</label>
//                 <input type="date" className="date-input" value={detailFromDate} onChange={(e) => setDetailFromDate(e.target.value)} />
//               </div>

//               {/* To Date */}
//               <div className="dropdown-container">
//                 <label className="filter-label">To Date</label>
//                 <input type="date" className="date-input" value={detailToDate} onChange={(e) => setDetailToDate(e.target.value)} />
//               </div>

//               {/* Reset */}
//               <div className="dropdown-container">
//                 <label className="filter-label">Reset</label>
//                 <button onClick={resetDetailDates} className="reset-btn">
//                   <i className="bi bi-arrow-counterclockwise"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ── Pending tab filters ── */}
//           {activeTab === 'pending' && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               {/* QA Status */}
//               <div className="dropdown-container">
//                 <label className="filter-label">QA Status</label>
//                 <div className="premium-button" onClick={() => setIsQaOpenPending(!isQaOpenPending)}>
//                   <div className="status-dot" style={{ backgroundColor: selectedQaPending.color }} />
//                   <span className="selected-text">{selectedQaPending.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isQaOpenPending && (
//                   <div className="custom-menu">
//                     {qaOptions.map((opt) => (
//                       <div key={opt.id} className="menu-item" onClick={() => { setPendingQaState(opt.id); setCurrentPage(1); setIsQaOpenPending(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Incident State */}
//               <div className="dropdown-container">
//                 <label className="filter-label">Incident State</label>
//                 <div className="premium-button" onClick={() => setIsStatusOpen(!isStatusOpen)}>
//                   <div className="status-dot" style={{ backgroundColor: selectedStatus.color }} />
//                   <span className="selected-text">{selectedStatus.label}</span>
//                   <i className="bi bi-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
//                 </div>
//                 {isStatusOpen && (
//                   <div className="custom-menu">
//                     {statusOptions.map((opt) => (
//                       <div key={opt.id} className="menu-item" onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsStatusOpen(false); }}>
//                         <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* From Date */}
//               <div className="dropdown-container">
//                 <label className="filter-label">From Date</label>
//                 <input type="date" className="date-input" value={pendingFromDate} onChange={(e) => setPendingFromDate(e.target.value)} />
//               </div>

//               {/* To Date */}
//               <div className="dropdown-container">
//                 <label className="filter-label">To Date</label>
//                 <input type="date" className="date-input" value={pendingToDate} onChange={(e) => setPendingToDate(e.target.value)} />
//               </div>

//               {/* Reset */}
//               <div className="dropdown-container">
//                 <label className="filter-label">Reset</label>
//                 <button onClick={resetPendingDates} className="reset-btn">
//                   <i className="bi bi-arrow-counterclockwise"></i>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>

//       <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>

//         {/* ── STATS BANNER (Team tab) ── */}
//         {activeTab === 'team' && (
//           <div className="banner-container">
//             <div
//               className={`stat-box stat-box--clickable ${!showGlobalSla && viewMode === 'list' ? 'stat-box--active-default' : ''}`}
//               onClick={() => setShowGlobalSla(false)}
//             >
//               <div className="icon-circle icon-circle--indigo"><i className="bi bi-ticket-perforated-fill"></i></div>
//               <div className="stat-info">
//                 <span className="stat-label">Total Tickets</span>
//                 <span className="stat-value">{viewMode === 'list' ? summary.total_tickets : selectedAgentData?.total_tickets}</span>
//               </div>
//             </div>

//             <div className="stat-box">
//               <div className="icon-circle icon-circle--green"><i className="bi bi-shield-check"></i></div>
//               <div className="stat-info">
//                 <span className="stat-label">Passed / Audited</span>
//                 <span className="stat-value stat-value--green">{viewMode === 'list' ? summary.passed : selectedAgentData?.passed}</span>
//               </div>
//             </div>

//             {viewMode === 'list' ? (
//               <div
//                 className={`stat-box stat-box--clickable ${showGlobalSla ? 'stat-box--active-sla' : ''}`}
//                 onClick={() => setShowGlobalSla(true)}
//               >
//                 <div className="icon-circle icon-circle--red"><i className="bi bi-exclamation-octagon-fill"></i></div>
//                 <div className="stat-info">
//                   <span className="stat-label">Team Health</span>
//                   <span className="stat-value stat-value--red">BREACHED SLA</span>
//                 </div>
//               </div>
//             ) : (
//               <div className="stat-box">
//                 <div className="icon-circle icon-circle--indigo"><i className="bi bi-stars"></i></div>
//                 <div className="stat-info">
//                   <span className="stat-label">Avg Score</span>
//                   <span className="stat-value stat-value--indigo">{selectedAgentData?.average_score?.toFixed(1) || 0}</span>
//                 </div>
//               </div>
//             )}

//             <div className="stat-box">
//               <div className="icon-circle icon-circle--amber"><i className="bi bi-graph-up-arrow"></i></div>
//               <div className="stat-info">
//                 <span className="stat-label">Quality Rate</span>
//                 <span className="stat-value stat-value--amber">
//                   {viewMode === 'list' ? `${summary.pass_percentage}%` : `${selectedAgentData?.pass_percentage || 0}%`}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className={activeTab === 'pending' || viewMode === 'detail' || (activeTab === 'team' && showGlobalSla) ? 'full-view' : 'main-grid'}>

//           {/* ── GLOBAL SLA BREACH VIEW ── */}
//           {activeTab === 'team' && viewMode === 'list' && showGlobalSla && (
//             <section className="card">
//               <div className="card-header">
//                 <h6 className="card-title">Global SLA Breaches</h6>
//                 <button onClick={() => setShowGlobalSla(false)} className="back-btn">
//                   <i className="bi bi-arrow-left"></i> Back to Chart
//                 </button>
//               </div>
//               <div className="table-scroll">
//                 {globalSlaData.length > 0 ? (
//                   <>
//                     <table className="data-table">
//                       <thead>
//                         <tr>
//                           <th>Incident No</th>
//                           <th>Actioned By</th>
//                           <th>Description</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {globalSlaData.map((item, i) => (
//                           <tr key={i}>
//                             <td className="incident-link">{item.incident_number}</td>
//                             <td>{formatName(item.done_by)}</td>
//                             <td>{item.short_description}</td>
//                             <td><span className="badge-red">SLA BREACHED</span></td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     <div className="pagination-area">
//                       <button disabled={globalSlaPage === 1} onClick={() => setGlobalSlaPage(p => p - 1)} className="pag-btn">Prev</button>
//                       <button disabled={globalSlaPage >= Math.ceil(globalSlaTotal / 10)} onClick={() => setGlobalSlaPage(p => p + 1)} className="pag-btn">Next</button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="no-data-container">
//                     <i className="bi bi-patch-check no-data-icon"></i>
//                     <p className="no-data-text">No SLA breaches found</p>
//                     <span className="no-data-subtext">All incidents are currently within their service level targets.</span>
//                   </div>
//                 )}
//               </div>
//             </section>
//           )}

//           {/* ── TEAM LIST VIEW ── */}
//           {activeTab === 'team' && viewMode === 'list' && !showGlobalSla && (
//             <>
//               {/* Bar Chart */}
//               <section className="card">
//                 <div className="card-header">
//                   <h6 className="card-title">Tickets Handled by User</h6>
//                   <span className="pill">Volume View</span>
//                 </div>
//                 <div className="table-scroll" style={{ padding: '10px' }}>
//                   <ResponsiveContainer width="100%" height={250}>
//                     <BarChart data={agentsList} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
//                       <defs>
//                         <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
//                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3} />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                       <XAxis
//                         dataKey="agent"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
//                         interval={0}
//                         angle={-25}
//                         textAnchor="end"
//                         tickFormatter={(name) => formatName(name.split(' ')[0])}
//                       />
//                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
//                       <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: [6, 6, 0, 0] }} />
//                       <Bar
//                         dataKey="total_tickets"
//                         name="Tickets Handled"
//                         fill="url(#barGradient)"
//                         radius={[6, 6, 0, 0]}
//                         barSize={30}
//                         activeBar={{ fill: '#4f46e5', filter: 'drop-shadow(0px 4px 8px rgba(99, 102, 241, 0.4))' }}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </section>

//               {/* Analyst Performance Table */}
//               <section className="card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
//                 <div className="card-header">
//                   <h6 className="card-title">Analyst Performance Directory</h6>
//                   <span className="pill">{agentsList.length} Active</span>
//                 </div>
//                 <div className="table-scroll" style={{ flex: 1, overflowY: 'auto' }}>
//                   <table className="data-table">
//                     <thead style={{ background: '#f8fafc' }}>
//                       <tr>
//                         <th className="compact-th" style={{ paddingLeft: '16px' }}>ANALYST</th>
//                         <th className="compact-th">TICKETS</th>
//                         <th className="compact-th">AVG SCORE</th>
//                         <th className="compact-th" style={{ paddingRight: '16px' }}>QUALITY RATE</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {agentsList.map((a, i) => (
//                         <tr key={i} onClick={() => handleAnalystClick(a)}>
//                           <td className="compact-td" style={{ paddingLeft: '16px' }}>
//                             <div className="avatar-row">
//                               <div className="mini-avatar mini-avatar--small">
//                                 {a.agent ? a.agent.charAt(0).toUpperCase() : 'A'}
//                               </div>
//                               <span style={{ fontSize: '12px', fontWeight: 500 }}>{formatName(a.agent)}</span>
//                             </div>
//                           </td>
//                           <td className="compact-td">
//                             <span style={{ fontSize: '12px', color: '#6366f1' }}># {a.total_tickets || 0}</span>
//                           </td>
//                           <td className="compact-td">
//                             <span style={{ fontSize: '12px', color: '#475569' }}>⭐ {a.average_score?.toFixed(1) || "0.0"}</span>
//                           </td>
//                           <td className="compact-td" style={{ paddingRight: '16px' }}>
//                             <div className="progress-wrap">
//                               <div className="progress-track">
//                                 <div className="progress-fill" style={{ width: `${a.pass_percentage || 0}%` }} />
//                               </div>
//                               <span className="progress-label">{a.pass_percentage || 0}%</span>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>
//             </>
//           )}

//           {/* ── ANALYST DETAIL VIEW ── */}
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <section className="card">
//               <div className="detail-header">
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className="back-btn"
//                 >
//                   <i className="bi bi-arrow-left"></i> BACK
//                 </button>
//                 <div style={{ textAlign: 'right' }}>
//                   <h3 className="detail-title">
//                     {formatName(selectedAgentData?.agent)} <span>Tickets</span>
//                   </h3>
//                 </div>
//               </div>
//               <div className="table-scroll">
//                 <table className="data-table">
//                   <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10 }}>
//                     <tr>
//                       <th>Incident No</th>
//                       <th>Description</th>
//                       <th>Status</th>
//                       <th>Phase</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {agentTickets.map((t, idx) => (
//                       <tr key={idx} onClick={() => openIncidentModal(t)}>
//                         <td
//                           className="incident-link"
//                           onMouseEnter={() => setHoveredIndex(t)}
//                           onMouseLeave={() => setHoveredIndex(null)}
//                           style={{ textDecoration: hoveredIndex === t ? 'underline' : 'none' }}
//                         >
//                           # {t.incident_number}
//                         </td>
//                         <td className="desc-cell">{t.short_description}</td>
//                         <td>
//                           <span className={`premium-pill ${getStatusBadgeClass(t.status)}`}>
//                             {t.status}
//                           </span>
//                         </td>
//                         <td>
//                           <span
//                             className="premium-pill"
//                             style={{ backgroundColor: selectedQaDetail.color + '15', color: selectedQaDetail.color }}
//                           >
//                             {qaState.toUpperCase()}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 <div className="pagination-area">
//                   <button disabled={detailPage === 1} onClick={() => setDetailPage(p => p - 1)} className="pag-btn">
//                     <i className="bi bi-chevron-left"></i> Previous
//                   </button>
//                   <div className="page-indicator">
//                     Page <span className="page-number">{detailPage}</span>
//                     of {Math.ceil((totalDetailTickets || 0) / 10) || 1}
//                   </div>
//                   <button disabled={detailPage >= Math.ceil(totalDetailTickets / 10)} onClick={() => setDetailPage(p => p + 1)} className="pag-btn">
//                     Next <i className="bi bi-chevron-right"></i>
//                   </button>
//                 </div>
//               </div>
//             </section>
//           )}

//           {/* ── MY PENDING VIEW ── */}
//           {activeTab === 'pending' && (
//             <section className="card">
//               <div className="card-header">
//                 <h6 className="card-title">My Pending Queue</h6>
//                 <span className="pill">{totalPending} Records</span>
//               </div>
//               <div className="table-scroll">
//                 {pendingIncidents.length > 0 ? (
//                   <>
//                     <table className="data-table">
//                       <thead>
//                         <tr>
//                           <th>Incident No</th>
//                           <th>Description</th>
//                           <th>Status</th>
//                           <th>Resolution</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {pendingIncidents.map((incident, i) => (
//                           <tr key={i}>
//                             <td
//                               className="incident-link"
//                               onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: incident, fromPending: true } })}
//                               onMouseEnter={() => setHoveredIndex(incident)}
//                               onMouseLeave={() => setHoveredIndex(null)}
//                               style={{ textDecoration: hoveredIndex === incident ? 'underline' : 'none' }}
//                             >
//                               # {incident.incident_number}
//                             </td>
//                             <td className="desc-cell">
//                               {incident.short_description || "No description provided"}
//                             </td>
//                             <td>
//                               <span className={`premium-pill ${
//                                 incident.status === 'resolved' ? 'pill-resolved' :
//                                 incident.status === 'escalated' ? 'pill-escalated' : 'pill-default'
//                               }`}>
//                                 <i className="bi bi-circle-fill" style={{ fontSize: '4px', marginRight: '6px' }}></i>
//                                 {incident.status}
//                               </span>
//                             </td>
//                             <td>{incident.resolution_shared || "---"}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                     <div className="pagination-area">
//                       <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="pag-btn">
//                         <i className="bi bi-chevron-left"></i> Previous
//                       </button>
//                       <div className="page-indicator">
//                         Page <span className="page-number">{currentPage}</span>
//                         of {Math.ceil((totalPending || 0) / perPage) || 1}
//                       </div>
//                       <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} className="pag-btn">
//                         Next <i className="bi bi-chevron-right"></i>
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="no-data-container">
//                     <i className="bi bi-inbox no-data-icon"></i>
//                     <p className="no-data-text">No records found</p>
//                     <span className="no-data-subtext">
//                       There are no incidents matching the "{selectedQaPending.label}" status for the selected criteria.
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </section>
//           )}
//         </div>
//       </div>

//       {/* ── INCIDENT DETAIL MODAL ── */}
//       {isModalOpen && selectedIncident && (
//         <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2 className="modal-title">{selectedIncident.incident_number}</h2>
//               <button className="modal-header-close" onClick={() => setIsModalOpen(false)}>
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="agent-info-card">
//                 <div className="mini-avatar">
//                   {selectedIncident.display_name.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <div className="agent-info-meta">ACTIONED BY</div>
//                   <div className="agent-info-name">{formatName(selectedIncident.display_name)}</div>
//                 </div>
//               </div>
//               <div className="data-grid">
//                 <div className="data-grid-full">
//                   <label className="filter-label">Description</label>
//                   <div style={{ fontSize: '12px', fontWeight: '600' }}>{selectedIncident.short_description}</div>
//                 </div>
//                 <div>
//                   <label className="filter-label">Status</label>
//                   <div className="pill">{selectedIncident.status?.toUpperCase()}</div>
//                 </div>
//                 <div className="data-grid-full">
//                   <label className="filter-label">Resolution Notes</label>
//                   <div className="resolution-box">{selectedIncident.resolution_shared || "No details provided."}</div>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="done-btn" onClick={() => setIsModalOpen(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllusersDashboard;


// import React, { useState, useEffect } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   ResponsiveContainer, Tooltip,
// } from 'recharts';
// import api from '../api/axois';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import '../pages/AlluserDashboard.css';

// /* ─── helpers ─────────────────────────────────────── */
// const fmt = (str) => {
//   if (!str) return '';
//   return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
// };

// const coverageStyle = (pct) => {
//   if (pct === null || pct === undefined) return { background: '#f1f5f9', color: '#64748b' };
//   if (pct >= 80) return { background: '#dcfce7', color: '#166534' };
//   if (pct >= 40) return { background: '#fef9c3', color: '#92400e' };
//   return { background: '#fee2e2', color: '#991b1b' };
// };
// const barColor = (pct) => (pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#e24b4a');

// /* ─── Recharts custom tooltip ─────────────────────── */
// const BarTip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{ background: '#fff', border: '0.5px solid #e4e7ef', borderRadius: 10, padding: '9px 13px', fontSize: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
//       <p style={{ margin: 0, fontWeight: 600, color: '#1a1d2e' }}>{label}</p>
//       <p style={{ margin: '3px 0 0', color: '#6366f1', fontWeight: 600 }}>{payload[0].value} tickets</p>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════ */
// const AllusersDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab]             = useState('team');
//   const [viewMode, setViewMode]               = useState('list');
//   const [userList, setUserList]               = useState([]);
//   const [data, setData]                       = useState(null);
//   const [loading, setLoading]                 = useState(false);
//   const [detailLoading, setDetailLoading]     = useState(false);
//   const [hoveredRow, setHoveredRow]           = useState(null);

//   // SLA
//   const [showSla, setShowSla]         = useState(false);
//   const [slaData, setSlaData]         = useState([]);
//   const [slaTotal, setSlaTotal]       = useState(0);
//   const [slaPage, setSlaPage]         = useState(1);

//   // Pending tab
//   const [pending, setPending]         = useState([]);
//   const [pendPage, setPendPage]       = useState(1);
//   const [pendTotal, setPendTotal]     = useState(0);
//   const [statusFilter, setStatusFilter]   = useState('');
//   const [pendQa, setPendQa]           = useState('pending');
//   const [pendFrom, setPendFrom]       = useState('');
//   const [pendTo, setPendTo]           = useState('');
//   const [qaDropPend, setQaDropPend]   = useState(false);
//   const [stDropPend, setStDropPend]   = useState(false);
//   const perPage = 10;

//   // Detail
//   const [selAgent, setSelAgent]           = useState(null);
//   const [agentTickets, setAgentTickets]   = useState([]);
//   const [detPage, setDetPage]             = useState(1);
//   const [detTotal, setDetTotal]           = useState(0);
//   const [detFrom, setDetFrom]             = useState('');
//   const [detTo, setDetTo]                 = useState('');
//   const [detQa, setDetQa]                 = useState('pending');
//   const [qaDropDet, setQaDropDet]         = useState(false);

//   // Modal
//   const [selInc, setSelInc]   = useState(null);
//   const [modal, setModal]     = useState(false);

//   /* ── option lists ── */
//   const statusOpts = [
//     { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
//     { id: 'resolved',   label: 'Resolved',    color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated',  label: 'Escalated',   color: '#b20f2a', icon: 'bi-fire' },
//     { id: 'in progress',label: 'In Progress', color: '#52be00', icon: 'bi-clock-history' },
//   ];
//   const qaOpts = [
//     { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
//     { id: 'done',    label: 'Done QA',    color: '#10b981', icon: 'bi-check-all' },
//   ];
//   const selStatus  = statusOpts.find(o => o.id === statusFilter) || statusOpts[0];
//   const selQaPend  = qaOpts.find(o => o.id === pendQa);
//   const selQaDet   = qaOpts.find(o => o.id === detQa);

//   /* ── token helper ── */
//   const tok = () => user?.token || localStorage.getItem('session_token');
//   const sid = () => user?.sid   || user?.user_sid;

//   /* ── fetches ── */
//   const fetchSla = async (page = 1) => {
//     setLoading(true);
//     try {
//       const r = await api.post('/users/get/sla-breached/incidents', { user_sid: sid(), page, per_page: 10 }, { headers: { Authorization: `Bearer ${tok()}` } });
//       setSlaData(r.data.response || []); setSlaTotal(r.data.total || 0);
//     } catch (e) { console.error(e); } finally { setLoading(false); }
//   };

//   useEffect(() => { if (showSla && activeTab === 'team') fetchSla(slaPage); }, [showSla, slaPage, activeTab]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const r = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${tok()}` } });
//         setUserList(r.data || []);
//       } catch (e) { console.error(e); }
//     })();
//   }, [user]);

//   useEffect(() => {
//     if (activeTab !== 'team' || viewMode === 'detail') return;
//     setLoading(true);
//     (async () => {
//       try {
//         const r = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${tok()}` } });
//         setData(r.data);
//       } catch (e) { console.error(e); } finally { setLoading(false); }
//     })();
//   }, [activeTab, viewMode, user]);

//   useEffect(() => {
//     if (activeTab !== 'pending') return;
//     setLoading(true);
//     (async () => {
//       try {
//         const r = await api.post('/users/get-pending/incidents/all',
//           { user_sid: sid(), page: pendPage, per_page: perPage },
//           { headers: { Authorization: `Bearer ${tok()}` }, params: { resolution_status: statusFilter || undefined, qa_state: pendQa, from_date: pendFrom || undefined, to_date: pendTo || undefined } }
//         );
//         setPending(r.data.response || []); setPendTotal(r.data.total || 0);
//       } catch (e) { console.error(e); setPending([]); } finally { setLoading(false); }
//     })();
//   }, [activeTab, pendPage, statusFilter, pendQa, pendFrom, pendTo, user]);

//   const fetchDetail = async (agent, page = 1) => {
//     setDetailLoading(true);
//     try {
//       const found = userList.find(u => u.full_name.toLowerCase() === agent.agent.toLowerCase());
//       if (found) {
//         const r = await api.post('/users/get-pending/incidents/all',
//           { user_sid: found.sid, page, per_page: 10, from_date: detFrom || undefined, to_date: detTo || undefined },
//           { headers: { Authorization: `Bearer ${tok()}` }, params: { qa_state: detQa } }
//         );
//         setAgentTickets(r.data.response || []); setDetTotal(r.data.total || 0);
//       }
//     } catch (e) { console.error(e); setAgentTickets([]); } finally { setDetailLoading(false); }
//   };

//   useEffect(() => { if (viewMode === 'detail' && selAgent) fetchDetail(selAgent, detPage); }, [detPage, detFrom, detTo, detQa]);

//   const openDetail = (a) => { setSelAgent(a); setViewMode('detail'); setDetPage(1); fetchDetail(a, 1); };
//   const openModal  = (t) => { setSelInc({ ...t, display_name: selAgent?.agent || t.done_by || 'System' }); setModal(true); };

//   /* ── derived data ── */
//   const summary    = data?.all_time?.summary              || {};
//   const agents     = data?.all_time?.agent_performance    || [];
//   const qaAdmins   = data?.all_time?.qa_admin_performance || [];
//   const maxTickets = Math.max(...agents.map(a => a.total_tickets || 0), 1);

//   const statusBadgeClass = (s) => {
//     const v = s?.toLowerCase();
//     if (v === 'resolved')   return 'pill-resolved';
//     if (v === 'escalated')  return 'pill-escalated';
//     return 'pill-default';
//   };

//   /* ── Dropdown wrapper ── */
//   const DD = ({ open, setOpen, selected, opts, onSelect, label }) => (
//     <div className="db-flt" style={{ position: 'relative' }}>
//       <label className="db-flbl">{label}</label>
//       <div className="db-fbtn" onClick={() => setOpen(o => !o)}>
//         <div className="db-dot" style={{ background: selected.color }} />
//         <span>{selected.label}</span>
//         <i className={`bi bi-chevron-down db-chevron`}></i>
//       </div>
//       {open && (
//         <div className="db-dropdown">
//           {opts.map(o => (
//             <div key={o.id} className="db-menu-item" onClick={() => { onSelect(o.id); setOpen(false); }}>
//               <i className={`bi ${o.icon}`} style={{ color: o.color, fontSize: 13 }}></i> {o.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   /* ── Pagination ── */
//   const Pager = ({ page, total, perP = 10, onPrev, onNext }) => (
//     <div className="db-pag">
//       <button className="db-pag-btn" disabled={page === 1} onClick={onPrev}>
//         <i className="bi bi-chevron-left"></i> Prev
//       </button>
//       <div className="db-pag-info">
//         Page <span className="db-pag-num">{page}</span> of {Math.ceil((total || 0) / perP) || 1}
//       </div>
//       <button className="db-pag-btn" disabled={page >= Math.ceil(total / perP)} onClick={onNext}>
//         Next <i className="bi bi-chevron-right"></i>
//       </button>
//     </div>
//   );

//   /* ════════════════════════════════════════════════ */
//   return (
//     <div className="db-root">
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {(loading || detailLoading) && <div className="db-overlay"><div className="db-spinner"></div></div>}

//       {/* ── HEADER ──────────────────────────────── */}
//       <header className="db-header">
//         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//           <h2 className="db-logo">Ticket<span>Metrics</span></h2>
//           <div className="db-tabs">
//             <button className={`db-tab ${activeTab === 'team' ? 'active' : ''}`}
//               onClick={() => { setActiveTab('team'); setViewMode('list'); setShowSla(false); }}>
//               Team View
//             </button>
//             <button className={`db-tab ${activeTab === 'pending' ? 'active' : ''}`}
//               onClick={() => setActiveTab('pending')}>
//               My Pending
//             </button>
//           </div>
//         </div>

//         <div className="db-filters">
//           {/* Detail filters */}
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <>
//               <DD label="Audit Phase" open={qaDropDet} setOpen={setQaDropDet} selected={selQaDet} opts={qaOpts} onSelect={v => { setDetQa(v); setDetPage(1); }} />
//               <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={detFrom} onChange={e => setDetFrom(e.target.value)} /></div>
//               <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={detTo} onChange={e => setDetTo(e.target.value)} /></div>
//               <div className="db-flt">
//                 <label className="db-flbl">Reset</label>
//                 <button className="db-reset" onClick={() => { setDetFrom(''); setDetTo(''); setDetPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button>
//               </div>
//             </>
//           )}
//           {/* Pending filters */}
//           {activeTab === 'pending' && (
//             <>
//               <DD label="QA Status"      open={qaDropPend} setOpen={setQaDropPend} selected={selQaPend}  opts={qaOpts}     onSelect={v => { setPendQa(v);     setPendPage(1); }} />
//               <DD label="Incident State" open={stDropPend} setOpen={setStDropPend} selected={selStatus}  opts={statusOpts} onSelect={v => { setStatusFilter(v); setPendPage(1); }} />
//               <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={pendFrom} onChange={e => setPendFrom(e.target.value)} /></div>
//               <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={pendTo} onChange={e => setPendTo(e.target.value)} /></div>
//               <div className="db-flt">
//                 <label className="db-flbl">Reset</label>
//                 <button className="db-reset" onClick={() => { setPendFrom(''); setPendTo(''); setPendPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button>
//               </div>
//             </>
//           )}
//         </div>
//       </header>

//       {/* ── STATS BANNER (team tab) ──────────────── */}
//       {activeTab === 'team' && (
//         <div className="db-banner">
//           <div className={`db-stat clickable ${!showSla && viewMode === 'list' ? 'active-ind' : ''}`} onClick={() => setShowSla(false)}>
//             <div className="db-ico ico-ind"><i className="bi bi-ticket-perforated-fill"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Total Tickets</span>
//               <span className="db-stat-val">{viewMode === 'list' ? (summary.total_tickets || 0) : (selAgent?.total_tickets || 0)}</span>
//             </div>
//           </div>
//           <div className="db-stat">
//             <div className="db-ico ico-grn"><i className="bi bi-shield-check"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Passed</span>
//               <span className="db-stat-val val-grn">{viewMode === 'list' ? (summary.passed || 0) : (selAgent?.passed || 0)}</span>
//             </div>
//           </div>
//           <div className="db-stat">
//             <div className="db-ico ico-vio"><i className="bi bi-inbox-fill"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Unassigned QA</span>
//               <span className="db-stat-val val-ind">{summary.unassigned_qa_tickets || 0}</span>
//             </div>
//           </div>
//           {viewMode === 'list' ? (
//             <div className={`db-stat clickable ${showSla ? 'active-red' : ''}`} onClick={() => setShowSla(true)}>
//               <div className="db-ico ico-red"><i className="bi bi-exclamation-octagon-fill"></i></div>
//               <div className="db-stat-info">
//                 <span className="db-stat-lbl">SLA Breached</span>
//                 <span className="db-stat-val val-red">{summary.sla_breached || 0}</span>
//               </div>
//             </div>
//           ) : (
//             <div className="db-stat">
//               <div className="db-ico ico-vio"><i className="bi bi-stars"></i></div>
//               <div className="db-stat-info">
//                 <span className="db-stat-lbl">Avg Score</span>
//                 <span className="db-stat-val val-ind">{selAgent?.average_score?.toFixed(1) || 0}</span>
//               </div>
//             </div>
//           )}
//           <div className="db-stat">
//             <div className="db-ico ico-amb"><i className="bi bi-graph-up-arrow"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Quality Rate</span>
//               <span className="db-stat-val val-amb">
//                 {viewMode === 'list' ? `${summary.pass_percentage || 0}%` : `${selAgent?.pass_percentage || 0}%`}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SLA FULL VIEW ────────────────────────── */}
//       {activeTab === 'team' && viewMode === 'list' && showSla && (
//         <div className="db-card" style={{ flex: 1 }}>
//           <div className="db-card-head-ind">
//             <span className="db-card-title"><i className="bi bi-exclamation-octagon-fill" style={{ marginRight: 7 }}></i>Global SLA Breaches</span>
//             <button className="db-back" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.3)' }} onClick={() => setShowSla(false)}>
//               <i className="bi bi-arrow-left"></i> Back
//             </button>
//           </div>
//           <div className="db-card-body db-table-wrap">
//             {slaData.length > 0 ? (
//               <>
//                 <table className="db-table">
//                   <thead><tr><th>Incident</th><th>Actioned By</th><th>Description</th><th>Status</th></tr></thead>
//                   <tbody>
//                     {slaData.map((it, i) => (
//                       <tr key={i}>
//                         <td className="inc-link">{it.incident_number}</td>
//                         <td>{fmt(it.done_by)}</td>
//                         <td className="desc-cell">{it.short_description}</td>
//                         <td><span className="badge badge-red">SLA Breached</span></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pager page={slaPage} total={slaTotal} onPrev={() => setSlaPage(p => p - 1)} onNext={() => setSlaPage(p => p + 1)} />
//               </>
//             ) : (
//               <div className="db-empty">
//                 <i className="bi bi-patch-check db-empty-icon"></i>
//                 <p className="db-empty-title">No SLA breaches</p>
//                 <span className="db-empty-sub">All incidents are within service level targets.</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── TEAM LIST VIEW ───────────────────────── */}
//       {activeTab === 'team' && viewMode === 'list' && !showSla && (
//         <div className="db-full">

//           {/* Row 1: Horizontal bar chart + Analyst table */}
//           <div className="db-grid-2">

//             {/* ── Horizontal Bar Chart ── */}
//             <div className="db-card">
//               <div className="db-card-head">
//                 <span className="db-card-title">Tickets by analyst</span>
//                 <span className="db-pill">Volume</span>
//               </div>
//               <div className="db-card-body db-chart-wrap" style={{ overflowY: 'auto' }}>
//                 <div className="hbar-list">
//                   {[...agents].sort((a, b) => (b.total_tickets || 0) - (a.total_tickets || 0)).map((a, i) => {
//                     const pct = Math.round(((a.total_tickets || 0) / maxTickets) * 100);
//                     return (
//                       <div key={i} className="hbar-row" onClick={() => openDetail(a)} style={{ cursor: 'pointer' }}>
//                         <div className="hbar-label">{fmt(a.agent.split(' ')[0])}</div>
//                         <div className="hbar-track">
//                           <div className={`hbar-fill ${a.is_top_performer ? 'top' : ''}`} style={{ width: `${pct}%` }}>
//                             <span className="hbar-val">{a.total_tickets}</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* ── Analyst Performance Table (expanded) ── */}
//             <div className="db-card" style={{ minHeight: 0 }}>
//               <div className="db-card-head">
//                 <span className="db-card-title">Analyst performance directory</span>
//                 <span className="db-pill db-pill-ind">{agents.length} active</span>
//               </div>
//               <div className="db-table-wrap">
//                 <table className="db-table" style={{ minWidth: 600 }}>
//                   <thead>
//                     <tr>
//                       <th>Analyst</th>
//                       <th className="center">Total</th>
//                       <th className="center">INC</th>
//                       <th className="center">RIT</th>
//                       <th className="center">Passed</th>
//                       <th className="center">Failed</th>
//                       <th className="center">Unassigned</th>
//                       <th>Quality</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {agents.map((a, i) => (
//                       <tr key={i} onClick={() => openDetail(a)}
//                         onMouseEnter={() => setHoveredRow(i)}
//                         onMouseLeave={() => setHoveredRow(null)}>
//                         <td>
//                           <div className="db-arow">
//                             <div className="db-av">{a.agent?.charAt(0)?.toUpperCase()}</div>
//                             <span className="db-av-name">{fmt(a.agent)}</span>
//                             {a.is_top_performer  && <span className="badge badge-top">Top</span>}
//                             {a.is_bottom_performer && <span className="badge badge-low">Low</span>}
//                           </div>
//                         </td>
//                         <td className="center">
//                           <span style={{ color: '#6366f1', fontWeight: 600, fontSize: 11 }}>{a.total_tickets || 0}</span>
//                         </td>
//                         <td className="center"><span className="badge badge-ind">{a.ticket_split?.INC ?? 0}</span></td>
//                         <td className="center"><span className="badge badge-amb">{a.ticket_split?.RIT ?? 0}</span></td>
//                         <td className="center"><span className="badge badge-grn">{a.passed || 0}</span></td>
//                         <td className="center"><span className="badge badge-red">{a.failed || 0}</span></td>
//                         <td className="center"><span className="badge badge-gray">{a.qc_remaining || 0}</span></td>
//                         <td>
//                           <div className="db-prog">
//                             <div className="db-prog-track">
//                               <div className="db-prog-fill" style={{ width: `${a.pass_percentage || 0}%`, background: barColor(a.pass_percentage || 0) }} />
//                             </div>
//                             <span className="db-prog-lbl">{a.pass_percentage !== null && a.pass_percentage !== undefined ? `${a.pass_percentage}%` : '—'}</span>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* ── QA Admin Performance ── */}
//           <div className="db-card">
//             <div className="db-card-head-ind">
//               <span className="db-card-title">
//                 <i className="bi bi-person-badge-fill" style={{ marginRight: 7 }}></i>
//                 QA admin performance
//               </span>
//               <span className="db-pill-ghost">{qaAdmins.length} auditors</span>
//             </div>

//             {qaAdmins.length === 0 ? (
//               <div className="db-empty" style={{ padding: '40px 20px' }}>
//                 <p className="db-empty-title">No QA admin data</p>
//               </div>
//             ) : (
//               <div className="db-qa-grid">
//                 {qaAdmins.map((qa, idx) => {
//                   const pct = qa.qc_coverage_percentage ?? 0;
//                   const bs  = coverageStyle(pct);
//                   const bc  = pct >= 80 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#e24b4a';
//                   return (
//                     <div key={idx} className="db-qa-col">
//                       <span className="db-qa-cov-badge" style={bs}>{pct.toFixed(0)}%</span>
//                       <div className="db-qa-name-row">
//                         <div className="db-qa-av">{qa.qa_admin?.charAt(0)?.toUpperCase() || '?'}</div>
//                         <span className="db-qa-name">{fmt(qa.qa_admin)}</span>
//                       </div>
//                       <div className="db-qa-rows">
//                         {[
//                           { k: 'Assigned',  v: qa.assigned_incidents ?? 0 },
//                           { k: 'QC done',   v: qa.qc_done ?? 0 },
//                           { k: 'Remaining', v: qa.qc_remaining ?? 0 },
//                         ].map(r => (
//                           <div key={r.k} className="db-qa-row">
//                             <span className="db-qa-k">{r.k}</span>
//                             <span className="db-qa-v">{r.v}</span>
//                           </div>
//                         ))}
//                         <div className="db-qa-row">
//                           <span className="db-qa-k">Pass rate</span>
//                           {qa.pass_percentage === null || qa.pass_percentage === undefined
//                             ? <span className="badge badge-gray">—</span>
//                             : qa.pass_percentage >= 80
//                               ? <span className="badge badge-grn">{qa.pass_percentage}%</span>
//                               : <span className="badge badge-red">{qa.pass_percentage}%</span>
//                           }
//                         </div>
//                       </div>
//                       <div>
//                         <div className="db-qa-cov-lbl">Coverage</div>
//                         <div className="db-qa-cov-track">
//                           <div className="db-qa-cov-fill" style={{ width: `${pct}%`, background: bc }} />
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── ANALYST DETAIL VIEW ──────────────────── */}
//       {activeTab === 'team' && viewMode === 'detail' && (
//         <div className="db-card" style={{ flex: 1 }}>
//           <div className="db-detail-header">
//             <button className="db-back" onClick={() => setViewMode('list')}>
//               <i className="bi bi-arrow-left"></i> Back
//             </button>
//             <h3 className="db-detail-title">{fmt(selAgent?.agent)} <span>Tickets</span></h3>
//           </div>
//           <div className="db-table-wrap">
//             <table className="db-table">
//               <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Phase</th></tr></thead>
//               <tbody>
//                 {agentTickets.map((t, i) => (
//                   <tr key={i} onClick={() => openModal(t)}>
//                     <td className="inc-link"># {t.incident_number}</td>
//                     <td className="desc-cell">{t.short_description}</td>
//                     <td>
//                       <span className={`status-pill ${statusBadgeClass(t.status)}`}>{t.status}</span>
//                     </td>
//                     <td>
//                       <span className="status-pill" style={{ background: selQaDet.color + '18', color: selQaDet.color, borderColor: selQaDet.color + '40' }}>
//                         {detQa.toUpperCase()}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <Pager page={detPage} total={detTotal} onPrev={() => setDetPage(p => p - 1)} onNext={() => setDetPage(p => p + 1)} />
//           </div>
//         </div>
//       )}

//       {/* ── MY PENDING VIEW ──────────────────────── */}
//       {activeTab === 'pending' && (
//         <div className="db-card" style={{ flex: 1 }}>
//           <div className="db-card-head">
//             <span className="db-card-title">My Pending Queue</span>
//             <span className="db-pill">{pendTotal} records</span>
//           </div>
//           <div className="db-table-wrap">
//             {pending.length > 0 ? (
//               <>
//                 <table className="db-table">
//                   <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Resolution</th></tr></thead>
//                   <tbody>
//                     {pending.map((inc, i) => (
//                       <tr key={i}>
//                         <td className="inc-link"
//                           onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: inc, fromPending: true } })}>
//                           # {inc.incident_number}
//                         </td>
//                         <td className="desc-cell">{inc.short_description || 'No description'}</td>
//                         <td>
//                           <span className={`status-pill ${inc.status === 'resolved' ? 'pill-resolved' : inc.status === 'escalated' ? 'pill-escalated' : 'pill-default'}`}>
//                             {inc.status}
//                           </span>
//                         </td>
//                         <td style={{ fontSize: 11, color: '#7b8099' }}>{inc.resolution_shared || '—'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pager page={pendPage} total={pendTotal} perP={perPage} onPrev={() => setPendPage(p => p - 1)} onNext={() => setPendPage(p => p + 1)} />
//               </>
//             ) : (
//               <div className="db-empty">
//                 <i className="bi bi-inbox db-empty-icon"></i>
//                 <p className="db-empty-title">No records found</p>
//                 <span className="db-empty-sub">No incidents matching "{selQaPend.label}" for the selected criteria.</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── MODAL ────────────────────────────────── */}
//       {modal && selInc && (
//         <div className="db-modal-overlay" onClick={() => setModal(false)}>
//           <div className="db-modal" onClick={e => e.stopPropagation()}>
//             <div className="db-modal-head">
//               <h2 className="db-modal-title">{selInc.incident_number}</h2>
//               <button className="db-modal-close" onClick={() => setModal(false)}><i className="bi bi-x-lg"></i></button>
//             </div>
//             <div className="db-modal-body">
//               <div className="db-modal-agent">
//                 <div className="db-modal-av">{selInc.display_name?.charAt(0)?.toUpperCase()}</div>
//                 <div>
//                   <div className="db-modal-meta">Actioned by</div>
//                   <div className="db-modal-name">{fmt(selInc.display_name)}</div>
//                 </div>
//               </div>
//               <div className="db-modal-grid">
//                 <div className="db-modal-full">
//                   <div className="db-modal-lbl">Description</div>
//                   <div className="db-modal-val">{selInc.short_description}</div>
//                 </div>
//                 <div>
//                   <div className="db-modal-lbl">Status</div>
//                   <span className={`status-pill ${statusBadgeClass(selInc.status)}`}>{selInc.status?.toUpperCase()}</span>
//                 </div>
//                 <div className="db-modal-full">
//                   <div className="db-modal-lbl">Resolution Notes</div>
//                   <div className="db-modal-res">{selInc.resolution_shared || 'No details provided.'}</div>
//                 </div>
//               </div>
//             </div>
//             <div className="db-modal-footer">
//               <button className="db-done-btn" onClick={() => setModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllusersDashboard;


// import React, { useState, useEffect } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   ResponsiveContainer, Tooltip,
// } from 'recharts';
// import api from '../api/axois';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import '../pages/AlluserDashboard.css';

// /* ─── helpers ─────────────────────────────────────── */
// const fmt = (str) => {
//   if (!str) return '';
//   return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
// };

// const coverageStyle = (pct) => {
//   if (pct === null || pct === undefined) return { background: '#f1f5f9', color: '#64748b' };
//   if (pct >= 80) return { background: '#dcfce7', color: '#166534' };
//   if (pct >= 40) return { background: '#fef9c3', color: '#92400e' };
//   return { background: '#fee2e2', color: '#991b1b' };
// };
// const barColor = (pct) => (pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#e24b4a');

// /* ─── Recharts custom tooltip ─────────────────────── */
// const BarTip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{ background: '#fff', border: '0.5px solid #e4e7ef', borderRadius: 10, padding: '9px 13px', fontSize: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
//       <p style={{ margin: 0, fontWeight: 600, color: '#1a1d2e' }}>{label}</p>
//       <p style={{ margin: '3px 0 0', color: '#6366f1', fontWeight: 600 }}>{payload[0].value} tickets</p>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════ */
// const AllusersDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab]             = useState('team');
//   const [viewMode, setViewMode]               = useState('list');
//   const [userList, setUserList]               = useState([]);
//   const [data, setData]                       = useState(null);
//   const [loading, setLoading]                 = useState(false);
//   const [detailLoading, setDetailLoading]     = useState(false);
//   const [hoveredRow, setHoveredRow]           = useState(null);

//   // Chart timeframe filter
//   const [chartTimeframe, setChartTimeframe]   = useState('overall');
//   const [chartData, setChartData]             = useState(null);
//   const [chartLoading, setChartLoading]       = useState(false);

//   // SLA
//   const [showSla, setShowSla]         = useState(false);
//   const [slaData, setSlaData]         = useState([]);
//   const [slaTotal, setSlaTotal]       = useState(0);
//   const [slaPage, setSlaPage]         = useState(1);

//   // Pending tab
//   const [pending, setPending]         = useState([]);
//   const [pendPage, setPendPage]       = useState(1);
//   const [pendTotal, setPendTotal]     = useState(0);
//   const [statusFilter, setStatusFilter]   = useState('');
//   const [pendQa, setPendQa]           = useState('pending');
//   const [pendFrom, setPendFrom]       = useState('');
//   const [pendTo, setPendTo]           = useState('');
//   const [qaDropPend, setQaDropPend]   = useState(false);
//   const [stDropPend, setStDropPend]   = useState(false);
//   const perPage = 10;

//   // Detail
//   const [selAgent, setSelAgent]           = useState(null);
//   const [agentTickets, setAgentTickets]   = useState([]);
//   const [detPage, setDetPage]             = useState(1);
//   const [detTotal, setDetTotal]           = useState(0);
//   const [detFrom, setDetFrom]             = useState('');
//   const [detTo, setDetTo]                 = useState('');
//   const [detQa, setDetQa]                 = useState('pending');
//   const [qaDropDet, setQaDropDet]         = useState(false);

//   // Modal
//   const [selInc, setSelInc]   = useState(null);
//   const [modal, setModal]     = useState(false);

//   /* ── option lists ── */
//   const statusOpts = [
//     { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
//     { id: 'resolved',   label: 'Resolved',    color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated',  label: 'Escalated',   color: '#b20f2a', icon: 'bi-fire' },
//     { id: 'in progress',label: 'In Progress', color: '#52be00', icon: 'bi-clock-history' },
//   ];
//   const qaOpts = [
//     { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
//     { id: 'done',    label: 'Done QA',    color: '#10b981', icon: 'bi-check-all' },
//   ];
//   const selStatus  = statusOpts.find(o => o.id === statusFilter) || statusOpts[0];
//   const selQaPend  = qaOpts.find(o => o.id === pendQa);
//   const selQaDet   = qaOpts.find(o => o.id === detQa);

//   /* ── token helper ── */
//   const tok = () => user?.token || localStorage.getItem('session_token');
//   const sid = () => user?.sid   || user?.user_sid;

//   /* ── fetches ── */
//   const fetchSla = async (page = 1) => {
//     setLoading(true);
//     try {
//       const r = await api.post('/users/get/sla-breached/incidents', { user_sid: sid(), page, per_page: 10 }, { headers: { Authorization: `Bearer ${tok()}` } });
//       setSlaData(r.data.response || []); setSlaTotal(r.data.total || 0);
//     } catch (e) { console.error(e); } finally { setLoading(false); }
//   };

//   useEffect(() => { if (showSla && activeTab === 'team') fetchSla(slaPage); }, [showSla, slaPage, activeTab]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const r = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${tok()}` } });
//         setUserList(r.data || []);
//       } catch (e) { console.error(e); }
//     })();
//   }, [user]);

//   useEffect(() => {
//     if (activeTab !== 'team' || viewMode === 'detail') return;
//     setLoading(true);
//     (async () => {
//       try {
//         const r = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${tok()}` } });
//         setData(r.data);
//         setChartData(r.data); // seed chart with overall on first load
//       } catch (e) { console.error(e); } finally { setLoading(false); }
//     })();
//   }, [activeTab, viewMode, user]);

//   // Separate fetch triggered by chart timeframe change
//   useEffect(() => {
//     if (activeTab !== 'team' || viewMode === 'detail') return;
//     setChartLoading(true);
//     (async () => {
//       try {
//         const r = await api.get('/users/admin/dashboard', {
//           headers: { Authorization: `Bearer ${tok()}` },
//           params: { timeframe: chartTimeframe },
//         });
//         setChartData(r.data);
//       } catch (e) { console.error(e); } finally { setChartLoading(false); }
//     })();
//   }, [chartTimeframe, activeTab, viewMode, user]);

//   useEffect(() => {
//     if (activeTab !== 'pending') return;
//     setLoading(true);
//     (async () => {
//       try {
//         const r = await api.post('/users/get-pending/incidents/all',
//           { user_sid: sid(), page: pendPage, per_page: perPage },
//           { headers: { Authorization: `Bearer ${tok()}` }, params: { resolution_status: statusFilter || undefined, qa_state: pendQa, from_date: pendFrom || undefined, to_date: pendTo || undefined } }
//         );
//         setPending(r.data.response || []); setPendTotal(r.data.total || 0);
//       } catch (e) { console.error(e); setPending([]); } finally { setLoading(false); }
//     })();
//   }, [activeTab, pendPage, statusFilter, pendQa, pendFrom, pendTo, user]);

//   const fetchDetail = async (agent, page = 1) => {
//     setDetailLoading(true);
//     try {
//       const found = userList.find(u => u.full_name.toLowerCase() === agent.agent.toLowerCase());
//       if (found) {
//         const r = await api.post('/users/get-pending/incidents/all',
//           { user_sid: found.sid, page, per_page: 10, from_date: detFrom || undefined, to_date: detTo || undefined },
//           { headers: { Authorization: `Bearer ${tok()}` }, params: { qa_state: detQa } }
//         );
//         setAgentTickets(r.data.response || []); setDetTotal(r.data.total || 0);
//       }
//     } catch (e) { console.error(e); setAgentTickets([]); } finally { setDetailLoading(false); }
//   };

//   useEffect(() => { if (viewMode === 'detail' && selAgent) fetchDetail(selAgent, detPage); }, [detPage, detFrom, detTo, detQa]);

//   const openDetail = (a) => { setSelAgent(a); setViewMode('detail'); setDetPage(1); fetchDetail(a, 1); };
//   const openModal  = (t) => { setSelInc({ ...t, display_name: selAgent?.agent || t.done_by || 'System' }); setModal(true); };

//   /* ── derived data ── */
//   const summary    = data?.all_time?.summary              || {};
//   const agents     = data?.all_time?.agent_performance    || [];
//   const qaAdmins   = data?.all_time?.qa_admin_performance || [];

//   // Chart uses its own timeframe-filtered data; fall back to all_time
//   const chartAgents = (
//     chartTimeframe === 'overall'
//       ? chartData?.all_time?.agent_performance
//       : chartData?.filtered?.agent_performance
//   ) || chartData?.all_time?.agent_performance || agents;

//   const maxTickets = Math.max(...chartAgents.map(a => a.total_tickets || 0), 1);

//   const statusBadgeClass = (s) => {
//     const v = s?.toLowerCase();
//     if (v === 'resolved')   return 'pill-resolved';
//     if (v === 'escalated')  return 'pill-escalated';
//     return 'pill-default';
//   };

//   /* ── Dropdown wrapper ── */
//   const DD = ({ open, setOpen, selected, opts, onSelect, label }) => (
//     <div className="db-flt" style={{ position: 'relative' }}>
//       <label className="db-flbl">{label}</label>
//       <div className="db-fbtn" onClick={() => setOpen(o => !o)}>
//         <div className="db-dot" style={{ background: selected.color }} />
//         <span>{selected.label}</span>
//         <i className={`bi bi-chevron-down db-chevron`}></i>
//       </div>
//       {open && (
//         <div className="db-dropdown">
//           {opts.map(o => (
//             <div key={o.id} className="db-menu-item" onClick={() => { onSelect(o.id); setOpen(false); }}>
//               <i className={`bi ${o.icon}`} style={{ color: o.color, fontSize: 13 }}></i> {o.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   /* ── Pagination ── */
//   const Pager = ({ page, total, perP = 10, onPrev, onNext }) => (
//     <div className="db-pag">
//       <button className="db-pag-btn" disabled={page === 1} onClick={onPrev}>
//         <i className="bi bi-chevron-left"></i> Prev
//       </button>
//       <div className="db-pag-info">
//         Page <span className="db-pag-num">{page}</span> of {Math.ceil((total || 0) / perP) || 1}
//       </div>
//       <button className="db-pag-btn" disabled={page >= Math.ceil(total / perP)} onClick={onNext}>
//         Next <i className="bi bi-chevron-right"></i>
//       </button>
//     </div>
//   );

//   /* ════════════════════════════════════════════════ */
//   return (
//     <div className="db-root">
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

//       {(loading || detailLoading) && <div className="db-overlay"><div className="db-spinner"></div></div>}

//       {/* ── HEADER ──────────────────────────────── */}
//       <header className="db-header">
//         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//           <h2 className="db-logo">Ticket<span>Metrics</span></h2>
//           <div className="db-tabs">
//             <button className={`db-tab ${activeTab === 'team' ? 'active' : ''}`}
//               onClick={() => { setActiveTab('team'); setViewMode('list'); setShowSla(false); }}>
//               Team View
//             </button>
//             <button className={`db-tab ${activeTab === 'pending' ? 'active' : ''}`}
//               onClick={() => setActiveTab('pending')}>
//               My Pending
//             </button>
//           </div>
//         </div>

//         <div className="db-filters">
//           {/* Detail filters */}
//           {activeTab === 'team' && viewMode === 'detail' && (
//             <>
//               <DD label="Audit Phase" open={qaDropDet} setOpen={setQaDropDet} selected={selQaDet} opts={qaOpts} onSelect={v => { setDetQa(v); setDetPage(1); }} />
//               <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={detFrom} onChange={e => setDetFrom(e.target.value)} /></div>
//               <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={detTo} onChange={e => setDetTo(e.target.value)} /></div>
//               <div className="db-flt">
//                 <label className="db-flbl">Reset</label>
//                 <button className="db-reset" onClick={() => { setDetFrom(''); setDetTo(''); setDetPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button>
//               </div>
//             </>
//           )}
//           {/* Pending filters */}
//           {activeTab === 'pending' && (
//             <>
//               <DD label="QA Status"      open={qaDropPend} setOpen={setQaDropPend} selected={selQaPend}  opts={qaOpts}     onSelect={v => { setPendQa(v);     setPendPage(1); }} />
//               <DD label="Incident State" open={stDropPend} setOpen={setStDropPend} selected={selStatus}  opts={statusOpts} onSelect={v => { setStatusFilter(v); setPendPage(1); }} />
//               <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={pendFrom} onChange={e => setPendFrom(e.target.value)} /></div>
//               <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={pendTo} onChange={e => setPendTo(e.target.value)} /></div>
//               <div className="db-flt">
//                 <label className="db-flbl">Reset</label>
//                 <button className="db-reset" onClick={() => { setPendFrom(''); setPendTo(''); setPendPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button>
//               </div>
//             </>
//           )}
//         </div>
//       </header>

//       {/* ── STATS BANNER (team tab) ──────────────── */}
//       {activeTab === 'team' && (
//         <div className="db-banner">
//           <div className={`db-stat clickable ${!showSla && viewMode === 'list' ? 'active-ind' : ''}`} onClick={() => setShowSla(false)}>
//             <div className="db-ico ico-ind"><i className="bi bi-ticket-perforated-fill"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Total Tickets</span>
//               <span className="db-stat-val">{viewMode === 'list' ? (summary.total_tickets || 0) : (selAgent?.total_tickets || 0)}</span>
//             </div>
//           </div>
//           <div className="db-stat">
//             <div className="db-ico ico-grn"><i className="bi bi-shield-check"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Passed</span>
//               <span className="db-stat-val val-grn">{viewMode === 'list' ? (summary.passed || 0) : (selAgent?.passed || 0)}</span>
//             </div>
//           </div>
//           <div className="db-stat">
//             <div className="db-ico ico-vio"><i className="bi bi-inbox-fill"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Unassigned QA</span>
//               <span className="db-stat-val val-ind">{summary.unassigned_qa_tickets || 0}</span>
//             </div>
//           </div>
//           {viewMode === 'list' ? (
//             <div className={`db-stat clickable ${showSla ? 'active-red' : ''}`} onClick={() => setShowSla(true)}>
//               <div className="db-ico ico-red"><i className="bi bi-exclamation-octagon-fill"></i></div>
//               <div className="db-stat-info">
//                 <span className="db-stat-lbl">SLA Breached</span>
//                 <span className="db-stat-val val-red">{summary.sla_breached || 0}</span>
//               </div>
//             </div>
//           ) : (
//             <div className="db-stat">
//               <div className="db-ico ico-vio"><i className="bi bi-stars"></i></div>
//               <div className="db-stat-info">
//                 <span className="db-stat-lbl">Avg Score</span>
//                 <span className="db-stat-val val-ind">{selAgent?.average_score?.toFixed(1) || 0}</span>
//               </div>
//             </div>
//           )}
//           <div className="db-stat">
//             <div className="db-ico ico-amb"><i className="bi bi-graph-up-arrow"></i></div>
//             <div className="db-stat-info">
//               <span className="db-stat-lbl">Quality Rate</span>
//               <span className="db-stat-val val-amb">
//                 {viewMode === 'list' ? `${summary.pass_percentage || 0}%` : `${selAgent?.pass_percentage || 0}%`}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SLA FULL VIEW ────────────────────────── */}
//       {activeTab === 'team' && viewMode === 'list' && showSla && (
//         <div className="db-card" style={{ flex: 1 }}>
//           <div className="db-card-head-ind">
//             <span className="db-card-title"><i className="bi bi-exclamation-octagon-fill" style={{ marginRight: 7 }}></i>Global SLA Breaches</span>
//             <button className="db-back" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.3)' }} onClick={() => setShowSla(false)}>
//               <i className="bi bi-arrow-left"></i> Back
//             </button>
//           </div>
//           <div className="db-card-body db-table-wrap">
//             {slaData.length > 0 ? (
//               <>
//                 <table className="db-table">
//                   <thead><tr><th>Incident</th><th>Actioned By</th><th>Description</th><th>Status</th></tr></thead>
//                   <tbody>
//                     {slaData.map((it, i) => (
//                       <tr key={i}>
//                         <td className="inc-link">{it.incident_number}</td>
//                         <td>{fmt(it.done_by)}</td>
//                         <td className="desc-cell">{it.short_description}</td>
//                         <td><span className="badge badge-red">SLA Breached</span></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pager page={slaPage} total={slaTotal} onPrev={() => setSlaPage(p => p - 1)} onNext={() => setSlaPage(p => p + 1)} />
//               </>
//             ) : (
//               <div className="db-empty">
//                 <i className="bi bi-patch-check db-empty-icon"></i>
//                 <p className="db-empty-title">No SLA breaches</p>
//                 <span className="db-empty-sub">All incidents are within service level targets.</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── TEAM LIST VIEW ───────────────────────── */}
//       {activeTab === 'team' && viewMode === 'list' && !showSla && (
//         <div className="db-full">

//           {/* Row 1: Horizontal bar chart + Analyst table */}
//           <div className="db-grid-2">

//             {/* ── Horizontal Bar Chart ── */}
//             <div className="db-card">
//               <div className="db-card-head" style={{ flexWrap: 'wrap', gap: 8 }}>
//                 <span className="db-card-title">Tickets by analyst</span>
//                 {/* Segmented timeframe control */}
//                 <div style={{
//                   display: 'flex',
//                   background: '#f0f2f7',
//                   borderRadius: 8,
//                   padding: 3,
//                   gap: 2,
//                   border: '0.5px solid #e4e7ef',
//                 }}>
//                   {[
//                     { id: 'overall', label: 'Overall',  icon: 'bi-infinity' },
//                     { id: 'monthly', label: 'Monthly',  icon: 'bi-calendar-month' },
//                     { id: 'weekly',  label: 'This Week', icon: 'bi-calendar-week' },
//                   ].map(opt => (
//                     <button
//                       key={opt.id}
//                       onClick={() => setChartTimeframe(opt.id)}
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 5,
//                         padding: '4px 10px',
//                         borderRadius: 6,
//                         border: 'none',
//                         cursor: 'pointer',
//                         fontSize: 10,
//                         fontWeight: 600,
//                         fontFamily: 'DM Sans, sans-serif',
//                         transition: 'all 0.15s',
//                         background: chartTimeframe === opt.id ? '#fff' : 'transparent',
//                         color:      chartTimeframe === opt.id ? '#6366f1' : '#7b8099',
//                         boxShadow:  chartTimeframe === opt.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
//                       }}
//                     >
//                       <i className={`bi ${opt.icon}`} style={{ fontSize: 11 }}></i>
//                       {opt.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="db-card-body db-chart-wrap" style={{ overflowY: 'auto', position: 'relative' }}>
//                 {chartLoading && (
//                   <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: 8 }}>
//                     <div className="db-spinner"></div>
//                   </div>
//                 )}
//                 <div className="hbar-list">
//                   {[...chartAgents].sort((a, b) => (b.total_tickets || 0) - (a.total_tickets || 0)).map((a, i) => {
//                     const pct = Math.round(((a.total_tickets || 0) / maxTickets) * 100);
//                     return (
//                       <div key={i} className="hbar-row" onClick={() => openDetail(a)} style={{ cursor: 'pointer' }}>
//                         <div className="hbar-label">{fmt(a.agent.split(' ')[0])}</div>
//                         <div className="hbar-track">
//                           <div className={`hbar-fill ${a.is_top_performer ? 'top' : ''}`} style={{ width: `${pct}%` }}>
//                             <span className="hbar-val">{a.total_tickets}</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                   {chartAgents.length === 0 && (
//                     <div style={{ textAlign: 'center', padding: '30px 0', fontSize: 12, color: '#9aa0b4' }}>
//                       No data for this period
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* ── Analyst Performance Table (expanded) ── */}
//             <div className="db-card" style={{ minHeight: 0 }}>
//               <div className="db-card-head">
//                 <span className="db-card-title">Analyst performance directory</span>
//                 <span className="db-pill db-pill-ind">{agents.length} active</span>
//               </div>
//               <div className="db-table-wrap">
//                 <table className="db-table" style={{ minWidth: 600 }}>
//                   <thead>
//                     <tr>
//                       <th>Analyst</th>
//                       <th className="center">Total</th>
//                       <th className="center">INC</th>
//                       <th className="center">RIT</th>
//                       <th className="center">Passed</th>
//                       <th className="center">Failed</th>
//                       <th className="center">Unassigned</th>
//                       <th>Quality</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {agents.map((a, i) => (
//                       <tr key={i} onClick={() => openDetail(a)}
//                         onMouseEnter={() => setHoveredRow(i)}
//                         onMouseLeave={() => setHoveredRow(null)}>
//                         <td>
//                           <div className="db-arow">
//                             <div className="db-av">{a.agent?.charAt(0)?.toUpperCase()}</div>
//                             <span className="db-av-name">{fmt(a.agent)}</span>
//                             {a.is_top_performer  && <span className="badge badge-top">Top</span>}
//                             {a.is_bottom_performer && <span className="badge badge-low">Low</span>}
//                           </div>
//                         </td>
//                         <td className="center">
//                           <span style={{ color: '#6366f1', fontWeight: 600, fontSize: 11 }}>{a.total_tickets || 0}</span>
//                         </td>
//                         <td className="center"><span className="badge badge-ind">{a.ticket_split?.INC ?? 0}</span></td>
//                         <td className="center"><span className="badge badge-amb">{a.ticket_split?.RIT ?? 0}</span></td>
//                         <td className="center"><span className="badge badge-grn">{a.passed || 0}</span></td>
//                         <td className="center"><span className="badge badge-red">{a.failed || 0}</span></td>
//                         <td className="center"><span className="badge badge-gray">{a.qc_remaining || 0}</span></td>
//                         <td>
//                           <div className="db-prog">
//                             <div className="db-prog-track">
//                               <div className="db-prog-fill" style={{ width: `${a.pass_percentage || 0}%`, background: barColor(a.pass_percentage || 0) }} />
//                             </div>
//                             <span className="db-prog-lbl">{a.pass_percentage !== null && a.pass_percentage !== undefined ? `${a.pass_percentage}%` : '—'}</span>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* ── QA Admin Performance ── */}
//           <div className="db-card">
//             <div className="db-card-head-ind">
//               <span className="db-card-title">
//                 <i className="bi bi-person-badge-fill" style={{ marginRight: 7 }}></i>
//                 QA admin performance
//               </span>
//               <span className="db-pill-ghost">{qaAdmins.length} auditors</span>
//             </div>

//             {qaAdmins.length === 0 ? (
//               <div className="db-empty" style={{ padding: '40px 20px' }}>
//                 <p className="db-empty-title">No QA admin data</p>
//               </div>
//             ) : (
//               <div className="db-qa-grid">
//                 {qaAdmins.map((qa, idx) => {
//                   const pct = qa.qc_coverage_percentage ?? 0;
//                   const bs  = coverageStyle(pct);
//                   const bc  = pct >= 80 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#e24b4a';
//                   return (
//                     <div key={idx} className="db-qa-col">
//                       <span className="db-qa-cov-badge" style={bs}>{pct.toFixed(0)}%</span>
//                       <div className="db-qa-name-row">
//                         <div className="db-qa-av">{qa.qa_admin?.charAt(0)?.toUpperCase() || '?'}</div>
//                         <span className="db-qa-name">{fmt(qa.qa_admin)}</span>
//                       </div>
//                       <div className="db-qa-rows">
//                         {[
//                           { k: 'Assigned',  v: qa.assigned_incidents ?? 0 },
//                           { k: 'QC done',   v: qa.qc_done ?? 0 },
//                           { k: 'Remaining', v: qa.qc_remaining ?? 0 },
//                         ].map(r => (
//                           <div key={r.k} className="db-qa-row">
//                             <span className="db-qa-k">{r.k}</span>
//                             <span className="db-qa-v">{r.v}</span>
//                           </div>
//                         ))}
//                         <div className="db-qa-row">
//                           <span className="db-qa-k">Pass rate</span>
//                           {qa.pass_percentage === null || qa.pass_percentage === undefined
//                             ? <span className="badge badge-gray">—</span>
//                             : qa.pass_percentage >= 80
//                               ? <span className="badge badge-grn">{qa.pass_percentage}%</span>
//                               : <span className="badge badge-red">{qa.pass_percentage}%</span>
//                           }
//                         </div>
//                       </div>
//                       <div>
//                         <div className="db-qa-cov-lbl">Coverage</div>
//                         <div className="db-qa-cov-track">
//                           <div className="db-qa-cov-fill" style={{ width: `${pct}%`, background: bc }} />
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── ANALYST DETAIL VIEW ──────────────────── */}
//       {activeTab === 'team' && viewMode === 'detail' && (
//         <div className="db-card" style={{ flex: 1 }}>
//           <div className="db-detail-header">
//             <button className="db-back" onClick={() => setViewMode('list')}>
//               <i className="bi bi-arrow-left"></i> Back
//             </button>
//             <h3 className="db-detail-title">{fmt(selAgent?.agent)} <span>Tickets</span></h3>
//           </div>
//           <div className="db-table-wrap">
//             <table className="db-table">
//               <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Phase</th></tr></thead>
//               <tbody>
//                 {agentTickets.map((t, i) => (
//                   <tr key={i} onClick={() => openModal(t)}>
//                     <td className="inc-link"># {t.incident_number}</td>
//                     <td className="desc-cell">{t.short_description}</td>
//                     <td>
//                       <span className={`status-pill ${statusBadgeClass(t.status)}`}>{t.status}</span>
//                     </td>
//                     <td>
//                       <span className="status-pill" style={{ background: selQaDet.color + '18', color: selQaDet.color, borderColor: selQaDet.color + '40' }}>
//                         {detQa.toUpperCase()}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <Pager page={detPage} total={detTotal} onPrev={() => setDetPage(p => p - 1)} onNext={() => setDetPage(p => p + 1)} />
//           </div>
//         </div>
//       )}

//       {/* ── MY PENDING VIEW ──────────────────────── */}
//       {activeTab === 'pending' && (
//         <div className="db-card" style={{ flex: 1 }}>
//           <div className="db-card-head">
//             <span className="db-card-title">My Pending Queue</span>
//             <span className="db-pill">{pendTotal} records</span>
//           </div>
//           <div className="db-table-wrap">
//             {pending.length > 0 ? (
//               <>
//                 <table className="db-table">
//                   <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Resolution</th></tr></thead>
//                   <tbody>
//                     {pending.map((inc, i) => (
//                       <tr key={i}>
//                         <td className="inc-link"
//                           onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: inc, fromPending: true } })}>
//                           # {inc.incident_number}
//                         </td>
//                         <td className="desc-cell">{inc.short_description || 'No description'}</td>
//                         <td>
//                           <span className={`status-pill ${inc.status === 'resolved' ? 'pill-resolved' : inc.status === 'escalated' ? 'pill-escalated' : 'pill-default'}`}>
//                             {inc.status}
//                           </span>
//                         </td>
//                         <td style={{ fontSize: 11, color: '#7b8099' }}>{inc.resolution_shared || '—'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pager page={pendPage} total={pendTotal} perP={perPage} onPrev={() => setPendPage(p => p - 1)} onNext={() => setPendPage(p => p + 1)} />
//               </>
//             ) : (
//               <div className="db-empty">
//                 <i className="bi bi-inbox db-empty-icon"></i>
//                 <p className="db-empty-title">No records found</p>
//                 <span className="db-empty-sub">No incidents matching "{selQaPend.label}" for the selected criteria.</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── MODAL ────────────────────────────────── */}
//       {modal && selInc && (
//         <div className="db-modal-overlay" onClick={() => setModal(false)}>
//           <div className="db-modal" onClick={e => e.stopPropagation()}>
//             <div className="db-modal-head">
//               <h2 className="db-modal-title">{selInc.incident_number}</h2>
//               <button className="db-modal-close" onClick={() => setModal(false)}><i className="bi bi-x-lg"></i></button>
//             </div>
//             <div className="db-modal-body">
//               <div className="db-modal-agent">
//                 <div className="db-modal-av">{selInc.display_name?.charAt(0)?.toUpperCase()}</div>
//                 <div>
//                   <div className="db-modal-meta">Actioned by</div>
//                   <div className="db-modal-name">{fmt(selInc.display_name)}</div>
//                 </div>
//               </div>
//               <div className="db-modal-grid">
//                 <div className="db-modal-full">
//                   <div className="db-modal-lbl">Description</div>
//                   <div className="db-modal-val">{selInc.short_description}</div>
//                 </div>
//                 <div>
//                   <div className="db-modal-lbl">Status</div>
//                   <span className={`status-pill ${statusBadgeClass(selInc.status)}`}>{selInc.status?.toUpperCase()}</span>
//                 </div>
//                 <div className="db-modal-full">
//                   <div className="db-modal-lbl">Resolution Notes</div>
//                   <div className="db-modal-res">{selInc.resolution_shared || 'No details provided.'}</div>
//                 </div>
//               </div>
//             </div>
//             <div className="db-modal-footer">
//               <button className="db-done-btn" onClick={() => setModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllusersDashboard;

 import React, { useState, useEffect, useRef } from 'react';
 import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid,
   ResponsiveContainer, Tooltip, Cell,
 } from 'recharts';
 import api from '../api/axois';
 import { useAuth } from '../context/AuthContext';
 import { useNavigate } from 'react-router-dom';
 import '../pages/AlluserDashboard.css';
 
 /* ─── helpers ─────────────────────────────────────── */
 const fmt = (str) => {
   if (!str) return '';
   return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
 };
 const coverageStyle = (pct) => {
   if (pct === null || pct === undefined) return { background: '#f1f5f9', color: '#64748b' };
   if (pct >= 80) return { background: '#dcfce7', color: '#166534' };
   if (pct >= 40) return { background: '#fef9c3', color: '#92400e' };
   return { background: '#fee2e2', color: '#991b1b' };
 };
 const barFill = (pct) => pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#e24b4a';
 
 /* ─── Date helpers ─────────────────────────────────── */
 const toDateStr = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD
 
 const getDateRange = (timeframe) => {
   const today = new Date();
   const todayStr = toDateStr(today);
 
   if (timeframe === 'today') {
     return { from_date: todayStr, to_date: todayStr };
   }
   if (timeframe === 'weekly') {
     const start = new Date(today);
     start.setDate(today.getDate() - today.getDay()); // Sunday of current week
     return { from_date: toDateStr(start), to_date: todayStr };
   }
   if (timeframe === 'monthly') {
     const start = new Date(today.getFullYear(), today.getMonth(), 1);
     return { from_date: toDateStr(start), to_date: todayStr };
   }
   // 'overall' — no date filter
   return { from_date: undefined, to_date: undefined };
 };
 
 /* ── Premium status pill ── */
 const StatusPill = ({ status }) => {
   const s = status?.toLowerCase();
   let cls = 'sp-default';
   if (s === 'resolved')    cls = 'sp-resolved';
   if (s === 'escalated')   cls = 'sp-escalated';
   if (s === 'in progress') cls = 'sp-progress';
   return <span className={`sp ${cls}`}>{status || '—'}</span>;
 };
 
 /* ── Premium phase pill ── */
 const PhasePill = ({ phase }) => {
   const cls = phase === 'done' ? 'pp-done' : 'pp-pending';
   return <span className={`pp ${cls}`}>{phase?.toUpperCase()}</span>;
 };
 
 /* ── Bar chart tooltip ── */
 const BarTip = ({ active, payload, label }) => {
   if (!active || !payload?.length) return null;
   const a = payload[0].payload;
   return (
     <div style={{ background: '#fff', border: '0.5px solid #e4e7ef', borderRadius: 11, padding: '10px 14px', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 145 }}>
       <p style={{ margin: '0 0 7px', fontWeight: 700, color: '#1a1d2e', fontSize: 12 }}>{fmt(label)}</p>
       <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
         <span style={{ color: '#6366f1', fontWeight: 700 }}>🎫 {a.total_tickets} tickets</span>
         <span style={{ color: '#166534', fontWeight: 600 }}>✓ {a.passed || 0} passed</span>
         <span style={{ color: '#991b1b', fontWeight: 600 }}>✕ {a.failed || 0} failed</span>
       </div>
     </div>
   );
 };
 
 /* ── Skeleton rows ── */
 const SkeletonRows = ({ cols = 4, rows = 6 }) => (
   <>
     {Array.from({ length: rows }).map((_, i) => (
       <tr key={i} className="db-skeleton-row">
         {Array.from({ length: cols }).map((_, j) => (
           <td key={j} style={{ padding: '10px 12px' }}>
             <div className="db-skel" style={{ width: j === 0 ? '70%' : j === cols - 1 ? '55%' : '40%' }} />
           </td>
         ))}
       </tr>
     ))}
   </>
 );
 
 /* ── Inline load bar (shown during pagination) ── */
 const LoadBar = ({ visible }) => !visible ? null : (
   <div className="db-load-bar">
     <div className="db-load-bar-fill" />
   </div>
 );
 
 /* ══════════════════════════════════════════════════ */
 const AllusersDashboard = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
 
   /* ── state ── */
   const [activeTab, setActiveTab]   = useState('team');
   const [viewMode, setViewMode]     = useState('list');
   const [userList, setUserList]     = useState([]);
   const [data, setData]             = useState(null);
 
   // loading states — NO full-screen overlay ever
   const [tableLoading, setTableLoading] = useState(false);
   const [pageLoading, setPageLoading]   = useState(false);
 
   // Chart + Analyst table share one timeframe
   const [chartTimeframe, setChartTimeframe] = useState('overall');
   const [chartData, setChartData]           = useState(null);
   const [chartLoading, setChartLoading]     = useState(false);
 
   // SLA
   const [showSla, setShowSla]   = useState(false);
   const [slaData, setSlaData]   = useState([]);
   const [slaTotal, setSlaTotal] = useState(0);
   const [slaPage, setSlaPage]   = useState(1);
 
   // Pending tab
   const [pending, setPending]           = useState([]);
   const [pendPage, setPendPage]         = useState(1);
   const [pendTotal, setPendTotal]       = useState(0);
   const [statusFilter, setStatusFilter] = useState('');
   const [pendQa, setPendQa]             = useState('pending');
   const [pendFrom, setPendFrom]         = useState('');
   const [pendTo, setPendTo]             = useState('');
   const [qaDropPend, setQaDropPend]     = useState(false);
   const [stDropPend, setStDropPend]     = useState(false);
   const perPage = 10;
 
   // Detail
   const [selAgent, setSelAgent]         = useState(null);
   const [agentTickets, setAgentTickets] = useState([]);
   const [detPage, setDetPage]           = useState(1);
   const [detTotal, setDetTotal]         = useState(0);
   const [detFrom, setDetFrom]           = useState('');
   const [detTo, setDetTo]               = useState('');
   const [detQa, setDetQa]               = useState('pending');
   const [qaDropDet, setQaDropDet]       = useState(false);
 
   // Modal
   const [selInc, setSelInc] = useState(null);
   const [modal, setModal]   = useState(false);
 
   /* ── refs ── */
   const prevPendPage = useRef(1);
   const prevDetPage  = useRef(1);
 
   /* ── options ── */
   const statusOpts = [
     { id: '',            label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
     { id: 'resolved',    label: 'Resolved',      color: '#10b981', icon: 'bi-check-circle-fill' },
     { id: 'escalated',   label: 'Escalated',     color: '#b20f2a', icon: 'bi-fire' },
     { id: 'in progress', label: 'In Progress',   color: '#52be00', icon: 'bi-clock-history' },
   ];
   const qaOpts = [
     { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
     { id: 'done',    label: 'Done QA',    color: '#10b981', icon: 'bi-check-all' },
   ];
   const selStatus  = statusOpts.find(o => o.id === statusFilter) || statusOpts[0];
   const selQaPend  = qaOpts.find(o => o.id === pendQa);
   const selQaDet   = qaOpts.find(o => o.id === detQa);
 
   const tok = () => user?.token || localStorage.getItem('session_token');
   const sid = () => user?.sid   || user?.user_sid;
 
   /* ════════════════════════════════════════════════
      DERIVED: which analyst rows to show in the table
      — all_time when 'overall', filtered otherwise
   ═════════════════════════════════════════════════ */
   const summary  = data?.all_time?.summary              || {};
   const qaAdmins = data?.all_time?.qa_admin_performance || [];
 
   // Chart agents: filtered data when a timeframe is active, else all_time
   const chartAgents = (() => {
     if (chartTimeframe === 'overall') {
       return chartData?.all_time?.agent_performance || [];
     }
     return (
       chartData?.filtered?.agent_performance ||
       chartData?.all_time?.agent_performance  ||
       []
     );
   })();
 
   // Analyst performance directory mirrors chart timeframe
   const dirAgents = chartAgents;
 
   /* ── fetches ── */
   const fetchSla = async (page, isPaging = false) => {
     isPaging ? setPageLoading(true) : setTableLoading(true);
     try {
       const r = await api.post(
         '/users/get/sla-breached/incidents',
         { user_sid: sid(), page, per_page: 10 },
         { headers: { Authorization: `Bearer ${tok()}` } }
       );
       setSlaData(r.data.response || []);
       setSlaTotal(r.data.total   || 0);
     } catch (e) { console.error(e); }
     finally { setPageLoading(false); setTableLoading(false); }
   };
 
   useEffect(() => {
     if (!showSla || activeTab !== 'team') return;
     fetchSla(slaPage, slaPage > 1);
   }, [showSla, slaPage, activeTab]);
 
   // User list
   useEffect(() => {
     (async () => {
       try {
         const r = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${tok()}` } });
         setUserList(r.data || []);
       } catch (e) { console.error(e); }
     })();
   }, [user]);
 
   // Base dashboard (all-time summary + initial chart)
   useEffect(() => {
     if (activeTab !== 'team' || viewMode === 'detail') return;
     setTableLoading(true);
     (async () => {
       try {
         const r = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${tok()}` } });
         setData(r.data);
         setChartData(r.data);
       } catch (e) { console.error(e); }
       finally { setTableLoading(false); }
     })();
   }, [activeTab, viewMode, user]);
 
   // Chart + analyst directory — re-fetch when timeframe changes
   useEffect(() => {
     if (activeTab !== 'team' || viewMode === 'detail') return;
     setChartLoading(true);
 
     const { from_date, to_date } = getDateRange(chartTimeframe);
 
     (async () => {
       try {
         const r = await api.get('/users/admin/dashboard', {
           headers: { Authorization: `Bearer ${tok()}` },
           params: {
             timeframe: chartTimeframe,
             ...(from_date ? { from_date } : {}),
             ...(to_date   ? { to_date }   : {}),
           },
         });
         setChartData(r.data);
       } catch (e) { console.error(e); }
       finally { setChartLoading(false); }
     })();
   }, [chartTimeframe, activeTab, viewMode, user]);
 
   // Pending tab
   useEffect(() => {
     if (activeTab !== 'pending') return;
     const isPaging = pendPage !== prevPendPage.current;
     prevPendPage.current = pendPage;
     isPaging ? setPageLoading(true) : setTableLoading(true);
     (async () => {
       try {
         const r = await api.post(
           '/users/get-pending/incidents/all',
           { user_sid: sid(), page: pendPage, per_page: perPage },
           {
             headers: { Authorization: `Bearer ${tok()}` },
             params: {
               resolution_status: statusFilter || undefined,
               qa_state: pendQa,
               from_date: pendFrom || undefined,
               to_date:   pendTo   || undefined,
             },
           }
         );
         setPending(r.data.response || []);
         setPendTotal(r.data.total  || 0);
       } catch (e) { console.error(e); setPending([]); }
       finally { setPageLoading(false); setTableLoading(false); }
     })();
   }, [activeTab, pendPage, statusFilter, pendQa, pendFrom, pendTo, user]);
 
   // Detail view fetch
   const fetchDetail = async (agent, page, isPaging = false) => {
     isPaging ? setPageLoading(true) : setTableLoading(true);
     try {
       const found = userList.find(u => u.full_name.toLowerCase() === agent.agent.toLowerCase());
       if (found) {
         const r = await api.post(
           '/users/get-pending/incidents/all',
           { user_sid: found.sid, page, per_page: 10 },
           {
             headers: { Authorization: `Bearer ${tok()}` },
             params: {
               qa_state:  detQa,
               from_date: detFrom || undefined,
               to_date:   detTo   || undefined,
             },
           }
         );
         setAgentTickets(r.data.response || []);
         setDetTotal(r.data.total       || 0);
       }
     } catch (e) { console.error(e); setAgentTickets([]); }
     finally { setPageLoading(false); setTableLoading(false); }
   };
 
   useEffect(() => {
     if (viewMode !== 'detail' || !selAgent) return;
     const isPaging = detPage !== prevDetPage.current;
     prevDetPage.current = detPage;
     fetchDetail(selAgent, detPage, isPaging);
   }, [detPage]);
 
   useEffect(() => {
     if (viewMode !== 'detail' || !selAgent) return;
     fetchDetail(selAgent, detPage, false);
   }, [detFrom, detTo, detQa]);
 
   const openDetail = (a) => {
     setSelAgent(a); setViewMode('detail');
     prevDetPage.current = 1; setDetPage(1);
     fetchDetail(a, 1, false);
   };
   const openModal = (t) => {
     setSelInc({ ...t, display_name: selAgent?.agent || t.done_by || 'System' });
     setModal(true);
   };
 
   /* ── Reusable dropdown ── */
   const DD = ({ open, setOpen, selected, opts, onSelect, label }) => (
     <div className="db-flt" style={{ position: 'relative' }}>
       <label className="db-flbl">{label}</label>
       <div className="db-fbtn" onClick={() => setOpen(o => !o)}>
         <div className="db-dot" style={{ background: selected.color }} />
         <span>{selected.label}</span>
         <i className="bi bi-chevron-down db-chevron"></i>
       </div>
       {open && (
         <div className="db-dropdown" style={{ zIndex: 9999 }}>
           {opts.map(o => (
             <div key={o.id} className="db-menu-item" onClick={() => { onSelect(o.id); setOpen(false); }}>
               <i className={`bi ${o.icon}`} style={{ color: o.color, fontSize: 13 }}></i> {o.label}
             </div>
           ))}
         </div>
       )}
     </div>
   );
 
   /* ── Premium pager ── */
   const Pager = ({ page, total, perP = 10, onChange }) => {
     const totalPages = Math.max(Math.ceil((total || 0) / perP), 1);
     const getPages = () => {
       if (totalPages <= 9) return Array.from({ length: totalPages }, (_, i) => i + 1);
       const pages = []; const left = page - 2; const right = page + 2;
       pages.push(1);
       if (left > 2) pages.push('…');
       for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) pages.push(i);
       if (right < totalPages - 1) pages.push('…');
       pages.push(totalPages);
       return pages;
     };
     return (
       <div className="db-pag">
         <button className="db-pag-btn db-pag-ico" disabled={page === 1} onClick={() => onChange(1)} title="First"><i className="bi bi-chevron-double-left"></i></button>
         <button className="db-pag-btn db-pag-ico" disabled={page === 1} onClick={() => onChange(page - 1)} title="Prev"><i className="bi bi-chevron-left"></i></button>
         <div className="db-pag-nums">
           {getPages().map((p, i) =>
             p === '…'
               ? <span key={`e${i}`} className="db-pag-ellipsis">…</span>
               : <button key={p} className={`db-pag-num-btn ${p === page ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
           )}
         </div>
         <button className="db-pag-btn db-pag-ico" disabled={page >= totalPages} onClick={() => onChange(page + 1)} title="Next"><i className="bi bi-chevron-right"></i></button>
         <button className="db-pag-btn db-pag-ico" disabled={page >= totalPages} onClick={() => onChange(totalPages)} title="Last"><i className="bi bi-chevron-double-right"></i></button>
         <div className="db-pag-jump">
           <span className="db-pag-jump-lbl">Go to</span>
           <input type="number" min={1} max={totalPages} className="db-pag-jump-input" placeholder="—"
             onKeyDown={e => {
               if (e.key === 'Enter') {
                 const v = parseInt(e.target.value);
                 if (v >= 1 && v <= totalPages) { onChange(v); e.target.value = ''; }
               }
             }} />
           <span className="db-pag-jump-lbl">/ {totalPages}</span>
         </div>
       </div>
     );
   };
 
   /* ── Timeframe label for table header ── */
   const timeframeLabel = {
     overall: 'All Time',
     today:   'Today',
     weekly:  'This Week',
     monthly: 'This Month',
   }[chartTimeframe];
 
   /* ══════════════════════════════════════════════ */
   return (
     <div className="db-root">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
 
       {/* ── HEADER ─────────────────────────────────── */}
       <header className="db-header">
         <div className="db-header-top">
           <div className="db-brand">
             <div className="db-brand-icon">
               <i className="bi bi-shield-check"></i>
             </div>
             <div className="db-brand-text">
               <div className="db-brand-name">Audit<span>Pulse</span></div>
               <div className="db-brand-tagline">Quality Intelligence Platform</div>
             </div>
           </div>
 
           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
             <div className="db-header-meta">
               <div className="db-meta-badge">
                 <div className="db-meta-dot"></div>
                 Live
               </div>
               <div className="db-meta-badge">
                 <i className="bi bi-ticket-perforated" style={{ fontSize: 10 }}></i>
                 {summary.total_tickets || 0} tickets
               </div>
               <div className="db-meta-badge">
                 <i className="bi bi-graph-up" style={{ fontSize: 10 }}></i>
                 {summary.pass_percentage || 0}% quality
               </div>
             </div>
             <div className="db-tabs">
               <button className={`db-tab ${activeTab === 'team' ? 'active' : ''}`}
                 onClick={() => { setActiveTab('team'); setViewMode('list'); setShowSla(false); }}>
                 <i className="bi bi-people-fill" style={{ marginRight: 5 }}></i>Team View
               </button>
               <button className={`db-tab ${activeTab === 'pending' ? 'active' : ''}`}
                 onClick={() => setActiveTab('pending')}>
                 <i className="bi bi-hourglass-split" style={{ marginRight: 5 }}></i>My Pending
               </button>
             </div>
           </div>
         </div>
 
         {/* Filters row */}
         {((activeTab === 'team' && viewMode === 'detail') || activeTab === 'pending') && (
           <div className="db-header-bottom">
             <div style={{ fontSize: 10, fontWeight: 600, color: '#7b8099', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
               {activeTab === 'pending' ? 'Pending Queue Filters' : `Analyst: ${fmt(selAgent?.agent)}`}
             </div>
             <div className="db-filters">
               {activeTab === 'team' && viewMode === 'detail' && (
                 <>
                   <DD label="Audit Phase" open={qaDropDet} setOpen={setQaDropDet} selected={selQaDet} opts={qaOpts} onSelect={v => { setDetQa(v); setDetPage(1); }} />
                   <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={detFrom} onChange={e => setDetFrom(e.target.value)} /></div>
                   <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={detTo} onChange={e => setDetTo(e.target.value)} /></div>
                   <div className="db-flt"><label className="db-flbl">Reset</label><button className="db-reset" onClick={() => { setDetFrom(''); setDetTo(''); setDetPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button></div>
                 </>
               )}
               {activeTab === 'pending' && (
                 <>
                   <DD label="QA Status"      open={qaDropPend} setOpen={setQaDropPend} selected={selQaPend}  opts={qaOpts}     onSelect={v => { setPendQa(v);      setPendPage(1); }} />
                   <DD label="Incident State" open={stDropPend} setOpen={setStDropPend} selected={selStatus}  opts={statusOpts} onSelect={v => { setStatusFilter(v); setPendPage(1); }} />
                   <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={pendFrom} onChange={e => setPendFrom(e.target.value)} /></div>
                   <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={pendTo} onChange={e => setPendTo(e.target.value)} /></div>
                   <div className="db-flt"><label className="db-flbl">Reset</label><button className="db-reset" onClick={() => { setPendFrom(''); setPendTo(''); setPendPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button></div>
                 </>
               )}
             </div>
           </div>
         )}
       </header>
 
       {/* ── STATS BANNER (always all-time) ───────────────── */}
       {activeTab === 'team' && (
         <div className="db-banner">
           <div className={`db-stat clickable ${!showSla && viewMode === 'list' ? 'active-ind' : ''}`} onClick={() => setShowSla(false)}>
             <div className="db-ico ico-ind"><i className="bi bi-ticket-perforated-fill"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl">Total Tickets</span>
               <span className="db-stat-val">{viewMode === 'list' ? (summary.total_tickets || 0) : (selAgent?.total_tickets || 0)}</span>
             </div>
           </div>
           
           <div className="db-stat">
             <div className="db-ico ico-vio"><i className="bi bi-inbox-fill"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl">Unassigned QA</span>
               <span className="db-stat-val val-ind">{summary.unassigned_qa_tickets || 0}</span>
             </div>
           </div>
           <div className="db-stat">
             <div className="db-ico ico-vio"><i className="bi bi-inbox-fill"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl">Pending Assigned</span>
               <span className="db-stat-val val-ind">{summary.pending || 0}</span>
             </div>
           </div>
           <div className="db-stat">
             <div className="db-ico ico-vio"><i className="bi bi-inbox-fill"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl">QC remaining</span>
               <span className="db-stat-val val-ind">{summary.qc_remaining || 0}</span>
             </div>
           </div>
           <div className="db-stat">
             <div className="db-ico ico-grn"><i className="bi bi-shield-check"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl"> QA Passed</span>
               <span className="db-stat-val val-grn">{viewMode === 'list' ? (summary.passed || 0) : (selAgent?.passed || 0)}</span>
             </div>
           </div>
            <div className="db-stat">
             <div className="db-ico ico-grn"><i className="bi bi-shield-check"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl"> QA Failed</span>
               <span className="db-stat-val val-grn">{viewMode === 'list' ? (summary.failed || 0) : (selAgent?.passed || 0)}</span>
             </div>
           </div>
            <div className="db-stat">
             <div className="db-ico ico-grn"><i className="bi bi-shield-check"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl">QA Completed</span>
               <span className="db-stat-val val-grn">{viewMode === 'list' ? (summary.qc_done || 0) : (selAgent?.passed || 0)}</span>
             </div>
           </div>
           {viewMode === 'list' ? (
             <div className={`db-stat clickable ${showSla ? 'active-red' : ''}`} onClick={() => setShowSla(true)}>
               <div className="db-ico ico-red"><i className="bi bi-exclamation-octagon-fill"></i></div>
               <div className="db-stat-info">
                 <span className="db-stat-lbl">SLA Breached</span>
                 <span className="db-stat-val val-red">{summary.sla_breached || 0}</span>
               </div>
             </div>
           ) : (
             <div className="db-stat">
               <div className="db-ico ico-vio"><i className="bi bi-stars"></i></div>
               <div className="db-stat-info">
                 <span className="db-stat-lbl">Total QA Score</span>
                 <span className="db-stat-val val-ind">{summary.pass_percentage || 0} %</span>
                 <div className="dbv2-stat-foot">
                <span className="dbv2-foot-lbl">all time</span>
                <span className="dbv2-foot-val" style={{ color: '#7c3aed' }}>+{summary.pass_percentage || 0}%</span>
              </div>
               </div>
             </div>
           )}
           <div className="db-stat">
             <div className="db-ico ico-amb"><i className="bi bi-graph-up-arrow"></i></div>
             <div className="db-stat-info">
               <span className="db-stat-lbl">Quality Rate</span>
               <span className="db-stat-val val-amb">
                 {viewMode === 'list' ? `${summary.pass_percentage || 0}%` : `${selAgent?.pass_percentage || 0}%`}
               </span>
             </div>
           </div>
         </div>
       )}
 
       {/* ── SLA BREACH VIEW ── */}
       {activeTab === 'team' && viewMode === 'list' && showSla && (
         <div className="db-card" style={{ flex: 1 }}>
           <div className="db-card-head-ind">
             <span className="db-card-title"><i className="bi bi-exclamation-octagon-fill" style={{ marginRight: 7 }}></i>Global SLA Breaches</span>
             <button className="db-back" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.3)' }} onClick={() => setShowSla(false)}>
               <i className="bi bi-arrow-left"></i> Back
             </button>
           </div>
           <div className="db-table-wrap">
             <table className="db-table">
               <thead><tr><th>Incident</th><th>Actioned By</th><th>Description</th><th>Status</th></tr></thead>
               <tbody>
                 {tableLoading
                   ? <SkeletonRows cols={4} rows={6} />
                   : slaData.length === 0
                     ? <tr><td colSpan={4}><div className="db-empty"><i className="bi bi-patch-check db-empty-icon"></i><p className="db-empty-title">No SLA breaches</p><span className="db-empty-sub">All incidents are within service level targets.</span></div></td></tr>
                     : slaData.map((it, i) => (
                         <tr key={i}>
                           <td className="inc-link">{it.incident_number}</td>
                           <td>{fmt(it.done_by)}</td>
                           <td className="desc-cell">{it.short_description}</td>
                           <td><span className="badge badge-red">SLA Breached</span></td>
                         </tr>
                       ))
                 }
               </tbody>
             </table>
             <LoadBar visible={pageLoading} />
             <Pager page={slaPage} total={slaTotal} onChange={setSlaPage} />
           </div>
         </div>
       )}
 
       {/* ── TEAM LIST VIEW ── */}
       {activeTab === 'team' && viewMode === 'list' && !showSla && (
         <div className="db-full">
           <div className="db-grid-2">
 
             {/* ── Premium bar chart ── */}
             <div className="db-card db-chart-card">
               <div className="db-card-head" style={{ flexWrap: 'wrap', gap: 8 }}>
                 <div>
                   <span className="db-card-title">
                     <i className="bi bi-bar-chart-line-fill" style={{ marginRight: 7, color: '#6366f1' }}></i>
                     Tickets by Analyst
                   </span>
                   <div style={{ fontSize: 10, color: '#9aa0b4', fontWeight: 600, marginTop: 2, letterSpacing: '0.04em' }}>
                     PERFORMANCE DISTRIBUTION · {timeframeLabel.toUpperCase()}
                   </div>
                 </div>
                 <div className="db-tf-switch">
                   {[
                     { id: 'overall', label: 'Overall', icon: 'bi-infinity' },
                     { id: 'today',   label: 'Today',   icon: 'bi-calendar-day' },
                     { id: 'monthly', label: 'Monthly', icon: 'bi-calendar-month' },
                     { id: 'weekly',  label: 'Weekly',  icon: 'bi-calendar-week' },
                   ].map(opt => (
                     <button key={opt.id}
                       onClick={() => setChartTimeframe(opt.id)}
                       className={`db-tf-btn ${chartTimeframe === opt.id ? 'active' : ''}`}>
                       <i className={`bi ${opt.icon}`}></i> {opt.label}
                     </button>
                   ))}
                 </div>
               </div>
 
               <div className="db-chart-legend">
                 <span><i style={{ background: 'linear-gradient(135deg,#10b981,#34d399)' }}></i> Top performer</span>
                 <span><i style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}></i> Standard</span>
                 <span><i style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}></i> Needs focus</span>
               </div>
 
               <div style={{ padding: '4px 14px 14px', position: 'relative', flex: 1, minHeight: 260 }}>
                 {chartLoading && (
                   <div className="db-chart-loader">
                     <div className="db-spinner"></div>
                   </div>
                 )}
                 <ResponsiveContainer width="100%" height={260}>
                   <BarChart
                     data={[...chartAgents].sort((a, b) => (b.total_tickets || 0) - (a.total_tickets || 0))}
                     margin={{ top: 22, right: 14, left: -14, bottom: 30 }}
                     barCategoryGap="28%"
                   >
                     <defs>
                       <linearGradient id="grad-std" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%"   stopColor="#818cf8" stopOpacity={1} />
                         <stop offset="60%"  stopColor="#6366f1" stopOpacity={0.95} />
                         <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.85} />
                       </linearGradient>
                       <linearGradient id="grad-top" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%"   stopColor="#34d399" stopOpacity={1} />
                         <stop offset="60%"  stopColor="#10b981" stopOpacity={0.95} />
                         <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                       </linearGradient>
                       <linearGradient id="grad-low" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%"   stopColor="#fbbf24" stopOpacity={1} />
                         <stop offset="60%"  stopColor="#f59e0b" stopOpacity={0.95} />
                         <stop offset="100%" stopColor="#d97706" stopOpacity={0.85} />
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="#e4e7ef" />
                     <XAxis dataKey="agent" axisLine={false} tickLine={false}
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#7b8099' }}
                       interval={0} angle={-22} textAnchor="end"
                       tickFormatter={n => fmt(n.split(' ')[0])} />
                     <YAxis axisLine={false} tickLine={false}
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#9aa0b4' }}
                       allowDecimals={false} />
                     <Tooltip cursor={{ fill: 'rgba(99,102,241,0.08)', radius: [8, 8, 0, 0] }} content={<BarTip />} />
                     <Bar dataKey="total_tickets" radius={[8, 8, 0, 0]} maxBarSize={42}
                       label={{ position: 'top', fontSize: 10, fontWeight: 800, fill: '#1a1d2e' }}>
                       {[...chartAgents]
                         .sort((a, b) => (b.total_tickets || 0) - (a.total_tickets || 0))
                         .map((a, i) => (
                           <Cell key={i}
                             fill={a.is_top_performer ? 'url(#grad-top)' : a.is_bottom_performer ? 'url(#grad-low)' : 'url(#grad-std)'}
                             cursor="pointer"
                             onClick={() => openDetail(a)}
                             style={{ filter: a.is_top_performer ? 'drop-shadow(0 6px 12px rgba(16,185,129,0.35))' : 'drop-shadow(0 4px 8px rgba(99,102,241,0.25))' }}
                           />
                         ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
 
             {/* ── Analyst performance directory — mirrors timeframe ── */}
             <div className="db-card" style={{ minHeight: 0 }}>
               <div className="db-card-head">
                 <div>
                   <span className="db-card-title">Analyst performance directory</span>
                   {/* Timeframe badge below title */}
                   <div style={{ marginTop: 3 }}>
                     <span className="db-timeframe-badge">
                       <i className={`bi ${chartTimeframe === 'today' ? 'bi-calendar-day' : chartTimeframe === 'weekly' ? 'bi-calendar-week' : chartTimeframe === 'monthly' ? 'bi-calendar-month' : 'bi-infinity'}`}
                         style={{ marginRight: 4 }}></i>
                       {timeframeLabel}
                     </span>
                   </div>
                 </div>
                 <span className="db-pill db-pill-ind">{dirAgents.length} active</span>
               </div>
               <div className="db-table-wrap">
                 {/* Empty state for filtered with no data */}
                 {!tableLoading && !chartLoading && dirAgents.length === 0 && (
                   <div className="db-empty" style={{ padding: '40px 20px' }}>
                     <i className="bi bi-calendar-x db-empty-icon"></i>
                     <p className="db-empty-title">No data for {timeframeLabel}</p>
                     <span className="db-empty-sub">No analyst activity recorded for this period. Try a wider timeframe.</span>
                   </div>
                 )}
                 {(tableLoading || chartLoading || dirAgents.length > 0) && (
                   <table className="db-table" style={{ minWidth: 600 }}>
                     <thead>
                       <tr>
                         <th>Analyst</th>
                         <th className="center">Total</th>
                         <th className="center">INC</th>
                         <th className="center">RIT</th>
                         <th className="center">Passed</th>
                         <th className="center">Failed</th>
                         <th className="center">Unassigned</th>
                         <th>Quality</th>
                       </tr>
                     </thead>
                     <tbody>
                       {(tableLoading || chartLoading)
                         ? <SkeletonRows cols={8} rows={6} />
                         : dirAgents.map((a, i) => (
                             <tr key={i} onClick={() => openDetail(a)}>
                               <td>
                                 <div className="db-arow">
                                   <div className="db-av">{a.agent?.charAt(0)?.toUpperCase()}</div>
                                   <span className="db-av-name">{fmt(a.agent)}</span>
                                   {a.is_top_performer   && <span className="badge badge-top">Top</span>}
                                   {a.is_bottom_performer && <span className="badge badge-low">Low</span>}
                                 </div>
                               </td>
                               <td className="center"><span style={{ color: '#6366f1', fontWeight: 700 }}>{a.total_tickets || 0}</span></td>
                               <td className="center"><span className="badge badge-ind">{a.ticket_split?.INC ?? 0}</span></td>
                               <td className="center"><span className="badge badge-amb">{a.ticket_split?.RIT ?? 0}</span></td>
                               <td className="center"><span className="badge badge-grn">{a.passed || 0}</span></td>
                               <td className="center"><span className="badge badge-red">{a.failed || 0}</span></td>
                               <td className="center"><span className="badge badge-gray">{a.qc_remaining || 0}</span></td>
                               <td>
                                 <div className="db-prog">
                                   <div className="db-prog-track">
                                     <div className="db-prog-fill" style={{ width: `${a.pass_percentage || 0}%`, background: barFill(a.pass_percentage || 0) }} />
                                   </div>
                                   <span className="db-prog-lbl">{a.pass_percentage !== null && a.pass_percentage !== undefined ? `${a.pass_percentage}%` : '—'}</span>
                                 </div>
                               </td>
                             </tr>
                           ))
                       }
                     </tbody>
                   </table>
                 )}
               </div>
             </div>
           </div>
 
           {/* QA Admin section */}
           <div className="db-card">
             <div className="db-card-head-ind">
               <span className="db-card-title"><i className="bi bi-person-badge-fill" style={{ marginRight: 7 }}></i>QA Admin Performance</span>
               <span className="db-pill-ghost">{qaAdmins.length} Auditors</span>
             </div>
             {qaAdmins.length === 0
               ? <div className="db-empty" style={{ padding: '32px' }}><p className="db-empty-title">No QA admin data</p></div>
               : (
                 <div className="db-qa-grid">
                   {qaAdmins.map((qa, idx) => {
                     const pct = qa.qc_coverage_percentage ?? 0;
                     const bs  = coverageStyle(pct);
                     const bc  = pct >= 80 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#e24b4a';
                     return (
                       <div key={idx} className="db-qa-col">
                         <span className="db-qa-cov-badge" style={bs}>{pct.toFixed(0)}%</span>
                         <div className="db-qa-name-row">
                           <div className="db-qa-av">{qa.qa_admin?.charAt(0)?.toUpperCase() || '?'}</div>
                           <span className="db-qa-name">{fmt(qa.qa_admin)}</span>
                         </div>
                         <div className="db-qa-rows">
                           {[['Assigned', qa.assigned_incidents ?? 0], ['QC Done', qa.qc_done ?? 0], ['Remaining', qa.qc_remaining ?? 0]].map(([k, v]) => (
                             <div key={k} className="db-qa-row"><span className="db-qa-k">{k}</span><span className="db-qa-v">{v}</span></div>
                           ))}
                           <div className="db-qa-row">
                             <span className="db-qa-k">Pass rate</span>
                             {qa.pass_percentage === null || qa.pass_percentage === undefined
                               ? <span className="badge badge-gray">—</span>
                               : qa.pass_percentage >= 80
                                 ? <span className="badge badge-grn">{qa.pass_percentage}%</span>
                                 : <span className="badge badge-red">{qa.pass_percentage}%</span>
                             }
                           </div>
                         </div>
                         <div>
                           <div className="db-qa-cov-lbl">Coverage</div>
                           <div className="db-qa-cov-track">
                             <div className="db-qa-cov-fill" style={{ width: `${pct}%`, background: bc }} />
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )
             }
           </div>
         </div>
       )}
 
       {/* ── ANALYST DETAIL VIEW ── */}
       {activeTab === 'team' && viewMode === 'detail' && (
         <div className="db-card" style={{ flex: 1 }}>
           <div className="db-detail-header">
             <button className="db-back" onClick={() => setViewMode('list')}>
               <i className="bi bi-arrow-left"></i> Back
             </button>
             <h3 className="db-detail-title">{fmt(selAgent?.agent)} <span>Tickets</span></h3>
           </div>
           <div className="db-table-wrap">
             <table className="db-table">
               <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Phase</th></tr></thead>
               <tbody>
                 {tableLoading
                   ? <SkeletonRows cols={4} rows={8} />
                   : agentTickets.map((t, i) => (
                       <tr key={i} onClick={() => openModal(t)}>
                         <td className="inc-link"># {t.incident_number}</td>
                         <td className="desc-cell">{t.short_description}</td>
                         <td><StatusPill status={t.status} /></td>
                         <td><PhasePill phase={detQa} /></td>
                       </tr>
                     ))
                 }
               </tbody>
             </table>
             <LoadBar visible={pageLoading} />
             <Pager page={detPage} total={detTotal} onChange={setDetPage} />
           </div>
         </div>
       )}
 
       {/* ── MY PENDING VIEW ── */}
       {activeTab === 'pending' && (
         <div className="db-card" style={{ flex: 1 }}>
           <div className="db-card-head">
             <span className="db-card-title">My Pending Queue</span>
             <span className="db-pill">{pendTotal} records</span>
           </div>
           <div className="db-table-wrap">
             <table className="db-table">
               <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Resolution</th></tr></thead>
               <tbody>
                 {tableLoading
                   ? <SkeletonRows cols={4} rows={8} />
                   : pending.length === 0
                     ? <tr><td colSpan={4}>
                         <div className="db-empty">
                           <i className="bi bi-inbox db-empty-icon"></i>
                           <p className="db-empty-title">No records found</p>
                           <span className="db-empty-sub">No incidents matching "{selQaPend?.label}" for the selected criteria.</span>
                         </div>
                       </td></tr>
                     : pending.map((inc, i) => (
                         <tr key={i}>
                           <td className="inc-link"
                             onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: inc, fromPending: true } })}>
                             # {inc.incident_number}
                           </td>
                           <td className="desc-cell">{inc.short_description || 'No description'}</td>
                           <td><StatusPill status={inc.status} /></td>
                           <td style={{ fontSize: 12, color: '#7b8099', fontWeight: 500 }}>{inc.resolution_shared || '—'}</td>
                         </tr>
                       ))
                 }
               </tbody>
             </table>
             <LoadBar visible={pageLoading} />
             <Pager page={pendPage} total={pendTotal} perP={perPage} onChange={setPendPage} />
           </div>
         </div>
       )}
 
       {/* ── MODAL ── */}
       {modal && selInc && (
         <div className="db-modal-overlay" onClick={() => setModal(false)}>
           <div className="db-modal" onClick={e => e.stopPropagation()}>
             <div className="db-modal-head">
               <h2 className="db-modal-title">{selInc.incident_number}</h2>
               <button className="db-modal-close" onClick={() => setModal(false)}><i className="bi bi-x-lg"></i></button>
             </div>
             <div className="db-modal-body">
               <div className="db-modal-agent">
                 <div className="db-modal-av">{selInc.display_name?.charAt(0)?.toUpperCase()}</div>
                 <div>
                   <div className="db-modal-meta">Actioned by</div>
                   <div className="db-modal-name">{fmt(selInc.display_name)}</div>
                 </div>
               </div>
               <div className="db-modal-grid">
                 <div className="db-modal-full">
                   <div className="db-modal-lbl">Description</div>
                   <div className="db-modal-val">{selInc.short_description}</div>
                 </div>
                 <div>
                   <div className="db-modal-lbl">Status</div>
                   <StatusPill status={selInc.status} />
                 </div>
                 <div className="db-modal-full">
                   <div className="db-modal-lbl">Resolution Notes</div>
                   <div className="db-modal-res">{selInc.resolution_shared || 'No details provided.'}</div>
                 </div>
               </div>
             </div>
             <div className="db-modal-footer">
               <button className="db-done-btn" onClick={() => setModal(false)}>Close</button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default AllusersDashboard;
 
