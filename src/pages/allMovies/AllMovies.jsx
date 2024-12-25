import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faBookmark,
  faPlayCircle,
  faComment,
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import useBookmarks from "../../hooks/useBookmarks";
import { AuthContext } from "../../components/context/AuthContext";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import Toggle from "../../components/toggle/Toggle";
import Genre from "../../components/genre/Genre";
import Modal from "../../components/movieModal/MovieModal";
import Search from "../../components/search/Search";
import { setCurrentPage } from "../../redux/store";
import { setContentType } from "../../redux/store";
import AuthToast from "../../components/authToast/AuthToast";
import { showToast, hideToast } from "../../redux/store";
import Loading from "../../components/loading/Loading";
import "./allMovies.scss";

const AllMovies = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.data.currentPage);
  const moviesByGenre = useSelector((state) => state.data.moviesByGenre);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);
  const contentType = useSelector((state) => state.data.contentType);
  const showToastState = useSelector((state) => state.toast.showToast);
  useEffect(() => {
    if (contentType !== "Movie") {
      dispatch(setContentType("Movie"));
    }
  }, [contentType, dispatch]);

  const {
    movies,
    loading: bookmarksLoading,
    selected,
    selectedMovies,
    handleBookmarkClick,
  } = useBookmarkHandle();
  const {
    playVideo,
    handlePlayVideo,
    handleCloseModal,
    movieLoading,
    loadTrailers,
  } = useMovieTrailers();

  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (movieLoading) {
    return <Loading />;
  }

  const handleNextTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) => (prev + 1) % moviesByGenre[playVideo].trailers.length
      );
    }
  };

  const handlePrevTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) =>
          (prev - 1 + moviesByGenre[playVideo].trailers.length) %
          moviesByGenre[playVideo].trailers.length
      );
    }
  };

  const showAuthToast = () => {
    dispatch(showToast());
    setTimeout(() => {
      dispatch(hideToast());
    }, 5000);
  };

  return (
    <div className="popular">
      <div className="popular__btn-wrapper">
        <Genre />
        <div className="search__wrapper">
          <Search />
        </div>
      </div>
      <div className="popular__text-wrapper">
        <div className="popular__title">All Movies</div>
      </div>
      <div className="popular__wrapper">
        {moviesByGenre.length > 0 ? (
          moviesByGenre.map((movie, index, trailers) => (
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
                    if (user) {
                      handleBookmarkClick(movie.id);
                      selected(movie.id);
                    } else {
                      showAuthToast();
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    color={
                      (user &&
                        Array.isArray(movies) &&
                        movies.some((m) => m.id === movie.id)) ||
                      selectedMovies[movie.id]
                        ? "yellow"
                        : "white"
                    }
                    size="1x"
                  />
                </div>
              </div>
              <AuthToast show={showToastState} />
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
                      <FontAwesomeIcon
                        icon={faPlayCircle}
                        color="white"
                        size="1x"
                      />
                    </span>

                    <div className="trending__movie-thumbnail-wrapper">
                      <div className="trending__movie-thumbnail-info">
                        <div className="trending__thumbnail-movie-year">
                          {movie.release_date
                            ? movie.release_date.slice(0, 4)
                            : ""}
                        </div>
                        <div className="trending__movie-thumbnail-dot">·</div>

                        <div className="trending__movie-thumbnail-svg">
                          <svg
                            width="20"
                            height="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"
                              fill="#FFFFFF"
                            />
                          </svg>
                        </div>
                        <div className="trending__movie-thumbnail-dot">·</div>
                        <div className="trending__movie-thumbnail-type">
                          Movie
                        </div>
                      </div>
                      <div className="trending__movie-thumbnail-overlay-name">
                        {movie.title}
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
          ))
        ) : (
          <p>No movies found for this genre</p>
        )}
      </div>
      <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
        {moviesByGenre?.[playVideo]?.trailers && (
          <>
            <iframe
              className="trending__movie-frame"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${
                moviesByGenre[playVideo].trailers[currentTrailer]?.key ||
                moviesByGenre[playVideo].trailers[0]?.key
              }`}
              title={
                moviesByGenre[playVideo].trailers[currentTrailer]?.name ||
                "Trailer"
              }
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            <div className="trending__movie-info">
              <div className="trending__movie-wrapper">
                <div className="trending__movie-year">
                  {moviesByGenre[playVideo]?.release_date.slice(0, 4)}
                </div>
                <div className="trending__movie-dot">·</div>
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <div className="trending__movie-dot">·</div>
                <div className="trending__movie-type">Movie</div>
                <div className="">.</div>

                <Link
                  className="movie__info-comments"
                  to={`/${
                    contentType === "Movie" ? "movie-info" : "tv-info"
                  }/comments/${moviesByGenre[playVideo].id}`}
                >
                  <FontAwesomeIcon icon={faComment} color="white" size="1x" />
                </Link>
              </div>

              <div>
                <button
                  className="trending__btn-handle"
                  onClick={() => handlePrevTrailer(playVideo)}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeftLong}
                    color="white"
                    size="2x"
                  />
                </button>
                <button
                  className="trending__btn-handle"
                  onClick={() => handleNextTrailer(playVideo)}
                >
                  <FontAwesomeIcon
                    icon={faArrowRightLong}
                    color="white"
                    size="2x"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <div className="popular__pagination">
        <button onClick={handlePreviousPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default AllMovies;
