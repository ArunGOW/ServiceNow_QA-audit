

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";
import 'bootstrap-icons/font/bootstrap-icons.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.get('/users/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) return <div style={styles.loader}>Initializing Analytics...</div>;

  const agents = data?.all_time?.agent_performance || [];
  const summary = data?.all_time?.summary;
  const pieData = [
    { name: 'Passed', value: summary?.passed || 0 },
    { name: 'Failed', value: summary?.failed || 0 },
    { name: 'Pending', value: summary?.pending || 0 }
  ];
  const formatName = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
  
  const COLORS = ['#10b981', '#f43f5e', '#f59e0b'];

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#1e293b" style={{ fontSize: '24px', fontWeight: '900' }}>{value}</text>
        <text x={cx} y={cy} dy={18} textAnchor="middle" fill="#94a3b8" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>{payload.name}</text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={8}/>
      </g>
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* FIXED HEADER */}
      <header style={styles.premiumHeader}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBadge}><i className="bi bi-cpu-fill"></i></div>
          <div>
            <h2 style={styles.premiumLogo}>Service<span style={{ color: '#6366f1' }}>Core</span></h2>
            <p style={styles.headerSub}>Real-time Agent Performance Intelligence</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.statusPill}><span style={styles.pulse}></span> System Active</div>
          <div style={styles.userSection}>
            <div style={styles.avatarPremium}>{user?.name?.charAt(0) || 'A'}</div>
          </div>
        </div>
      </header>

      {/* FIXED KPI TILES */}
      <div style={styles.statsGrid}>
        <MetricTile label="Total Tickets" value={summary?.total_tickets} icon="bi-collection" color="#6366f1" />
        <MetricTile label="Passed" value={summary?.passed} icon="bi-shield-check" color="#10b981" />
        <MetricTile label="Failed" value={summary?.failed} icon="bi-shield-x" color="#f43f5e" />
        <MetricTile label="Pending" value={summary?.pending} icon="bi-hourglass-split" color="#f59e0b" />
        <MetricTile label="Success Rate" value={`${summary?.pass_percentage}%`} icon="bi-lightning-charge" color="#8b5cf6" />
      </div>

      {/* SCROLLABLE MAIN CONTENT AREA */}
      <div style={styles.mainLayout}>
        {/* LEFT PANEL: CHART */}
        <div style={styles.chartContainer}>
          <h3 style={styles.cardTitle}>Quality Distribution</h3>
          <div style={{ width: '100%', height: 240, flexShrink: 0 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={4}
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* LEGEND: Scrollable if items are many */}
          <div style={styles.customLegendScroll}>
            {pieData.map((item, i) => (
              <div key={i} style={styles.legendRow}>
                <div style={{ ...styles.legendDot, background: COLORS[i] }} />
                <span style={styles.legendLabel}>{item.name}</span>
                <span style={styles.legendValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: TABLE */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.cardTitle}>Top Performing Analysts</h3>
            <div style={styles.tableStats}>{agents.length} Total Agents</div>
          </div>
          <div style={styles.tableScroll}>
            <table style={styles.table}>
              <thead style={styles.stickyThead}>
                <tr>
                  <th style={styles.th}>Analyst</th>
                  <th style={styles.th}>Tickets</th>
                  <th style={styles.th}>Passed</th>
                  <th style={styles.th}>Failed</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                 {agents.map((agent, i) => {
  const displayName = formatName(agent.agent); // Format the name once here
  
  return (
    <tr key={i} style={styles.tr}>
      <td style={styles.td}>
        <div style={styles.agentInfo}>
          {/* Avatar now shows capitalized letter */}
          <div style={styles.miniAvatar}>{displayName.charAt(0)}</div>
          <span style={styles.nameText}>{displayName}</span>
        </div>
      </td>
      <td style={styles.td}>{agent.total_tickets}</td>
      <td style={{ ...styles.td, color: '#10b981', fontWeight: 'bold' }}>{agent.passed}</td>
      <td style={{ ...styles.td, color: '#f43f5e', fontWeight: 'bold' }}>{agent.failed}</td>
      <td style={styles.td}>
        <span style={agent.needs_training ? styles.chipRed : styles.chipGreen}>
          {agent.needs_training ? "Review" : "Verified"}
        </span>
      </td>
    </tr>
  );
})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricTile = ({ label, value, icon, color }) => (
  <div style={styles.metricTile}>
    <div style={{ ...styles.iconBox, backgroundColor: `${color}15`, color: color }}>
      <i className={`bi ${icon}`} style={{ fontSize: '20px' }}></i>
    </div>
    <div>
      <p style={styles.tileLabel}>{label}</p>
      <h3 style={styles.tileValue}>{value}</h3>
    </div>
  </div>
);

const styles = {
  // Lock the wrapper to the screen size
  wrapper: { 
    backgroundColor: '#f8fafc', 
    height: '100vh', 
    padding: '10px 20px', 
    fontFamily: "'Inter', sans-serif", 
    display: 'flex', 
    flexDirection: 'column',
    overflow: 'hidden' // No page scroll
  },
  
  premiumHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', flexShrink: 0 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoBadge: { width: '40px', height: '40px', background: '#1e293b', borderRadius: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  premiumLogo: { margin: 0, fontSize: '20px', fontWeight: '900', color: '#1e293b' },
  headerSub: { margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: '500' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  statusPill: { background: '#fff', border: '1px solid #e2e8f0', padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' },
  pulse: { width: '7px', height: '7px', background: '#10b981', borderRadius: '50%', display: 'inline-block' },
  avatarPremium: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '15px', flexShrink: 0 },
  metricTile: { background: '#fff', padding: '12px 15px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' },
  iconBox: { width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tileLabel: { margin: 0, fontSize: '9px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  tileValue: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' },

  // Layout logic for single screen
  mainLayout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '15px', flex: 1, minHeight: 0, paddingBottom: '10px' },
  
  chartContainer: { 
    background: '#fff', 
    padding: '15px', 
    borderRadius: '20px', 
    border: '1px solid #f1f5f9', 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: 0 // Crucial for flex child scrolling
  },
  customLegendScroll: { overflowY: 'auto', flex: 1, marginTop: '10px', paddingRight: '5px' },

  tableCard: { 
    background: '#fff', 
    borderRadius: '20px', 
    display: 'flex', 
    flexDirection: 'column', 
    border: '1px solid #f1f5f9', 
    minHeight: 0, // Allows internal scroll
    overflow: 'hidden'
  },
  tableHeader: { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
  tableScroll: { flex: 1, overflowY: 'auto', padding: '0 15px 15px 15px' },
  
  stickyThead: { position: 'sticky', top: 0, background: '#fff', zIndex: 2 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px', fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #f1f5f9' },
  tr: { transition: '0.2s', borderBottom: '1px solid #f8fafc' },
  td: { padding: '12px 10px', fontSize: '12px', color: '#334155' },
  
  cardTitle: { margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e293b' },
  legendRow: { display: 'flex', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px', marginBottom: '6px' },
  legendDot: { width: '7px', height: '7px', borderRadius: '50%', marginRight: '10px' },
  legendLabel: { fontSize: '11px', fontWeight: '600', color: '#64748b', flex: 1 },
  legendValue: { fontSize: '11px', fontWeight: '800', color: '#1e293b' },
  
  agentInfo: { display: 'flex', alignItems: 'center', gap: '8px' },
  miniAvatar: { width: '28px', height: '28px', borderRadius: '6px', background: '#f1f5f9', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  nameText: { fontWeight: '700', fontSize: '12px' },
  chipGreen: { padding: '3px 10px', background: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '9px', fontWeight: '800' },
  chipRed: { padding: '3px 10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '9px', fontWeight: '800' },
  
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#6366f1', fontWeight: '900', fontSize: '18px' }
};

export default UserDashboard;