


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

//  import React, { useState, useEffect, useRef } from 'react';
//  import {
//    BarChart, Bar, XAxis, YAxis, CartesianGrid,
//    ResponsiveContainer, Tooltip, Cell,
//  } from 'recharts';
//  import api from '../api/axois';
//  import { useAuth } from '../context/AuthContext';
//  import { useNavigate } from 'react-router-dom';
//  import '../pages/AlluserDashboard.css';
 
//  /* ─── helpers ─────────────────────────────────────── */
//  const fmt = (str) => {
//    if (!str) return '';
//    return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
//  };
//  const coverageStyle = (pct) => {
//    if (pct === null || pct === undefined) return { background: '#f1f5f9', color: '#64748b' };
//    if (pct >= 80) return { background: '#dcfce7', color: '#166534' };
//    if (pct >= 40) return { background: '#fef9c3', color: '#92400e' };
//    return { background: '#fee2e2', color: '#991b1b' };
//  };
//  const barFill = (pct) => pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#e24b4a';
 
//  /* ─── Date helpers ─────────────────────────────────── */
//  const toDateStr = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD
 
//  const getDateRange = (timeframe) => {
//    const today = new Date();
//    const todayStr = toDateStr(today);
 
//    if (timeframe === 'today') {
//      return { from_date: todayStr, to_date: todayStr };
//    }
//    if (timeframe === 'weekly') {
//      const start = new Date(today);
//      start.setDate(today.getDate() - today.getDay()); // Sunday of current week
//      return { from_date: toDateStr(start), to_date: todayStr };
//    }
//    if (timeframe === 'monthly') {
//      const start = new Date(today.getFullYear(), today.getMonth(), 1);
//      return { from_date: toDateStr(start), to_date: todayStr };
//    }
//    // 'overall' — no date filter
//    return { from_date: undefined, to_date: undefined };
//  };
 
//  /* ── Premium status pill ── */
//  const StatusPill = ({ status }) => {
//    const s = status?.toLowerCase();
//    let cls = 'sp-default';
//    if (s === 'resolved')    cls = 'sp-resolved';
//    if (s === 'escalated')   cls = 'sp-escalated';
//    if (s === 'in progress') cls = 'sp-progress';
//    return <span className={`sp ${cls}`}>{status || '—'}</span>;
//  };
 
//  /* ── Premium phase pill ── */
//  const PhasePill = ({ phase }) => {
//    const cls = phase === 'done' ? 'pp-done' : 'pp-pending';
//    return <span className={`pp ${cls}`}>{phase?.toUpperCase()}</span>;
//  };
 
//  /* ── Bar chart tooltip ── */
//  const BarTip = ({ active, payload, label }) => {
//    if (!active || !payload?.length) return null;
//    const a = payload[0].payload;
//    return (
//      <div style={{ background: '#fff', border: '0.5px solid #e4e7ef', borderRadius: 11, padding: '10px 14px', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 145 }}>
//        <p style={{ margin: '0 0 7px', fontWeight: 700, color: '#1a1d2e', fontSize: 12 }}>{fmt(label)}</p>
//        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//          <span style={{ color: '#6366f1', fontWeight: 700 }}>🎫 {a.total_tickets} tickets</span>
//          <span style={{ color: '#166534', fontWeight: 600 }}>✓ {a.passed || 0} passed</span>
//          <span style={{ color: '#991b1b', fontWeight: 600 }}>✕ {a.failed || 0} failed</span>
//        </div>
//      </div>
//    );
//  };
 
//  /* ── Skeleton rows ── */
//  const SkeletonRows = ({ cols = 4, rows = 6 }) => (
//    <>
//      {Array.from({ length: rows }).map((_, i) => (
//        <tr key={i} className="db-skeleton-row">
//          {Array.from({ length: cols }).map((_, j) => (
//            <td key={j} style={{ padding: '10px 12px' }}>
//              <div className="db-skel" style={{ width: j === 0 ? '70%' : j === cols - 1 ? '55%' : '40%' }} />
//            </td>
//          ))}
//        </tr>
//      ))}
//    </>
//  );
 
//  /* ── Inline load bar (shown during pagination) ── */
//  const LoadBar = ({ visible }) => !visible ? null : (
//    <div className="db-load-bar">
//      <div className="db-load-bar-fill" />
//    </div>
//  );
 
//  /* ══════════════════════════════════════════════════ */
//  const AllusersDashboard = () => {
//    const { user } = useAuth();
//    const navigate = useNavigate();
 
//    /* ── state ── */
//    const [activeTab, setActiveTab]   = useState('team');
//    const [viewMode, setViewMode]     = useState('list');
//    const [userList, setUserList]     = useState([]);
//    const [data, setData]             = useState(null);
 
//    // loading states — NO full-screen overlay ever
//    const [tableLoading, setTableLoading] = useState(false);
//    const [pageLoading, setPageLoading]   = useState(false);
 
//    // Chart + Analyst table share one timeframe
//    const [chartTimeframe, setChartTimeframe] = useState('overall');
//    const [chartData, setChartData]           = useState(null);
//    const [chartLoading, setChartLoading]     = useState(false);
 
//    // SLA
//    const [showSla, setShowSla]   = useState(false);
//    const [slaData, setSlaData]   = useState([]);
//    const [slaTotal, setSlaTotal] = useState(0);
//    const [slaPage, setSlaPage]   = useState(1);
 
//    // Pending tab
//    const [pending, setPending]           = useState([]);
//    const [pendPage, setPendPage]         = useState(1);
//    const [pendTotal, setPendTotal]       = useState(0);
//    const [statusFilter, setStatusFilter] = useState('');
//    const [pendQa, setPendQa]             = useState('pending');
//    const [pendFrom, setPendFrom]         = useState('');
//    const [pendTo, setPendTo]             = useState('');
//    const [qaDropPend, setQaDropPend]     = useState(false);
//    const [stDropPend, setStDropPend]     = useState(false);
//    const perPage = 10;
 
//    // Detail
//    const [selAgent, setSelAgent]         = useState(null);
//    const [agentTickets, setAgentTickets] = useState([]);
//    const [detPage, setDetPage]           = useState(1);
//    const [detTotal, setDetTotal]         = useState(0);
//    const [detFrom, setDetFrom]           = useState('');
//    const [detTo, setDetTo]               = useState('');
//    const [detQa, setDetQa]               = useState('pending');
//    const [qaDropDet, setQaDropDet]       = useState(false);
 
//    // Modal
//    const [selInc, setSelInc] = useState(null);
//    const [modal, setModal]   = useState(false);
 
//    /* ── refs ── */
//    const prevPendPage = useRef(1);
//    const prevDetPage  = useRef(1);
 
//    /* ── options ── */
//    const statusOpts = [
//      { id: '',            label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
//      { id: 'resolved',    label: 'Resolved',      color: '#10b981', icon: 'bi-check-circle-fill' },
//      { id: 'escalated',   label: 'Escalated',     color: '#b20f2a', icon: 'bi-fire' },
//      { id: 'in progress', label: 'In Progress',   color: '#52be00', icon: 'bi-clock-history' },
//    ];
//    const qaOpts = [
//      { id: 'pending', label: 'Pending QA', color: '#f59e0b', icon: 'bi-hourglass-split' },
//      { id: 'done',    label: 'Done QA',    color: '#10b981', icon: 'bi-check-all' },
//    ];
//    const selStatus  = statusOpts.find(o => o.id === statusFilter) || statusOpts[0];
//    const selQaPend  = qaOpts.find(o => o.id === pendQa);
//    const selQaDet   = qaOpts.find(o => o.id === detQa);
 
//    const tok = () => user?.token || localStorage.getItem('session_token');
//    const sid = () => user?.sid   || user?.user_sid;
 
