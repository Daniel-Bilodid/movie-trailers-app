import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";

import { AuthContext } from "../../components/context/AuthContext";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import usePageHandle from "../../hooks/usePageHandle";
import Genre from "../../components/genre/Genre";

import { setMoviesByGenre } from "../../redux/store";
import { setContentType } from "../../redux/store";
import Search from "../../components/search/Search";
import AuthToast from "../../components/authToast/AuthToast";
import { showToast, hideToast } from "../../redux/store";
import Loading from "../../components/loading/Loading";
import MovieActions from "../../components/movieActions/MovieActions";
import ModalMovie from "../../components/modalMovie/ModalMovie";

const AllTv = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.data.currentPage);
  const tvShowsByGenre = useSelector((state) => state.data.moviesByGenre);

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

    handleBookmarkClick,
  } = useBookmarkHandle();

  const {
    playVideo,
    handlePlayVideo,
    handleCloseModal,
    loadTrailers,
    movieLoading,
  } = useMovieTrailers();

  const { handleNextPage, handlePreviousPage } = usePageHandle();

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    await loadTrailers(currentPage);
    setLoading(false);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  if (loading && movieLoading) {
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
        <div className="popular__title">All TV Shows</div>
      </div>
      <div className="popular__wrapper">
        {tvShowsByGenre.length > 0 ? (
          tvShowsByGenre.map((tvShow, index) => (
            <div key={tvShow.id}>
              <MovieActions
                movie={tvShow}
                contentType={contentType}
                user={user}
                movies={tvShows}
                selected={selected}
                showAuthToast={showAuthToast}
                handleBookmarkClick={handleBookmarkClick}
              />

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

      <ModalMovie
        isOpen={playVideo !== null}
        onClose={handleCloseModal}
        playVideo={playVideo}
        trailers={tvShowsByGenre}
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

export default AllTv;
