import React, { useState, useEffect } from 'react';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const PendingIncidentsTab = () => {
  const { user } = useAuth();

  // States
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
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
        setLoading(false);
      }
    };
    fetchPendingIncidents();
  }, [currentPage, user, statusFilter]);

  return (
    <div style={styles.fullView}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
      {/* Header with Filter */}
      <div style={styles.tabHeader}>
        <h4 style={styles.tabTitle}>Your <span style={{ color: '#4f46e5' }}>Pending</span> Incidents</h4>
        
        <div style={styles.dropdownContainer}>
          <div 
            style={{...styles.premiumButton, borderColor: isOpen ? '#4f46e5' : '#d1d5db'}}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div style={{ ...styles.statusDot, backgroundColor: selectedOption.color }} />
            <span style={styles.selectedText}>{selectedOption.label}</span>
            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '12px' }}></i>
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
                  <i className={`bi ${opt.icon}`} style={{ color: opt.color, fontSize: '14px' }}></i>
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h6 style={styles.cardTitle}>Incident Log</h6>
          <span style={styles.badge}>{totalPending} Records Found</span>
        </div>

        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Incident No</th>
                <th style={styles.th}>Short Description</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {pendingIncidents.length > 0 ? (
                pendingIncidents.map((incident, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={{ fontWeight: '700', color: '#4f46e5' }}>{incident.incident_number}</span>
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
                      <span style={{ fontStyle: 'italic', color: '#64748b' }}>
                        {incident.resolution_shared || "Pending..." }
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '40px 0', textAlign: 'center' }}>
                    <div style={styles.noDataWrapper}>
                      <i className={`bi ${selectedOption.icon}`} style={{ fontSize: '24px', color: '#cbd5e1', marginBottom: '10px', display: 'block' }}></i>
                      <p style={{ margin: 0, fontWeight: '700', color: '#64748b', fontSize: '14px' }}>
                        No data found in <span style={{ color: selectedOption.color }}>{selectedOption.label}</span>
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPending > perPage && (
            <div style={styles.paginationArea}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={currentPage === 1 ? styles.pagBtnDisabled : styles.pagBtn}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                {[...Array(Math.ceil(totalPending / perPage))].slice(0, 5).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} style={currentPage === i + 1 ? styles.pagNumActive : styles.pagNum}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={currentPage >= Math.ceil(totalPending / perPage)} onClick={() => setCurrentPage(p => p + 1)} style={currentPage >= Math.ceil(totalPending / perPage) ? styles.pagBtnDisabled : styles.pagBtn}>
                  <i className="bi bi-chevron-right"></i>
                </button>
            </div>
          )}
        </div>
      </section>
      {loading && <div style={styles.loader}><div className="spinner-border text-primary"></div></div>}
    </div>
  );
};

// Reusable Styles (Matching your design)
const styles = {
  fullView: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '15px' },
  tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  tabTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' },
  card: { background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', flex: 1 },
  cardHeader: { padding: '12px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { margin: 0, fontSize: '14px', fontWeight: '700', color: '#334155' },
  badge: { fontSize: '10px', background: '#e0e7ff', color: '#4338ca', padding: '3px 10px', borderRadius: '10px', fontWeight: '700' },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '0 20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 8px', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', borderBottom: '2px solid #f8fafc' },
  td: { padding: '12px 8px', fontSize: '12px', borderBottom: '1px solid #f8fafc', color: '#475569' },
  textTruncate: { maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statusBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' },
  dropdownContainer: { position: 'relative' },
  premiumButton: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #d1d5db', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  selectedText: { fontSize: '13px', fontWeight: '700', color: '#1e293b' },
  customMenu: { position: 'absolute', top: '110%', right: '0', width: '180px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, padding: '5px', border: '1px solid #f1f5f9' },
  menuItem: { padding: '10px', fontSize: '12px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  noDataWrapper: { padding: '30px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' },
  paginationArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', padding: '20px 0' },
  pagBtn: { border: '1px solid #e2e8f0', background: '#fff', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', color: '#4f46e5' },
  pagBtnDisabled: { border: '1px solid #f1f5f9', background: '#f8fafc', padding: '5px 10px', borderRadius: '6px', color: '#cbd5e1', cursor: 'not-allowed' },
  pagNum: { border: '1px solid #e2e8f0', background: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  pagNumActive: { background: '#4f46e5', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: '700' },
  loader: { position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }
};

export default PendingIncidentsTab;