//    /* ════════════════════════════════════════════════
//       DERIVED: which analyst rows to show in the table
//       — all_time when 'overall', filtered otherwise
//    ═════════════════════════════════════════════════ */
//    const summary  = data?.all_time?.summary              || {};
//    const qaAdmins = data?.all_time?.qa_admin_performance || [];
 
//    // Chart agents: filtered data when a timeframe is active, else all_time
//    const chartAgents = (() => {
//      if (chartTimeframe === 'overall') {
//        return chartData?.all_time?.agent_performance || [];
//      }
//      return (
//        chartData?.filtered?.agent_performance ||
//        chartData?.all_time?.agent_performance  ||
//        []
//      );
//    })();
 
//    // Analyst performance directory mirrors chart timeframe
//    const dirAgents = chartAgents;
 
//    /* ── fetches ── */
//    const fetchSla = async (page, isPaging = false) => {
//      isPaging ? setPageLoading(true) : setTableLoading(true);
//      try {
//        const r = await api.post(
//          '/users/get/sla-breached/incidents',
//          { user_sid: sid(), page, per_page: 10 },
//          { headers: { Authorization: `Bearer ${tok()}` } }
//        );
//        setSlaData(r.data.response || []);
//        setSlaTotal(r.data.total   || 0);
//      } catch (e) { console.error(e); }
//      finally { setPageLoading(false); setTableLoading(false); }
//    };
 
//    useEffect(() => {
//      if (!showSla || activeTab !== 'team') return;
//      fetchSla(slaPage, slaPage > 1);
//    }, [showSla, slaPage, activeTab]);
 
//    // User list
//    useEffect(() => {
//      (async () => {
//        try {
//          const r = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${tok()}` } });
//          setUserList(r.data || []);
//        } catch (e) { console.error(e); }
//      })();
//    }, [user]);
 
//    // Base dashboard (all-time summary + initial chart)
//    useEffect(() => {
//      if (activeTab !== 'team' || viewMode === 'detail') return;
//      setTableLoading(true);
//      (async () => {
//        try {
//          const r = await api.get('/users/admin/dashboard', { headers: { Authorization: `Bearer ${tok()}` } });
//          setData(r.data);
//          setChartData(r.data);
//        } catch (e) { console.error(e); }
//        finally { setTableLoading(false); }
//      })();
//    }, [activeTab, viewMode, user]);
 
//    // Chart + analyst directory — re-fetch when timeframe changes
//    useEffect(() => {
//      if (activeTab !== 'team' || viewMode === 'detail') return;
//      setChartLoading(true);
 
//      const { from_date, to_date } = getDateRange(chartTimeframe);
 
//      (async () => {
//        try {
//          const r = await api.get('/users/admin/dashboard', {
//            headers: { Authorization: `Bearer ${tok()}` },
//            params: {
//              timeframe: chartTimeframe,
//              ...(from_date ? { from_date } : {}),
//              ...(to_date   ? { to_date }   : {}),
//            },
//          });
//          setChartData(r.data);
//        } catch (e) { console.error(e); }
//        finally { setChartLoading(false); }
//      })();
//    }, [chartTimeframe, activeTab, viewMode, user]);
 
//    // Pending tab
//    useEffect(() => {
//      if (activeTab !== 'pending') return;
//      const isPaging = pendPage !== prevPendPage.current;
//      prevPendPage.current = pendPage;
//      isPaging ? setPageLoading(true) : setTableLoading(true);
//      (async () => {
//        try {
//          const r = await api.post(
//            '/users/get-pending/incidents/all',
//            { user_sid: sid(), page: pendPage, per_page: perPage },
//            {
//              headers: { Authorization: `Bearer ${tok()}` },
//              params: {
//                resolution_status: statusFilter || undefined,
//                qa_state: pendQa,
//                from_date: pendFrom || undefined,
//                to_date:   pendTo   || undefined,
//              },
//            }
//          );
//          setPending(r.data.response || []);
//          setPendTotal(r.data.total  || 0);
//        } catch (e) { console.error(e); setPending([]); }
//        finally { setPageLoading(false); setTableLoading(false); }
//      })();
//    }, [activeTab, pendPage, statusFilter, pendQa, pendFrom, pendTo, user]);
 
//    // Detail view fetch
//    const fetchDetail = async (agent, page, isPaging = false) => {
//      isPaging ? setPageLoading(true) : setTableLoading(true);
//      try {
//        const found = userList.find(u => u.full_name.toLowerCase() === agent.agent.toLowerCase());
//        if (found) {
//          const r = await api.post(
//            '/users/get-pending/incidents/all',
//            { user_sid: found.sid, page, per_page: 10 },
//            {
//              headers: { Authorization: `Bearer ${tok()}` },
//              params: {
//                qa_state:  detQa,
//                from_date: detFrom || undefined,
//                to_date:   detTo   || undefined,
//              },
//            }
//          );
//          setAgentTickets(r.data.response || []);
//          setDetTotal(r.data.total       || 0);
//        }
//      } catch (e) { console.error(e); setAgentTickets([]); }
//      finally { setPageLoading(false); setTableLoading(false); }
//    };
 
//    useEffect(() => {
//      if (viewMode !== 'detail' || !selAgent) return;
//      const isPaging = detPage !== prevDetPage.current;
//      prevDetPage.current = detPage;
//      fetchDetail(selAgent, detPage, isPaging);
//    }, [detPage]);
 
//    useEffect(() => {
//      if (viewMode !== 'detail' || !selAgent) return;
//      fetchDetail(selAgent, detPage, false);
//    }, [detFrom, detTo, detQa]);
 
//    const openDetail = (a) => {
//      setSelAgent(a); setViewMode('detail');
//      prevDetPage.current = 1; setDetPage(1);
//      fetchDetail(a, 1, false);
//    };
//    const openModal = (t) => {
//      setSelInc({ ...t, display_name: selAgent?.agent || t.done_by || 'System' });
//      setModal(true);
//    };
 
//    /* ── Reusable dropdown ── */
//    const DD = ({ open, setOpen, selected, opts, onSelect, label }) => (
//      <div className="db-flt" style={{ position: 'relative' }}>
//        <label className="db-flbl">{label}</label>
//        <div className="db-fbtn" onClick={() => setOpen(o => !o)}>
//          <div className="db-dot" style={{ background: selected.color }} />
//          <span>{selected.label}</span>
//          <i className="bi bi-chevron-down db-chevron"></i>
//        </div>
//        {open && (
//          <div className="db-dropdown" style={{ zIndex: 9999 }}>
//            {opts.map(o => (
//              <div key={o.id} className="db-menu-item" onClick={() => { onSelect(o.id); setOpen(false); }}>
//                <i className={`bi ${o.icon}`} style={{ color: o.color, fontSize: 13 }}></i> {o.label}
//              </div>
//            ))}
//          </div>
//        )}
//      </div>
//    );
 
