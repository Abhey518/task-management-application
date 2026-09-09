import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import axiosInstance from "../api/axiosInstance";

import "../css/Dashboard.css";

const columns = ["To Do", "Doing", "Done"];

function Dashboard() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {

            try {
                const response = await axiosInstance.get("/tasks");
                setTasks(response.data.tasks);

            } catch {
                setError("Unable to load tasks");
            }
        };

        fetchTasks();
    }, []);

    const tasksByStatus = {
        "To Do": tasks.filter((task) => task.status === "To Do"),
        Doing: tasks.filter((task) => task.status === "Doing"),
        Done: tasks.filter((task) => task.status === "Done"),
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

            {error && <p className="error-msg">{error}</p>}

            <section className="task-board">

                {columns.map((column) => (
                    <div className="task-column" key={column}>

                        <h2>{column}</h2>

                        <div className="task-list">
                            {tasksByStatus[column].length === 0 ? (
                                <p>No tasks yet</p>

                            ) : (
                                tasksByStatus[column].map((task) => (
                                    <article className="task-card" key={task._id}>
                                        <h3>{task.title}</h3>
                                        <p>{task.description}</p>
                                    </article>

                                ))
                            )}
                            
                        </div>

                    </div>
                ))}

            </section>

        </main>
    );

};

export default Dashboard;