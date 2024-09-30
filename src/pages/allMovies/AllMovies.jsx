import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faBookmark } from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import useBookmarks from "../../hooks/useBookmarks";
import { AuthContext } from "../../components/context/AuthContext";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  fetchMoviesByGenre,
  fetchPopularMovies,
} from "../../utils/fetchTrailers";
import Genre from "../../components/genre/Genre";
import Modal from "../../components/movieModal/MovieModal";
import Search from "../../components/search/Search";

import "./allMovies.scss";

const AllMovies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const moviesByGenre = useSelector((state) => state.data.moviesByGenre);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);
  const {
    trailers,
    playVideo,
    handlePlayVideo,
    handleCloseModal,

    loadTrailers,
  } = useMovieTrailers();

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

  const handleBookmarkClick = async (movieId) => {
    if (!user) {
      console.log("Please sign in to bookmark.");
      return;
    }

    try {
      const bookmarkRef = doc(db, `users/${user.uid}/bookmarks/${movieId}`);
      const bookmarkDoc = await getDoc(bookmarkRef);

      if (bookmarkDoc.exists()) {
        // Если закладка уже существует, удаляем её
        await deleteDoc(bookmarkRef);
      } else {
        // Если закладки нет, добавляем новую
        await setDoc(bookmarkRef, { movieId });
      }
    } catch (error) {
      console.error("Error handling bookmark click:", error);
    }
  };
  const [selectedMovies, setSelectedMovies] = useState({});
  const { movies, loading: bookmarksLoading } = useBookmarks();

  const selected = (movieId) => {
    setSelectedMovies((prevState) => ({
      ...prevState,
      [movieId]: !prevState[movieId],
    }));
  };
  if (bookmarksLoading) {
    return <div>Loading movies...</div>;
  }

  const handleNextTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) => (prev + 1) % moviesByGenre[playVideo].trailers.length
      ); // Циклический переход
    }
  };

  const handlePrevTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) =>
          (prev - 1 + moviesByGenre[playVideo].trailers.length) %
          moviesByGenre[playVideo].trailers.length
      ); // Циклический переход
    }
  };
  return (
    <div className="popular">
      <div className="popular__text-wrapper">
        <div className="popular__title">All Movies</div>
        <Genre />
        <Search />
      </div>
      <div className="popular__wrapper">
        {moviesByGenre.length > 0 ? (
          moviesByGenre.map((movie, index, trailers) => (
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
                  <FontAwesomeIcon
                    icon={faBookmark}
                    color={
                      (Array.isArray(movies) &&
                        movies.some((m) => m.id === movie.id)) ||
                      selectedMovies[movie.id]
                        ? "yellow"
                        : "white"
                    }
                    onClick={() => selected(movie.id)}
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
      <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
        {moviesByGenre?.[playVideo]?.trailers && (
          <>
            <iframe
              className="trending__movie-frame"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${
                moviesByGenre[playVideo].trailers[currentTrailer]?.key ||
                moviesByGenre[playVideo].trailers[0]?.key
              }`}
              title={
                moviesByGenre[playVideo].trailers[currentTrailer]?.name ||
                "Trailer"
              }
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            <div className="trending__movie-info">
              <div className="trending__movie-wrapper">
                <div className="trending__movie-year">
                  {moviesByGenre[playVideo]?.release_year}
                </div>
                <div className="trending__movie-dot">·</div>
                <div className="trending__movie-type">Movie</div>
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

export default AllMovies;
