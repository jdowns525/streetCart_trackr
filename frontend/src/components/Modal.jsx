import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalEl = modalRef.current;
    const focusable = modalEl.querySelectorAll(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trapFocus = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    modalEl.addEventListener('keydown', trapFocus);
    first?.focus();

    return () => {
      if (modalEl) {
        modalEl.removeEventListener('keydown', trapFocus);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 🔁 Render into the DOM body for layering
  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal slide-in"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
