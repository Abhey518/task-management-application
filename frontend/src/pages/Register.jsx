import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

import "../css/Register.css";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if(formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post("/auth/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            navigate("/login");

        } catch (requestError) {
            setError(requestError.response?.data?.message || "Registration failed");

        } finally {
            setLoading(false);
        }

    };

    return (
        <main className="register-container">
            <h1> Create Account </h1>

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label htmlFor="username">
                        Username
                    </label>

                    <input 
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-group">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-group">

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-group">

                    <label htmlFor="confirmPassword">
                        Re-enter Password
                    </label>

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                </div>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

            </form>

            <p>
                Already have an account? {" "}
                <Link to="/login">Login</Link>
            </p>

        </main>
    );

};

export default Register;