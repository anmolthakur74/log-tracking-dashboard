import React, { useState } from "react";
import axios from "axios";

function LoginPage({ apiBase }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success | error

  const handleLogin = async () => {
    // Validation before API call
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

      setMessage(res.data.message);
      setStatus(res.data.status);
      setUsername("");
      setPassword("");
    } catch {
      setMessage("Backend unreachable. Try again later.");
      setStatus("error");
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

        {/* Demo credentials shown clearly */}
        <p className="hint">
          Demo credentials:<br />
          <b>Username:</b> demoUser<br />
          <b>Password:</b> demoPass123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
