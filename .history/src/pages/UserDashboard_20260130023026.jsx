 // src/pages/UsersDashboard.jsx
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const UsersDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState(null);

  // Pending incidents (for AGENT view)
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "incidents"
  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const perPage = 10;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = user?.token || localStorage.getItem("session_token");
        const res = await api.get("/users/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
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

  // Fetch pending incidents (only for agent view)
  useEffect(() => {
    if (activeTab === "incidents") fetchPendingIncidents();
  }, [activeTab, currentPage]);

  const fetchPendingIncidents = async () => {
    setIncidentsLoading(true);
    try {
      const sid = user?.user_sid;
      if (!sid) return;

      const response = await api.post("/users/get-pending/incidents/all", {
        page: currentPage,
        per_page: perPage,
        user_sid: sid,
      });

      const incidentData = response.data.incidents || response.data.data || [];
      const totalCount = response.data.total_count || response.data.total || 0;

      setIncidents(incidentData);
      setTotalIncidents(totalCount);
    } catch (err) {
      console.error("Error fetching incidents:", err.response?.data || err.message);
    } finally {
      setIncidentsLoading(false);
    }
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-10}
          textAnchor="middle"
          fill="#1e293b"
          style={{ fontSize: "20px", fontWeight: "bold" }}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={20}
          textAnchor="middle"
          fill="#64748b"
          style={{ fontSize: "14px" }}
        >
          {`${value} Tickets`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  if (loading) return <div style={styles.loader}>Syncing with ServiceNow...</div>;

  const summary = data?.all_time?.summary;
  const agents = data?.all_time?.agent_performance || [];
  const pieData = [
    { name: "Passed", value: summary?.passed || 0 },
    { name: "Failed", value: summary?.failed || 0 },
    { name: "Pending", value: summary?.pending || 0 },
  ];
  const COLORS = ["#10b981", "#f43f5e", "#f59e0b"];

  return (
    <div style={styles.wrapper}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div>
          <h2 style={styles.logo}>
            Ticket<span style={{ color: "#6366f1" }}>Metrics</span>
          </h2>
          <p style={styles.subtext}>ServiceNow Integration • Global Overview</p>
        </div>

        {/* Tab Switcher (only for agent view) */}
        {user?.user_type === "AGENT" && (
          <div style={styles.tabContainer}>
            <button
              onClick={() => setActiveTab("overview")}
              style={activeTab === "overview" ? styles.activeTab : styles.inactiveTab}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab("incidents")}
              style={activeTab === "incidents" ? styles.activeTab : styles.inactiveTab}
            >
              Pending Incidents
            </button>
          </div>
        )}
      </nav>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          <div style={styles.statsRow}>
            <MetricCard label="Total Tickets" value={summary?.total_tickets} color="#1e293b" icon="📑" />
            <MetricCard label="Passed" value={summary?.passed} color="#10b981" icon="✅" />
            <MetricCard label="Failed" value={summary?.failed} color="#f43f5e" icon="❌" />
            <MetricCard label="Pending" value={summary?.pending} color="#f59e0b" icon="⏳" />
            <MetricCard label="Pass Rate" value={`${summary?.pass_percentage}%`} color="#6366f1" icon="📈" />
          </div>

          <div style={styles.contentGrid}>
            {/* Pie Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.cardHeader}>Distribution Analysis</h3>
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Agent Table */}
            <div style={styles.tableCard}>
              <h3 style={styles.cardHeader}>Agent Performance Details</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Agent Name</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Passed</th>
                      <th style={styles.th}>Failed</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent, i) => (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>
                          <strong>{agent.agent}</strong>
                        </td>
                        <td style={styles.td}>{agent.total_tickets}</td>
                        <td style={{ ...styles.td, color: "#10b981", fontWeight: "bold" }}>{agent.passed}</td>
                        <td style={{ ...styles.td, color: "#f43f5e", fontWeight: "bold" }}>{agent.failed}</td>
                        <td style={styles.td}>
                          <span style={agent.needs_training ? styles.badgeRed : styles.badgeGreen}>
                            {agent.needs_training ? "Training Req." : "Standard"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pending Incidents Tab (for agent) */}
      {activeTab === "incidents" && (
        <div style={styles.fullWidthCard}>
          <div style={styles.cardHeaderRow}>
            <h3 style={styles.cardHeader}>Your Pending Incidents</h3>
            <span style={styles.countBadge}>{totalIncidents} Total</span>
          </div>
          <div style={styles.tableWrapper}>
            {incidentsLoading ? (
              <div style={styles.inlineLoader}>Updating list...</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Incident ID</th>
                    <th style={styles.th}>Short Description</th>
                    <th style={styles.th}>Priority</th>
                    <th style={styles.th}>Created</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.length > 0 ? (
                    incidents.map((inc, i) => (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>
                          <strong>{inc.number || inc.incident_id}</strong>
                        </td>
                        <td style={styles.td}>{inc.short_description}</td>
                        <td style={styles.td}>{inc.priority}</td>
                        <td style={styles.td}>{inc.sys_created_on}</td>
                        <td style={styles.td}>
                          <span style={styles.badgeOrange}>Pending</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={styles.emptyCell}>
                        No pending incidents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ label, value, color, icon }) => (
  <div style={styles.metricCard}>
    <div style={styles.metricTop}>
      <span style={styles.metricLabel}>{label}</span>
      <span style={styles.metricIcon}>{icon}</span>
    </div>
    <h2 style={{ ...styles.metricValue, color }}>{value}</h2>
  </div>
);

// Styles
const styles = {
  wrapper: { backgroundColor: "#f8fafc", minHeight: "100vh", padding: "0 40px 40px 40px", fontFamily: "'Inter', sans-serif" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", marginBottom: "30px", borderBottom: "1px solid #e2e8f0" },
  logo: { margin: 0, fontSize: "24px", fontWeight: "800", color: "#1e293b" },
  subtext: { margin: 0, fontSize: "12px", color: "#94a3b8" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px", marginBottom: "30px" },
  metricCard: { background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #fff" },
  metricTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  metricLabel: { fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" },
  metricValue: { fontSize: "26px", fontWeight: "800", margin: 0 },
  contentGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "25px" },
  chartCard: { background: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" },
  tableCard: { background: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" },
  fullWidthCard: { background: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" },
  cardHeader: { margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px", fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px", fontSize: "13px", borderBottom: "1px solid #f8fafc" },
  badgeGreen: { padding: "4px 8px", background: "#dcfce7", color: "#15803d", borderRadius: "6px", fontSize: "11px" },
  badgeRed: { padding: "4px 8px", background: "#fee2e2", color: "#b91c1c", borderRadius: "6px", fontSize: "11px" },
  badgeOrange: { padding: "4px 8px", background: "#ffedd5", color: "#9a3412", borderRadius: "6px", fontSize: "11px" },
  loader: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "18px", color: "#6366f1" },
  tabContainer: { display: "flex", gap: "5px", background: "#f1f5f9", padding: "4px", borderRadius: "12px" },
  activeTab: { padding: "8px 16px", background: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "#6366f1", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  inactiveTab: { padding: "8px 16px", background: "transparent", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500", color: "#64748b" },
  inlineLoader: { padding: "40px", textAlign: "center", color: "#6366f1", fontWeight: "500" },
  emptyCell: { textAlign: "center", padding: "40px", color: "#94a3b8" },
  cardHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  countBadge: { background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", color: "#475569", fontWeight: "bold" },
};

export default UsersDashboard;
