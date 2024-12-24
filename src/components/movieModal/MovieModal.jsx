import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./movieModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faComment } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
const MovieModal = ({ isOpen, onClose, children, movieId }) => {
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const contentType = useSelector((state) => state.data.contentType);

  const location = useLocation();

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-content-wrapper">{children}</div>

        <button onClick={onClose} className="modal-close">
          <FontAwesomeIcon icon={faXmark} color="white" size="1x" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
