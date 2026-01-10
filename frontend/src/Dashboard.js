import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

function Dashboard({ apiBase, queueBackendErrorLog }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [status, setStatus] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get(`${apiBase}/logs?limit=100`);
      const data = res.data;

      const sorted = [...data].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLogs(sorted);
      setStatus("");
    } catch (err) {
      setStatus("Logs cannot be loaded. Please try again later.");
      console.error("[Dashboard] Backend unreachable:", err);

      queueBackendErrorLog("[ERROR] Backend unreachable. Logs could not be loaded.");
    }
  }, [apiBase, queueBackendErrorLog]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    if (filter === "ALL") return logs;
    return logs.filter((log) =>
      log.message?.toUpperCase().includes(`[${filter}]`)
    );
  }, [logs, filter]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Developer / Tester Dashboard</h2>
        <p className="user">Monitoring all login & system events</p>
      </div>

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

      {status && <p className="status">{status}</p>}

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
                  className={log.message.includes("Backend unreachable") ? "queued-log" : ""}
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
