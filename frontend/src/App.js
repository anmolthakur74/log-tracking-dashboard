import React, { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import axios from "axios";
import "./styles.css";

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [retryQueue, setRetryQueue] = useState([]);

  const API_BASE = "https://log-tracking-dashboard.onrender.com"; // replace with your backend URL

  // Periodically flush retry queue every 10 seconds
  useEffect(() => {
    const interval = setInterval(flushRetryQueue, 10000);
    return () => clearInterval(interval);
  }, [retryQueue]);

  // Function to flush queued logs
  const flushRetryQueue = async () => {
    const queueCopy = [...retryQueue];
    for (let i = 0; i < queueCopy.length; i++) {
      const log = queueCopy[i];
      try {
        await axios.post(`${API_BASE}/logs/frontend-log`, log);
        // Remove successfully sent log
        setRetryQueue((prevQueue) =>
          prevQueue.filter((l) => l.timestamp !== log.timestamp)
        );
      } catch (err) {
        // Backend still down, keep log in queue
        console.error("[RetryQueue] Backend still unreachable.", err);
      }
    }
  };

  // Helper to queue backend-unreachable logs
  const queueBackendErrorLog = (message) => {
    const log = {
      timestamp: new Date().toISOString(),
      message,
    };
    setRetryQueue((prev) => [...prev, log]);
  };

  // Pass these props to LoginPage and Dashboard for centralized backend handling
  return (
    <div className="app">
      <header className="app-header">
        <h1>LogMonitor</h1>
        <div className="tab-buttons">
          <button
            className={activeTab === "login" ? "active-tab" : ""}
            onClick={() => setActiveTab("login")}
          >
            User Login
          </button>
          <button
            className={activeTab === "dashboard" ? "active-tab" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Developer Dashboard
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === "login" ? (
          <LoginPage
            apiBase={API_BASE}
            queueBackendErrorLog={queueBackendErrorLog}
          />
        ) : (
          <Dashboard
            apiBase={API_BASE}
            queueBackendErrorLog={queueBackendErrorLog}
          />
        )}
      </main>
    </div>
  );
}

export default App;