//    /* ── Premium pager ── */
//    const Pager = ({ page, total, perP = 10, onChange }) => {
//      const totalPages = Math.max(Math.ceil((total || 0) / perP), 1);
//      const getPages = () => {
//        if (totalPages <= 9) return Array.from({ length: totalPages }, (_, i) => i + 1);
//        const pages = []; const left = page - 2; const right = page + 2;
//        pages.push(1);
//        if (left > 2) pages.push('…');
//        for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) pages.push(i);
//        if (right < totalPages - 1) pages.push('…');
//        pages.push(totalPages);
//        return pages;
//      };
//      return (
//        <div className="db-pag">
//          <button className="db-pag-btn db-pag-ico" disabled={page === 1} onClick={() => onChange(1)} title="First"><i className="bi bi-chevron-double-left"></i></button>
//          <button className="db-pag-btn db-pag-ico" disabled={page === 1} onClick={() => onChange(page - 1)} title="Prev"><i className="bi bi-chevron-left"></i></button>
//          <div className="db-pag-nums">
//            {getPages().map((p, i) =>
//              p === '…'
//                ? <span key={`e${i}`} className="db-pag-ellipsis">…</span>
//                : <button key={p} className={`db-pag-num-btn ${p === page ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
//            )}
//          </div>
//          <button className="db-pag-btn db-pag-ico" disabled={page >= totalPages} onClick={() => onChange(page + 1)} title="Next"><i className="bi bi-chevron-right"></i></button>
//          <button className="db-pag-btn db-pag-ico" disabled={page >= totalPages} onClick={() => onChange(totalPages)} title="Last"><i className="bi bi-chevron-double-right"></i></button>
//          <div className="db-pag-jump">
//            <span className="db-pag-jump-lbl">Go to</span>
//            <input type="number" min={1} max={totalPages} className="db-pag-jump-input" placeholder="—"
//              onKeyDown={e => {
//                if (e.key === 'Enter') {
//                  const v = parseInt(e.target.value);
//                  if (v >= 1 && v <= totalPages) { onChange(v); e.target.value = ''; }
//                }
//              }} />
//            <span className="db-pag-jump-lbl">/ {totalPages}</span>
//          </div>
//        </div>
//      );
//    };
 
//    /* ── Timeframe label for table header ── */
//    const timeframeLabel = {
//      overall: 'All Time',
//      today:   'Today',
//      weekly:  'This Week',
//      monthly: 'This Month',
//    }[chartTimeframe];
 
//    /* ══════════════════════════════════════════════ */
//    return (
//      <div className="db-root">
//        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
 
//        {/* ── HEADER ─────────────────────────────────── */}
//        <header className="db-header">
//          <div className="db-header-top">
//            <div className="db-brand">
//              <div className="db-brand-icon">
//                <i className="bi bi-shield-check"></i>
//              </div>
//              <div className="db-brand-text">
//                <div className="db-brand-name">Audit<span>Pulse</span></div>
//                <div className="db-brand-tagline">Quality Intelligence Platform</div>
//              </div>
//            </div>
 
//            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//              <div className="db-header-meta">
//                <div className="db-meta-badge">
//                  <div className="db-meta-dot"></div>
//                  Live
//                </div>
//                <div className="db-meta-badge">
//                  <i className="bi bi-ticket-perforated" style={{ fontSize: 10 }}></i>
//                  {summary.total_tickets || 0} tickets
//                </div>
//                <div className="db-meta-badge">
//                  <i className="bi bi-graph-up" style={{ fontSize: 10 }}></i>
//                  {summary.pass_percentage || 0}% quality
//                </div>
//              </div>
//              <div className="db-tabs">
//                <button className={`db-tab ${activeTab === 'team' ? 'active' : ''}`}
//                  onClick={() => { setActiveTab('team'); setViewMode('list'); setShowSla(false); }}>
//                  <i className="bi bi-people-fill" style={{ marginRight: 5 }}></i>Team View
//                </button>
//                <button className={`db-tab ${activeTab === 'pending' ? 'active' : ''}`}
//                  onClick={() => setActiveTab('pending')}>
//                  <i className="bi bi-hourglass-split" style={{ marginRight: 5 }}></i>My Pending
//                </button>
//              </div>
//            </div>
//          </div>
 
//          {/* Filters row */}
//          {((activeTab === 'team' && viewMode === 'detail') || activeTab === 'pending') && (
//            <div className="db-header-bottom">
//              <div style={{ fontSize: 10, fontWeight: 600, color: '#7b8099', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
//                {activeTab === 'pending' ? 'Pending Queue Filters' : `Analyst: ${fmt(selAgent?.agent)}`}
//              </div>
//              <div className="db-filters">
//                {activeTab === 'team' && viewMode === 'detail' && (
//                  <>
//                    <DD label="Audit Phase" open={qaDropDet} setOpen={setQaDropDet} selected={selQaDet} opts={qaOpts} onSelect={v => { setDetQa(v); setDetPage(1); }} />
//                    <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={detFrom} onChange={e => setDetFrom(e.target.value)} /></div>
//                    <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={detTo} onChange={e => setDetTo(e.target.value)} /></div>
//                    <div className="db-flt"><label className="db-flbl">Reset</label><button className="db-reset" onClick={() => { setDetFrom(''); setDetTo(''); setDetPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button></div>
//                  </>
//                )}
//                {activeTab === 'pending' && (
//                  <>
//                    <DD label="QA Status"      open={qaDropPend} setOpen={setQaDropPend} selected={selQaPend}  opts={qaOpts}     onSelect={v => { setPendQa(v);      setPendPage(1); }} />
//                    <DD label="Incident State" open={stDropPend} setOpen={setStDropPend} selected={selStatus}  opts={statusOpts} onSelect={v => { setStatusFilter(v); setPendPage(1); }} />
//                    <div className="db-flt"><label className="db-flbl">From</label><input type="date" className="db-date" value={pendFrom} onChange={e => setPendFrom(e.target.value)} /></div>
//                    <div className="db-flt"><label className="db-flbl">To</label><input type="date" className="db-date" value={pendTo} onChange={e => setPendTo(e.target.value)} /></div>
//                    <div className="db-flt"><label className="db-flbl">Reset</label><button className="db-reset" onClick={() => { setPendFrom(''); setPendTo(''); setPendPage(1); }}><i className="bi bi-arrow-counterclockwise"></i></button></div>
//                  </>
//                )}
//              </div>
//            </div>
//          )}
//        </header>
 
//        {/* ── STATS BANNER (always all-time) ───────────────── */}
//        {activeTab === 'team' && (
//          <div className="db-banner">
//            <div className={`db-stat clickable ${!showSla && viewMode === 'list' ? 'active-ind' : ''}`} onClick={() => setShowSla(false)}>
//              <div className="db-ico ico-ind"><i className="bi bi-ticket-perforated-fill"></i></div>
//              <div className="db-stat-info">
//                <span className="db-stat-lbl">Total Tickets</span>
//                <span className="db-stat-val">{viewMode === 'list' ? (summary.total_tickets || 0) : (selAgent?.total_tickets || 0)}</span>
//              </div>
//            </div>
//            <div className="db-stat">
//              <div className="db-ico ico-grn"><i className="bi bi-shield-check"></i></div>
//              <div className="db-stat-info">
//                <span className="db-stat-lbl">Passed</span>
//                <span className="db-stat-val val-grn">{viewMode === 'list' ? (summary.passed || 0) : (selAgent?.passed || 0)}</span>
//              </div>
//            </div>
//            <div className="db-stat">
//              <div className="db-ico ico-vio"><i className="bi bi-inbox-fill"></i></div>
//              <div className="db-stat-info">
//                <span className="db-stat-lbl">Unassigned QA</span>
//                <span className="db-stat-val val-ind">{summary.unassigned_qa_tickets || 0}</span>
//              </div>
//            </div>
//            {viewMode === 'list' ? (
//              <div className={`db-stat clickable ${showSla ? 'active-red' : ''}`} onClick={() => setShowSla(true)}>
//                <div className="db-ico ico-red"><i className="bi bi-exclamation-octagon-fill"></i></div>
//                <div className="db-stat-info">
//                  <span className="db-stat-lbl">SLA Breached</span>
//                  <span className="db-stat-val val-red">{summary.sla_breached || 0}</span>
//                </div>
//              </div>
//            ) : (
//              <div className="db-stat">
//                <div className="db-ico ico-vio"><i className="bi bi-stars"></i></div>
//                <div className="db-stat-info">
//                  <span className="db-stat-lbl">Avg Score</span>
//                  <span className="db-stat-val val-ind">{selAgent?.average_score?.toFixed(1) || 0}</span>
//                </div>
//              </div>
//            )}
//            <div className="db-stat">
//              <div className="db-ico ico-amb"><i className="bi bi-graph-up-arrow"></i></div>
//              <div className="db-stat-info">
//                <span className="db-stat-lbl">Quality Rate</span>
//                <span className="db-stat-val val-amb">
//                  {viewMode === 'list' ? `${summary.pass_percentage || 0}%` : `${selAgent?.pass_percentage || 0}%`}
//                </span>
//              </div>
//            </div>
//          </div>
//        )}
 
