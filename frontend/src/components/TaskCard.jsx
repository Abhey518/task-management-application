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
    onDelete,
    onUpdate,
    onAssign,
    dragRef,
    dragProps,
    dragHandleProps,
    isDragging,
}) {

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

            <h3 {...dragHandleProps}>{task.title}</h3>

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
                        onClick={() => onDelete(task._id)}
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

        </article>
    );

};

export default TaskCard;