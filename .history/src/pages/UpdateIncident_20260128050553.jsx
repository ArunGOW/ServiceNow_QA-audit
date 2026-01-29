// import React, { useState } from 'react';
// import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const UpdateIncident = () => {
//   const { user: currentUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [recentIncidents, setRecentIncidents] = useState([]);

//   const [formData, setFormData] = useState({
//     incident_number: '',
//     short_description: '',
//     status: 'resolved',
//     resolution_shared: '',
//     updates_link: '',
//     user: currentUser?.full_name || ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setFeedback(null);
//     try {
//       const token = currentUser?.token || localStorage.getItem("session_token");
//       const res = await api.post('/users/update/incidents', [formData], {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (res.data.status === "success") {
//         setFeedback({ type: 'success', message: res.data.message });
//         const newEntry = { ...formData, timestamp: new Date().toLocaleTimeString() };
//         setRecentIncidents([newEntry, ...recentIncidents].slice(0, 5)); 
//         setFormData({ ...formData, incident_number: '', short_description: '', resolution_shared: '', updates_link: '' });
//       }
//     } catch (err) {
//       setFeedback({ type: 'danger', message: "Sync Failed" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.pageWrapper}>
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
//       <div style={styles.mainGrid}>
//         {/* LEFT: INPUT FORM */}
//         <div style={styles.formSection}>
//           <h4 style={styles.sectionTitle}>Update <span style={{ color: '#4f46e5' }}>Incident</span></h4>
//           <Form onSubmit={handleSubmit}>
//             <Row className="g-3">
//               <Col md={6}>
//                 <Form.Label style={styles.label}>Incident ID</Form.Label>
//                 <Form.Control name="incident_number" value={formData.incident_number} placeholder="INC0012..." style={styles.input} onChange={handleChange} required />
//               </Col>
//               <Col md={6}>
//                 <Form.Label style={styles.label}>User</Form.Label>
//                 <Form.Control name="user" value={formData.user} style={styles.input} onChange={handleChange} required />
//               </Col>
//               <Col md={12}>
//                 <Form.Label style={styles.label}>Short Description</Form.Label>
//                 <Form.Control name="short_description" value={formData.short_description} style={styles.input} onChange={handleChange} required />
//               </Col>
//               <Col md={12}>
//                 <Form.Label style={styles.label}>Updates Link</Form.Label>
//                 <Form.Control name="updates_link" value={formData.updates_link} placeholder="https://..." style={styles.input} onChange={handleChange} />
//               </Col>
              
//               <Col md={8}>
//                 <Form.Label style={styles.label}>Resolution Details</Form.Label>
//                 <Form.Control as="textarea" rows={3} name="resolution_shared" value={formData.resolution_shared} style={styles.textarea} onChange={handleChange} />
//               </Col>
//               <Col md={4}>
//                 <Form.Label style={styles.label}>Status</Form.Label>
//                 <Form.Select name="status" value={formData.status} style={styles.select} onChange={handleChange}>
//                   <option value="resolved">Resolved</option>
//                   <option value="pending">Pending</option>
//                   <option value="closed">Closed</option>
//                 </Form.Select>
//               </Col>
//             </Row>
            
//             {feedback && <Alert variant={feedback.type} className="mt-3 py-2 small">{feedback.message}</Alert>}
            
//             <Button type="submit" style={styles.submitBtn} className="w-100 mt-4 text-white" disabled={loading}>
//               {loading ? <Spinner size="sm" /> : 'Save Incident'}
//             </Button>
//           </Form>
//         </div>

//         {/* RIGHT: INCIDENT LIST (Using your dark styles) */}
//         <div style={styles.previewSection}>
//           <div style={styles.previewHeader}>
//             <div style={styles.liveDot}></div> INCIDENT CREATED LIST
//           </div>
          