//        {/* ── SLA BREACH VIEW ── */}
//        {activeTab === 'team' && viewMode === 'list' && showSla && (
//          <div className="db-card" style={{ flex: 1 }}>
//            <div className="db-card-head-ind">
//              <span className="db-card-title"><i className="bi bi-exclamation-octagon-fill" style={{ marginRight: 7 }}></i>Global SLA Breaches</span>
//              <button className="db-back" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.3)' }} onClick={() => setShowSla(false)}>
//                <i className="bi bi-arrow-left"></i> Back
//              </button>
//            </div>
//            <div className="db-table-wrap">
//              <table className="db-table">
//                <thead><tr><th>Incident</th><th>Actioned By</th><th>Description</th><th>Status</th></tr></thead>
//                <tbody>
//                  {tableLoading
//                    ? <SkeletonRows cols={4} rows={6} />
//                    : slaData.length === 0
//                      ? <tr><td colSpan={4}><div className="db-empty"><i className="bi bi-patch-check db-empty-icon"></i><p className="db-empty-title">No SLA breaches</p><span className="db-empty-sub">All incidents are within service level targets.</span></div></td></tr>
//                      : slaData.map((it, i) => (
//                          <tr key={i}>
//                            <td className="inc-link">{it.incident_number}</td>
//                            <td>{fmt(it.done_by)}</td>
//                            <td className="desc-cell">{it.short_description}</td>
//                            <td><span className="badge badge-red">SLA Breached</span></td>
//                          </tr>
//                        ))
//                  }
//                </tbody>
//              </table>
//              <LoadBar visible={pageLoading} />
//              <Pager page={slaPage} total={slaTotal} onChange={setSlaPage} />
//            </div>
//          </div>
//        )}
 
//        {/* ── TEAM LIST VIEW ── */}
//        {activeTab === 'team' && viewMode === 'list' && !showSla && (
//          <div className="db-full">
//            <div className="db-grid-2">
 
//              {/* ── Premium bar chart ── */}
//              <div className="db-card db-chart-card">
//                <div className="db-card-head" style={{ flexWrap: 'wrap', gap: 8 }}>
//                  <div>
//                    <span className="db-card-title">
//                      <i className="bi bi-bar-chart-line-fill" style={{ marginRight: 7, color: '#6366f1' }}></i>
//                      Tickets by Analyst
//                    </span>
//                    <div style={{ fontSize: 10, color: '#9aa0b4', fontWeight: 600, marginTop: 2, letterSpacing: '0.04em' }}>
//                      PERFORMANCE DISTRIBUTION · {timeframeLabel.toUpperCase()}
//                    </div>
//                  </div>
//                  <div className="db-tf-switch">
//                    {[
//                      { id: 'overall', label: 'Overall', icon: 'bi-infinity' },
//                      { id: 'today',   label: 'Today',   icon: 'bi-calendar-day' },
//                      { id: 'monthly', label: 'Monthly', icon: 'bi-calendar-month' },
//                      { id: 'weekly',  label: 'Weekly',  icon: 'bi-calendar-week' },
//                    ].map(opt => (
//                      <button key={opt.id}
//                        onClick={() => setChartTimeframe(opt.id)}
//                        className={`db-tf-btn ${chartTimeframe === opt.id ? 'active' : ''}`}>
//                        <i className={`bi ${opt.icon}`}></i> {opt.label}
//                      </button>
//                    ))}
//                  </div>
//                </div>
 
//                <div className="db-chart-legend">
//                  <span><i style={{ background: 'linear-gradient(135deg,#10b981,#34d399)' }}></i> Top performer</span>
//                  <span><i style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}></i> Standard</span>
//                  <span><i style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}></i> Needs focus</span>
//                </div>
 
//                <div style={{ padding: '4px 14px 14px', position: 'relative', flex: 1, minHeight: 260 }}>
//                  {chartLoading && (
//                    <div className="db-chart-loader">
//                      <div className="db-spinner"></div>
//                    </div>
//                  )}
//                  <ResponsiveContainer width="100%" height={260}>
//                    <BarChart
//                      data={[...chartAgents].sort((a, b) => (b.total_tickets || 0) - (a.total_tickets || 0))}
//                      margin={{ top: 22, right: 14, left: -14, bottom: 30 }}
//                      barCategoryGap="28%"
//                    >
//                      <defs>
//                        <linearGradient id="grad-std" x1="0" y1="0" x2="0" y2="1">
//                          <stop offset="0%"   stopColor="#818cf8" stopOpacity={1} />
//                          <stop offset="60%"  stopColor="#6366f1" stopOpacity={0.95} />
//                          <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.85} />
//                        </linearGradient>
//                        <linearGradient id="grad-top" x1="0" y1="0" x2="0" y2="1">
//                          <stop offset="0%"   stopColor="#34d399" stopOpacity={1} />
//                          <stop offset="60%"  stopColor="#10b981" stopOpacity={0.95} />
//                          <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
//                        </linearGradient>
//                        <linearGradient id="grad-low" x1="0" y1="0" x2="0" y2="1">
//                          <stop offset="0%"   stopColor="#fbbf24" stopOpacity={1} />
//                          <stop offset="60%"  stopColor="#f59e0b" stopOpacity={0.95} />
//                          <stop offset="100%" stopColor="#d97706" stopOpacity={0.85} />
//                        </linearGradient>
//                      </defs>
//                      <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="#e4e7ef" />
//                      <XAxis dataKey="agent" axisLine={false} tickLine={false}
//                        tick={{ fontSize: 10, fontWeight: 700, fill: '#7b8099' }}
//                        interval={0} angle={-22} textAnchor="end"
//                        tickFormatter={n => fmt(n.split(' ')[0])} />
//                      <YAxis axisLine={false} tickLine={false}
//                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9aa0b4' }}
//                        allowDecimals={false} />
//                      <Tooltip cursor={{ fill: 'rgba(99,102,241,0.08)', radius: [8, 8, 0, 0] }} content={<BarTip />} />
//                      <Bar dataKey="total_tickets" radius={[8, 8, 0, 0]} maxBarSize={42}
//                        label={{ position: 'top', fontSize: 10, fontWeight: 800, fill: '#1a1d2e' }}>
//                        {[...chartAgents]
//                          .sort((a, b) => (b.total_tickets || 0) - (a.total_tickets || 0))
//                          .map((a, i) => (
//                            <Cell key={i}
//                              fill={a.is_top_performer ? 'url(#grad-top)' : a.is_bottom_performer ? 'url(#grad-low)' : 'url(#grad-std)'}
//                              cursor="pointer"
//                              onClick={() => openDetail(a)}
//                              style={{ filter: a.is_top_performer ? 'drop-shadow(0 6px 12px rgba(16,185,129,0.35))' : 'drop-shadow(0 4px 8px rgba(99,102,241,0.25))' }}
//                            />
//                          ))}
//                      </Bar>
//                    </BarChart>
//                  </ResponsiveContainer>
//                </div>
//              </div>
 
