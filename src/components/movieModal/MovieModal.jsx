import React from "react";
import ReactDOM from "react-dom";
import "./movieModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const MovieModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="modal-close">
          <FontAwesomeIcon icon={faXmark} color="white" size="1x" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
