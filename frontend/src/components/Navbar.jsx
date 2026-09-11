import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import "../css/Navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="app-navbar" aria-label="Main navigation">
            <NavLink
                className="navbar-brand"
                to={isAdmin ? "/admin" : "/dashboard"}
            >
                <img
                    className="navbar-logo"
                    src="/logo.png"
                    alt="TaskFlow" 
                />

                <span> Taskflow </span>
            </NavLink>

            <div className="navbar-links">
                {isAdmin ? (
                    <>
                        <NavLink
                            className={({ isActive }) =>
                                `navbar-link${isActive ? " navbar-link-active" : ""}`
                            }
                            to="/admin"
                        >
                            Tasks
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `navbar-link${isActive ? " navbar-link-active" : ""}`
                            }
                            to="/admin/users"
                        >
                            Users
                        </NavLink>
                    </>
                ) : (
                    <NavLink
                        className={({ isActive }) =>
                            `navbar-link${isActive ? " navbar-link-active" : ""}`
                        }
                        to="/dashboard"
                    >
                        Dashboard
                    </NavLink>
                )}
            </div>

            <div className="navbar-account">
                <span className="navbar-user">
                    {user?.username || "User"}
                </span>
                <button
                    className="navbar-logout"
                    type="button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
