import "../css/components/TaskCard.css";

function TaskCard ({task, onDelete, onUpdate}) {

    return (
        <article className="task-card">

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <div className="task-card-actions">

                <button className="btn-delete" type="button" onClick={() => onDelete(task._id)}>
                    Delete
                </button>  

                <button className="btn-edit" type="button" onClick={() => onUpdate(task)}>
                    Edit
                </button>

            </div>

        </article>
    );

};

export default TaskCard;