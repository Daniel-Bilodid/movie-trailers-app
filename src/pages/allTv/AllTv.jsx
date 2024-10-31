import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faBookmark,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import useBookmarks from "../../hooks/useBookmarks";
import { AuthContext } from "../../components/context/AuthContext";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import Genre from "../../components/genre/Genre";
import Modal from "../../components/movieModal/MovieModal";
import { setCurrentPage } from "../../redux/store";
import { setContentType } from "../../redux/store";
import Search from "../../components/search/Search";
import AuthToast from "../../components/authToast/AuthToast";
import { showToast, hideToast } from "../../redux/store";

const AllTv = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.data.currentPage);
  const tvShowsByGenre = useSelector((state) => state.data.moviesByGenre);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);
  const contentType = useSelector((state) => state.data.contentType);
  const showToastState = useSelector((state) => state.toast.showToast);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (contentType !== "TV") {
      dispatch(setContentType("TV"));
    }
  }, [contentType, dispatch]);

  const {
    movies: tvShows,
    loading: bookmarksLoading,
    selected,
    selectedMovies,
    handleBookmarkClick,
  } = useBookmarkHandle();

  const {
    playVideo,
    handlePlayVideo,
    handleCloseModal,
    loadTrailers,
    movieLoading,
  } = useMovieTrailers();

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    await loadTrailers(currentPage);

    setLoading(false);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  if (loading && movieLoading) {
    return (
      <div className="loading">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          width="200"
          height="200"
          style={{
            shapeRendering: "auto",
            display: "block",
            background: "rgba(255, 255, 255, 0)",
          }}
        >
          <g>
            <circle
              strokeDasharray="164.93361431346415 56.97787143782138"
              r="35"
              strokeWidth="10"
              stroke="#5a698f"
              fill="none"
              cy="50"
              cx="50"
            >
              <animateTransform
                keyTimes="0;1"
                values="0 50 50;360 50 50"
                dur="1s"
                repeatCount="indefinite"
                type="rotate"
                attributeName="transform"
              />
            </circle>
          </g>
        </svg>
      </div>
    );
  }

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

  const handleNextTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) => (prev + 1) % tvShowsByGenre[playVideo].trailers.length
      );
    }
  };

  const handlePrevTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) =>
          (prev - 1 + tvShowsByGenre[playVideo].trailers.length) %
          tvShowsByGenre[playVideo].trailers.length
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
        <div className="popular__title">All TV Shows</div>
      </div>
      <div className="popular__wrapper">
        {tvShowsByGenre.length > 0 ? (
          tvShowsByGenre.map((tvShow, index) => (
            <div key={tvShow.id}>
              <div className="trending__btn-wrapper">
                <Link className="trending__info" to={`/tv-info/${tvShow.id}`}>
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
                      handleBookmarkClick(tvShow.id);
                      selected(tvShow.id);
                    } else {
                      showAuthToast();
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    color={
                      (user &&
                        Array.isArray(tvShows) &&
                        tvShows.some((m) => m.id === tvShow.id)) ||
                      selectedMovies[tvShow.id]
                        ? "yellow"
                        : "white"
                    }
                    size="1x"
                  />
                </div>
              </div>
              <AuthToast show={showToastState} />
              <h3 className="trending__movie-title">{tvShow.name}</h3>
              {tvShow.trailers.length > 0 ? (
                <div className="trending__movie-thumbnail-container">
                  <img
                    className="trending__movie-thumbnail"
                    src={`https://image.tmdb.org/t/p/w780${tvShow.poster_path}`}
                    alt={`${tvShow.name} thumbnail`}
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
                          {tvShow.first_air_date
                            ? tvShow.first_air_date.slice(0, 4)
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
                              d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"
                              fill="#ffffff"
                            />
                          </svg>
                        </div>
                        <div className="trending__movie-thumbnail-dot">·</div>
                        <div className="trending__movie-thumbnail-type">TV</div>
                      </div>
                      <div className="trending__movie-thumbnail-overlay-name">
                        {tvShow.title}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  className="trending__movie-thumbnail"
                  src={`https://image.tmdb.org/t/p/w780${tvShow.poster_path}`}
                  alt={`${tvShow.name} thumbnail`}
                />
              )}
            </div>
          ))
        ) : (
          <p>No TV shows found for this genre</p>
        )}
      </div>
      <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
        {tvShowsByGenre?.[playVideo]?.trailers && (
          <>
            <iframe
              className="trending__movie-frame"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${
                tvShowsByGenre[playVideo].trailers[currentTrailer]?.key ||
                tvShowsByGenre[playVideo].trailers[0]?.key
              }`}
              title={
                tvShowsByGenre[playVideo].trailers[currentTrailer]?.name ||
                "Trailer"
              }
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            <div className="trending__movie-info">
              <div className="trending__movie-wrapper">
                <div className="trending__movie-year">
                  {tvShowsByGenre[playVideo]?.first_air_date.slice(0, 4)}
                </div>
                <div className="trending__movie-dot">·</div>
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"
                    fill="#ffffff"
                  />
                </svg>
                <div className="trending__movie-dot">·</div>
                <div className="trending__movie-type">TV Show</div>
              </div>

              <div>
                <button onClick={handlePrevTrailer}>Previous</button>
                <button onClick={handleNextTrailer}>Next</button>
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

export default AllTv;
