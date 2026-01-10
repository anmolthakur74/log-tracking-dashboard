import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

function Dashboard({ apiBase }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [status, setStatus] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get(`${apiBase}/logs?limit=100`);
      setLogs(res.data.reverse());
      setStatus("");
    } catch {
      setStatus("Logs cannot be loaded. Please try again later.");
    }
  }, [apiBase]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    if (filter === "ALL") return logs;
    return logs.filter((log) =>
      log.message.includes(`[${filter}]`)
    );
  }, [logs, filter]);

  return (
    <div className="dashboard-container">
      <h2>Developer / Tester Dashboard</h2>

      <div className="filters">
        {["ALL", "INFO", "WARNING", "ERROR"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {status && <p className="status">{status}</p>}

      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, i) => (
            <tr key={i}>
              <td>{log.timestamp}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
