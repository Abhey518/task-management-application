import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";

import "../css/Admin.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get("/users");
                setUsers(response.data.users);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                        "Unable to load users"
                );
            }
        };

        fetchUsers();
    }, []);

    return (
        <main className="admin-page">
            <Navbar />

            <header className="admin-page-header">
                <div>
                    <p className="admin-eyebrow">Administrator workspace</p>
                    <h1>User Management</h1>
                    <p>View all registered users and their roles.</p>
                </div>

            </header>

            {error && (
                <div className="dashboard-error" role="alert">
                    <p className="error-msg">{error}</p>
                    <button
                        className="error-dismiss"
                        type="button"
                        onClick={() => setError("")}
                    >
                        Close
                    </button>
                </div>
            )}

            <section className="users-panel" aria-label="Registered users">
                <div className="users-panel-heading">
                    <h2>Registered users</h2>
                    <span>{users.length} total</span>
                </div>

                {users.length === 0 && !error ? (
                    <p className="users-empty">No users found.</p>
                ) : (
                    <div className="users-table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th scope="col">Username</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((registeredUser) => (
                                    <tr key={registeredUser._id}>
                                        <td>{registeredUser.username}</td>
                                        <td>{registeredUser.email}</td>
                                        <td>
                                            <span className={`role-badge role-${registeredUser.role}`}>
                                                {registeredUser.role}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(registeredUser.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminUsers;
