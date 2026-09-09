import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

import "../css/Login.css";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axiosInstance.post("/auth/login", {
                email,
                password,
            });

            login(res.data.user, res.data.token);

            navigate("/dashboard");


        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1> Welcome Back </h1>

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input  
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                </div>

                <div className="form-group">

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        required 
                    />
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>     

    );
};

export default Login;