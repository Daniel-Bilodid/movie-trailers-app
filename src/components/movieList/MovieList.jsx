import React, { useCallback, useContext, useState, useEffect } from "react";

import useMovieTrailers from "../../hooks/useMovieTrailers";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faBookmark,
  faPlayCircle,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setMovies, selectMovies } from "../../redux/store";
import { AuthContext } from "../context/AuthContext";
import { showToast, hideToast } from "../../redux/store";
import useBookmarks from "../../hooks/useBookmarks";
import AuthToast from "../authToast/AuthToast";

import "./movieList.scss";
import { addHistory } from "../../utils/firestoreUtils";
import ModalMovie from "../modalMovie/ModalMovie";

const MovieCard = React.memo(
  ({
    movie,
    trailers,

    release_year,

    onPlayVideo,
    onBookmarkClick,
    movies,

    isSelected,
    contentType,
    user,
    showAuthToast,

    showToastState,
  }) => (
    <div key={movie.id}>
      <div className="trending__btn-wrapper">
        <Link
          className="trending__info"
          to={`/${contentType === "Movie" ? "movie-info" : "tv-info"}/${
            movie.id
          }`}
        >
          <FontAwesomeIcon icon={faInfoCircle} color="white" size="1x" />
        </Link>
        <Link
          className="movie__info-comments"
          to={`/${
            contentType === "Movie" ? "movie-info" : "tv-info"
          }/comments/${movie.id}`}
        >
          <FontAwesomeIcon icon={faComment} color="white" size="1x" />
        </Link>
        <div
          className="trending__bookmark"
          onClick={() => {
            if (user) {
              onBookmarkClick(movie.id);
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
              isSelected
                ? "yellow"
                : "white"
            }
            size="1x"
          />
        </div>
      </div>
      <AuthToast show={showToastState} />

      <h3 className="trending__movie-title">
        {contentType === "Movie" ? movie.title : movie.name}
      </h3>
      {trailers.length > 0 ? (
        <div className="trending__movie-thumbnail-container">
          <img
            className="trending__movie-thumbnail"
            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            alt={`${movie.title} thumbnail`}
            loading="lazy"
            width="342"
            height="513"
          />
          <div
            className="trending__movie-thumbnail-overlay"
            onClick={onPlayVideo}
          >
            <span className="trending__movie-thumbnail-overlay-text">
              Play Trailer
              <FontAwesomeIcon
                className="trending__play-icon"
                icon={faPlayCircle}
                color="white"
                size="1x"
              />
            </span>
            <div className="trending__movie-thumbnail-wrapper">
              <div className="trending__movie-thumbnail-info">
                <div className="trending__thumbnail-movie-year">
                  {contentType === "Movie"
                    ? release_year
                    : movie.first_air_date
                    ? movie.first_air_date.slice(0, 4)
                    : ""}
                </div>
                <div className="trending__movie-thumbnail-dot">·</div>
                <div className="trending__movie-thumbnail-svg">
                  {contentType === "Movie" ? (
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
                  ) : (
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
                  )}
                </div>
                <div className="trending__movie-thumbnail-dot">·</div>
                <div className="trending__movie-thumbnail-type">
                  {contentType === "Movie" ? "Movie" : "TV"}
                </div>
              </div>
              <div className="trending__movie-thumbnail-overlay-name">
                {contentType === "Movie" ? movie.title : movie.name}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <img
          className="trending__movie-thumbnail"
          src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
          alt={`${movie.title} thumbnail`}
          loading="lazy"
          width="342"
          height="513"
        />
      )}
    </div>
  )
);

const MovieList = ({ fetchMovies, title, moreLink, enablePagination }) => {
  const {
    trailers,
    setTrailers,
    playVideo,
    handlePlayVideo: originalHandlePlayVideo,
    handleCloseModal,

    loadTrailers,
    handleBookmarkClick: originalHandleBookmarkClick,
    movieLoading,
    setMovieLoading,
  } = useMovieTrailers(fetchMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const { movies, loading: bookmarksLoading } = useBookmarks();
  const [selectedMovies, setSelectedMovies] = useState({});
  const { user } = useContext(AuthContext);

  const contentType = useSelector((state) => state.data.contentType);
  const dispatch = useDispatch();

  const showToastState = useSelector((state) => state.toast.showToast);

  const showAuthToast = () => {
    dispatch(showToast());
    setTimeout(() => {
      dispatch(hideToast());
    }, 5000);
  };

  const selected = (movieId) => {
    setSelectedMovies((prevState) => ({
      ...prevState,
      [movieId]: !prevState[movieId],
    }));
  };

  const handleBookmarkClick = useCallback(
    (movieId) => {
      originalHandleBookmarkClick(movieId);

      dispatch(setMovies(movies));
    },
    [originalHandleBookmarkClick, dispatch, movies]
  );

  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData, selectedMovies, movies]);

  const handlePlayVideo = useCallback(
    (index) => originalHandlePlayVideo(index),
    [originalHandlePlayVideo]
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const preloadImage = (src) => {
    const img = new Image();
    img.src = src;
  };

  useEffect(() => {
    if (trailers.length > 0) {
      preloadImage(
        `https://image.tmdb.org/t/p/w780${trailers[0].movie.poster_path}`
      );
    }
  }, [trailers]);

  useEffect(() => {
    try {
      if (contentType) {
        setMovieLoading(true);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setMovieLoading(false);
    }
  }, [contentType, setMovieLoading]);

  useEffect(() => {
    if (playVideo !== null && user) {
      const movieId = trailers[playVideo].movie.id;

      const movie = trailers[playVideo].movie;
      console.log("contentType:", contentType);

      addHistory(
        user.uid,
        movieId.toString(),
        contentType === "Movie" ? movie.title : movie.name,
        contentType
      );
    }
  }, [playVideo, contentType, trailers, user]);

  console.log(trailers[playVideo]?.movie?.first_air_date);

  return (
    <div className="popular-list">
      <div className="popular__text-wrapper">
        <div className="popular__title">{title}</div>
        {!enablePagination ? (
          <Link className="popular__more" to={moreLink}>
            See more
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="popular__wrapper">
        {enablePagination
          ? trailers.map((item, index) => (
              <MovieCard
                key={item.movie.id}
                movie={item.movie}
                trailers={item.trailers}
                currentTrailerIndex={item.currentTrailerIndex}
                release_year={item.release_year}
                first_air_date={
                  contentType !== "Movie" ? item.first_air_date : ""
                }
                onPlayVideo={() => handlePlayVideo(index)}
                onBookmarkClick={handleBookmarkClick}
                movies={movies}
                selected={() => selected(item.movie.id)}
                isSelected={!!selectedMovies[item.movie.id]}
                contentType={contentType}
                user={user}
                showAuthToast={showAuthToast}
                showToast={showToast}
                showToastState={showToastState}
                movieLoading={movieLoading}
              />
            ))
          : trailers
              .slice(0, 10)
              .map((item, index) => (
                <MovieCard
                  key={item.movie.id}
                  movie={item.movie}
                  trailers={item.trailers}
                  currentTrailerIndex={item.currentTrailerIndex}
                  release_year={item.release_year}
                  first_air_date={
                    contentType !== "Movie" ? item.first_air_date : ""
                  }
                  onPlayVideo={() => handlePlayVideo(index)}
                  onBookmarkClick={handleBookmarkClick}
                  movies={movies}
                  selected={() => selected(item.movie.id)}
                  isSelected={!!selectedMovies[item.movie.id]}
                  contentType={contentType}
                  user={user}
                  showAuthToast={showAuthToast}
                  showToast={showToast}
                  showToastState={showToastState}
                  movieLoading={movieLoading}
                />
              ))}
      </div>
      {enablePagination && (
        <div className="popular__pagination">
          {currentPage > 1 && (
            <button
              className="pagination__previous"
              onClick={handlePreviousPage}
            >
              Previous Page
            </button>
          )}
          {trailers.length > 0 && (
            <button className="pagination__next" onClick={handleNextPage}>
              Next Page
            </button>
          )}
        </div>
      )}

      <ModalMovie
        isOpen={playVideo !== null}
        onClose={handleCloseModal}
        playVideo={playVideo}
        trailers={trailers}
        setTrailers={setTrailers}
        contentType={contentType}
      />
    </div>
  );
};

export default MovieList;
