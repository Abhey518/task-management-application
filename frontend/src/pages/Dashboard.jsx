import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../hooks/useAuth"; 
import axiosInstance from "../api/axiosInstance";

import "../css/Dashboard.css";
import Navbar from "../components/Navbar";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";
import DashboardStats from "../components/DashboardStats";

const columns = ["To Do", "Doing", "Done"];

function getTaskUserId(user) {
    return typeof user === "object" ? user?._id : user;
}

function canUserChangeStatus(task, user) {
    const userId = getTaskUserId(user);
    const creatorId = getTaskUserId(task.createdBy);
    const assignedUserId = getTaskUserId(task.assignedTo);
    const isCreator = creatorId === userId;
    const isAssignedUser = assignedUserId === userId;
    const isUnassigned = !assignedUserId;

    return user?.role === "admin" ||
        isAssignedUser ||
        (isCreator && (isUnassigned || isAssignedUser));
}

function Dashboard() {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);

    const [users, setUsers] = useState([]);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [taskToEdit, setTaskToEdit] = useState(null);


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

    useEffect(() => {
        if (user?.role !== "admin") {
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get("/users");
                setUsers(response.data.users);
            } catch {
                setError("Unable to load users");
            }
        };

        fetchUsers();
    }, [user]);

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

    const handleAssign = async (taskId) => {
        setError("");

        try {
            const res = await axiosInstance.patch(`/tasks/${taskId}/assign`);

            setTasks((prev) =>
                prev.map((task) => task._id === taskId ? res.data.task : task));

        } catch (err) {
            setError(err.response?.data?.message || "Unable to assign this task");

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
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to reassign this task"
            );
        }
    };

    const handleStatusChange = async (taskId, status) => {
        setError("");

        const previousTask = tasks.find((task) => task._id === taskId);

        if (!previousTask || previousTask.status === status) {
            return;
        }

        setTasks((prev) =>
            prev.map((task) =>
                task._id === taskId ? { ...task, status } : task
            )
        );

        try {
            const res = await axiosInstance.put(`/tasks/${taskId}`, { status });

            setTasks((prev) =>
                prev.map((task) =>
                    task._id === taskId ? res.data.task : task
                )
            );

        } catch (err) {
            setTasks((prev) =>
                prev.map((task) =>
                    task._id === taskId ? previousTask : task
                )
            );
            setError(err.response?.data?.message || "Unable to update task status");

        }
    };

    const handleDragEnd = ({ draggableId, destination }) => {
        if (!destination || destination.droppableId === "") {
            return;
        }

        const task = tasks.find((item) => item._id === draggableId);

        if (!task || task.status === destination.droppableId) {
            return;
        }

        handleStatusChange(draggableId, destination.droppableId);
    };

    const userId = user?._id;

    const assignedTasks = tasks.filter((task) => {
        const assignedUserId = typeof task.assignedTo === "object" ? task.assignedTo?._id : task.assignedTo;

        return assignedUserId === userId;
    });

    const completedTasks = tasks.filter((task) => task.status === "Done");

    const inProgressTasks = tasks.filter((task) => task.status === "Doing");

    const userStats = [
        {
            label: "My Tasks",
            value: tasks.length,
            details: "Tasks available on your board"
        },

        {
            label: "Assigned to Me",
            value: assignedTasks.length,
            details: "Tasks currently assigned to you"
        },

        {
            label: "In Progress",
            value: inProgressTasks.length,
            details: "Tasks currently being worked on"
        },

        {
            label: "Completed",
            value: completedTasks.length,
            details: "Tasks moved to Done"
        },
    ];



    return (
        <main className="dashboard">
            <Navbar />

            <header className="dashboard-header">

                <div>
                    <h1> Task Dashboard </h1>
                    <p> Welcome, {user?.username || "User"} </p>
                </div>

                <div className="dashboard-actions">
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

            <DashboardStats stats={userStats} />

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
                                                    isDragDisabled={!canUserChangeStatus(task, user)}
                                                    key={task._id}
                                                >
                                                    {(draggableProvided, draggableSnapshot) => (
                                                        <TaskCard
                                                            task={task}
                                                            currentUser={user}
                                                            users={users}
                                                            onDelete={handleDelete}
                                                            onUpdate={handleEdit}
                                                            onAssign={handleAssign}
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
                    onClose={handleModalClose}
                    onTaskCreated={handleTaskCreated}
                    onTaskUpdated={handleTaskUpdated}
                />
            )}

        </main>
    );

};

export default Dashboard;