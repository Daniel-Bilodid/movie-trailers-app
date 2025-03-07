import React, { useState, useEffect } from "react";
import Modal from "../../components/movieModal/MovieModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ModalMovie = ({
  isOpen,
  onClose,
  playVideo,
  trailers,
  setTrailers,
  contentType,
}) => {
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  useEffect(() => {
    if (!isOpen) {
      setCurrentTrailerIndex(0);
    }
  }, [isOpen]);
  if (playVideo === null || !trailers.length) return null;

  const currentTrailer = trailers[playVideo];

  const trailer =
    currentTrailer.trailers && currentTrailer.trailers[currentTrailerIndex]
      ? currentTrailer.trailers[currentTrailerIndex]
      : currentTrailer.videos &&
        currentTrailer.videos.results &&
        currentTrailer.videos.results[currentTrailerIndex]
      ? currentTrailer.videos.results[currentTrailerIndex]
      : null;

  if (!trailer) return null;

  const handleNextMovie = () => {
    setCurrentTrailerIndex((prevIndex) => {
      const totalTrailers =
        currentTrailer.videos?.results?.length ||
        currentTrailer.trailers?.length ||
        1;
      return (prevIndex + 1) % totalTrailers;
    });
  };

  const handlePrevMovie = () => {
    setCurrentTrailerIndex((prevIndex) => {
      const totalTrailers =
        currentTrailer.videos?.results?.length ||
        currentTrailer.trailers?.length ||
        1;
      return (prevIndex - 1 + totalTrailers) % totalTrailers;
    });
  };

  return (
    <Modal isOpen={playVideo !== null} onClose={onClose}>
      <iframe
        className="trending__movie-frame"
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${trailer.key}`}
        title={trailer.name || "Trailer"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="trending__movie-info">
        <div className="trending__movie-wrapper">
          <div className="trending__movie-year">
            {currentTrailer.first_air_date?.slice(0, 4) ||
              currentTrailer.release_date?.slice(0, 4) ||
              currentTrailer?.movie?.first_air_date?.slice(0, 4) ||
              currentTrailer.release_year ||
              "N/A"}
          </div>

          <div className="trending__movie-dot">·</div>

          <div className="trending__movie-svg">
            {contentType ||
            contentType[playVideo].movieType ||
            contentType[playVideo].item.type === "Movie" ? (
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"
                  fill="#FFFFFF"
                />
              </svg>
            ) : (
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"
                  fill="#ffffff"
                />
              </svg>
            )}
          </div>

          <div className="trending__movie-dot">·</div>
          <div className="trending__movie-type">
            {contentType === "Movie" ||
            contentType?.[playVideo]?.movieType === "Movie" ||
            contentType?.[playVideo]?.item?.type
              ? "Movie"
              : "TV"}
          </div>
          <div className="trending__movie-dot">·</div>
          <Link
            className="movie__info-comments"
            to={`/${
              contentType === "Movie" ||
              contentType?.[playVideo]?.movieType === "Movie" ||
              contentType?.[playVideo]?.item?.type
                ? "movie-info"
                : "tv-info"
            }/comments/${
              currentTrailer?.id ??
              currentTrailer?.movie?.id ??
              currentTrailer?.item?.id ??
              ""
            }`}
          >
            <FontAwesomeIcon icon={faComment} color="white" size="1x" />
          </Link>
        </div>

        <div>
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
      </div>
    </Modal>
  );
};

export default ModalMovie;