//              {/* ── Analyst performance directory — mirrors timeframe ── */}
//              <div className="db-card" style={{ minHeight: 0 }}>
//                <div className="db-card-head">
//                  <div>
//                    <span className="db-card-title">Analyst performance directory</span>
//                    {/* Timeframe badge below title */}
//                    <div style={{ marginTop: 3 }}>
//                      <span className="db-timeframe-badge">
//                        <i className={`bi ${chartTimeframe === 'today' ? 'bi-calendar-day' : chartTimeframe === 'weekly' ? 'bi-calendar-week' : chartTimeframe === 'monthly' ? 'bi-calendar-month' : 'bi-infinity'}`}
//                          style={{ marginRight: 4 }}></i>
//                        {timeframeLabel}
//                      </span>
//                    </div>
//                  </div>
//                  <span className="db-pill db-pill-ind">{dirAgents.length} active</span>
//                </div>
//                <div className="db-table-wrap">
//                  {/* Empty state for filtered with no data */}
//                  {!tableLoading && !chartLoading && dirAgents.length === 0 && (
//                    <div className="db-empty" style={{ padding: '40px 20px' }}>
//                      <i className="bi bi-calendar-x db-empty-icon"></i>
//                      <p className="db-empty-title">No data for {timeframeLabel}</p>
//                      <span className="db-empty-sub">No analyst activity recorded for this period. Try a wider timeframe.</span>
//                    </div>
//                  )}
//                  {(tableLoading || chartLoading || dirAgents.length > 0) && (
//                    <table className="db-table" style={{ minWidth: 600 }}>
//                      <thead>
//                        <tr>
//                          <th>Analyst</th>
//                          <th className="center">Total</th>
//                          <th className="center">INC</th>
//                          <th className="center">RIT</th>
//                          <th className="center">Passed</th>
//                          <th className="center">Failed</th>
//                          <th className="center">Unassigned</th>
//                          <th>Quality</th>
//                        </tr>
//                      </thead>
//                      <tbody>
//                        {(tableLoading || chartLoading)
//                          ? <SkeletonRows cols={8} rows={6} />
//                          : dirAgents.map((a, i) => (
//                              <tr key={i} onClick={() => openDetail(a)}>
//                                <td>
//                                  <div className="db-arow">
//                                    <div className="db-av">{a.agent?.charAt(0)?.toUpperCase()}</div>
//                                    <span className="db-av-name">{fmt(a.agent)}</span>
//                                    {a.is_top_performer   && <span className="badge badge-top">Top</span>}
//                                    {a.is_bottom_performer && <span className="badge badge-low">Low</span>}
//                                  </div>
//                                </td>
//                                <td className="center"><span style={{ color: '#6366f1', fontWeight: 700 }}>{a.total_tickets || 0}</span></td>
//                                <td className="center"><span className="badge badge-ind">{a.ticket_split?.INC ?? 0}</span></td>
//                                <td className="center"><span className="badge badge-amb">{a.ticket_split?.RIT ?? 0}</span></td>
//                                <td className="center"><span className="badge badge-grn">{a.passed || 0}</span></td>
//                                <td className="center"><span className="badge badge-red">{a.failed || 0}</span></td>
//                                <td className="center"><span className="badge badge-gray">{a.qc_remaining || 0}</span></td>
//                                <td>
//                                  <div className="db-prog">
//                                    <div className="db-prog-track">
//                                      <div className="db-prog-fill" style={{ width: `${a.pass_percentage || 0}%`, background: barFill(a.pass_percentage || 0) }} />
//                                    </div>
//                                    <span className="db-prog-lbl">{a.pass_percentage !== null && a.pass_percentage !== undefined ? `${a.pass_percentage}%` : '—'}</span>
//                                  </div>
//                                </td>
//                              </tr>
//                            ))
//                        }
//                      </tbody>
//                    </table>
//                  )}
//                </div>
//              </div>
//            </div>
 
//            {/* QA Admin section */}
//            <div className="db-card">
//              <div className="db-card-head-ind">
//                <span className="db-card-title"><i className="bi bi-person-badge-fill" style={{ marginRight: 7 }}></i>QA Admin Performance</span>
//                <span className="db-pill-ghost">{qaAdmins.length} Auditors</span>
//              </div>
//              {qaAdmins.length === 0
//                ? <div className="db-empty" style={{ padding: '32px' }}><p className="db-empty-title">No QA admin data</p></div>
//                : (
//                  <div className="db-qa-grid">
//                    {qaAdmins.map((qa, idx) => {
//                      const pct = qa.qc_coverage_percentage ?? 0;
//                      const bs  = coverageStyle(pct);
//                      const bc  = pct >= 80 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#e24b4a';
//                      return (
//                        <div key={idx} className="db-qa-col">
//                          <span className="db-qa-cov-badge" style={bs}>{pct.toFixed(0)}%</span>
//                          <div className="db-qa-name-row">
//                            <div className="db-qa-av">{qa.qa_admin?.charAt(0)?.toUpperCase() || '?'}</div>
//                            <span className="db-qa-name">{fmt(qa.qa_admin)}</span>
//                          </div>
//                          <div className="db-qa-rows">
//                            {[['Assigned', qa.assigned_incidents ?? 0], ['QC Done', qa.qc_done ?? 0], ['Remaining', qa.qc_remaining ?? 0]].map(([k, v]) => (
//                              <div key={k} className="db-qa-row"><span className="db-qa-k">{k}</span><span className="db-qa-v">{v}</span></div>
//                            ))}
//                            <div className="db-qa-row">
//                              <span className="db-qa-k">Pass rate</span>
//                              {qa.pass_percentage === null || qa.pass_percentage === undefined
//                                ? <span className="badge badge-gray">—</span>
//                                : qa.pass_percentage >= 80
//                                  ? <span className="badge badge-grn">{qa.pass_percentage}%</span>
//                                  : <span className="badge badge-red">{qa.pass_percentage}%</span>
//                              }
//                            </div>
//                          </div>
//                          <div>
//                            <div className="db-qa-cov-lbl">Coverage</div>
//                            <div className="db-qa-cov-track">
//                              <div className="db-qa-cov-fill" style={{ width: `${pct}%`, background: bc }} />
//                            </div>
//                          </div>
//                        </div>
//                      );
//                    })}
//                  </div>
//                )
//              }
//            </div>
//          </div>
//        )}
 
//        {/* ── ANALYST DETAIL VIEW ── */}
//        {activeTab === 'team' && viewMode === 'detail' && (
//          <div className="db-card" style={{ flex: 1 }}>
//            <div className="db-detail-header">
//              <button className="db-back" onClick={() => setViewMode('list')}>
//                <i className="bi bi-arrow-left"></i> Back
//              </button>
//              <h3 className="db-detail-title">{fmt(selAgent?.agent)} <span>Tickets</span></h3>
//            </div>
//            <div className="db-table-wrap">
//              <table className="db-table">
//                <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Phase</th></tr></thead>
//                <tbody>
//                  {tableLoading
//                    ? <SkeletonRows cols={4} rows={8} />
//                    : agentTickets.map((t, i) => (
//                        <tr key={i} onClick={() => openModal(t)}>
//                          <td className="inc-link"># {t.incident_number}</td>
//                          <td className="desc-cell">{t.short_description}</td>
//                          <td><StatusPill status={t.status} /></td>
//                          <td><PhasePill phase={detQa} /></td>
//                        </tr>
//                      ))
//                  }
//                </tbody>
//              </table>
//              <LoadBar visible={pageLoading} />
//              <Pager page={detPage} total={detTotal} onChange={setDetPage} />
//            </div>
//          </div>
//        )}
 
