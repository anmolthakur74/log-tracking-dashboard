import React, { useState } from "react";
import axios from "axios";

function LoginPage({ apiBase }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${apiBase}/logs/login`, {
        username,
        password,
      });

      setMessage(res.data.message);
      setStatus(res.data.status);
    } catch {
      setMessage("Backend unreachable. Try again later.");
      setStatus("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>LogMonitor</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Login</button>

        {message && (
          <p className={status === "success" ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
