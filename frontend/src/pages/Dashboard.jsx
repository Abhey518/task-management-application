import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

import "../css/Dashboard.css";

const columns = ["To Do", "Doing", "Done"];

function Dashboard() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <main className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1> Task Dashboard </h1>
                    <p> Welcome, {user?.username || "User"} </p>
                </div>

                <button type="button" onClick={handleLogout}>
                    Logout
                </button>

            </header>

            <section className="task-board">

                {columns.map((column) => (
                    <div className="task-column" key={column}>

                        <h2>{column}</h2>

                        <div className="task-list">
                            <p>No tasks yet</p>
                        </div>

                    </div>
                ))}

            </section>

        </main>
    );

};

export default Dashboard;