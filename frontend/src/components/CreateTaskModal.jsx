import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

import "../css/components/CreateTaskModal.css";


function CreateTaskModal ({ onClose, onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);

            try {
                const res = await axiosInstance.post("/tasks", {
                    title,
                    description
                });

                onTaskCreated(res.data.task);

                onClose();

            } catch (err) {
                setError(err.response?.data?.message || "Something went wrong. Task cannot be created");

            } finally {
                setLoading(false)
            }
        };


    return (
        <div className="modal-overlay">

            <div className="modal-content">

                <h1> Create a Task </h1>

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
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <input
                            id="description"
                            name="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </button>

                </form>

            </div>

        </div>

    );

};

export default CreateTaskModal;