import React, { useCallback, useContext, useState, useEffect } from "react";
import Modal from "../movieModal/MovieModal";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setMovies, selectMovies } from "../../redux/store";
import { AuthContext } from "../context/AuthContext";
import useBookmarks from "../../hooks/useBookmarks";

import "./movieList.scss";

const MovieCard = React.memo(
  ({
    movie,
    trailers,
    currentTrailerIndex,
    release_year,
    onPlayVideo,
    onBookmarkClick,
    movies,
    selected,
    isSelected,
    contentType,
  }) => (
    <div key={movie.id}>
      <div className="trending__btn-wrapper">
        <Link className="trending__info" to={`/movie-info/${movie.id}`}>
          <FontAwesomeIcon icon={faInfoCircle} color="white" size="1x" />
        </Link>

        <div
          className="trending__bookmark"
          onClick={() => onBookmarkClick(movie.id)}
        >
          <FontAwesomeIcon
            icon={faBookmark}
            color={
              (Array.isArray(movies) &&
                movies.some((m) => m.id === movie.id)) ||
              isSelected
                ? "yellow"
                : "white"
            }
            size="1x"
            onClick={selected}
          />
        </div>
      </div>
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
            </span>
            <div className="trending__movie-thumbnail-wrapper">
              <div className="trending__movie-thumbnail-info">
                <div className="trending__thumbnail-movie-year">
                  {release_year}
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
                <div className="trending__movie-thumbnail-type">Movie</div>
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
    playVideo,
    handlePlayVideo: originalHandlePlayVideo,
    handleCloseModal,
    handleNextTrailer,
    handlePrevTrailer,
    loadTrailers,
    handleBookmarkClick: originalHandleBookmarkClick,
  } = useMovieTrailers(fetchMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const { loading: bookmarksLoading } = useBookmarks();
  const [selectedMovies, setSelectedMovies] = useState({});
  const { user } = useContext(AuthContext);
  const contentType = useSelector((state) => state.data.contentType);
  const movies = useSelector((state) => state.data.movies);

  const selected = (movieId) => {
    setSelectedMovies((prevState) => ({
      ...prevState,
      [movieId]: !prevState[movieId],
    }));
  };

  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handlePlayVideo = useCallback(
    (index) => originalHandlePlayVideo(index),
    [originalHandlePlayVideo]
  );
  const handleBookmarkClick = useCallback(
    (movieId) => originalHandleBookmarkClick(movieId),
    [originalHandleBookmarkClick]
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

  if (bookmarksLoading && user) {
    return <div>Loading bookmarks...</div>;
  }
  console.log(movies);
  return (
    <div className="popular-list">
      <div className="popular__text-wrapper">
        <div className="popular__title">{title}</div>
        <Link className="popular__more" to={moreLink}>
          See more
        </Link>
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
                onPlayVideo={() => handlePlayVideo(index)}
                onBookmarkClick={handleBookmarkClick}
                movies={movies}
                selected={() => selected(item.movie.id)}
                isSelected={!!selectedMovies[item.movie.id]}
                contentType={contentType}
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
                  onPlayVideo={() => handlePlayVideo(index)}
                  onBookmarkClick={handleBookmarkClick}
                  movies={movies}
                  selected={() => selected(item.movie.id)}
                  isSelected={!!selectedMovies[item.movie.id]}
                  contentType={contentType}
                />
              ))}
      </div>
      {enablePagination && (
        <div className="pagination">
          <button
            className="pagination__button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <button className="pagination__button" onClick={handleNextPage}>
            Next Page
          </button>
        </div>
      )}
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
                <div className="trending__movie-dot">·</div>
                <div className="trending__movie-svg">
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
                <div className="trending__movie-dot">·</div>
                <div className="trending__movie-type">Movie</div>
              </div>
              <div>
                <button onClick={() => handlePrevTrailer(playVideo)}>
                  Previous
                </button>
                <button onClick={() => handleNextTrailer(playVideo)}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MovieList;
