import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

function Dashboard({ apiBase }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [status, setStatus] = useState("");

  // Make fetchLogs stable for useEffect
  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get(`${apiBase}/logs?limit=100`);
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setLogs(sorted);
      setStatus("");
    } catch {
      setStatus("Logs cannot be loaded. Please try again later.");
    }
  }, [apiBase]);

  // Fetch logs every 5 seconds
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  // Filter logs safely
  const filteredLogs = useMemo(() => {
    if (filter === "ALL") return logs;
    return logs.filter((log) => log.message.includes(`[${filter}]`));
  }, [logs, filter]);

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      {/* Heading */}
      <h1 style={{ marginBottom: "10px" }}>Developer / Tester Dashboard</h1>
      <p style={{ marginBottom: "20px" }}>
        Monitoring login & system events in real time
      </p>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: "20px" }}>
        {["ALL", "INFO", "WARNING", "ERROR"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: "10px",
              padding: "5px 12px",
              backgroundColor: filter === f ? "#1976d2" : "#eee",
              color: filter === f ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Status / Backend error */}
      {status && (
        <p style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}>
          {status}
        </p>
      )}

      {/* Logs table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>
              Timestamp
            </th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>
              Message
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ padding: "10px", textAlign: "center" }}>
                No logs available
              </td>
            </tr>
          ) : (
            filteredLogs.map((log, i) => (
              <tr key={i}>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
                  {log.timestamp}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
                  {log.message}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
