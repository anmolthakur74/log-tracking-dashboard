import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

function Dashboard({ apiBase, queuedLogs }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [status, setStatus] = useState("");

  // Fetch logs from backend
  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${apiBase}/logs?limit=100`);
      const data = res.data;

      // Sort newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLogs(sorted);
      setStatus(""); // Clear error status if successful
    } catch (err) {
      setStatus("Logs cannot be loaded. Please try again later.");
      console.error("[Dashboard] Backend unreachable:", err);
    }
  };

  // Fetch logs every 5 seconds
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  // Merge backend logs with queued logs for simulation
  const allLogs = useMemo(() => {
    // queuedLogs is from App.js prop
    return [...(queuedLogs || []), ...logs];
  }, [logs, queuedLogs]);

  // Filter logs safely
  const filteredLogs = useMemo(() => {
    if (filter === "ALL") return allLogs;
    return allLogs.filter((log) =>
      log.message?.toUpperCase().includes(`[${filter}]`)
    );
  }, [allLogs, filter]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Developer / Tester Dashboard</h2>
        <p className="user">Monitoring all login & system events</p>
      </div>

      {/* Log type filters */}
      <div className="filters">
        {["ALL", "INFO", "WARNING", "ERROR"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active-filter" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Backend status */}
      {status && <p className="status">{status}</p>}

      {/* Logs table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="2">No logs available</td>
              </tr>
            ) : (
              filteredLogs.map((log, i) => (
                <tr
                  key={i}
                  className={
                    log.message.includes("Backend unreachable") ? "queued-log" : ""
                  }
                >
                  <td>{log.timestamp}</td>
                  <td>{log.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
