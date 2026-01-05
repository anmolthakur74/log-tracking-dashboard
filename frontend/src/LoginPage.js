import React, { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success or error

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/logs/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setMessage(data.message);
      setStatus(data.status);
      setUsername("");
      setPassword("");
    } catch (err) {
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

        <p className="hint">
          Demo credentials: <b>demoUser / demoPass123</b>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