//        {/* ── MY PENDING VIEW ── */}
//        {activeTab === 'pending' && (
//          <div className="db-card" style={{ flex: 1 }}>
//            <div className="db-card-head">
//              <span className="db-card-title">My Pending Queue</span>
//              <span className="db-pill">{pendTotal} records</span>
//            </div>
//            <div className="db-table-wrap">
//              <table className="db-table">
//                <thead><tr><th>Incident No</th><th>Description</th><th>Status</th><th>Resolution</th></tr></thead>
//                <tbody>
//                  {tableLoading
//                    ? <SkeletonRows cols={4} rows={8} />
//                    : pending.length === 0
//                      ? <tr><td colSpan={4}>
//                          <div className="db-empty">
//                            <i className="bi bi-inbox db-empty-icon"></i>
//                            <p className="db-empty-title">No records found</p>
//                            <span className="db-empty-sub">No incidents matching "{selQaPend?.label}" for the selected criteria.</span>
//                          </div>
//                        </td></tr>
//                      : pending.map((inc, i) => (
//                          <tr key={i}>
//                            <td className="inc-link"
//                              onClick={() => navigate('/dashboard/update-incident', { state: { incidentData: inc, fromPending: true } })}>
//                              # {inc.incident_number}
//                            </td>
//                            <td className="desc-cell">{inc.short_description || 'No description'}</td>
//                            <td><StatusPill status={inc.status} /></td>
//                            <td style={{ fontSize: 12, color: '#7b8099', fontWeight: 500 }}>{inc.resolution_shared || '—'}</td>
//                          </tr>
//                        ))
//                  }
//                </tbody>
//              </table>
//              <LoadBar visible={pageLoading} />
//              <Pager page={pendPage} total={pendTotal} perP={perPage} onChange={setPendPage} />
//            </div>
//          </div>
//        )}
 
//        {/* ── MODAL ── */}
//        {modal && selInc && (
//          <div className="db-modal-overlay" onClick={() => setModal(false)}>
//            <div className="db-modal" onClick={e => e.stopPropagation()}>
//              <div className="db-modal-head">
//                <h2 className="db-modal-title">{selInc.incident_number}</h2>
//                <button className="db-modal-close" onClick={() => setModal(false)}><i className="bi bi-x-lg"></i></button>
//              </div>
//              <div className="db-modal-body">
//                <div className="db-modal-agent">
//                  <div className="db-modal-av">{selInc.display_name?.charAt(0)?.toUpperCase()}</div>
//                  <div>
//                    <div className="db-modal-meta">Actioned by</div>
//                    <div className="db-modal-name">{fmt(selInc.display_name)}</div>
//                  </div>
//                </div>
//                <div className="db-modal-grid">
//                  <div className="db-modal-full">
//                    <div className="db-modal-lbl">Description</div>
//                    <div className="db-modal-val">{selInc.short_description}</div>
//                  </div>
//                  <div>
//                    <div className="db-modal-lbl">Status</div>
//                    <StatusPill status={selInc.status} />
//                  </div>
//                  <div className="db-modal-full">
//                    <div className="db-modal-lbl">Resolution Notes</div>
//                    <div className="db-modal-res">{selInc.resolution_shared || 'No details provided.'}</div>
//                  </div>
//                </div>
//              </div>
//              <div className="db-modal-footer">
//                <button className="db-done-btn" onClick={() => setModal(false)}>Close</button>
//              </div>
//            </div>
//          </div>
//        )}
//      </div>
//    );
//  };
 
//  export default AllusersDashboard;
 

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
const toDateStr = (d) => d.toISOString().split('T')[0];

const getDateRange = (timeframe) => {
  const today = new Date();
  const todayStr = toDateStr(today);
  if (timeframe === 'today') return { from_date: todayStr, to_date: todayStr };
  if (timeframe === 'weekly') {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return { from_date: toDateStr(start), to_date: todayStr };
  }
  if (timeframe === 'monthly') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from_date: toDateStr(start), to_date: todayStr };
  }
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

/* ── Inline load bar ── */
const LoadBar = ({ visible }) => !visible ? null : (
  <div className="db-load-bar">
    <div className="db-load-bar-fill" />
  </div>
);

