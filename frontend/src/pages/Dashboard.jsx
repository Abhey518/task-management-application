import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import axiosInstance from "../api/axiosInstance";

import "../css/Dashboard.css";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";

const columns = ["To Do", "Doing", "Done"];

function Dashboard() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [taskToEdit, setTaskToEdit] = useState(null);


    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    useEffect(() => {
        const fetchTasks = async () => {

            try {
                setError("");
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


    const handleDelete = async (taskId) => {
        setError("");

        try {
            await axiosInstance.delete(`/tasks/${taskId}`);

            setTasks(prev => prev.filter((task) => task._id !== taskId));

        } catch {
            setError("Failed to delete task");
        }
        
    };

    const handleEdit = (task) => {
        setError("");
        setTaskToEdit(task);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setTaskToEdit(null);
    };

    const handleTaskCreated = (task) => {
        setError("");
        setTasks((prev) => [task, ...prev]);
    };

    const handleTaskUpdated = (updatedTask) => {
        setError("");
        setTasks((prev) => 
            prev.map((task) => task._id === updatedTask._id ? updatedTask : task)
        );
    };

    return (
        <main className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1> Task Dashboard </h1>
                    <p> Welcome, {user?.username || "User"} </p>
                </div>

                <div className="dashboard-actions">
                    <button className="secondary-button" type="button" onClick={handleLogout}>
                        Logout
                    </button>

                    <button className="primary-button" type="button" onClick={() => {
                        setError("");
                        setTaskToEdit(null);
                        setShowModal(true);
                    }}>
                        Create Task
                    </button>
                </div>

            </header>

            {error && (
                <div className="dashboard-error" role="alert">
                    <p className="error-msg">{error}</p>
                    <button
                        className="error-dismiss"
                        type="button"
                        aria-label="Dismiss error"
                        onClick={() => setError("")}
                    >
                        Close
                    </button>
                </div>
            )}

            <section className="task-board">

                {columns.map((column) => (
                    <div className="task-column" key={column}>

                        <h2>{column}</h2>

                        <div className="task-list">
                            {tasksByStatus[column].length === 0 ? (
                                <p>No tasks yet</p>

                            ) : (
                                tasksByStatus[column].map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onDelete={handleDelete}
                                        onUpdate={handleEdit}
                                    />

                                ))
                            )}
                            
                        </div>

                    </div>
                ))}

            </section>

            {showModal && (
                <TaskModal 
                    key={taskToEdit?._id || "create"}
                    taskToEdit={taskToEdit}
                    onClose={handleModalClose}
                    onTaskCreated={handleTaskCreated}
                    onTaskUpdated={handleTaskUpdated}
                />
            )}

        </main>
    );

};

export default Dashboard;