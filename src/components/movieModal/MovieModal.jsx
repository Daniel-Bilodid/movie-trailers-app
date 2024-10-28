import React from "react";
import ReactDOM from "react-dom";
import "./movieModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const MovieModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
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
