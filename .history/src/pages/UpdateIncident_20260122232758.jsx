import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const UpdateIncident = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]); // Stores the list of recently created/updated items

  const [formData, setFormData] = useState({
    incident_number: '',
    short_description: '',
    status: 'resolved',
    resolution_shared: '',
    updates_link: '',
    user: user?.full_name || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const token = user?.token || localStorage.getItem("session_token");
      const res = await api.post('/users/update/incidents', [formData], {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.status === "success") {
        setFeedback({ type: 'success', message: res.data.message });
        
        // Add the new incident to the top of the local list for immediate visual confirmation
        const newEntry = { ...formData, timestamp: new Date().toLocaleTimeString() };
        setRecentIncidents([newEntry, ...recentIncidents].slice(0, 6)); // Keep only latest 6
        
        // Reset form except user name
        setFormData({ ...formData, incident_number: '', short_description: '', resolution_shared: '', updates_link: '' });
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
        {/* LEFT: INPUT FORM */}
        <div style={styles.formSection}>
          <div className="mb-4">
            <h4 style={styles.sectionTitle}>Sync <span style={{ color: '#4f46e5' }}>Incident</span></h4>
            <p style={styles.subtitle}>Enter details to update the master record</p>
          </div>
          
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label style={styles.label}>Incident ID</Form.Label>
                <Form.Control name="incident_number" value={formData.incident_number} placeholder="INC0012345" style={styles.input} onChange={handleChange} required />
              </Col>
              <Col md={6}>
                <Form.Label style={styles.label}>Lifecycle Status</Form.Label>
                <Form.Select name="status" value={formData.status} style={styles.select} onChange={handleChange}>
                  <option value="resolved">Resolved</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </Form.Select>
              </Col>
              <Col md={12}>
                <Form.Label style={styles.label}>Short Description</Form.Label>
                <Form.Control name="short_description" value={formData.short_description} placeholder="e.g. Server Latency in Region A" style={styles.input} onChange={handleChange} required />
              </Col>
              <Col md={12}>
                <Form.Label style={styles.label}>Resolution Details</Form.Label>
                <Form.Control as="textarea" rows={3} name="resolution_shared" value={formData.resolution_shared} style={styles.textarea} onChange={handleChange} />
              </Col>
            </Row>
            
            {feedback && <Alert variant={feedback.type} className="mt-3 py-2 small border-0 shadow-sm">{feedback.message}</Alert>}
            
            <Button type="submit" style={styles.submitBtn} className="w-100 mt-4" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Update Master Record'}
            </Button>
          </Form>
        </div>

        {/* RIGHT: INCIDENT LIST (Activity Log) */}
        <div style={styles.listSection}>
          <div style={styles.listHeader}>
            <h6 style={styles.listTitle}><i className="bi bi-clock-history me-2"></i>Recent Activity</h6>
            <Badge bg="primary" pill style={{ fontSize: '10px' }}>Session Log</Badge>
          </div>
          
          <div style={styles.tableContainer}>
            {recentIncidents.length === 0 ? (
              <div style={styles.emptyState}>
                <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                <p>No incidents updated in this session</p>
              </div>
            ) : (
              <Table hover responsive style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Summary</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((inc, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.tdId}>{inc.incident_number}</td>
                      <td style={styles.tdText}>{inc.short_description}</td>
                      <td style={styles.td}>
                        <span style={{...styles.statusDot, background: inc.status === 'resolved' ? '#10b981' : '#f59e0b'}}></span>
                        <span style={{ fontSize: '11px', fontWeight: '600' }}>{inc.status}</span>
                      </td>
                      <td style={styles.tdTime}>{inc.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
          
          <div style={styles.listFooter}>
            <p className="m-0 text-muted" style={{ fontSize: '11px' }}>
              <i className="bi bi-info-circle me-1"></i> Data syncs automatically with Aura Cloud
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f1f5f9', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '0', width: '100%', maxWidth: '1200px', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' },
  
  formSection: { padding: '40px', borderRight: '1px solid #f1f5f9' },
  sectionTitle: { fontWeight: '900', marginBottom: '4px', letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', fontSize: '13px' },
  label: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' },
  input: { borderRadius: '10px', padding: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', transition: 'all 0.2s' },
  textarea: { borderRadius: '10px', padding: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px' },
  select: { borderRadius: '10px', padding: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', fontWeight: '700' },
  submitBtn: { background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', border: 'none', borderRadius: '10px', padding: '15px', fontWeight: '700', fontSize: '14px' },

  listSection: { backgroundColor: '#fafbfd', padding: '30px', display: 'flex', flexDirection: 'column' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  listTitle: { margin: 0, fontWeight: '800', fontSize: '14px', color: '#1e293b' },
  tableContainer: { flex: 1, backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #edf2f7', overflow: 'hidden' },
  table: { margin: 0 },
  th: { fontSize: '10px', color: '#94a3b8', background: '#f8fafc', padding: '12px 15px', borderBottom: '1px solid #edf2f7', textTransform: 'uppercase' },
  tdId: { fontSize: '12px', fontWeight: '800', color: '#4f46e5', padding: '12px 15px' },
  tdText: { fontSize: '12px', color: '#475569', maxWidth: '200px', overflow: 'hidden', textTruncate: 'ellipsis', whiteSpace: 'nowrap' },
  td: { verticalAlign: 'middle', padding: '12px 15px' },
  tdTime: { fontSize: '11px', color: '#94a3b8' },
  statusDot: { display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', marginRight: '8px' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '13px' },
  listFooter: { marginTop: '15px' }
};

export default UpdateIncident;