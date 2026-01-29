import React, { useState, useEffect } from 'react';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const PendingIncidentsTab = () => {
  const { user } = useAuth();

  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true); 
  const [isOpen, setIsOpen] = useState(false);
  const perPage = 10;

  const options = [
    { id: '', label: 'All Incidents', color: '#6366f1', icon: 'bi-grid-fill' },
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
      
      {/* 👑 PREMIUM BANNER */}
      <div style={styles.premiumBanner}>
        <div style={styles.bannerContent}>
          <div style={styles.bannerIconBox}><i className="bi bi-stack"></i></div>
          <div>
            <h5 style={styles.bannerTitle}>My Pending Queues</h5>
            <p style={styles.bannerSub}>Manage and track your active incident assignments</p>
          </div>
        </div>
        <div style={styles.bannerStats}>
            <div style={styles.statMini}>
                <span style={styles.statLabel}>TOTAL</span>
                <span style={styles.statValue}>{totalPending}</span>
            </div>
        </div>
      </div>

      <div style={styles.actionRow}>
        <div style={styles.filterWrapper}>
          {/* 🏷️ BEAUTIFUL LABEL */}
          <label style={styles.fieldLabel}>Filter by Status</label>
          
          <div style={styles.dropdownContainer}>
            <div 
              style={{...styles.premiumButton, borderColor: isOpen ? '#4f46e5' : '#e2e8f0'}}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${selectedOption.icon}`} style={{ color: selectedOption.color, fontSize: '14px' }}></i>
                <span style={styles.selectedText}>{selectedOption.label}</span>
              </div>
              <i className={`bi bi-chevron-down`} style={styles.chevron}></i>
            </div>

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
                    onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); setIsOpen(false); }}
                  >
                    <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i>
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <section style={styles.card}>
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
                    <th style={styles.th}>Incident ID</th>
                    <th style={styles.th}>Summary</th>
                    <th style={styles.th}>Current Status</th>
                    <th style={styles.th}>Updates</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingIncidents.map((incident, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}><span style={styles.idBadge}>{incident.incident_number}</span></td>
                      <td style={styles.td}><div style={styles.textTruncate}>{incident.short_description}</div></td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: incident.status === 'resolved' ? '#dcfce7' : '#fff3e0',
                          color: incident.status === 'resolved' ? '#166534' : '#e65100'
                        }}>{incident.status}</span>
                      </td>
                      <td style={styles.td}><div style={styles.resText}>{incident.resolution_shared || "Waiting..." }</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={styles.paginationArea}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={currentPage === 1 ? styles.pagBtnDisabled : styles.pagBtn}><i className="bi bi-chevron-left"></i></button>
                  <span style={styles.pageIndicator}>Page {currentPage} of {Math.ceil(totalPending / perPage) || 1}</span>
                  <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={currentPage >= Math.ceil(totalPending / perPage) ? styles.pagBtnDisabled : styles.pagBtn}><i className="bi bi-chevron-right"></i></button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  fullView: { display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minHeight: '600px', gap: '15px', padding: '10px' },
  premiumBanner: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
    borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', color: 'white'
  },
  bannerContent: { display: 'flex', alignItems: 'center', gap: '15px' },
  bannerIconBox: { width: '45px', height: '45px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' },
  bannerTitle: { margin: 0, fontWeight: '800', fontSize: '18px', letterSpacing: '0.5px' },
  bannerSub: { margin: 0, fontSize: '12px', opacity: 0.8 },
  bannerStats: { background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '12px', textAlign: 'center' },
  statLabel: { display: 'block', fontSize: '9px', fontWeight: '800', opacity: 0.7 },
  statValue: { fontSize: '18px', fontWeight: '900' },
  
  actionRow: { display: 'flex', justifyContent: 'flex-start', padding: '0 5px' },
  filterWrapper: { display: 'flex', flexDirection: 'column', gap: '5px' },
  fieldLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginLeft: '2px' },
  
  dropdownContainer: { position: 'relative', minWidth: '200px' },
  premiumButton: { 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
    background: '#fff', padding: '10px 15px', borderRadius: '12px', 
    border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s' 
  },
  selectedText: { fontSize: '13px', fontWeight: '700', color: '#1e293b' },
  chevron: { fontSize: '12px', color: '#94a3b8' },
  customMenu: { 
    position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', 
    borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, padding: '5px', border: '1px solid #f1f5f9' 
  },
  menuItem: { padding: '10px', fontSize: '12px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', flex: 1, display: 'flex', flexDirection: 'column' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '10px 20px' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
  th: { textAlign: 'left', padding: '10px', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' },
  td: { padding: '15px 10px', fontSize: '13px', background: '#f8fafc', border: 'none', verticalAlign: 'middle' },
  idBadge: { fontWeight: '800', color: '#4338ca' },
  textTruncate: { maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#334155', fontWeight: '500' },
  statusBadge: { padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' },
  resText: { fontSize: '11px', color: '#64748b', fontStyle: 'italic' },
  
  paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px' },
  pagBtn: { border: 'none', background: '#eef2ff', color: '#4338ca', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer' },
  pagBtnDisabled: { background: '#f8fafc', color: '#cbd5e1', padding: '8px 15px', borderRadius: '10px', cursor: 'not-allowed' },
  pageIndicator: { fontSize: '12px', fontWeight: '700', color: '#64748b' },
  skeletonRow: { height: '50px', background: '#f8fafc', marginBottom: '10px', borderRadius: '12px' }
};

export default PendingIncidentsTab;