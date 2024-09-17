import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faBookmark } from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import { fetchPopularMovies } from "../../utils/fetchTrailers";
import Genre from "../../components/genre/Genre";
import Modal from "../../components/movieModal/MovieModal";
import Search from "../../components/search/Search";

import "./allMovies.scss";

const AllMovies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTrailers, setFilteredTrailers] = useState([]);
  const {
    trailers,
    playVideo,
    handlePlayVideo,
    handleCloseModal,
    handleNextTrailer,
    handlePrevTrailer,
    handleBookmarkClick,
    loadTrailers,
  } = useMovieTrailers(fetchPopularMovies);

  const selectedGenre = useSelector((state) => state.data.selectedGenre);

  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  useEffect(() => {
    if (selectedGenre) {
      console.log(selectedGenre);
      const filtered = trailers.filter((trailer) =>
        trailer.movie.genre_ids.includes(Number(selectedGenre))
      );

      setFilteredTrailers(filtered);
    } else {
      setFilteredTrailers(trailers);
    }
  }, [selectedGenre, trailers]);
  console.log(filteredTrailers);
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="popular">
      <div className="popular__text-wrapper">
        <div className="popular__title">All Movies</div>
        <Genre />
        <Search />
      </div>
      <div className="popular__wrapper">
        {filteredTrailers.length > 0 ? (
          filteredTrailers.map(
            ({ movie, trailers, currentTrailerIndex, release_year }, index) => (
              <div key={movie.id}>
                <div className="trending__btn-wrapper">
                  <Link
                    className="trending__info"
                    to={`/movie-info/${movie.id}`}
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      color="white"
                      size="1x"
                    />
                  </Link>
                  <div
                    className="trending__bookmark"
                    onClick={() => handleBookmarkClick(movie.id)}
                  >
                    <FontAwesomeIcon
                      icon={faBookmark}
                      color="white"
                      size="1x"
                    />
                  </div>
                </div>
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
                      </span>
                    </div>
                  </div>
                ) : (
                  <p>No trailer</p>
                )}
              </div>
            )
          )
        ) : (
          <p>No movies found for this genre</p>
        )}
      </div>
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
              </div>
              <div>
                <button onClick={() => handlePrevTrailer(playVideo)}>
                  previous
                </button>
                <button onClick={() => handleNextTrailer(playVideo)}>
                  next
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
