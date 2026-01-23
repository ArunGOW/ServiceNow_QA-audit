import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const UpdateIncident = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);

  const [formData, setFormData] = useState({
    incident_number: '',
    short_description: '',
    status: 'resolved',
    resolution_shared: '',
    updates_link: '',
    user: currentUser?.full_name || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const token = currentUser?.token || localStorage.getItem("session_token");
      // The API expects an array
      const res = await api.post('/users/update/incidents', [formData], {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.status === "success") {
        setFeedback({ type: 'success', message: res.data.message });
        
        // Push to list with the new details
        const newEntry = { ...formData, timestamp: new Date().toLocaleTimeString() };
        setRecentIncidents([newEntry, ...recentIncidents].slice(0, 8)); 
        
        // Reset fields but keep the user name for the next entry
        setFormData({ 
          ...formData, 
          incident_number: '', 
          short_description: '', 
          resolution_shared: '', 
          updates_link: '' 
        });
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: "Sync Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
      <div style={styles.mainGrid}>
        {/* LEFT: FORM SECTION */}
        <div style={styles.formSection}>
          <div className="mb-4">
            <h4 style={styles.sectionTitle}>Aura <span style={{ color: '#4f46e5' }}>Sync</span></h4>
            <p style={styles.subtitle}>Update master incident repository</p>
          </div>
          
          <Form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col md={6}>
                <Form.Label style={styles.label}>Incident ID</Form.Label>
                <Form.Control name="incident_number" value={formData.incident_number} placeholder="INC0012..." style={styles.input} onChange={handleChange} required />
              </Col>
              <Col md={6}>
                <Form.Label style={styles.label}>User / Analyst</Form.Label>
                <Form.Control name="user" value={formData.user} placeholder="Name" style={styles.input} onChange={handleChange} required />
              </Col>
              <Col md={12}>
                <Form.Label style={styles.label}>Updates Link</Form.Label>
                <Form.Control name="updates_link" value={formData.updates_link} placeholder="https://..." style={styles.input} onChange={handleChange} />
              </Col>
              <Col md={12}>
                <Form.Label style={styles.label}>Short Description</Form.Label>
                <Form.Control name="short_description" value={formData.short_description} style={styles.input} onChange={handleChange} required />
              </Col>
              <Col md={12}>
                <Form.Label style={styles.label}>Resolution Details</Form.Label>
                <Form.Control as="textarea" rows={2} name="resolution_shared" value={formData.resolution_shared} style={styles.textarea} onChange={handleChange} />
              </Col>
            </Row>
            
            {feedback && <Alert variant={feedback.type} className="mt-3 py-2 small border-0 shadow-sm">{feedback.message}</Alert>}
            
            <Button type="submit" style={styles.submitBtn} className="w-100 mt-3" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Commit Changes'}
            </Button>
          </Form>
        </div>

        {/* RIGHT: LIST SECTION */}
        <div style={styles.listSection}>
          <div style={styles.listHeader}>
            <h6 style={styles.listTitle}><i className="bi bi-list-ul me-2 text-primary"></i>Updated Incidents</h6>
            <Badge bg="dark" style={{ fontSize: '10px' }}>{recentIncidents.length} Records</Badge>
          </div>
          
          <div style={styles.tableContainer}>
            {recentIncidents.length === 0 ? (
              <div style={styles.emptyState}>
                <i className="bi bi-database-dash mb-2" style={{ fontSize: '1.5rem' }}></i>
                <p>No activity in current session</p>
              </div>
            ) : (
              <Table hover style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Incident</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Link</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((inc, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.tdId}>{inc.incident_number}</div>
                        <div style={styles.tdSubtext}>{inc.short_description}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.tdUser}><i className="bi bi-person-circle me-1"></i> {inc.user}</div>
                      </td>
                      <td style={styles.td}>
                        {inc.updates_link ? (
                          <a href={inc.updates_link} target="_blank" rel="noreferrer" style={styles.iconBtn}>
                            <i className="bi bi-link-45deg"></i>
                          </a>
                        ) : '—'}
                      </td>
                      <td style={styles.td}>
                         <div style={{...styles.statusBadge, color: inc.status === 'resolved' ? '#10b981' : '#f59e0b'}}>
                            ● {inc.status}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f4f7fa', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0', width: '100%', maxWidth: '1150px', backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '85vh' },
  
  formSection: { padding: '30px', borderRight: '1px solid #f1f5f9', overflowY: 'auto' },
  sectionTitle: { fontWeight: '900', marginBottom: '2px', fontSize: '20px' },
  subtitle: { color: '#94a3b8', fontSize: '12px', marginBottom: '20px' },
  label: { fontSize: '9px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' },
  input: { borderRadius: '8px', padding: '10px', fontSize: '13px', border: '1.5px solid #e2e8f0' },
  textarea: { borderRadius: '8px', padding: '10px', fontSize: '13px', border: '1.5px solid #e2e8f0' },
  submitBtn: { background: '#4f46e5', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', fontSize: '13px' },

  listSection: { backgroundColor: '#fcfdfe', padding: '25px', display: 'flex', flexDirection: 'column' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  listTitle: { margin: 0, fontWeight: '800', fontSize: '13px' },
  tableContainer: { flex: 1, overflowY: 'auto' },
  table: { width: '100%' },
  th: { fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', padding: '10px', borderBottom: '2px solid #f1f5f9' },
  td: { padding: '12px 10px', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' },
  tdId: { fontSize: '12px', fontWeight: '800', color: '#1e293b' },
  tdSubtext: { fontSize: '10px', color: '#94a3b8', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  tdUser: { fontSize: '11px', fontWeight: '600', color: '#64748b' },
  statusBadge: { fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' },
  iconBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: '#eef2ff', color: '#4f46e5', borderRadius: '6px', textDecoration: 'none' },
  emptyState: { textAlign: 'center', marginTop: '100px', color: '#cbd5e1' }
};

export default UpdateIncident;