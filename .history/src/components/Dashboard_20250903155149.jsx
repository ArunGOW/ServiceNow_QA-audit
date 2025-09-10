 <h2>Welcome, {user?.name || user?.email}</h2>
<p>Role: {user?.role}</p>

{user?.role === "Agent" && <h4>Agent Dashboard: Handle tickets</h4>}
{user?.role === "QA Admin" && (
  <>
    <h4>QA Admin Dashboard: Manage Agents</h4>
    <UserList />
  </>
)}
