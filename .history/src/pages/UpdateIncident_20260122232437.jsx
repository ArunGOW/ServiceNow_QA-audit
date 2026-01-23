import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const UpdateIncident = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form State
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
      // The API expects an array of objects
      const res = await api.post('/users/update/incidents', [formData], {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status === "success") {
        setFeedback({ type: 'success', message: res.data.message });
        // Optional: Reset form or redirect
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || "Failed to update incident." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Icons Support */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

      <Card style={styles.glassCard}>
        <div style={styles.headerArea}>
          <div>
            <h4 style={styles.title}>Incident <span style={{ color: '#4f46e5' }}>Lifecycle</span></h4>
            <p style={styles.subtitle}>Update or create incident records with precision</p>
          </div>
          <div style={styles.statusBadge}>{formData.status.toUpperCase()}</div>
        </div>

        <Form onSubmit={handleSubmit} style={styles.formBody}>
          <Row className="g-3">
            {/* Incident ID */}
            <Col md={6}>
              <Form.Group>
                <Form.Label style={styles.label}>Incident Number</Form.Label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-hash" style={styles.inputIcon}></i>
                  <Form.Control
                    type="text"
                    name="incident_number"
                    placeholder="INC0012345"
                    required
                    style={styles.input}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>

            {/* Assigned User */}
            <Col md={6}>
              <Form.Group>
                <Form.Label style={styles.label}>Assigned User</Form.Label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-person-fill" style={styles.inputIcon}></i>
                  <Form.Control
                    type="text"
                    name="user"
                    value={formData.user}
                    style={styles.input}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>

            {/* Short Description */}
            <Col md={12}>
              <Form.Group>
                <Form.Label style={styles.label}>Short Description</Form.Label>
                <Form.Control
                  type="text"
                  name="short_description"
                  placeholder="Summarize the issue..."
                  required
                  style={styles.input}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Resolution Textarea */}
            <Col md={12}>
              <Form.Group>
                <Form.Label style={styles.label}>Resolution Details</Form.Label>
                <Form.Control
                  as="textarea"
                  name="resolution_shared"
                  rows={3}
                  placeholder="Describe the steps taken to resolve..."
                  style={styles.textarea}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Updates Link */}
            <Col md={8}>
              <Form.Group>
                <Form.Label style={styles.label}>Reference Link</Form.Label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-link-45deg" style={styles.inputIcon}></i>
                  <Form.Control
                    type="url"
                    name="updates_link"
                    placeholder="http://updates.com/..."
                    style={styles.input}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>

            {/* Status Dropdown */}
            <Col md={4}>
              <Form.Group>
                <Form.Label style={styles.label}>Current Status</Form.Label>
                <Form.Select 
                    name="status" 
                    style={styles.select} 
                    onChange={handleChange}
                    value={formData.status}
                >
                  <option value="resolved">Resolved</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {feedback && (
            <Alert variant={feedback.type} className="mt-4 py-2 small border-0 shadow-sm animate__animated animate__fadeIn">
              <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
              {feedback.message}
            </Alert>
          )}

          <div style={styles.footerAction}>
            <Button 
                type="submit" 
                style={styles.submitBtn} 
                disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : <><i className="bi bi-cloud-arrow-up me-2"></i> Sync Record</>}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', sans-serif"
  },
  glassCard: {
    width: '100%',
    maxWidth: '700px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden'
  },
  headerArea: {
    padding: '30px 40px',
    background: 'linear-gradient(to right, #ffffff, #f8fafc)',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { margin: 0, fontWeight: '800', fontSize: '22px', letterSpacing: '-0.5px' },
  subtitle: { margin: '5px 0 0', color: '#64748b', fontSize: '13px' },
  statusBadge: {
    padding: '5px 12px',
    background: '#e0e7ff',
    color: '#4f46e5',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.5px'
  },
  formBody: { padding: '30px 40px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', color: '#94a3b8', fontSize: '16px' },
  input: {
    padding: '12px 12px 12px 40px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  textarea: {
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500'
  },
  select: {
    padding: '12px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  footerAction: { marginTop: '30px', textAlign: 'right' },
  submitBtn: {
    padding: '12px 30px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    border: 'none',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
    transition: 'transform 0.2s'
  }
};

export default UpdateIncident;