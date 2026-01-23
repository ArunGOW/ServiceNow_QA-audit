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

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";

// const UpdateIncident = () => {
//   const { user: currentUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);
  
//   // Initialize state from localStorage if it exists
//   const [recentIncidents, setRecentIncidents] = useState(() => {
//     const saved = localStorage.getItem('aura_incident_history');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [formData, setFormData] = useState({
//     incident_number: '',
//     short_description: '',
//     status: 'resolved',
//     resolution_shared: '',
//     updates_link: '',
//     user: currentUser?.full_name || ''
//   });

//   // Save to localStorage whenever the list changes
//   useEffect(() => {
//     localStorage.setItem('aura_incident_history', JSON.stringify(recentIncidents));
//   }, [recentIncidents]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setFeedback(null);

//     // Ensure the payload is an array of objects
//     const payload = [{
//       incident_number: formData.incident_number,
//       resolution_shared: formData.resolution_shared || "N/A",
//       short_description: formData.short_description,
//       status: formData.status,
//       updates_link: formData.updates_link || " ",
//       user: formData.user
//     }];

//     try {
//       const token = currentUser?.token || localStorage.getItem("session_token");
      
//       const res = await api.post('/users/update/incidents', payload, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (res.data.status === "success") {
//         setFeedback({ type: 'success', message: res.data.message });
//         const newEntry = { ...formData, timestamp: new Date().toLocaleString() };
//         setRecentIncidents([newEntry, ...recentIncidents.filter(i => i.incident_number !== formData.incident_number)].slice(0, 10));
        
//         // Reset form but keep the user
//         setFormData({ ...formData, incident_number: '', short_description: '', resolution_shared: '', updates_link: '' });
//       }
//     } catch (err) {
//       // FIX: Extracting the real error message from the server response
//       const serverError = err.response?.data?.message || err.response?.data?.detail?.[0]?.msg || "Network Error: Check API URL";
//       setFeedback({ type: 'danger', message: `Sync Failed: ${serverError}` });
//       console.error("API Error Response:", err.response?.data);
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
            
//             {feedback && <Alert variant={feedback.type} className="mt-3 py-2 small border-0 shadow-sm">{feedback.message}</Alert>}
            
//             <div className="d-flex gap-2 mt-4">
//                <Button type="submit" style={styles.submitBtn} className="flex-grow-1 text-white" disabled={loading}>
//                  {loading ? <Spinner size="sm" /> : 'Save Incident'}
//                </Button>
//                {recentIncidents.length > 0 && (
//                  <Button variant="outline-danger" style={{ borderRadius: '12px' }} onClick={() => setRecentIncidents([])}>
//                    <i className="bi bi-trash"></i>
//                  </Button>
//                )}
//             </div>
//           </Form>
//         </div>

//         {/* RIGHT: PERSISTENT LIST */}
//         <div style={styles.previewSection}>
//           <div style={styles.previewHeader}>
//             <div style={styles.liveDot}></div> INCIDENT HISTORY (SAVED)
//           </div>
          
//           <div style={styles.previewCard}>
//             {recentIncidents.length === 0 ? (
//               <div style={{ textAlign: 'center', marginTop: '50px', color: '#475569' }}>
//                 <i className="bi bi-archive mb-2" style={{ fontSize: '2rem' }}></i>
//                 <p style={styles.previewLabel}>No saved incidents</p>
//               </div>
//             ) : (
//               recentIncidents.map((inc, index) => (
//                 <div 
//                   key={index} 
//                   onClick={() => handleEdit(inc)}
//                   style={{...styles.previewItem, cursor: 'pointer', borderBottom: '1px solid #1e293b', paddingBottom: '15px'}}
//                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
//                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                 >
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <span style={styles.previewTag}>{inc.timestamp}</span>
//                     <div style={{...styles.statusPill, backgroundColor: inc.status === 'resolved' ? '#064e3b' : '#451a03', color: inc.status === 'resolved' ? '#10b981' : '#f59e0b'}}>
//                       {inc.status.toUpperCase()}
//                     </div>
//                   </div>
//                   <div style={{...styles.previewValue, fontSize: '18px', color: '#fff'}}>{inc.incident_number}</div>
//                   <div style={{...styles.previewSmallValue, marginBottom: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>{inc.short_description}</div>
                  
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div style={styles.previewSmallValue}><i className="bi bi-person me-1"></i>{inc.user}</div>
//                     <i className="bi bi-pencil-square" style={{color: '#4f46e5'}}></i>
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
//   previewItem: { marginBottom: '20px', padding: '8px', borderRadius: '10px', transition: '0.3s' },
//   previewLabel: { display: 'block', fontSize: '10px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' },
//   previewValue: { fontSize: '15px', fontWeight: '600', color: '#cbd5e1' },
//   previewSmallValue: { fontSize: '12px', fontWeight: '600', color: '#94a3b8' }
// };

