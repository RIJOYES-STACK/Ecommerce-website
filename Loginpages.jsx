import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Loginpages = () => {
  const { role } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3002/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/role/login/${role}`, { email, password });
      const { token } = response.data;

      if (token) {
        // Store token in localStorage
        localStorage.setItem("token", token);
        alert(response.data.message);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert("No token received");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{role === "admin" ? "Admin Login" : "User Login"}</h2>
      <form onSubmit={handleLogin} className="w-50 mx-auto shadow p-4 rounded">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Loginpages;
