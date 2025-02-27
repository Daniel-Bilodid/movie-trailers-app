import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import useMovieTrailers from "../../hooks/useMovieTrailers";

import { AuthContext } from "../../components/context/AuthContext";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import usePageHandle from "../../hooks/usePageHandle";
import Genre from "../../components/genre/Genre";

import { setMoviesByGenre } from "../../redux/store";
import { setContentType } from "../../redux/store";
import Search from "../../components/search/Search";

import { showToast, hideToast } from "../../redux/store";
import Loading from "../../components/loading/Loading";

import ModalMovie from "../../components/modalMovie/ModalMovie";
import MovieCard from "../../components/movieCard/MovieCard";

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
          tvShowsByGenre.map((tvShow, index, trailers) => (
            <div key={tvShow.id}>
              <MovieCard
                movie={tvShow}
                trailers={trailers}
                release_year={
                  tvShow.release_date ? tvShow.release_date.slice(0, 4) : ""
                }
                first_air_date={
                  tvShow.first_air_date ? tvShow.first_air_date.slice(0, 4) : ""
                }
                onPlayVideo={() => handlePlayVideo(index)}
                onBookmarkClick={handleBookmarkClick}
                movies={tvShows}
                selected={() => selected(tvShow.id)}
                contentType={contentType}
                user={user}
                showAuthToast={showAuthToast}
                showToastState={showToastState}
              />
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
