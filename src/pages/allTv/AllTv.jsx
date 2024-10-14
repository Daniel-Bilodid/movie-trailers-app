import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faBookmark } from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import useBookmarks from "../../hooks/useBookmarks";
import { AuthContext } from "../../components/context/AuthContext";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import Genre from "../../components/genre/Genre";
import Modal from "../../components/movieModal/MovieModal";
import { setCurrentPage } from "../../redux/store";
import { setContentType } from "../../redux/store";

const AllTv = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.data.currentPage);
  const tvShowsByGenre = useSelector((state) => state.data.moviesByGenre);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);
  const contentType = useSelector((state) => state.data.contentType);

  useEffect(() => {
    if (contentType !== "TV") {
      dispatch(setContentType("TV"));
    }
  }, [contentType]);

  const {
    movies: tvShows, // Переименуем для логики ТВ-шоу
    loading: bookmarksLoading,
    selected,
    selectedMovies,
    handleBookmarkClick,
  } = useBookmarkHandle();

  const { playVideo, handlePlayVideo, handleCloseModal, loadTrailers } =
    useMovieTrailers();

  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage); // Загружаем трейлеры для ТВ-шоу
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

  if (bookmarksLoading) {
    return <div>Loading TV shows...</div>;
  }

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

  return (
    <div className="popular">
      <div className="popular__text-wrapper">
        <div className="popular__title">All TV Shows</div>
        <Genre />
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
                    handleBookmarkClick(tvShow.id);
                    selected(tvShow.id);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    color={
                      (Array.isArray(tvShows) &&
                        tvShows.some((m) => m.id === tvShow.id)) ||
                      selectedMovies[tvShow.id]
                        ? "yellow"
                        : "white"
                    }
                    size="1x"
                  />
                </div>
              </div>
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
                    </span>
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
