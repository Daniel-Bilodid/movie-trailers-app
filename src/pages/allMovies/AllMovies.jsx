import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import useMovieTrailers from "../../hooks/useMovieTrailers";
import usePageHandle from "../../hooks/usePageHandle";
import { AuthContext } from "../../components/context/AuthContext";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";

import Genre from "../../components/genre/Genre";
import useAddHistory from "../../hooks/useAddHistory";
import Search from "../../components/search/Search";
import { setMoviesByGenre } from "../../redux/store";
import { setContentType } from "../../redux/store";

import { showToast, hideToast } from "../../redux/store";
import Loading from "../../components/loading/Loading";
import "./allMovies.scss";
import ModalMovie from "../../components/modalMovie/ModalMovie";

import MovieCard from "../../components/movieCard/MovieCard";

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
  useAddHistory(playVideo, moviesByGenre, user, contentType);
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
              <MovieCard
                movie={movie}
                trailers={trailers}
                release_year={
                  movie.release_date ? movie.release_date.slice(0, 4) : ""
                }
                first_air_date={
                  contentType !== "Movie" ? movie.first_air_date : ""
                }
                onPlayVideo={() => handlePlayVideo(index)}
                onBookmarkClick={handleBookmarkClick}
                movies={movies}
                selected={() => selected(movie.id)}
                contentType={contentType}
                user={user}
                showAuthToast={showAuthToast}
                showToastState={showToastState}
              />
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
