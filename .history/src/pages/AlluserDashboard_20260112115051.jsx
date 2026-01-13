import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const AlluserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('team'); // 'team' or 'individual'
  
  // Filter States
  const [selectedAgent, setSelectedAgent] = useState('sagnik');
  const [fromDate, setFromDate] = useState('2025-12-13');
  const [toDate, setToDate] = useState('2026-01-12');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data whenever filters or tabs change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("session_token");
        
        // Build URL dynamically based on filters
        const url = activeTab === 'team' 
          ? '/users/admin/dashboard' 
          : `/users/admin/dashboard?agent=${selectedAgent}&from_date=${fromDate}&to_date=${toDate}`;

        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, selectedAgent, fromDate, toDate, user]);

  const summary = activeTab === 'team' ? data?.all_time?.summary : data?.filtered?.summary;
  const agentsList = data?.all_time?.agent_performance || [];

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>ServiceNow <span style={{color:'#6366f1'}}>Intelligence</span></h1>
        
        {/* Tab Switcher */}
        <div style={styles.tabContainer}>
          <button 
            onClick={() => setActiveTab('team')} 
            style={activeTab === 'team' ? styles.activeTab : styles.inactiveTab}>
            Team Overview
          </button>
          <button 
            onClick={() => setActiveTab('individual')} 
            style={activeTab === 'individual' ? styles.activeTab : styles.inactiveTab}>
            Individual Analysis
          </button>
        </div>
      </div>

      {/* Filter Bar (Only shows for Individual Tab) */}
      {activeTab === 'individual' && (
        <div style={styles.filterBar}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Select Agent</label>
            <select style={styles.input} value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
              {/* This fills automatically from the team data */}
              {agentsList.map(a => <option key={a.agent} value={a.agent}>{a.agent}</option>)}
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.label}>From Date</label>
            <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.label}>To Date</label>
            <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      )}

      {loading ? (
        <div style={styles.loader}>Generating Report...</div>
      ) : (
        <>
          {/* Performance Cards */}
          <div style={styles.statsRow}>
            <MetricCard label="Total Tickets" value={summary?.total_tickets} color="#1e293b" icon="📑" />
            <MetricCard label="Passed" value={summary?.passed} color="#10b981" icon="✅" />
            <MetricCard label="Failed" value={summary?.failed} color="#f43f5e" icon="❌" />
            <MetricCard label="Pending" value={summary?.pending} color="#f59e0b" icon="⏳" />
            <MetricCard label="Pass Rate" value={`${summary?.pass_percentage}%`} color="#6366f1" icon="📈" />
          </div>

          {/* Charts Area */}
          <div style={styles.contentGrid}>
             <ChartSection summary={summary} title={activeTab === 'team' ? "Team Distribution" : `${selectedAgent}'s Performance`} />
             
             {activeTab === 'team' ? (
                <div style={styles.tableCard}>
                   <h3>Agent Leaderboard</h3>
                   <table style={styles.table}>
                      <thead>
                        <tr><th>Agent</th><th>Total</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {agentsList.map((a, i) => (
                          <tr key={i}>
                            <td>{a.agent}</td>
                            <td>{a.total_tickets}</td>
                            <td><span style={a.needs_training ? styles.tagRed : styles.tagGreen}>{a.needs_training ? 'Training' : 'Optimal'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             ) : (
                <div style={styles.detailCard}>
                   <h3>In-Depth Analysis</h3>
                   <p>Viewing data for <strong>{selectedAgent}</strong> from <strong>{fromDate}</strong> to <strong>{toDate}</strong>.</p>
                   <div style={styles.infoBox}>
                      <div style={styles.infoItem}><span>Avg Score:</span> <strong>{data?.filtered?.agent_performance?.[0]?.average_score}%</strong></div>
                      <div style={styles.infoItem}><span>Training Status:</span> <strong>{data?.filtered?.agent_performance?.[0]?.needs_training ? "Required" : "Not Required"}</strong></div>
                   </div>
                </div>
             )}
          </div>
        </>
      )}
    </div>
  );
};

// Sub-Components
const MetricCard = ({ label, value, color, icon }) => (
  <div style={styles.card}>
    <div style={{display:'flex', justifyContent:'space-between'}}>
      <span style={styles.cardLabel}>{label}</span>
      <span>{icon}</span>
    </div>
    <h2 style={{color, margin:'10px 0 0 0', fontSize:'24px'}}>{value || 0}</h2>
  </div>
);

const ChartSection = ({ summary, title }) => {
  const chartData = [
    { name: 'Passed', value: summary?.passed || 0 },
    { name: 'Failed', value: summary?.failed || 0 },
    { name: 'Pending', value: summary?.pending || 0 },
  ];
  const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div style={styles.chartCard}>
      <h3 style={{marginBottom:'20px'}}>{title}</h3>
      <div style={{height: 300}}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};



const styles = {
  wrapper: { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logo: { fontSize: '22px', fontWeight: 'bold' },
  tabContainer: { display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px' },
  activeTab: { padding: '8px 20px', background: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  inactiveTab: { padding: '8px 20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' },
  filterBar: { display: 'flex', gap: '20px', background: '#fff', padding: '20px', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#64748b' },
  input: { padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' },
  card: { background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' },
  cardLabel: { fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
  chartCard: { background: '#fff', padding: '25px', borderRadius: '20px' },
  tableCard: { background: '#fff', padding: '25px', borderRadius: '20px' },
  detailCard: { background: '#fff', padding: '25px', borderRadius: '20px' },
  infoBox: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  infoItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' },
  tagGreen: { background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' },
  tagRed: { background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' },
  loader: { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#6366f1' }
};

export default AlluserDashboard;