//           <div style={styles.previewCard}>
//             {recentIncidents.length === 0 ? (
//               <div style={{ textAlign: 'center', marginTop: '50px', color: '#475569' }}>
//                 <i className="bi bi-cloud-slash mb-2" style={{ fontSize: '2rem' }}></i>
//                 <p style={styles.previewLabel}>No active session data</p>
//               </div>
//             ) : (
//               recentIncidents.map((inc, index) => (
//                 <div key={index} style={{...styles.previewItem, borderBottom: '1px solid #1e293b', paddingBottom: '15px'}}>
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <span style={styles.previewTag}>{inc.timestamp}</span>
//                     <div style={{...styles.statusPill, backgroundColor: inc.status === 'resolved' ? '#064e3b' : '#451a03', color: inc.status === 'resolved' ? '#10b981' : '#f59e0b'}}>
//                       {inc.status.toUpperCase()}
//                     </div>
//                   </div>
//                   <div style={{...styles.previewValue, fontSize: '18px', color: '#fff'}}>{inc.incident_number}</div>
//                   <div style={{...styles.previewSmallValue, marginBottom: '8px'}}>{inc.short_description}</div>
                  
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div style={styles.previewSmallValue}><i className="bi bi-person me-1"></i>{inc.user}</div>
//                     {inc.updates_link && (
//                       <a href={inc.updates_link} target="_blank" rel="noreferrer" style={{color: '#4f46e5', fontSize: '12px'}}>
//                         <i className="bi bi-link-45deg"></i> Link
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   pageWrapper: { backgroundColor: '#f8fafc', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
//   mainGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', width: '100%', maxWidth: '1100px', backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
//   sectionTitle: { fontWeight: '900', marginBottom: '25px', letterSpacing: '-1px' },
//   label: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' },
//   input: { borderRadius: '12px', padding: '10px 15px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#fcfdfe' },
//   textarea: { borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0', fontSize: '13px', backgroundColor: '#fcfdfe' },
//   select: { borderRadius: '12px', padding: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600' },
//   submitBtn: { background: '#4f46e5', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' },
  
//   previewSection: { backgroundColor: '#0f172a', borderRadius: '20px', padding: '25px', display: 'flex', flexDirection: 'column', color: '#fff', overflowY: 'auto' },
//   previewHeader: { fontSize: '10px', fontWeight: '900', color: '#64748b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
//   liveDot: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' },
//   previewCard: { flex: 1, display: 'flex', flexDirection: 'column' },
//   previewTag: { fontSize: '9px', background: '#1e293b', padding: '2px 8px', borderRadius: '4px', color: '#94a3b8', marginBottom: '5px', display: 'inline-block' },
//   previewId: { fontSize: '28px', fontWeight: '900', margin: 0, color: '#f8fafc' },
//   statusPill: { padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '900' },
//   previewItem: { marginBottom: '20px' },
//   previewLabel: { display: 'block', fontSize: '10px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' },
//   previewValue: { fontSize: '15px', fontWeight: '600', color: '#cbd5e1' },
//   previewBox: { backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', fontSize: '12px', color: '#94a3b8', border: '1px solid #334155', minHeight: '80px' },
//   previewSmallValue: { fontSize: '12px', fontWeight: '600', color: '#94a3b8' }
// };

// export default UpdateIncident;

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const UpdateIncident = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userList, setUserList] = useState([]); // State for dropdown

  // Initialize state from localStorage
  const [recentIncidents, setRecentIncidents] = useState(() => {
    const saved = localStorage.getItem('aura_incident_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    incident_number: '',
    short_description: '',
    status: 'resolved',
    resolution_shared: '',
    updates_link: '',
    user: '', // This is the end-user
    done_by: currentUser?.full_name || '', // This is the selected analyst from dropdown
    escalated_notes: '' // New field for resolution/escalation notes
  });

  // 1. Fetch User List for the "Done By" dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = currentUser?.token || localStorage.getItem("session_token");
        const res = await api.get('/users/get/list_users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserList(res.data || []);
      } catch (err) {
        console.error("Failed to fetch user list", err);
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aura_incident_history', JSON.stringify(recentIncidents));
  }, [recentIncidents]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (incident) => {
    setFormData({ ...incident });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    // Matches your provided CURL payload exactly
    const payload = [{
      done_by: formData.done_by,
      escalated_notes: formData.escalated_notes || "N/A",
      incident_number: formData.incident_number,
      resolution_shared: formData.resolution_shared || "N/A",
      short_description: formData.short_description,
      status: formData.status,
      updates_link: formData.updates_link || " ",
      user: formData.user
    }];

    try {
      const token = currentUser?.token || localStorage.getItem("session_token");
      const res = await api.post('/users/update/incidents', payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.data.status === "success" || res.status === 200) {
        setFeedback({ type: 'success', message: res.data.message || "Updated successfully" });
        const newEntry = { ...formData, timestamp: new Date().toLocaleString() };
        setRecentIncidents([newEntry, ...recentIncidents.filter(i => i.incident_number !== formData.incident_number)].slice(0, 10));
        
        // Reset form
        setFormData({ 
          ...formData, 
          incident_number: '', 
          short_description: '', 
          resolution_shared: '', 
          updates_link: '', 
          user: '', 
          escalated_notes: '' 
        });
      }
    } catch (err) {
      const serverError = err.response?.data?.message || "Sync Failed";
      setFeedback({ type: 'danger', message: serverError });
    } finally {
      setLoading(false);
    }
  };
  <style>{`
  .premium-dropdown:focus {
    outline: none !important;
    border-color: #4f46e5 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
    transform: translateY(-1px);
  }
  .premium-dropdown:hover {
    border-color: #cbd5e1;
    background-color: #fff;
  }
`}</style>

  return (
    
    <div style={styles.pageWrapper}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
      <div style={styles.mainGrid}>
        <div style={styles.formSection}>
          <h4 style={styles.sectionTitle}>Update <span style={{ color: '#4f46e5' }}>Incident</span></h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label style={styles.label}>Incident ID</Form.Label>
                <Form.Control name="incident_number" value={formData.incident_number} placeholder="INC0012..." style={styles.input} onChange={handleChange} required />
              </Col>
              
              {/* NEW: DROPDOWN FOR SELECT USER (Done By) */}
              <Col md={6}>
                <Form.Label style={styles.label}>Done By (Analyst)</Form.Label>
                <Form.Select name="done_by" value={formData.done_by} style={styles.select} onChange={handleChange} required>
                  <option value="">Select Analyst</option>
                  {userList.map(u => (
                    <option key={u.sid} value={u.full_name}>{u.full_name}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label style={styles.label}>End User</Form.Label>
                <Form.Control name="user" value={formData.user} placeholder="John Doe" style={styles.input} onChange={handleChange} required />
              </Col>

              <Col md={6}>
                <Form.Label style={styles.label}>Status</Form.Label>
                <Form.Select name="status" value={formData.status} style={styles.select} onChange={handleChange}>
                  <option value="resolved">resolved</option>
                  <option value="escalated">escalated</option>
                  <option value="in progress">in progress</option>
                  <option value="on hold">on hold</option>
                </Form.Select>
              </Col>

              <Col md={12}>
                <Form.Label style={styles.label}>Short Description</Form.Label>
                <Form.Control name="short_description" value={formData.short_description} style={styles.input} onChange={handleChange} required />
              </Col>
              
              <Col md={12}>
                <Form.Label style={styles.label}>Resolution Shared</Form.Label>
                <Form.Control name="resolution_shared" value={formData.resolution_shared} style={styles.input} onChange={handleChange} />
              </Col>

              {/* NEW: INPUT FIELD FOR ESCALATION/RESOLUTION NOTES */}
              <Col md={12}>
                <Form.Label style={styles.label}>Notes (Escalation/Internal)</Form.Label>
                <Form.Control as="textarea" rows={2} name="escalated_notes" value={formData.escalated_notes} placeholder="Detailed notes..." style={styles.textarea} onChange={handleChange} />
              </Col>

              <Col md={12}>
                <Form.Label style={styles.label}>Updates Link</Form.Label>
                <Form.Control name="updates_link" value={formData.updates_link} placeholder="https://..." style={styles.input} onChange={handleChange} />
              </Col>
            </Row>
            
            {feedback && <Alert variant={feedback.type} className="mt-3 py-2 small border-0 shadow-sm">{feedback.message}</Alert>}
            
            <div className="d-flex gap-2 mt-4">
               <Button type="submit" style={styles.submitBtn} className="flex-grow-1 text-white" disabled={loading}>
                 {loading ? <Spinner size="sm" /> : 'Save Incident'}
               </Button>
               {recentIncidents.length > 0 && (
                 <Button variant="outline-danger" style={{ borderRadius: '12px' }} onClick={() => setRecentIncidents([])}>
                   <i className="bi bi-trash"></i>
                 </Button>
               )}
            </div>
          </Form>
        </div>

        {/* RIGHT SIDE REMAINS THE SAME... */}
        <div style={styles.previewSection}>
          <div style={styles.previewHeader}>
            <div style={styles.liveDot}></div> INCIDENT HISTORY (SAVED)
          </div>
          <div style={styles.previewCard}>
            {recentIncidents.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#475569' }}>
                <i className="bi bi-archive mb-2" style={{ fontSize: '2rem' }}></i>
                <p style={styles.previewLabel}>No saved incidents</p>
              </div>
            ) : (
              recentIncidents.map((inc, index) => (
                <div key={index} onClick={() => handleEdit(inc)} style={{...styles.previewItem, cursor: 'pointer', borderBottom: '1px solid #1e293b', paddingBottom: '15px'}}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={styles.previewTag}>{inc.timestamp}</span>
                    <div style={{...styles.statusPill, backgroundColor: inc.status === 'resolved' ? '#064e3b' : '#451a03', color: inc.status === 'resolved' ? '#10b981' : '#f59e0b'}}>
                      {inc.status.toUpperCase()}
                    </div>
                  </div>
                  <div style={{...styles.previewValue, fontSize: '18px', color: '#fff'}}>{inc.incident_number}</div>
                  <div style={{...styles.previewSmallValue, marginBottom: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>{inc.short_description}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={styles.previewSmallValue}><i className="bi bi-person me-1"></i>{inc.user}</div>
                    <i className="bi bi-pencil-square" style={{color: '#4f46e5'}}></i>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ... Styles object remains the same as in your original code ...

const styles = {
  pageWrapper: { backgroundColor: '#f8fafc', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px', width: '100%', maxWidth: '1200px', backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  sectionTitle: { fontWeight: '900', marginBottom: '30px',  
    background: 'linear-gradient(90deg, #f8fafc 0%, #eef2ff 100%)', 
    padding: '20px 30px', 
    borderBottom: '1px solid #e2e8f0',
    
    
    },
  label: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' },
  input: { borderRadius: '12px', padding: '10px 15px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#fcfdfe' },
  textarea: { borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0', fontSize: '13px', backgroundColor: '#fcfdfe' },
select: { 
    borderRadius: '14px', 
    padding: '12px 18px', 
    border: '1px solid #e2e8f0', 
    fontSize: '14px', 
    backgroundColor: '#f8fafc', 
    cursor: 'pointer',
    appearance: 'none', // Removes default browser arrow
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234f46e5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1.2rem center',
    backgroundSize: '1.1em',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    fontWeight: '500',
    color: '#1e293b'
  },  submitBtn: { background: '#4f46e5', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' },
  
  previewSection: { backgroundColor: '#0f172a', borderRadius: '20px', padding: '25px', display: 'flex', flexDirection: 'column', color: '#fff', overflowY: 'auto' },
  previewHeader: { fontSize: '10px', fontWeight: '900', color: '#64748b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  liveDot: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' },
  previewCard: { flex: 1, display: 'flex', flexDirection: 'column' },
  previewTag: { fontSize: '9px', background: '#1e293b', padding: '2px 8px', borderRadius: '4px', color: '#94a3b8', marginBottom: '5px', display: 'inline-block' },
  previewId: { fontSize: '28px', fontWeight: '900', margin: 0, color: '#f8fafc' },
  statusPill: { padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '900' },
  previewItem: { marginBottom: '20px', padding: '8px', borderRadius: '10px', transition: '0.3s' },
  previewLabel: { display: 'block', fontSize: '10px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' },
  previewValue: { fontSize: '15px', fontWeight: '600', color: '#cbd5e1' },
  previewSmallValue: { fontSize: '12px', fontWeight: '600', color: '#94a3b8' }
};

export default UpdateIncident;