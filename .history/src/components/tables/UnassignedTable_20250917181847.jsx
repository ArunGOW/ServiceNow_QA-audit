 import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UnassignedTable = ({ incidents, loading }) => {
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;

  // ✅ Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users/get/list_users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Select / Deselect all
  const handleSelectAll = () => {
    if (selectedIncidents.length === incidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(incidents.map((i) => i.sid));
    }
  };

  // ✅ Select individual incident
  const handleSelectIncident = (sid) => {
    setSelectedIncidents((prev) =>
      prev.includes(sid) ? prev.filter((id) => id !== sid) : [...prev, sid]
    );
  };

  // ✅ Assign selected incidents
  const handleAssign = async () => {
    if (!selectedUser) {
      alert("⚠️ Please select a user first.");
      return;
    }
    if (selectedIncidents.length === 0) {
      alert("⚠️ Please select at least one incident.");
      return;
    }
    if (!loggedUserSid) {
      alert("⚠️ Unable to find logged-in user SID. Please re-login.");
      return;
    }

    const payload = {
      assigned_by_sid: loggedUserSid,
      assigned_to_sid: selectedUser,
      incident_sid: selectedIncidents,
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/assign/incidents/",
        payload
      );
      console.log("✅ Assign Response:", res.data);
      alert("Incidents successfully assigned!");
      setSelectedIncidents([]);
      setSelectedUser("");
    } catch (error) {
      console.error("❌ Error assigning incidents:", error);
      alert("Failed to assign incidents.");
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* ✅ Assignment Controls */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Unassigned Incidents</h2>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u.sid} value={u.sid}>
                {u.full_name}
              </option>
            ))}
          </select>
          <button
            className={`px-3 py-1 rounded text-white text-sm ${
              selectedIncidents.length === 0 || !selectedUser
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleAssign}
            disabled={selectedIncidents.length === 0 || !selectedUser}
          >
            Assign
          </button>
        </div>
      </div>

      {/* ✅ Incidents Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      incidents.length > 0 &&
                      selectedIncidents.length === incidents.length
                    }
                    onChange={handleSelectAll}
                  />
                  <span>Select All</span>
                </label>
              </th>
              <th className="px-4 py-2 border text-left">Incident No</th>
              <th className="px-4 py-2 border text-left">Incident Date</th>
              <th className="px-4 py-2 border text-left">Short Description</th>
              <th className="px-4 py-2 border text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <tr
                key={incident.sid || index}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={selectedIncidents.includes(incident.sid)}
                    onChange={() => handleSelectIncident(incident.sid)}
                  />
                </td>
                <td className="px-4 py-2 border font-medium text-blue-600 cursor-pointer">
                  {incident.incident_number}
                </td>
                <td className="px-4 py-2 border">{incident.incident_date}</td>
                <td
                  className="px-4 py-2 border max-w-xs truncate"
                  title={incident.short_description}
                >
                  <span className="line-clamp-2">
                    {incident.short_description || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      incident.resolution_status === "on hold"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {incident.resolution_status || "Unassigned"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnassignedTable;
