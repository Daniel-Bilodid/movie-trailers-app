import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import usePageHandle from "../../hooks/usePageHandle";
import { AuthContext } from "../../components/context/AuthContext";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";

import Genre from "../../components/genre/Genre";

import Search from "../../components/search/Search";
import { setMoviesByGenre } from "../../redux/store";
import { setContentType } from "../../redux/store";
import AuthToast from "../../components/authToast/AuthToast";
import { showToast, hideToast } from "../../redux/store";
import Loading from "../../components/loading/Loading";
import "./allMovies.scss";
import ModalMovie from "../../components/modalMovie/ModalMovie";
import MovieActions from "../../components/movieActions/MovieActions";

const AllMovies = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.data.currentPage);
  const moviesByGenre = useSelector((state) => state.data.moviesByGenre);

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
    handleBookmarkClick,
  } = useBookmarkHandle();
  const {
    playVideo,
    handlePlayVideo,
    handleCloseModal,
    movieLoading,
    loadTrailers,
  } = useMovieTrailers();

  const { handleNextPage, handlePreviousPage } = usePageHandle();

  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  if (movieLoading) {
    return <Loading />;
  }

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
              <MovieActions
                movie={movie}
                contentType={contentType}
                user={user}
                movies={movies}
                selected={selected}
                showAuthToast={showAuthToast}
                handleBookmarkClick={handleBookmarkClick}
              />

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

      <ModalMovie
        isOpen={playVideo !== null}
        onClose={handleCloseModal}
        playVideo={playVideo}
        trailers={moviesByGenre}
        setTrailers={setMoviesByGenre}
        contentType={contentType}
      />

      <div className="popular__pagination">
        <button onClick={handlePreviousPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default AllMovies;
