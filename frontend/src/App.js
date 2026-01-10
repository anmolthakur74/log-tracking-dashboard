import React, { useState } from "react";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import "./styles.css";

const API_BASE = "https://log-tracking-dashboard.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState("login");

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
          <LoginPage apiBase={API_BASE} />
        ) : (
          <Dashboard apiBase={API_BASE} />
        )}
      </main>
    </div>
  );
}

export default App;