/* ══════════════════════════════════════════════════ */
const AllusersDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState('team');
  const [viewMode, setViewMode]     = useState('list');
  const [userList, setUserList]     = useState([]);
  const [data, setData]             = useState(null);

  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading]   = useState(false);

  const [chartTimeframe, setChartTimeframe] = useState('monthly');
  const [chartData, setChartData]           = useState(null);
  const [chartLoading, setChartLoading]     = useState(false);

  const [showSla, setShowSla]   = useState(false);
  const [slaData, setSlaData]   = useState([]);
  const [slaTotal, setSlaTotal] = useState(0);
  const [slaPage, setSlaPage]   = useState(1);

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

  const [selAgent, setSelAgent]         = useState(null);
  const [agentTickets, setAgentTickets] = useState([]);
  const [detPage, setDetPage]           = useState(1);
  const [detTotal, setDetTotal]         = useState(0);
  const [detFrom, setDetFrom]           = useState('');
  const [detTo, setDetTo]               = useState('');
  const [detQa, setDetQa]               = useState('pending');
  const [qaDropDet, setQaDropDet]       = useState(false);

  const [selInc, setSelInc] = useState(null);
  const [modal, setModal]   = useState(false);

  const prevPendPage = useRef(1);
  const prevDetPage  = useRef(1);

  const statusOpts = [
    { id: '',            label: 'All Incidents', color: '#6366f1', icon: 'bi-collection-fill' },
    { id: 'resolved',    label: 'Resolved',      color: '#10b981', icon: 'bi-patch-check-fill' },
    { id: 'escalated',   label: 'Escalated',     color: '#b20f2a', icon: 'bi-arrow-up-circle-fill' },
    { id: 'in progress', label: 'In Progress',   color: '#52be00', icon: 'bi-arrow-repeat' },
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

  const summary  = data?.all_time?.summary              || {};
  const qaAdmins = data?.all_time?.qa_admin_performance || [];

  const chartAgents = (() => {
    if (chartTimeframe === 'overall') return chartData?.all_time?.agent_performance || [];
    return chartData?.filtered?.agent_performance || chartData?.all_time?.agent_performance || [];
  })();

  const dirAgents = chartAgents;

  // Compute top/bottom performers from dirAgents directly
const sortedByPct = [...dirAgents]
  .filter(a => a.pass_percentage !== null && a.pass_percentage !== undefined)
  .sort((a, b) => (b.pass_percentage ?? 0) - (a.pass_percentage ?? 0));

const topAgentName    = sortedByPct[0]?.agent;
const bottomAgentName = sortedByPct[sortedByPct.length - 1]?.agent;

const isTop    = (a) => dirAgents.length > 1 && a.agent === topAgentName;
const isBottom = (a) => dirAgents.length > 1 && a.agent === bottomAgentName && a.agent !== topAgentName;

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

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get('/users/get/list_users', { headers: { Authorization: `Bearer ${tok()}` } });
        setUserList(r.data || []);
      } catch (e) { console.error(e); }
    })();
  }, [user]);

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

  useEffect(() => {
    if (activeTab !== 'team' || viewMode === 'detail') return;
    setChartLoading(true);
    const { from_date, to_date } = getDateRange(chartTimeframe);
    (async () => {
      try {
        const r = await api.get('/users/admin/dashboard', {
          headers: { Authorization: `Bearer ${tok()}` },
          params: { timeframe: chartTimeframe, ...(from_date ? { from_date } : {}), ...(to_date ? { to_date } : {}) },
        });
        setChartData(r.data);
      } catch (e) { console.error(e); }
      finally { setChartLoading(false); }
    })();
  }, [chartTimeframe, activeTab, viewMode, user]);

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
            params: { resolution_status: statusFilter || undefined, qa_state: pendQa, from_date: pendFrom || undefined, to_date: pendTo || undefined },
          }
        );
        setPending(r.data.response || []);
        setPendTotal(r.data.total  || 0);
      } catch (e) { console.error(e); setPending([]); }
      finally { setPageLoading(false); setTableLoading(false); }
    })();
  }, [activeTab, pendPage, statusFilter, pendQa, pendFrom, pendTo, user]);

  const fetchDetail = async (agent, page, isPaging = false) => {
    isPaging ? setPageLoading(true) : setTableLoading(true);
    try {
      const found = userList.find(u => u.full_name.toLowerCase() === agent.agent.toLowerCase());
      if (found) {
        const r = await api.post(
          '/users/get-pending/incidents/all',
          { user_sid: found.sid, page, per_page: 10 },
          { headers: { Authorization: `Bearer ${tok()}` }, params: { qa_state: detQa, from_date: detFrom || undefined, to_date: detTo || undefined } }
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

  const [globalTimeframe, setGlobalTimeframe] = useState('1m');

const periodLabel = {
  '1m': 'Last 1 Month',
  '3m': 'Last 3 Months',
  '6m': 'Last 6 Months',
  'all': 'All Time',
}[globalTimeframe];

  /* ── Dropdown ── */
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

  /* ── Pager ── */
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
        <button className="db-pag-btn db-pag-ico" disabled={page === 1} onClick={() => onChange(1)}><i className="bi bi-chevron-double-left"></i></button>
        <button className="db-pag-btn db-pag-ico" disabled={page === 1} onClick={() => onChange(page - 1)}><i className="bi bi-chevron-left"></i></button>
        <div className="db-pag-nums">
          {getPages().map((p, i) =>
            p === '…'
              ? <span key={`e${i}`} className="db-pag-ellipsis">…</span>
              : <button key={p} className={`db-pag-num-btn ${p === page ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
          )}
        </div>
        <button className="db-pag-btn db-pag-ico" disabled={page >= totalPages} onClick={() => onChange(page + 1)}><i className="bi bi-chevron-right"></i></button>
        <button className="db-pag-btn db-pag-ico" disabled={page >= totalPages} onClick={() => onChange(totalPages)}><i className="bi bi-chevron-double-right"></i></button>
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

  const timeframeLabel = { overall: 'All Time', today: 'Today', weekly: 'This Week', monthly: 'This Month' }[chartTimeframe];

  /* ── Derived values for banner ── */
  const incCount   = summary.ticket_split?.INC ?? 0;
  const ritCount   = summary.ticket_split?.RIT ?? 0;
  const totalTix   = summary.total_tickets || 0;
  const incRatio   = totalTix ? Math.round((incCount / totalTix) * 100) : 0;
  const unassignedPct = totalTix ? Math.min(Math.round(((summary.unassigned_qa_tickets || 0) / totalTix) * 100), 100) : 0;
  const pendingPct    = totalTix ? Math.min(Math.round(((summary.pending || 0) / totalTix) * 100), 100) : 0;
  const coveragePct   = totalTix ? +((summary.qc_done || 0) / totalTix * 100).toFixed(1) : 0;
  const failRate      = summary.qc_done ? Math.round(((summary.failed || 0) / summary.qc_done) * 100) : 0;

  /* ══════════════════════════════════════════════ */
  return (
    <div className="db-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

      {/* ── HEADER ── */}
      {/* <header className="db-header">
        <div className="db-header-top">
          <div className="db-brand">
            <div className="db-brand-icon"><i className="bi bi-shield-check"></i></div>
            <div className="db-brand-text">
              <div className="db-brand-name">Audit<span>Pulse</span></div>
              <div className="db-brand-tagline">Quality Intelligence Platform</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="db-header-meta">
              <div className="db-meta-badge"><div className="db-meta-dot"></div>Live</div>
              <div className="db-meta-badge"><i className="bi bi-ticket-perforated" style={{ fontSize: 10 }}></i>{summary.total_tickets || 0} tickets</div>
              <div className="db-meta-badge"><i className="bi bi-graph-up" style={{ fontSize: 10 }}></i>{summary.pass_percentage || 0}% quality</div>
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
      </header> */}
      <header className="db-header">
  <div className="db-header-top">

    {/* Brand */}
    <div className="db-brand">
      <div className="db-brand-icon"><i className="bi bi-layers-fill"></i></div>
      <div className="db-brand-text">
        <div className="db-brand-name">Desk<span>IQ</span> Pro</div>
        <div className="db-brand-tagline">Service Desk Intelligence</div>
      </div>
    </div>

    {/* Timeframe tabs — centre */}
    <div className="db-tf-center">
      <div className="db-tf-range-label">Data Range</div>
      <div className="db-tf-tabs">
        {[
          { id: '1m', label: '1 Month' },
          { id: '3m', label: '3 Months' },
          { id: '6m', label: '6 Months' },
          { id: 'all', label: 'All Time' },
        ].map(opt => (
          <button key={opt.id}
            className={`db-tf-range-btn ${globalTimeframe === opt.id ? 'active' : ''}`}
            onClick={() => setGlobalTimeframe(opt.id)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    {/* Right */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="db-live-pill"><div className="db-meta-dot"></div> Live</div>
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

 

  {/* existing filter row for detail/pending views */}
  {((activeTab === 'team' && viewMode === 'detail') || activeTab === 'pending') && (
    <div className="db-header-bottom">
      {/* ...your existing filters unchanged... */}
    </div>
  )}
</header>

      {/* ══════════════════════════════════════════════════
          STATS BANNER V2 — two rows
      ══════════════════════════════════════════════════ */}
     {/* {activeTab === 'team' && (
  <div className="dbs-banner"> */}
  {activeTab === 'team' && viewMode !== 'detail' && (
  <div className="dbs-banner">

    <div className="dbs-row-label">Ticket Volume</div>
    <div className="dbs-row dbs-row-4">

      <div className="dbs-card v">
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">Total Tickets</div>
            <div className="dbs-val v">{(summary.total_tickets||0).toLocaleString()}</div></div>
          <div className="dbs-ico v"><i className="bi bi-ticket-perforated-fill"/></div>
        </div>
        <div className="dbs-chips">
          <span className="dbs-chip inc">INC {summary.ticket_split?.INC??0}</span>
          <span className="dbs-chip rit">RIT {summary.ticket_split?.RIT??0}</span>
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${incRatio}%`,background:'#6366f1'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">INC ratio</span><span className="dbs-foot-val v">{incRatio}%</span></div>
      </div>

      <div className="dbs-card s">
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">Unassigned QA</div>
            <div className="dbs-val s">{summary.unassigned_qa_tickets||0}</div></div>
          <div className="dbs-ico s"><i className="bi bi-inbox-fill"/></div>
        </div>
        <div className="dbs-chips">
          <span className="dbs-chip neu">Awaiting assignment</span>
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${unassignedPct}%`,background:'#64748b'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">of total tickets</span><span className="dbs-foot-val s">{unassignedPct}%</span></div>
      </div>

      <div className="dbs-card a">
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">Pending Assigned</div>
            <div className="dbs-val a">{summary.pending||0}</div></div>
          <div className="dbs-ico a"><i className="bi bi-hourglass-split"/></div>
        </div>
        <div className="dbs-chips">
          <span className="dbs-chip amb">QC remaining {summary.qc_remaining??0}</span>
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${pendingPct}%`,background:'#f59e0b'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">QC backlog</span><span className="dbs-foot-val a">{summary.qc_remaining??0} tickets</span></div>
      </div>

      <div className={`dbs-card or click ${showSla?'dbs-sla-active':''}`} onClick={()=>setShowSla(true)}>
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">SLA Breached</div>
            <div className="dbs-val or">{summary.sla_breached??0}</div></div>
          <div className="dbs-ico or"><i className="bi bi-clock-history"/></div>
        </div>
        <div className="dbs-chips">
          {(summary.sla_breached??0)===0
            ? <span className="dbs-chip grn">All within SLA</span>
            : <span className="dbs-chip or">{summary.sla_breached} breached</span>}
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${Math.max(totalTix?Math.round(((summary.sla_breached??0)/totalTix)*100):0,1)}%`,background:'#f97316'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">Breach rate</span>
          <span className={`dbs-foot-val ${(summary.sla_breached??0)===0?'g':'or'}`}>
            {totalTix?Math.round(((summary.sla_breached??0)/totalTix)*100):0}%
          </span>
        </div>
      </div>

    </div>

    <div className="dbs-row-label" style={{marginTop:6}}>QA Outcomes</div>
    <div className="dbs-row dbs-row-4">

      <div className="dbs-card g">
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">QA Passed</div>
            <div className="dbs-val g">{summary.passed||0}</div></div>
          <div className="dbs-ico g"><i className="bi bi-shield-check"/></div>
        </div>
        <div className="dbs-chips">
          <span className="dbs-chip grn">of {summary.qc_done||0} reviewed</span>
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${summary.pass_percentage||0}%`,background:'#10b981'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">Pass rate</span><span className="dbs-foot-val g">{summary.pass_percentage||0}%</span></div>
      </div>

      <div className={`dbs-card r click ${showSla?'':'dbs-red-active'}`} onClick={()=>setShowSla(false)}>
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">QA Failed</div>
            <div className="dbs-val r">{summary.failed||0}</div></div>
          <div className="dbs-ico r"><i className="bi bi-exclamation-octagon-fill"/></div>
        </div>
        <div className="dbs-chips">
          {(summary.failed||0)===0
            ? <span className="dbs-chip grn">All clear</span>
            : <span className="dbs-chip red">{summary.failed} failed</span>}
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${Math.max(failRate,1)}%`,background:'#ef4444'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">Fail rate</span>
          <span className={`dbs-foot-val ${(summary.failed||0)===0?'g':'r'}`}>{failRate}%</span>
        </div>
      </div>

      <div className="dbs-card t">
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">QA Completed</div>
            <div className="dbs-val t">{summary.qc_done||0}</div></div>
          <div className="dbs-ico t"><i className="bi bi-check2-all"/></div>
        </div>
        <div className="dbs-chips">
          <span className="dbs-chip teal">Coverage {coveragePct}%</span>
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${Math.max(coveragePct,1)}%`,background:'#14b8a6'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">of {totalTix} total</span><span className="dbs-foot-val t">QC done</span></div>
      </div>

      <div className="dbs-card p">
        <div className="dbs-card-top">
          <div><div className="dbs-lbl">Total QA Score</div>
            <div className="dbs-val p">{summary.pass_percentage||0}%</div></div>
          <div className="dbs-ico p"><i className="bi bi-graph-up-arrow"/></div>
        </div>
        <div className="dbs-chips">
          <span className="dbs-chip pur">Pass percentage</span>
        </div>
        <div className="dbs-bar-track"><div className="dbs-bar-fill" style={{width:`${summary.pass_percentage||0}%`,background:'#8b5cf6'}}/></div>
        <div className="dbs-divider"/>
        <div className="dbs-foot"><span className="dbs-foot-lbl">All time</span><span className="dbs-foot-val p">+{summary.pass_percentage||0}%</span></div>
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

            {/* Bar chart */}
            {/* <div className="db-card">
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
                    <button key={opt.id} onClick={() => setChartTimeframe(opt.id)}
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
                  <div className="db-chart-loader"><div className="db-spinner"></div></div>
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
                            fill={isTop(a) ? 'url(#grad-top)' : isBottom(a) ? 'url(#grad-low)' : 'url(#grad-std)'}
style={{ filter: isTop(a) ? 'drop-shadow(0 6px 12px rgba(16,185,129,0.35))' : 'drop-shadow(0 4px 8px rgba(99,102,241,0.25))' }}
                            cursor="pointer"
                            onClick={() => openDetail(a)}
                            style={{ filter: a.is_top_performer ? 'drop-shadow(0 6px 12px rgba(16,185,129,0.35))' : 'drop-shadow(0 4px 8px rgba(99,102,241,0.25))' }}
                          />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div> */}
            <div className="db-card">
  <div className="db-card-head" style={{ flexWrap: 'wrap', gap: 8 }}>
    <div>
      <span className="db-card-title">
        <i
          className="bi bi-bar-chart-line-fill"
          style={{ marginRight: 7, color: '#6366f1' }}
        ></i>
        Tickets by Analyst
      </span>

      <div
        style={{
          fontSize: 10,
          color: '#9aa0b4',
          fontWeight: 600,
          marginTop: 2,
          letterSpacing: '0.04em',
        }}
      >
        PERFORMANCE DISTRIBUTION · {timeframeLabel.toUpperCase()}
      </div>
    </div>

    <div className="db-tf-switch">
      {[
        { id: 'overall', label: 'Overall', icon: 'bi-infinity' },
        { id: 'today', label: 'Today', icon: 'bi-calendar-day' },
        { id: 'monthly', label: 'Monthly', icon: 'bi-calendar-month' },
        { id: 'weekly', label: 'Weekly', icon: 'bi-calendar-week' },
      ].map((opt) => (
        <button
          key={opt.id}
          onClick={() => setChartTimeframe(opt.id)}
          className={`db-tf-btn ${chartTimeframe === opt.id ? 'active' : ''}`}
        >
          <i className={`bi ${opt.icon}`}></i> {opt.label}
        </button>
      ))}
    </div>
  </div>

  {/* Removed Top Performer / Needs Focus Legend */}

  <div
    style={{
      padding: '4px 14px 14px',
      position: 'relative',
      flex: 1,
      minHeight: 260,
    }}
  >
    {chartLoading && (
      <div className="db-chart-loader">
        <div className="db-spinner"></div>
      </div>
    )}

    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={[...chartAgents].sort(
          (a, b) => (b.total_tickets || 0) - (a.total_tickets || 0)
        )}
        margin={{ top: 22, right: 14, left: -14, bottom: 30 }}
        barCategoryGap="28%"
      >
        <defs>
          <linearGradient id="grad-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
            <stop offset="60%" stopColor="#6366f1" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.85} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="2 6"
          vertical={false}
          stroke="#e4e7ef"
        />

        <XAxis
          dataKey="agent"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontWeight: 700, fill: '#7b8099' }}
          interval={0}
          angle={-22}
          textAnchor="end"
          tickFormatter={(n) => fmt(n.split(' ')[0])}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontWeight: 700, fill: '#9aa0b4' }}
          allowDecimals={false}
        />

        <Tooltip
          cursor={{ fill: 'rgba(99,102,241,0.08)' }}
          content={<BarTip />}
        />

        <Bar
          dataKey="total_tickets"
          radius={[8, 8, 0, 0]}
          maxBarSize={42}
          label={{
            position: 'top',
            fontSize: 10,
            fontWeight: 800,
            fill: '#1a1d2e',
          }}
        >
          {[...chartAgents]
            .sort(
              (a, b) => (b.total_tickets || 0) - (a.total_tickets || 0)
            )
            .map((a, i) => (
              <Cell
                key={i}
                fill="url(#grad-bar)"
                cursor="pointer"
                onClick={() => openDetail(a)}
                style={{
                  filter:
                    'drop-shadow(0 4px 8px rgba(99,102,241,0.25))',
                }}
              />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

            {/* Analyst performance directory */}
            <div className="db-card  " style={{ minHeight: 0 }}>
              <div className="db-card-head">
                <div>
                  <span className="db-card-title">Analyst performance directory</span>
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
