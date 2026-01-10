import React, { useState } from "react";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const API_BASE = "https://log-tracking-dashboard.onrender.com"; // Render backend URL

  // Queue for backend-unreachable logs
  const [queuedLogs, setQueuedLogs] = useState([]);

  const queueBackendErrorLog = (message) => {
    const log = {
      timestamp: new Date().toISOString(),
      message,
    };
    setQueuedLogs((prev) => [log, ...prev]);
    console.warn("[Queued Log]", log);
  };

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
          <LoginPage apiBase={API_BASE} queueBackendErrorLog={queueBackendErrorLog} />
        ) : (
          <Dashboard apiBase={API_BASE} queuedLogs={queuedLogs} />
        )}
      </main>
    </div>
  );
}

export default App;
