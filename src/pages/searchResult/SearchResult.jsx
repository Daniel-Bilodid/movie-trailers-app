import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../../components/movieModal/MovieModal";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faBookmark } from "@fortawesome/free-solid-svg-icons";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import { AuthContext } from "../../components/context/AuthContext";
import Search from "../../components/search/Search";

const SearchResult = () => {
  const data = useSelector((state) => state.data.value);
  const [playVideo, setPlayVideo] = useState(null);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);
  const {
    movies,
    loading: bookmarksLoading,
    selected,
    selectedMovies,
    handleBookmarkClick,
  } = useBookmarkHandle();

  console.log(data);
  const handlePlayVideo = (index) => {
    setPlayVideo(index);
    setCurrentTrailer(0);
  };

  const handleCloseModal = () => {
    setPlayVideo(null);
    setCurrentTrailer(0);
  };

  const handleNextTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer((prev) => (prev + 1) % data[playVideo].trailers.length);
    }
  };

  const handlePrevTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) =>
          (prev - 1 + data[playVideo].trailers.length) %
          data[playVideo].trailers.length
      );
    }
  };
  if (bookmarksLoading && user) {
    return <div>Loading movies...</div>;
  }

  return (
    <>
      <h1>Search Results</h1>
      {/* <Search /> */}
      <div className="popular">
        <div className="popular__wrapper">
          {data.map(({ movie, trailers, release_year }, index) => (
            <div key={movie.id}>
              <div className="trending__btn-wrapper">
                <Link className="trending__info" to={`/movie-info/${movie.id}`}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color="white"
                    size="1x"
                  />
                </Link>
                <div
                  className="trending__bookmark"
                  onClick={() => {
                    handleBookmarkClick(movie.id);
                    selected(movie.id);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    color={
                      (Array.isArray(movies) &&
                        movies.some((m) => m.id === movie.id)) ||
                      selectedMovies[movie.id]
                        ? "yellow"
                        : "white"
                    }
                    size="1x"
                  />
                </div>
              </div>
              <h3 className="trending__movie-title">{movie.title}</h3>
              {trailers.length > 0 ? (
                <div className="trending__movie-thumbnail-container">
                  <img
                    className="trending__movie-thumbnail"
                    src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                    alt={`${movie.title} thumbnail`}
                  />
                  <div
                    className="trending__movie-thumbnail-overlay"
                    onClick={() => handlePlayVideo(index)}
                  >
                    <span className="trending__movie-thumbnail-overlay-text">
                      Play Trailer
                    </span>
                    <div className="trending__movie-thumbnail-wrapper">
                      <div className="trending__movie-thumbnail-info">
                        <div className="trending__thumbnail-movie-year">
                          {release_year}
                        </div>
                        <div className="trending__movie-thumbnail-dot">·</div>
                        <div className="trending__movie-thumbnail-type">
                          Movie
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  className="trending__movie-thumbnail"
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={`${movie.title} thumbnail`}
                />
              )}
            </div>
          ))}
        </div>

        <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
          {data?.[playVideo]?.trailers && (
            <>
              <iframe
                className="trending__movie-frame"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${
                  data[playVideo].trailers[currentTrailer]?.key ||
                  data[playVideo].trailers[0]?.key
                }`}
                title={
                  data[playVideo].trailers[currentTrailer]?.name || "Trailer"
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              <div className="trending__movie-info">
                <div className="trending__movie-wrapper">
                  <div className="trending__movie-year">
                    {data[playVideo]?.release_year}
                  </div>
                  <div className="trending__movie-dot">·</div>
                  <div className="trending__movie-type">Movie</div>
                </div>

                <div>
                  <button onClick={handlePrevTrailer}>Previous</button>
                  <button onClick={handleNextTrailer}>Next</button>
                </div>
              </div>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default SearchResult;