// export default UpdateIncident;

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify'; 
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const UpdateIncident = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [recentIncidents, setRecentIncidents] = useState(() => {
    const saved = localStorage.getItem('aura_incident_history');
    return saved ? JSON.parse(saved) : [];
  });

  const initialFormState = {
    incident_number: '',
    short_description: '',
    status: 'resolved',
    resolution_shared: '',
    updates_link: '',
    user: currentUser?.full_name || ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem('aura_incident_history', JSON.stringify(recentIncidents));
  }, [recentIncidents]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (incident) => {
    setFormData({ ...incident });
    toast.info(`Editing Incident ${incident.incident_number}`, { position: "top-center", autoClose: 2000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = [{
      ...formData,
      resolution_shared: formData.resolution_shared || "N/A",
      updates_link: formData.updates_link || " "
    }];

    try {
      const token = currentUser?.token || localStorage.getItem("session_token");
      const res = await api.post('/users/update/incidents', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.data.status === "success" || res.status === 200) {
        toast.success("Incident Synced Successfully!");
        
        // Update local history
        const newEntry = { ...formData, timestamp: new Date().toLocaleString() };
        setRecentIncidents([newEntry, ...recentIncidents.filter(i => i.incident_number !== formData.incident_number)].slice(0, 10));
        
        // Clear input fields (keep user)
        setFormData({ ...initialFormState, user: currentUser?.full_name || formData.user });
      }
    } catch (err) {
      const serverError = err.response?.data?.message || "Sync Failed";
      toast.error(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      
      <div style={styles.dashboardCard}>
        {/* PREMIUM HEADER BANNER */}
        <div style={styles.headerBanner}>
          <div style={styles.bannerContent}>
            <div style={styles.iconBox}>
              <i className="bi bi-shield-fill-check"></i>
            </div>
            <div>
              <h2 style={styles.bannerTitle}>AURA <span style={{fontWeight: '300'}}>TERMINAL</span></h2>
              <p style={styles.bannerSubtitle}>Incident Management & Cloud Sync</p>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <div style={styles.pulse}></div> SYSTEM ACTIVE
          </div>
        </div>

        <div style={styles.mainGrid}>
          {/* LEFT: INPUT FORM */}
          <div style={styles.formSection}>
            <h4 style={styles.sectionTitle}>Sync <span style={{ color: '#4f46e5' }}>Incident</span></h4>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label style={styles.label}>Incident ID</Form.Label>
                  <Form.Control name="incident_number" value={formData.incident_number} placeholder="INC001..." style={styles.input} onChange={handleChange} required />
                </Col>
                <Col md={6}>
                  <Form.Label style={styles.label}>Engineer</Form.Label>
                  <Form.Control name="user" value={formData.user} style={styles.input} onChange={handleChange} required />
                </Col>
                <Col md={12}>
                  <Form.Label style={styles.label}>Short Description</Form.Label>
                  <Form.Control name="short_description" value={formData.short_description} style={styles.input} onChange={handleChange} required />
                </Col>
                <Col md={12}>
                  <Form.Label style={styles.label}>Updates Link</Form.Label>
                  <Form.Control name="updates_link" value={formData.updates_link} placeholder="Internal wiki or tracker link" style={styles.input} onChange={handleChange} />
                </Col>
                <Col md={8}>
                  <Form.Label style={styles.label}>Resolution Details</Form.Label>
                  <Form.Control as="textarea" rows={3} name="resolution_shared" value={formData.resolution_shared} style={styles.textarea} onChange={handleChange} />
                </Col>
                <Col md={4}>
                  <Form.Label style={styles.label}>Status</Form.Label>
                  <Form.Select name="status" value={formData.status} style={styles.select} onChange={handleChange}>
                    <option value="resolved">Resolved</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </Form.Select>
                </Col>
              </Row>
              
              <div className="d-flex gap-2 mt-4">
                <Button type="submit" style={styles.submitBtn} className="flex-grow-1 text-white border-0" disabled={loading}>
                  {loading ? <Spinner size="sm" className="me-2"/> : <i className="bi bi-cloud-arrow-up-fill me-2"></i>}
                  {loading ? 'SYNCING...' : 'SAVE & SYNC'}
                </Button>
                {recentIncidents.length > 0 && (
                  <Button variant="outline-danger" style={{ borderRadius: '12px', width: '50px' }} onClick={() => setRecentIncidents([])}>
                    <i className="bi bi-trash-fill"></i>
                  </Button>
                )}
              </div>
            </Form>
          </div>

          {/* RIGHT: PERSISTENT HISTORY */}
          <div style={styles.previewSection}>
            <div style={styles.previewHeader}>
              <div style={styles.liveDot}></div> RECENT ACTIVITY
            </div>
            
            <div style={styles.historyList}>
              {recentIncidents.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#475569' }}>
                  <i className="bi bi-archive-fill mb-2" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                  <p style={styles.previewLabel}>No history found</p>
                </div>
              ) : (
                recentIncidents.map((inc, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleEdit(inc)}
                    style={styles.previewItem}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span style={styles.previewTag}>{inc.timestamp}</span>
                      <div style={{...styles.statusPill, backgroundColor: inc.status === 'resolved' ? '#064e3b' : '#451a03', color: inc.status === 'resolved' ? '#10b981' : '#f59e0b'}}>
                        {inc.status.toUpperCase()}
                      </div>
                    </div>
                    <div style={styles.previewValue}>{inc.incident_number}</div>
                    <div style={styles.previewSmallValue}>{inc.short_description}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f1f5f9', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  dashboardCard: { width: '100%', maxWidth: '1100px', backgroundColor: '#fff', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' },
  
  /* Banner Styles */
  headerBanner: { 
    background: 'linear-gradient(135deg, #1f2021 0%, #79797b 100%)', 
    padding: '25px 35px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottom: '4px solid #4f46e5'
  },
  bannerContent: { display: 'flex', alignItems: 'center', gap: '20px' },
  iconBox: { width: '50px', height: '50px', backgroundColor: 'rgba(79, 70, 229, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '24px', border: '1px solid rgba(129, 140, 248, 0.3)' },
  bannerTitle: { color: '#fff', margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '2px' },
  bannerSubtitle: { color: '#94a3b8', margin: 0, fontSize: '13px', fontWeight: '500' },
  statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' },
  pulse: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 0 rgba(16, 185, 129, 0.4)', animation: 'pulse 2s infinite' },

  mainGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0', height: '100%' },
  formSection: { padding: '35px' },
  sectionTitle: { fontWeight: '900', marginBottom: '25px', letterSpacing: '-1px' },
  label: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' },
  input: { borderRadius: '12px', padding: '10px 15px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#f8fafc', transition: 'all 0.2s' },
  textarea: { borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0', fontSize: '13px', backgroundColor: '#f8fafc', resize: 'none' },
  select: { borderRadius: '12px', padding: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { background: '#4f46e5', padding: '14px', fontWeight: '700', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' },
  
  previewSection: { backgroundColor: '#0f172a', padding: '35px', display: 'flex', flexDirection: 'column', color: '#fff' },
  previewHeader: { fontSize: '11px', fontWeight: '900', color: '#64748b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' },
  historyList: { overflowY: 'auto', maxHeight: '450px', paddingRight: '10px' },
  liveDot: { width: '8px', height: '8px', background: '#4f46e5', borderRadius: '50%', boxShadow: '0 0 10px #4f46e5' },
  previewItem: { marginBottom: '15px', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', transition: '0.2s', cursor: 'pointer' },
  previewTag: { fontSize: '9px', color: '#64748b', marginBottom: '5px', display: 'block' },
  previewValue: { fontSize: '17px', fontWeight: '800', color: '#f8fafc', marginBottom: '2px' },
  previewSmallValue: { fontSize: '13px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statusPill: { padding: '3px 10px', borderRadius: '20px', fontSize: '9px', fontWeight: '900' }
};

export default UpdateIncident;