import React, { useCallback, useContext, useState, useEffect } from "react";

import useMovieTrailers from "../../hooks/useMovieTrailers";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setMovies, selectMovies } from "../../redux/store";
import { AuthContext } from "../context/AuthContext";
import { showToast, hideToast } from "../../redux/store";
import useBookmarks from "../../hooks/useBookmarks";

import "./movieList.scss";

import ModalMovie from "../modalMovie/ModalMovie";
import MovieCard from "../movieCard/MovieCard";
import useAddHistory from "../../hooks/useAddHistory";

const MovieList = ({ fetchMovies, title, moreLink, enablePagination }) => {
  const {
    trailers,
    setTrailers,
    playVideo,
    handlePlayVideo: originalHandlePlayVideo,
    handleCloseModal,

    loadTrailers,
    handleBookmarkClick: originalHandleBookmarkClick,

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

  useAddHistory(playVideo, trailers, user, contentType);

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
              <div>
                <MovieCard
                  movie={item.movie}
                  trailers={item.trailers}
                  release_year={item.release_year}
                  first_air_date={
                    contentType !== "Movie" ? item.first_air_date : ""
                  }
                  onPlayVideo={() => handlePlayVideo(index)}
                  onBookmarkClick={handleBookmarkClick}
                  movies={movies}
                  selected={() => selected(item.movie.id)}
                  contentType={contentType}
                  user={user}
                  showAuthToast={showAuthToast}
                  showToastState={showToastState}
                />
              </div>
            ))
          : trailers.slice(0, 10).map((item, index) => (
              <div>
                <MovieCard
                  movie={item.movie}
                  trailers={item.trailers}
                  release_year={item.release_year}
                  first_air_date={
                    contentType !== "Movie" ? item.first_air_date : ""
                  }
                  onPlayVideo={() => handlePlayVideo(index)}
                  onBookmarkClick={handleBookmarkClick}
                  movies={movies}
                  selected={() => selected(item.movie.id)}
                  contentType={contentType}
                  user={user}
                  showAuthToast={showAuthToast}
                  showToastState={showToastState}
                />
              </div>
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
