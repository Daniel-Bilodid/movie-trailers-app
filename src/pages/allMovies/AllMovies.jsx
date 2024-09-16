import React, { useState, useCallback, useEffect } from "react";

import { fetchPopularMovies } from "../../utils/fetchTrailers";
import Modal from "../../components/movieModal/MovieModal";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import Search from "../../components/search/Search";
import Genre from "../../components/genre/Genre";
import { useSelector } from "react-redux";

import "./allMovies.scss";
const AllMovies = () => {
  const [currentPage, setCurrentPage] = useState(1);
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
  const [filteredTrailers, setFilteredTrailers] = useState([]);
  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  // useEffect(() => {
  //   if (selectedGenre) {
  //     const filtered = trailers.filter((trailer) =>
  //       trailer.movie.genres.includes(selectedGenre)
  //     );
  //     setFilteredTrailers(filtered);
  //   } else {
  //     setFilteredTrailers(trailers);
  //   }
  // }, [selectedGenre, trailers]);

  return (
    <div className="popular">
      <div className="popular__text-wrapper">
        <div className="popular__title">All Movies</div>
        <Genre />
        <Search />
      </div>
      <div className="popular__wrapper">
        {filteredTrailers.map(
          ({ movie, trailers, currentTrailerIndex, release_year }, index) => (
            <div key={movie.id}>
              <div className="trending__btn-wrapper">
                <Link className="trending__info" to={`/movie-info/${movie.id}`}>
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
                  <FontAwesomeIcon icon={faBookmark} color="white" size="1x" />
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
                <p>No trailer</p>
              )}
            </div>
          )
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
    </div>
  );
};

export default AllMovies;
