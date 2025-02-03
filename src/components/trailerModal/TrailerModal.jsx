import React from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";

const TrailerModal = ({
  playVideo,
  trailers,
  handleCloseModal,
  handlePrevTrailer,
  handleNextTrailer,
}) => {
  return (
    <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
      {playVideo !== null && (
        <>
          <iframe
            className="trending__movie-frame"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${
              trailers[playVideo].trailers[
                trailers[playVideo].currentTrailerIndex
              ].key
            }`}
            title={
              trailers[playVideo].trailers[
                trailers[playVideo].currentTrailerIndex
              ].name
            }
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="trending__movie-info">
            <div className="trending__movie-wrapper">
              <div className="trending__movie-year">
                {trailers[playVideo].release_year}
              </div>
              <div className="trending__movie-type">Movie</div>
            </div>
            <div>
              <button onClick={() => handlePrevTrailer(playVideo)}>
                previous
              </button>
              <button onClick={() => handleNextTrailer(playVideo)}>next</button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default TrailerModal;
