 import React from "react";

const UnassignedTable = ({ incidents, loading }) => {
  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
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
              <td className="px-4 py-2 border font-medium text-blue-600 cursor-pointer">
                {incident.incident_number}
              </td>
              <td className="px-4 py-2 border">{incident.incident_date}</td>
              <td
                className="px-4 py-2 border max-w-xs truncate"
                title={incident.short_description} // ✅ Show full text on hover
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
  );
};

export default UnassignedTable;
