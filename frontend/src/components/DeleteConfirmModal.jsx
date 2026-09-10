function DeleteConfirmModal({ taskTitle, onCancel, onConfirm }) {
    return (
        <div className="delete-confirm-overlay" role="presentation">
            <section
                className="delete-confirm-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-confirm-title"
                aria-describedby="delete-confirm-message"
            >
                <h2 id="delete-confirm-title">Delete task?</h2>
                <p id="delete-confirm-message">
                    Are you sure you want to delete "{taskTitle}"? This action
                    cannot be undone.
                </p>

                <div className="delete-confirm-actions">
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="confirm-delete-button"
                        type="button"
                        onClick={onConfirm}
                    >
                        Delete task
                    </button>
                </div>
            </section>
        </div>
    );
}

export default DeleteConfirmModal;
