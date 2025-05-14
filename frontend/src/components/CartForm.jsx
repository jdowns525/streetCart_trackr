function CartForm({ isOpen, onClose, onSubmit, initialData }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing when inside modal
      >
        <h2>{initialData ? 'Edit Cart' : 'Add Cart'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const name = form.name.value.trim();
            const notes = form.notes.value.trim();
            if (!name && !notes) return;
            onSubmit({ name, notes });
          }}
        >
          <label>
            Name:
            <input name="name" defaultValue={initialData?.name || ''} />
          </label>
          <label>
            Notes:
            <textarea name="notes" defaultValue={initialData?.notes || ''} />
          </label>
          <div className="modal-actions">
            <button type="submit">💾 Save</button>
            <button type="button" onClick={onClose}>❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CartForm;
