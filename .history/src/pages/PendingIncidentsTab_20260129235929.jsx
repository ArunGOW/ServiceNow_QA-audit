// import React, { useState, useEffect, useRef } from 'react';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const PendingIncidentsTab = () => {
//   const { user } = useAuth();
//   const dropdownRef = useRef(null);

//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPending, setTotalPending] = useState(0);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [loading, setLoading] = useState(true); 
//   const [isOpen, setIsOpen] = useState(false);
//   const perPage = 10;

//   const options = [
//     { id: '', label: 'All Queues', color: '#fff', icon: 'bi-grid-fill' },
//     { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
//     { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
//     { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
//     { id: 'on hold', label: 'On Hold', color: '#94a3b8', icon: 'bi-pause-circle-fill' },
//   ];

//   const selectedOption = options.find(opt => opt.id === statusFilter) || options[0];

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   useEffect(() => {
//     const fetchPendingIncidents = async () => {
//       const currentSid = user?.sid || user?.user_sid;
//       if (!currentSid) return;
//       setLoading(true);
//       try {
//         const token = user?.token || localStorage.getItem("session_token");
//         const res = await api.post('/users/get-pending/incidents/all', 
//           { page: currentPage, per_page: perPage, user_sid: currentSid }, 
//           { headers: { Authorization: `Bearer ${token}` }, params: { resolution_status: statusFilter || undefined } }
//         );
//         setPendingIncidents(res.data.response || []);
//         setTotalPending(res.data.total || 0);
//       } catch (err) { console.error(err); } 
//       finally { setTimeout(() => setLoading(false), 300); }
//     };
//     fetchPendingIncidents();
//   }, [currentPage, user, statusFilter]);

//   return (
//     <div style={styles.fullView}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
//       {/* 👑 PREMIUM BANNER WITH INTEGRATED FILTER */}
//       <div style={styles.premiumBanner}>
//         <div style={styles.bannerLeft}>
//           <div style={styles.bannerIconBox}><i className="bi bi-stack"></i></div>
//           <div>
//             <h5 style={styles.bannerTitle}>My Pending Queues</h5>
//             <p style={styles.bannerSub}>Real-time incident tracking</p>
//           </div>
//         </div>

//         <div style={styles.bannerRight}>
//           {/* 🏷️ FILTER DROPDOWN NEAR TOTAL COUNT */}
//           <div style={styles.filterGroup} ref={dropdownRef}>
//             <label style={styles.bannerLabel}>Filter Status</label>
//             <div 
//               style={{...styles.bannerDropdown, border: isOpen ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.2)'}}
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               <div className="d-flex align-items-center gap-2">
//                 <i className={`bi ${selectedOption.icon}`} style={{ color: selectedOption.id ? selectedOption.color : '#fff', fontSize: '12px' }}></i>
//                 <span style={styles.dropdownText}>{selectedOption.label}</span>
//               </div>
//               <i className="bi bi-chevron-down" style={{fontSize: '10px'}}></i>
              
//               {isOpen && (
//                 <div style={styles.customMenu}>
//                   {options.map((opt) => (
//                     <div 
//                       key={opt.id}
//                       style={{
//                         ...styles.menuItem,
//                         background: statusFilter === opt.id ? '#f5f7ff' : 'transparent',
//                         color: statusFilter === opt.id ? '#4f46e5' : '#475569'
//                       }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setStatusFilter(opt.id);
//                         setCurrentPage(1);
//                         setIsOpen(false);
//                       }}
//                     >
//                       <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i>
//                       {opt.label}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div style={styles.divider}></div>

//           <div style={styles.statMini}>
//               <span style={styles.bannerLabel}>TOTAL TICKETS</span>
//               <span style={styles.statValue}>{totalPending}</span>
//           </div>
//         </div>
//       </div>

//       <section style={styles.card}>
//         <div style={styles.tableScroll}>
//           {loading ? (
//              <div style={styles.skeletonContainer}>
//                 {[1,2,3,4,5].map(i => <div key={i} style={styles.skeletonRow}></div>)}
//              </div>
//           ) : (
//             <>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Incident ID</th>
//                     <th style={styles.th}>Summary</th>
//                     <th style={styles.th}>Current Status</th>
//                     <th style={styles.th}>Updates</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingIncidents.map((incident, i) => (
//                     <tr key={i} style={styles.tr}>
//                       <td style={styles.td}><span style={styles.idBadge}>{incident.incident_number}</span></td>
//                       <td style={styles.td}><div style={styles.textTruncate}>{incident.short_description}</div></td>
//                       <td style={styles.td}>
//                         <span style={{
//                           ...styles.statusBadge,
//                           backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fff3e0',
//                           color: incident.status === 'resolved' ? '#166534' : '#e65100'
//                         }}>{incident.status}</span>
//                       </td>
//                       <td style={styles.td}><div style={styles.resText}>{incident.resolution_shared || "Waiting..." }</div></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div style={styles.paginationArea}>
//                   <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={currentPage === 1 ? styles.pagBtnDisabled : styles.pagBtn}><i className="bi bi-chevron-left"></i></button>
//                   <span style={styles.pageIndicator}>Page {currentPage} of {Math.ceil(totalPending / perPage) || 1}</span>
//                   <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={currentPage >= Math.ceil(totalPending / perPage) ? styles.pagBtnDisabled : styles.pagBtn}><i className="bi bi-chevron-right"></i></button>
//               </div>
//             </>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// const styles = {
//   fullView: { display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minHeight: '600px', gap: '15px', padding: '10px' },
//   premiumBanner: {
//     background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
//     borderRadius: '20px', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//     boxShadow: '0 15px 30px -10px rgba(67, 56, 202, 0.4)', color: 'white'
//   },
//   bannerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
//   bannerRight: { display: 'flex', alignItems: 'center', gap: '25px' },
//   bannerIconBox: { width: '42px', height: '42px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
//   bannerTitle: { margin: 0, fontWeight: '800', fontSize: '16px', letterSpacing: '0.3px' },
//   bannerSub: { margin: 0, fontSize: '11px', opacity: 0.7 },
  
//   filterGroup: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px' },
//   bannerLabel: { fontSize: '9px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' },
//   bannerDropdown: { 
//     background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '10px', 
//     display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
//     position: 'relative', transition: '0.3s ease'
//   },
//   dropdownText: { fontSize: '12px', fontWeight: '700' },
//   divider: { width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' },
//   statValue: { fontSize: '20px', fontWeight: '900', display: 'block', lineHeight: '1' },
  
//   customMenu: { 
//     position: 'absolute', top: '120%', left: 0, right: 0, background: '#fff', 
//     borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 100, padding: '5px', border: '1px solid #f1f5f9' 
//   },
//   menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  
//   card: { background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//   tableScroll: { flex: 1, overflowY: 'auto', padding: '10px 20px' },
//   table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
//   th: { textAlign: 'left', padding: '10px', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
//   td: { padding: '14px 10px', fontSize: '12px', background: '#f8fafc', verticalAlign: 'middle' },
//   idBadge: { fontWeight: '800', color: '#4338ca' },
//   textTruncate: { maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#334155', fontWeight: '600' },
//   statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' },
//   resText: { fontSize: '11px', color: '#64748b', fontStyle: 'italic' },
  
//   paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '20px' },
//   pagBtn: { border: 'none', background: '#f0f4ff', color: '#4338ca', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
//   pagBtnDisabled: { background: '#f8fafc', color: '#cbd5e1', padding: '6px 12px', borderRadius: '8px', cursor: 'not-allowed' },
//   pageIndicator: { fontSize: '11px', fontWeight: '700', color: '#64748b' },
//   skeletonRow: { height: '45px', background: '#f8fafc', marginBottom: '10px', borderRadius: '10px' }
// };

// export default PendingIncidentsTab;


import React, { useState, useEffect, useRef } from 'react';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const PendingIncidentsTab = () => {
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true); 
  const [isOpen, setIsOpen] = useState(false);
  const perPage = 10; 

  const options = [
    { id: '', label: 'All Queues', color: '#818cf8', icon: 'bi-grid-fill' },
    { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
    { id: 'escalated', label: 'Escalated', color: '#fb7185', icon: 'bi-fire' },
    { id: 'in progress', label: 'In Progress', color: '#fbbf24', icon: 'bi-clock-history' },
    { id: 'on hold', label: 'On Hold', color: '#94a3b8', icon: 'bi-pause-circle-fill' },
  ];

  const selectedOption = options.find(opt => opt.id === statusFilter) || options[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const fetchPendingIncidents = async () => {
      const currentSid = user?.sid || user?.user_sid;
      if (!currentSid) return;
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.post('/users/get-pending/incidents/all', 
          { page: currentPage, per_page: perPage, user_sid: currentSid }, 
          { headers: { Authorization: `Bearer ${token}` }, params: { resolution_status: statusFilter || undefined } }
        );
        setPendingIncidents(res.data.response || []);
        setTotalPending(res.data.total || 0);
      } catch (err) { console.error(err); } 
      finally { setTimeout(() => setLoading(false), 300); }
    };
    fetchPendingIncidents();
  }, [currentPage, user, statusFilter]);

  return (
    <div style={styles.fullView}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
      {/* 🌌 DARK PROFESSIONAL GRADIENT BANNER */}
      <div style={styles.premiumBanner}>
        <div style={styles.bannerLeft}>
          <div style={styles.bannerIconBox}><i className="bi bi-shield-lock-fill"></i></div>
          <div>
            <h5 style={styles.bannerTitle}>Pending Incident Queue</h5>
            <p style={styles.bannerSub}>Enterprise Asset Management Portal</p>
          </div>
        </div>

        <div style={styles.bannerRight}>
          <div style={styles.filterGroup} ref={dropdownRef}>
            <label style={styles.bannerLabel}>Select Status</label>
            <div 
              style={{...styles.bannerDropdown, border: isOpen ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.1)'}}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${selectedOption.icon}`} style={{ color: selectedOption.color, fontSize: '12px' }}></i>
                <span style={styles.dropdownText}>{selectedOption.label}</span>
              </div>
              <i className="bi bi-chevron-down" style={{fontSize: '10px', color: '#94a3b8'}}></i>
              
              {isOpen && (
                <div style={styles.customMenu}>
                  {options.map((opt) => (
                    <div 
                      key={opt.id}
                      style={{
                        ...styles.menuItem,
                        background: statusFilter === opt.id ? '#f5f7ff' : 'transparent',
                        color: statusFilter === opt.id ? '#4f46e5' : '#475569'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusFilter(opt.id);
                        setCurrentPage(1);
                        setIsOpen(false);
                      }}
                    >
                      <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i>
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={styles.divider}></div>
          <div style={styles.statMini}>
              <span style={styles.bannerLabel}>TOTAL RECORDS</span>
              <span style={styles.statValue}>{totalPending}</span>
          </div>
        </div>
      </div>

      <section style={styles.card}>
        <div style={styles.tableScroll}>
          {loading ? (
             <div style={styles.skeletonContainer}>
                {[...Array(10)].map((_, i) => <div key={i} style={styles.skeletonRow}></div>)}
             </div>
          ) : pendingIncidents.length > 0 ? (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Incident ID</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>State</th>
                    <th style={styles.th}>Resolution Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingIncidents.map((incident, i) => (
                    <tr key={i}>
                      <td style={styles.td}><span style={styles.idBadge}>{incident.incident_number}</span></td>
                      <td style={styles.td}><div style={styles.textTruncate}>{incident.short_description}</div></td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: incident.status === 'resolved' ? '#e1fcf0' : '#fff4e5',
                          color: incident.status === 'resolved' ? '#065f46' : '#9a3412'
                        }}>{incident.status}</span>
                      </td>
                      <td style={styles.td}><div style={styles.resText}>{incident.resolution_shared || "—" }</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={styles.paginationArea}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={currentPage === 1 ? styles.pagBtnDisabled : styles.pagBtn}><i className="bi bi-chevron-left"></i> Prev</button>
                  <span style={styles.pageIndicator}>{currentPage} of {Math.ceil(totalPending / perPage) || 1}</span>
                  <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={currentPage >= Math.ceil(totalPending / perPage) ? styles.pagBtnDisabled : styles.pagBtn}>Next <i className="bi bi-chevron-right"></i></button>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
                <div style={styles.emptyIconBox}>
                    <i className={`bi ${selectedOption.icon}`} style={{ color: '#cbd5e1' }}></i>
                </div>
                <h6 style={styles.emptyTitle}>Empty Queue</h6>
                <p style={styles.emptySub}>No results for <strong>{selectedOption.label}</strong> status.</p>
                <button onClick={() => setStatusFilter('')} style={styles.resetLink}>Show all data</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  fullView: { display: 'flex', flexDirection: 'column', flex: 1, height: '100%', gap: '10px', padding: '12px', backgroundColor: '#fcfdfe' },
  premiumBanner: {
    // 🌑 Dark Professional Gradient
     background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)
    borderRadius: '14px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', color: '#fff'
  },
  bannerLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  bannerRight: { display: 'flex', alignItems: 'center', gap: '24px' },
  bannerIconBox: { width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#818cf8' },
  bannerTitle: { margin: 0, fontWeight: '700', fontSize: '16px', letterSpacing: '0.2px' },
  bannerSub: { margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: '400', marginTop: '2px' },
  
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px' },
  bannerLabel: { fontSize: '8px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  bannerDropdown: { 
    background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
    position: 'relative', transition: 'all 0.2s'
  },
  dropdownText: { fontSize: '11px', fontWeight: '600', color: '#e2e8f0' },
  divider: { width: '1px', height: '35px', background: 'rgba(255,255,255,0.1)' },
  statValue: { fontSize: '22px', fontWeight: '800', color: '#fff', display: 'block', lineHeight: 1 },
  
  customMenu: { 
    position: 'absolute', top: '115%', right: 0, width: '170px', background: '#fff', 
    borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 100, padding: '5px', border: '1px solid #e2e8f0' 
  },
  menuItem: { padding: '9px 12px', fontSize: '11px', fontWeight: '600', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '0 16px' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' },
  th: { textAlign: 'left', padding: '12px 8px', fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.3px' },
  td: { padding: '10px 8px', fontSize: '11.5px', background: '#fff', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  idBadge: { fontWeight: '700', color: '#4f46e5', background: '#f5f7ff', padding: '2px 6px', borderRadius: '4px' },
  textTruncate: { maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e293b', fontWeight: '500' },
  statusBadge: { padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' },
  resText: { fontSize: '10.5px', color: '#64748b' },
  
  paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '15px' },
  pagBtn: { border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
  pagBtnDisabled: { background: '#f8fafc', color: '#cbd5e1', border: '1px solid #f1f5f9', padding: '6px 14px', borderRadius: '8px', cursor: 'not-allowed' },
  pageIndicator: { fontSize: '11px', fontWeight: '700', color: '#64748b' },

  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' },
  emptyIconBox: { width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '14px' },
  emptyTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0' },
  emptySub: { fontSize: '12px', color: '#64748b', marginTop: '4px' },
  resetLink: { background: '#4f46e5', border: 'none', color: '#fff', fontWeight: '600', fontSize: '11px', cursor: 'pointer', marginTop: '16px', padding: '8px 16px', borderRadius: '8px' },
  
  skeletonRow: { height: '40px', background: '#f8fafc', margin: '8px 0', borderRadius: '6px' },
  skeletonContainer: { padding: '10px 0' }
};

export default PendingIncidentsTab;