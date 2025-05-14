import Modal from './Modal';

function CartForm({ isOpen, onClose, onSubmit, initialData }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{initialData ? 'Edit Cart' : 'Add Cart'}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const name = form.name.value.trim();
          const notes = form.notes.value.trim();
          onSubmit({ name, notes });
        }}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name || ''}
          />
        </label>
        <label>
          Notes:
          <textarea
            name="notes"
            defaultValue={initialData?.notes || ''}
          />
        </label>
        <div className="modal-actions">
          <button type="submit">💾 Save</button>
          {/* ✅ Prevent form submit on cancel */}
          <button type="button" onClick={onClose}>❌ Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

export default CartForm;
