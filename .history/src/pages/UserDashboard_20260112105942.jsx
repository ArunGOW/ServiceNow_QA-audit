//  import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// const UserDashboard = () => {
//   // DUMMY DATA - Simulating a ServiceNow User Record
//   const userStats = {
//     user: {
//       name: "Arun Kumar",
//       role: "Service Desk Analyst IT",
//       dept: "IT SD L1",
//       img: "https://ui-avatars.com/api/?name=Arun+Kumar&background=0D8ABC&color=fff"
//     },
//     summary: [
//       { label: "Total Handled", value: 142, color: "#3b82f6" },
//       { label: "Resolved", value: "97.2%", color: "#22c55e" },
//       { label: "Escalated", value: "2.4%", color: "#8b5cf6" },
//       { label: "In-progress", value: "1.8%", color: "#f59e0b" }
//     ],
//     chartData: [
//       { name: 'Resolved', value: 85 },
//       { name: 'Escalated', value: 12 },
//       { name: 'Pending Vendor', value: 25 },
//       { name: 'Work in Progress', value: 20 }
//     ]
//   };

//   const COLORS = ['#22c55e', '#ef4444', '#6366f1', '#f59e0b'];

//   return (
//     <div style={{ backgroundColor: '#f1f5f9', padding: '40px', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
//       {/* 1. Header & Profile Section */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//           <img src={userStats.user.img} alt="profile" style={{ borderRadius: '50%', width: '70px', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
//           <div>
//             <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{userStats.user.name}</h1>
//             <p style={{ margin: 0, color: '#64748b' }}>{userStats.user.role} • {userStats.user.dept}</p>
//           </div>
//         </div>
//         <button style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
//           Export Report
//         </button>
//       </div>

//       {/* 2. Top Metrics Grid */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
//         {userStats.summary.map((item, i) => (
//           <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//             <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
//             <h2 style={{ margin: '10px 0 0 0', fontSize: '28px', color: item.color }}>{item.value}</h2>
//           </div>
//         ))}
//       </div>

//       {/* 3. Main Content: Pie Chart & Details */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
//         {/* Pie Chart Card */}
//         <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
//           <h3 style={{ marginTop: 0, color: '#1e293b' }}>Ticket Status Breakdown</h3>
//           <div style={{ width: '100%', height: '300px' }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={userStats.chartData}
//                   innerRadius={80}
//                   outerRadius={120}
//                   paddingAngle={8}
//                   dataKey="value"
//                 >
//                   {userStats.chartData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend iconType="circle" />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Activity List (ServiceNow Style) */}
//         <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
//           <h3 style={{ marginTop: 0, color: '#1e293b' }}>Recent Ticket Log</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//             {[
//               { id: 'INC00102', task: 'Password Reset', status: 'Resolved' },
//               { id: 'INC00105', task: 'VPN Connectivity', status: 'Escalated' },
//               { id: 'INC00108', task: 'Laptop Deployment', status: 'In Progress' }
//             ].map((ticket, i) => (
//               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
//                 <div>
//                   <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#3b82f6' }}>{ticket.id}</span>
//                   <div style={{ fontSize: '13px', color: '#64748b' }}>{ticket.task}</div>
//                 </div>
//                 <span style={{ 
//                   fontSize: '11px', 
//                   padding: '4px 8px', 
//                   borderRadius: '12px', 
//                   backgroundColor: ticket.status === 'Resolved' ? '#dcfce7' : '#fee2e2',
//                   color: ticket.status === 'Resolved' ? '#166534' : '#991b1b',
//                   height: 'fit-content'
//                 }}>{ticket.status}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const UserDashboard = ({ agentName = "sagnik" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual auth token if required
    const fetchData = async () => {
      try {
        const response = await fetch(`http://18.130.235.113:8010/api/users/admin/dashboard?agent=${agentName}&from_date=2025-12-13&to_date=2026-01-12`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ServiceNow data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [agentName]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;
  if (!data) return <div style={{ padding: '40px' }}>No data found for this agent.</div>;

  // Extracting data from your API response
  const performance = data.filtered.agent_performance[0];
  const summary = data.filtered.summary;

  const chartData = [
    { name: 'Passed', value: performance.passed },
    { name: 'Failed', value: performance.failed },
    { name: 'Pending', value: performance.pending },
  ];

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '30px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '22px', color: '#1e293b', marginBottom: '4px' }}>
          Agent Performance: <span style={{ color: '#3b82f6', textTransform: 'capitalize' }}>{performance.agent}</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Date Range: {data.filtered.date_range.from} to {data.filtered.date_range.to}
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {[
          { label: "Total Tickets", value: performance.total_tickets, color: '#1e293b' },
          { label: "Pass Rate", value: `${performance.pass_percentage}%`, color: '#22c55e' },
          { label: "Avg Score", value: performance.average_score, color: '#6366f1' },
          { label: "Training Status", value: performance.needs_training ? "Required" : "Good", color: performance.needs_training ? '#ef4444' : '#22c55e' }
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{item.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color, marginTop: '8px' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Ticket Distribution</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip borderRadius={8} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;