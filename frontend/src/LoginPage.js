import React, { useState } from "react";
import axios from "axios";

function LoginPage({ apiBase, queueBackendErrorLog }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success or error

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter username and password.");
      setStatus("error");
      return;
    }

    try {
      const res = await axios.post(`${apiBase}/logs/login`, {
        username,
        password,
      });

      const data = res.data;
      setMessage(data.message);
      setStatus(data.status);
      setUsername("");
      setPassword("");
    } catch (err) {
      // Backend unreachable → queue a frontend log
      const logMessage = `[ERROR] Backend unreachable during login attempt for user ${username}`;
      queueBackendErrorLog(logMessage);

      setMessage("Backend unreachable. Try again later.");
      setStatus("error");
      console.error("[LoginPage] Backend unreachable:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>LogMonitor</h1>
        <p className="subtitle">Simulated login for monitoring logs</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        {message && (
          <p className={status === "success" ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}

        <p className="hint">
          Demo credentials: <b>demoUser / demoPass123</b>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
