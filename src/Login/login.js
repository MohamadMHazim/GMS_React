import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./login.css";
import WDashboard from "../Welcome-Dashboard/wDashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const email = "";
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.userType === "user") {
          console.log("User login successful");
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("username", username);
          navigate("/user", { state: { username } });
        } else if (data.userType === "admin") {
          console.log("Admin login successful");
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("adminUsername", username);
          navigate("/admin",{state: {username}});
        }
      } else if (response.status === 401) {
        console.error("Login Failed");
        alert("Login Failed");
        setUsername("");
        setPassword("");
        window.location.reload();
      } else {
        console.error("Error occurred during login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="login">
  <div className="wdashboard">
    <WDashboard />
  </div>
  <div className="login-form-container">
    <div className="login-dark">
      <form method="post">
        <h2 className="sr-only">Login Form</h2>
        <div className="illustration">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <div className="form-group">
          <input className="form-control" type="email" name="email" placeholder="Email or Username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <input className="form-control" type="password" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn-primary" type="submit" onClick={handleLogin}> Log In </button>
        </div>
        <a href="/register" className="forgot"> Don't have an account? Register Here </a>
      </form>
    </div>
  </div>
</div>
  );
}

export default Login;