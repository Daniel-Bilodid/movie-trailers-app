import React from "react";
import ReactDOM from "react-dom";
import "./movieModal.scss";
const MovieModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="modal-close">
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
