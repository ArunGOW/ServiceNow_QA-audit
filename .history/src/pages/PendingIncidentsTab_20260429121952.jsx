 
import React, { useState, useEffect, useRef } from 'react';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PendingIncidentsTab = () => {
  const { user: authUser } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // --- List State ---
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const [qaState, setQaState] = useState('pending');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  // --- SLA State ---
  const [slaFilter, setSlaFilter] = useState('all');
  const [isSlaOpen, setIsSlaOpen] = useState(false);
  const slaRef = useRef(null);

  const perPage = 10;
  const qaDropdownRef = useRef(null);
  const [isQaOpen, setIsQaOpen] = useState(false);

  const slaOptions = [
    { id: 'all', label: 'All SLAs', icon: 'bi-clock', color: '#6366f1' },
    { id: 'breached', label: 'SLA Breached', icon: 'bi-exclamation-octagon', color: '#f43f5e' }
  ];

  const qaOptions = [
    { id: 'pending', label: 'Pending QA', icon: 'bi-hourglass-split', color: '#fbbf24' },
    { id: 'done', label: 'Completed QA', icon: 'bi-check-all', color: '#34d399' }
  ];

  const options = [
    { id: '', label: 'All Queues', color: '#6366f1', icon: 'bi-grid-fill' },
    { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
    { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
    { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
    { id: 'on hold', label: 'On Hold', color: '#64748b', icon: 'bi-pause-circle-fill' },
  ];

  const selectedSla = slaOptions.find(opt => opt.id === slaFilter) || slaOptions[0];
  const selectedQa = qaOptions.find(opt => opt.id === qaState) || qaOptions[0];
  const selectedOption = options.find(opt => opt.id === statusFilter) || options[0];

  const handleOpenUpdatePage = (incident) => {
    navigate("/dashboard/update-incident", { 
      state: { incidentData: incident, fromPending: true } 
    });
  };

  useEffect(() => {
    const fetchPendingIncidents = async () => {
      const currentSid = authUser?.sid || authUser?.user_sid;
      if (!currentSid) return;
      setLoading(true);
      try {
        const token = authUser?.token || localStorage.getItem("session_token");
        
        // SWITCH ENDPOINT BASED ON SLA FILTER
        const endpoint = slaFilter === 'breached' 
          ? '/users/get/sla-breached/incidents' 
          : '/users/get-pending/incidents/all';

        const params = {
          qa_state: qaState,
          resolution_status: statusFilter || undefined,
        };
        if (fromDate) params.from_date = fromDate;
        if (toDate) params.to_date = toDate;

        const res = await api.post(endpoint, 
          { page: currentPage, per_page: perPage, user_sid: currentSid }, 
          { headers: { Authorization: `Bearer ${token}` }, params: params }
        );
        setPendingIncidents(res.data.response || []);
        setTotalPending(res.data.total || 0);
      } catch (err) { 
        console.error(err); 
        setPendingIncidents([]);
      } 
      finally { setTimeout(() => setLoading(false), 300); }
    };
    fetchPendingIncidents();
  }, [currentPage, authUser, statusFilter, qaState, fromDate, toDate, slaFilter]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
      if (qaDropdownRef.current && !qaDropdownRef.current.contains(e.target)) setIsQaOpen(false);
      if (slaRef.current && !slaRef.current.contains(e.target)) setIsSlaOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={styles.fullView}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      
      <div style={styles.premiumBanner}>
        <div style={styles.bannerLeft}>
          <div style={styles.bannerIconBox}><i className="bi bi-mailbox2" style={{color: '#6366f1'}}></i></div>
          <div>
            <h5 style={styles.bannerTitle}><span style={{color: '#6366f1'}}>Incident Queue</span></h5>
            <p style={styles.bannerSub}>QA Workflow Management</p>
          </div>
        </div>

        <div style={styles.bannerRight}>
          {/* NEW SLA FILTER */}
          <div style={styles.filterGroup} ref={slaRef}>
            <label style={styles.bannerLabel}>SLA Status</label>
            <div style={styles.bannerDropdown} onClick={() => setIsSlaOpen(!isSlaOpen)}>
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${selectedSla.icon}`} style={{ color: selectedSla.color, fontSize: '13px' }}></i>
                <span style={styles.dropdownText}>{selectedSla.label}</span>
              </div>
              <i className="bi bi-chevron-down" style={{fontSize: '10px', color: '#94a3b8'}}></i>
              {isSlaOpen && (
                <div style={styles.customMenu}>
                  {slaOptions.map((opt) => (
                    <div key={opt.id} style={{...styles.menuItem, background: slaFilter === opt.id ? '#fef2f2' : 'transparent', color: slaFilter === opt.id ? '#f43f5e' : '#475569'}}
                      onClick={(e) => { e.stopPropagation(); setSlaFilter(opt.id); setCurrentPage(1); setIsSlaOpen(false); }}>
                      <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={styles.filterGroup} ref={qaDropdownRef}>
            <label style={styles.bannerLabel}>QA Flow</label>
            <div style={styles.bannerDropdown} onClick={() => setIsQaOpen(!isQaOpen)}>
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${selectedQa.icon}`} style={{ color: selectedQa.color, fontSize: '13px' }}></i>
                <span style={styles.dropdownText}>{selectedQa.label}</span>
              </div>
              <i className="bi bi-chevron-down" style={{fontSize: '10px', color: '#94a3b8'}}></i>
              {isQaOpen && (
                <div style={styles.customMenu}>
                  {qaOptions.map((opt) => (
                    <div key={opt.id} style={{...styles.menuItem, background: qaState === opt.id ? '#f5f3ff' : 'transparent', color: qaState === opt.id ? '#7c3aed' : '#475569'}}
                      onClick={(e) => { e.stopPropagation(); setQaState(opt.id); setCurrentPage(1); setIsQaOpen(false); }}>
                      <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.bannerLabel}>Date Filter</label>
            <div className="d-flex gap-2">
               <input type="date" value={fromDate} onChange={(e) => {setFromDate(e.target.value); setCurrentPage(1);}} style={styles.premiumDate} />
               <input type="date" value={toDate} onChange={(e) => {setToDate(e.target.value); setCurrentPage(1);}} style={styles.premiumDate} />
            </div>
          </div>

          <div style={styles.filterGroup} ref={dropdownRef}>
            <label style={styles.bannerLabel}>Status Filter</label>
            <div style={styles.bannerDropdown} onClick={() => setIsOpen(!isOpen)}>
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${selectedOption.icon}`} style={{ color: selectedOption.color, fontSize: '13px' }}></i>
                <span style={styles.dropdownText}>{selectedOption.label}</span>
              </div>
              <i className="bi bi-chevron-down" style={{fontSize: '10px', color: '#94a3b8'}}></i>
              {isOpen && (
                <div style={styles.customMenu}>
                  {options.map((opt) => (
                    <div key={opt.id} style={{...styles.menuItem, background: statusFilter === opt.id ? '#f5f3ff' : 'transparent', color: statusFilter === opt.id ? '#7c3aed' : '#475569'}}
                      onClick={(e) => { e.stopPropagation(); setStatusFilter(opt.id); setCurrentPage(1); setIsOpen(false); }}>
                      <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button style={styles.resetIconBtn} onClick={() => {setFromDate(''); setToDate(''); setQaState('pending'); setStatusFilter(''); setSlaFilter('all');}} title="Reset Filters">
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>

      <section style={styles.card}>
        <div style={styles.tableScroll}>
          {loading ? (
             <div style={styles.skeletonContainer}>{[...Array(8)].map((_, i) => <div key={i} style={styles.skeletonRow}></div>)}</div>
          ) : pendingIncidents.length > 0 ? (
            <table style={styles.table}>
              <thead style={styles.stickyHeader}>
                <tr>
                  <th style={styles.th}>Incident ID</th>
                  <th style={styles.th}>Short Description</th>
                  <th style={styles.th}>Current Status</th>
                  <th style={styles.th}>Resolution Info</th>
                </tr>
              </thead>
              <tbody>
                {pendingIncidents.map((incident, i) => (
                  <tr key={i} className="incident-row">
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.idBadge} onClick={() => handleOpenUpdatePage(incident)}>
                          {incident.incident_number}
                        </span>
                        {incident.sla_breached && (
                           <i className="bi bi-clock-history" style={{ color: '#f43f5e', fontSize: '12px' }} title="SLA Breached"></i>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}><div style={styles.textTruncate}>{incident.short_description}</div></td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fff7ed',
                        color: incident.status === 'resolved' ? '#166534' : '#9a3412',
                      }}>{incident.status}</span>
                    </td>
                    <td style={styles.td}><div style={styles.resText}>{incident.resolution_shared || "Pending Resolution" }</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
                <div style={styles.emptyIconBox}>
                  <i className={`bi ${slaFilter === 'breached' ? 'bi-patch-check' : 'bi-search'}`} style={{ color: '#6366f1' }}></i>
                </div>
                <h6 style={styles.emptyTitle}>
                  {slaFilter === 'breached' ? "No SLA breaches found" : "No matching incidents found"}
                </h6>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
                   {slaFilter === 'breached' ? "All your tickets are within target SLA." : "Try adjusting your filters."}
                </p>
                <button onClick={() => {setStatusFilter(''); setSlaFilter('all');}} style={styles.resetBtn}>Reset All Filters</button>
            </div>
          )}
        </div>
        
        <div style={styles.paginationArea}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={currentPage === 1 ? styles.pagBtnDisabled : styles.pagBtn}><i className="bi bi-arrow-left"></i> Previous</button>
            <span style={styles.pageIndicator}> {currentPage} / {Math.ceil(totalPending / perPage) || 1}</span>
            <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={currentPage >= Math.ceil(totalPending / perPage) ? styles.pagBtnDisabled : styles.pagBtn}>Next <i className="bi bi-arrow-right"></i></button>
        </div>
      </section>
    </div>
  );
};

// ... keep existing styles

const styles = {
  // Single screen lock: 100vh minus any external padding
  fullView: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)', gap: '15px', padding: '10px 20px', backgroundColor: '#f8fafc', overflow: 'hidden' },
  
  premiumBanner: {
    background: '#ffffff',
    borderRadius: '16px', 
    padding: '12px 24px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', 
    border: '1px solid #eef2f6',
    flexShrink: 0 // Prevents header from shrinking
  },
  bannerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  bannerIconBox: { width: '40px', height: '40px', background: '#f5f3ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  bannerTitle: { margin: 0, fontWeight: '800', fontSize: '16px', color: '#1e293b' },
  bannerSub: { margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: '500' },
  
  bannerRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '140px' },
  bannerLabel: { fontSize: '8px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  bannerDropdown: { 
    background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', position: 'relative',
    border: '1px solid #e2e8f0'
  },
  dropdownText: { fontSize: '11px', fontWeight: '700', color: '#1e293b' },
  
  premiumDate: {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
    color: '#1e293b', fontSize: '11px', padding: '5px 8px', fontWeight: '600', outline: 'none'
  },

  resetIconBtn: {
    background: '#fff', border: '1px solid #e2e8f0', color: '#64748b',
    borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '10px'
  },

  customMenu: { 
    position: 'absolute', top: '110%', right: 0, width: '170px', background: '#fff', 
    borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', border: '1px solid #eef2f6' 
  },
  menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #eef2f6', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '0 20px' },
  stickyHeader: { position: 'sticky', top: 0, background: '#fff', zIndex: 5 },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
  th: { textAlign: 'left', padding: '12px 10px', fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '900', borderBottom: '1px solid #f8fafc' },
  td: { padding: '10px 10px', fontSize: '12px', color: '#334155', verticalAlign: 'middle' },
  idBadge: { fontWeight: '800', color: '#6366f1', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' },
  textTruncate: { maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600' },
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' },
  resText: { fontSize: '11px', color: '#64748b', fontStyle: 'italic' },
  
  paginationArea: { flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '12px', borderTop: '1px solid #f8fafc' },
  pagBtn: { border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
  pagBtnDisabled: { background: '#f8fafc', color: '#cbd5e1', border: '1px solid #f1f5f9', padding: '6px 14px', borderRadius: '8px', cursor: 'not-allowed' },
  pageIndicator: { fontSize: '11px', fontWeight: '800', color: '#1e293b' },
  
  emptyState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  emptyIconBox: { width: '50px', height: '50px', background: '#f5f3ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '10px' },
  emptyTitle: { fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: '0' },
  resetBtn: { background: '#6366f1', border: 'none', color: '#fff', fontWeight: '700', fontSize: '11px', cursor: 'pointer', marginTop: '15px', padding: '8px 20px', borderRadius: '10px' },
  skeletonRow: { height: '40px', background: '#f9fafb', margin: '10px 0', borderRadius: '8px' },
  skeletonContainer: { padding: '10px 0' },
};

export default PendingIncidentsTab;