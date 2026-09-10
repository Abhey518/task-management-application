import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

import "../css/components/TaskModal.css";


function TaskModal ({ onClose, onTaskCreated, onTaskUpdated, taskToEdit = null }) {

    const isEditMode = Boolean(taskToEdit);
    
    const [title, setTitle] = useState(taskToEdit?.title || "");
    
    const [description, setDescription] = useState(taskToEdit?.description || "");

    const [status, setStatus] = useState(taskToEdit?.status || "To Do");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            
            if(isEditMode) {
                const res = await axiosInstance.put(`/tasks/${taskToEdit._id}`, {
                    title,
                    description,
                    status
                });

                onTaskUpdated(res.data.task);
            
            } else {
                const res = await axiosInstance.post("/tasks", {
                    title,
                    description
                });

                onTaskCreated(res.data.task);

            }

            onClose();

        } catch (err) {
            setError(err.response?.data?.message || "Unable to save the task");

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="modal-overlay">

            <div className="modal-content">

                <h1>{isEditMode ? "Edit Task" : "Create a Task"} </h1>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="title">
                            Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />

                    </div>

                    {isEditMode && (
                        <div className="form-group">

                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                            >
                                <option value="To Do">To Do</option>
                                <option value="Doing">Doing</option>
                                <option value="Done">Done</option>
                            </select>

                        </div>
                    )}

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {isEditMode 
                            ? loading 
                                ? "Saving..." 
                                : "Save"
                            : loading 
                                ? "Creating..." 
                                : "Create"}
                    </button>

                    <button type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>

                </form>

            </div>

        </div>

    );

};

export default TaskModal;