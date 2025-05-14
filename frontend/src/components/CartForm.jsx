import { useState, useEffect } from 'react';

const CartForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setNotes('');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, notes });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'Edit Cart' : 'Add New Cart'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Restaurant Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CartForm;
