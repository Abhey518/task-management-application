import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import Navbar from "../components/Navbar";
import DashboardStats from "../components/DashboardStats";

import "../css/Dashboard.css";
import "../css/Admin.css";

const columns = ["To Do", "Doing", "Done"];

function AdminDashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [taskResponse, userResponse] = await Promise.all([
                    axiosInstance.get("/tasks"),
                    axiosInstance.get("/users"),
                ]);

                setTasks(taskResponse.data.tasks);
                setUsers(userResponse.data.users);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                        "Unable to load admin data"
                );
            }
        };

        fetchAdminData();
    }, []);

    const handleDelete = async (taskId) => {
        setError("");

        try {
            await axiosInstance.delete(`/tasks/${taskId}`);
            setTasks((previousTasks) =>
                previousTasks.filter((task) => task._id !== taskId)
            );
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                    "Unable to delete task"
            );
        }
    };

    const handleReassign = async (taskId, assignedTo) => {
        setError("");

        try {
            const response = await axiosInstance.patch(
                `/tasks/${taskId}/reassign`,
                { assignedTo: assignedTo || null }
            );

            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task._id === taskId ? response.data.task : task
                )
            );
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                    "Unable to reassign task"
            );
        }
    };

    const handleStatusChange = async (taskId, status) => {
        const previousTask = tasks.find((task) => task._id === taskId);

        if (!previousTask || previousTask.status === status) {
            return;
        }

        setError("");
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task._id === taskId ? { ...task, status } : task
            )
        );

        try {
            const response = await axiosInstance.put(`/tasks/${taskId}`, {
                status,
            });

            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task._id === taskId ? response.data.task : task
                )
            );
        } catch (requestError) {
            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task._id === taskId ? previousTask : task
                )
            );
            setError(
                requestError.response?.data?.message ||
                    "Unable to update task status"
            );
        }
    };

    const handleDragEnd = ({ draggableId, destination }) => {
        if (!destination) {
            return;
        }

        const task = tasks.find((item) => item._id === draggableId);

        if (!task || task.status === destination.droppableId) {
            return;
        }

        handleStatusChange(draggableId, destination.droppableId);
    };

    const handleTaskCreated = (task) => {
        setTasks((previousTasks) => [task, ...previousTasks]);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
            )
        );
    };

    const openEditModal = (task) => {
        setTaskToEdit(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTaskToEdit(null);
    };

    const tasksByStatus = {
        "To Do": tasks.filter((task) => task.status === "To Do"),
        Doing: tasks.filter((task) => task.status === "Doing"),
        Done: tasks.filter((task) => task.status === "Done"),
    };

    const completedTasks = tasks.filter((task) => task.status === "Done");

    const inProgressTasks = tasks.filter((task) => task.status === "Doing");

    const unassignedTasks = tasks.filter((task) => !task.assignedTo);

    const adminStats = [
        {
            label: "Total Users",
            value: users.length,
            details: "Registered users and administrators"
        },

        {
            label: "Total Tasks",
            value: tasks.length,
            details: "Tasks across the entire system"
        },

        {
            label: "In Progress",
            value: inProgressTasks.length,
            details: "Active tasks and ongoing work"
        },

        {
            label: "Completed",
            value: completedTasks.length,
            details: "Tasks move to Done"
        },

        {
            label: "Unassigned Tasks",
            value: unassignedTasks.length,
            details: "Tasks waiting for an owner"
        },
    ];

    return (
        <main className="dashboard">
            <Navbar />

            <header className="dashboard-header">
                <div>
                    <p className="admin-eyebrow">Administrator workspace</p>
                    <h1>Task Administration</h1>
                    <p>Manage every task and its assignment.</p>
                </div>

                <div className="dashboard-actions">
                    <button
                        className="primary-button"
                        type="button"
                        onClick={() => {
                            setTaskToEdit(null);
                            setShowModal(true);
                        }}
                    >
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
                        onClick={() => setError("")}
                    >
                        Close
                    </button>
                </div>
            )}

            <DashboardStats stats={adminStats} />

            <DragDropContext onDragEnd={handleDragEnd}>
                <section className="task-board">
                    {columns.map((column) => (
                        <Droppable droppableId={column} key={column}>
                            {(droppableProvided, droppableSnapshot) => (
                                <div
                                    className={`task-column${droppableSnapshot.isDraggingOver ? " task-column-dragging-over" : ""}`}
                                    ref={droppableProvided.innerRef}
                                    {...droppableProvided.droppableProps}
                                >
                                    <h2>{column}</h2>
                                    <div className="task-list">
                                        {tasksByStatus[column].length === 0 ? (
                                            <p>No tasks yet</p>
                                        ) : (
                                            tasksByStatus[column].map((task, index) => (
                                                <Draggable
                                                    draggableId={task._id}
                                                    index={index}
                                                    key={task._id}
                                                >
                                                    {(draggableProvided, draggableSnapshot) => (
                                                        <TaskCard
                                                            task={task}
                                                            currentUser={user}
                                                            users={users}
                                                            onDelete={handleDelete}
                                                            onUpdate={openEditModal}
                                                            onReassign={handleReassign}
                                                            dragRef={draggableProvided.innerRef}
                                                            dragProps={draggableProvided.draggableProps}
                                                            dragHandleProps={draggableProvided.dragHandleProps}
                                                            isDragging={draggableSnapshot.isDragging}
                                                        />
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {droppableProvided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </section>
            </DragDropContext>

            {showModal && (
                <TaskModal
                    key={taskToEdit?._id || "create"}
                    taskToEdit={taskToEdit}
                    onClose={closeModal}
                    onTaskCreated={handleTaskCreated}
                    onTaskUpdated={handleTaskUpdated}
                />
            )}
        </main>
    );
}

export default AdminDashboard;
