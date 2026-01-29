import React, { useState, useEffect } from 'react';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const PendingIncidentsTab = () => {
  const { user } = useAuth();

  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true); // Start as true to prevent layout jump
  const [isOpen, setIsOpen] = useState(false);
  const perPage = 10;

  const options = [
    { id: '', label: 'All Incidents', color: '#4f46e5', icon: 'bi-grid-fill' },
    { id: 'resolved', label: 'Resolved', color: '#10b981', icon: 'bi-check-circle-fill' },
    { id: 'escalated', label: 'Escalated', color: '#f43f5e', icon: 'bi-fire' },
    { id: 'in progress', label: 'In Progress', color: '#f59e0b', icon: 'bi-clock-history' },
    { id: 'on hold', label: 'On Hold', color: '#64748b', icon: 'bi-pause-circle-fill' },
  ];

  const selectedOption = options.find(opt => opt.id === statusFilter) || options[0];

  useEffect(() => {
    const fetchPendingIncidents = async () => {
      const currentSid = user?.sid || user?.user_sid;
      if (!currentSid) return;

      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const payload = {
          page: currentPage,
          per_page: perPage,
          user_sid: currentSid
        };

        const res = await api.post('/users/get-pending/incidents/all', payload, {
          headers: { Authorization: `Bearer ${token}` },
          params: { resolution_status: statusFilter || undefined }
        });

        setPendingIncidents(res.data.response || []);
        setTotalPending(res.data.total || 0);
      } catch (err) {
        console.error("Pending API Error:", err);
      } finally {
        // Smooth timeout to prevent the "color flash"
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchPendingIncidents();
  }, [currentPage, user, statusFilter]);

  return (
    <div style={{...styles.fullView, opacity: loading ? 0.7 : 1}}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
      <div style={styles.tabHeader}>
        <div className="d-flex align-items-center gap-2">
           <i className="bi bi-layers-half text-primary"></i>
           <h4 style={styles.tabTitle}>Pending <span style={{ color: '#4f46e5' }}>Queue</span></h4>
        </div>
        
        <div style={styles.dropdownContainer}>
          <div 
            style={{...styles.premiumButton, borderColor: isOpen ? '#4f46e5' : '#d1d5db'}}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div style={{ ...styles.statusDot, backgroundColor: selectedOption.color }} />
            <span style={styles.selectedText}>{selectedOption.label}</span>
            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '11px' }}></i>
          </div>

          {isOpen && (
            <div style={styles.customMenu}>
              {options.map((opt) => (
                <div 
                  key={opt.id}
                  style={{
                    ...styles.menuItem,
                    background: statusFilter === opt.id ? '#f0f4ff' : 'transparent',
                    color: statusFilter === opt.id ? '#4f46e5' : '#475569'
                  }}
                  onClick={() => {
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

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div className="d-flex align-items-center gap-2">
            <div style={styles.livePulse}></div>
            <h6 style={styles.cardTitle}>Incident Overview</h6>
          </div>
          <span style={styles.badge}>{totalPending} Active Records</span>
        </div>

        <div style={styles.tableScroll}>
          {loading ? (
             <div style={styles.skeletonContainer}>
                {[1,2,3,4,5].map(i => <div key={i} style={styles.skeletonRow}></div>)}
             </div>
          ) : (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Last Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingIncidents.length > 0 ? (
                    pendingIncidents.map((incident, i) => (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.idBadge}>{incident.incident_number}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.textTruncate}>{incident.short_description}</div>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fee2e2',
                            color: incident.status === 'resolved' ? '#166534' : '#991b1b'
                          }}>
                            {incident.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.resText}>{incident.resolution_shared || "Waiting for update..." }</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '60px 0' }}>
                        <div style={styles.noDataWrapper}>
                          <i className="bi bi-inbox text-muted" style={{fontSize: '2rem'}}></i>
                          <p className="m-0 fw-bold text-muted">No records found for this filter</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPending > perPage && (
                <div style={styles.paginationArea}>
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={currentPage === 1 ? styles.pagBtnDisabled : styles.pagBtn}>
                      <i className="bi bi-arrow-left"></i>
                    </button>
                    <span style={styles.pageIndicator}>Page {currentPage}</span>
                    <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={currentPage >= Math.ceil(totalPending / perPage) ? styles.pagBtnDisabled : styles.pagBtn}>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  fullView: { 
    display: 'flex', 
    flexDirection: 'column', 
    flex: 1, 
    height: '100%', // Take up full sidebar content area
    minHeight: '500px', // FIX: Prevents "Shaking" by holding space
    gap: '12px',
    transition: 'opacity 0.3s ease',
    overflow: 'hidden'
  },
  tabHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    background: '#fff', 
    padding: '12px 18px', 
    borderRadius: '12px', 
    border: '1px solid #edf2f7'
  },
  tabTitle: { margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' },
  card: { 
    background: '#fff', 
    borderRadius: '12px', 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden', 
    border: '1px solid #edf2f7', 
    flex: 1,
    minHeight: 0 // Crucial for inner scroll
  },
  cardHeader: { padding: '10px 18px', borderBottom: '1px solid #f7fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { margin: 0, fontSize: '12px', fontWeight: '700', color: '#4a5568' },
  livePulse: { width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' },
  badge: { fontSize: '10px', background: '#f0f5ff', color: '#4f46e5', padding: '2px 10px', borderRadius: '20px', fontWeight: '700' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '0 18px' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
  th: { textAlign: 'left', padding: '8px', fontSize: '10px', color: '#a0aec0', textTransform: 'uppercase', fontWeight: '800' },
  td: { padding: '10px 8px', fontSize: '12px', background: '#fcfcfd', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' },
  idBadge: { fontWeight: '800', color: '#4f46e5', fontSize: '11px' },
  textTruncate: { maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' },
  resText: { fontStyle: 'italic', color: '#718096', fontSize: '11px' },
  statusBadge: { padding: '3px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' },
  dropdownContainer: { position: 'relative' },
  premiumButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' },
  statusDot: { width: '7px', height: '7px', borderRadius: '50%' },
  selectedText: { fontSize: '12px', fontWeight: '700', color: '#2d3748' },
  customMenu: { position: 'absolute', top: '110%', right: '0', width: '160px', background: '#fff', borderRadius: '10px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)', zIndex: 100, border: '1px solid #f1f5f9', padding: '4px' },
  menuItem: { padding: '8px 12px', fontSize: '11px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  noDataWrapper: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '15px 0' },
  pagBtn: { border: 'none', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', color: '#4f46e5' },
  pagBtnDisabled: { background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', color: '#cbd5e1', cursor: 'not-allowed' },
  pageIndicator: { fontSize: '11px', fontWeight: '700', color: '#718096' },
  skeletonContainer: { padding: '20px 0' },
  skeletonRow: { height: '40px', background: '#f8fafc', marginBottom: '10px', borderRadius: '8px', border: '1px solid #f1f5f9' }
};

export default PendingIncidentsTab;