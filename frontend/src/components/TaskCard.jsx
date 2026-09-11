import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "../css/components/TaskCard.css";

function getUserId(user) {
    return typeof user === "object" ? user?._id : user;
};

function getUsername(user) {
    return typeof user === "object" ? user?.username : null;
};

function TaskCard ({
    task,
    currentUser,
    users,
    onDelete,
    onUpdate,
    onAssign,
    onReassign,
    dragRef,
    dragProps,
    dragHandleProps,
    isDragging,
}) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const currentUserId = getUserId(currentUser);

    const creatorId = getUserId(task.createdBy);

    const assignedUserId = getUserId(task.assignedTo);

    const isAdmin = currentUser?.role === "admin";

    const isCreator = creatorId === currentUserId;

    const isAssignedUser = assignedUserId === currentUserId;

    const isUnassigned = !assignedUserId;

    const canEdit = isAdmin || (isCreator && (isUnassigned || isAssignedUser));
    
    const canDelete = isAdmin || (isCreator && (isUnassigned || isAssignedUser));

    const canAssign = !isAdmin && isCreator && isUnassigned;


    return (
        <article
            className={`task-card${isDragging ? " task-card-dragging" : ""}`}
            ref={dragRef}
            {...dragProps}
        >

            <div
                className="task-card-drag-area"
                {...dragHandleProps}
            >
                <h3>{task.title}</h3>

                <p>{task.description || "No description provided"}</p>

                <div className="task-meta">

                    <p>
                        <strong>Created by:</strong>{" "}
                        {getUsername(task.createdBy) || "You"}
                    </p>

                    <p>
                        <strong>Assigned to:</strong>{" "}
                        {getUsername(task.assignedTo) || "Unassigned"}
                    </p>

                </div>
            </div>

            {isAdmin && (
                <label className="task-reassignment-control">
                    <span>Assign task</span>

                    <select
                        value={assignedUserId || ""}
                        onChange={(event) =>
                            onReassign(task._id, event.target.value)
                        }
                    >
                        <option value="">Unassigned</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            <div className="task-card-actions">
                {canAssign && (
                    <button 
                        className="btn-assign"
                        type="button"
                        onClick={() => onAssign(task._id)}
                    >
                        Assign to me
                    </button>
                )}

                {canDelete && (
                    <button
                        className="btn-delete"
                        type="button"
                        onClick={() => setShowDeleteConfirmation(true)}
                    >
                        Delete
                    </button>
                )}

                {canEdit && (
                    <button 
                        className="btn-edit"
                        type="button"
                        onClick={() => onUpdate(task)}
                    >
                        Edit
                    </button>
                )}

            </div>

            {showDeleteConfirmation && (
                <DeleteConfirmModal
                    taskTitle={task.title}
                    onCancel={() => setShowDeleteConfirmation(false)}
                    onConfirm={() => {
                        setShowDeleteConfirmation(false);
                        onDelete(task._id);
                    }}
                />
            )}

        </article>
    );

};

export default TaskCard;