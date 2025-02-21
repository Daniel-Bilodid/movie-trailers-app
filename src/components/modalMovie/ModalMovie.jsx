import React from "react";
import Modal from "../../components/movieModal/MovieModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";

const ModalMovie = ({ isOpen, onClose, playVideo, trailers, setTrailers }) => {
  if (playVideo === null || !trailers.length) return null;

  const currentTrailer = trailers[playVideo];

  const handleNextMovie = (index) => {
    setTrailers((prevMovies) => {
      const updatedMovies = [...prevMovies];
      const currentMovie = updatedMovies[index];

      if (currentMovie.videos && currentMovie.videos.results.length > 0) {
        const nextIndex =
          (currentMovie.currentTrailerIndex + 1) %
          currentMovie.videos.results.length;

        updatedMovies[index] = {
          ...currentMovie,
          currentTrailerIndex: nextIndex,
        };
      }

      return updatedMovies;
    });
  };

  const handlePrevMovie = (index) => {
    setTrailers((prevMovies) => {
      const updatedMovies = [...prevMovies];
      const currentMovie = updatedMovies[index];

      if (currentMovie.videos && currentMovie.videos.results.length > 0) {
        const prevIndex =
          (currentMovie.currentTrailerIndex -
            1 +
            currentMovie.videos.results.length) %
          currentMovie.videos.results.length;

        updatedMovies[index] = {
          ...currentMovie,
          currentTrailerIndex: prevIndex,
        };
      }

      return updatedMovies;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <iframe
        className="trending__movie-frame"
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${
          currentTrailer.videos.results?.[playVideo]?.key || ""
        }`}
        title={currentTrailer.videos.results?.[playVideo]?.name || "Trailer"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="trending__movie-info">
        <button
          className="trending__btn-handle"
          onClick={() => handlePrevMovie(playVideo)}
        >
          <FontAwesomeIcon icon={faArrowLeftLong} color="white" size="2x" />
        </button>
        <button
          className="trending__btn-handle"
          onClick={() => handleNextMovie(playVideo)}
        >
          <FontAwesomeIcon icon={faArrowRightLong} color="white" size="2x" />
        </button>
      </div>
    </Modal>
  );
};

export default ModalMovie;
