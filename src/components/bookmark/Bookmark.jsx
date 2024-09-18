import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchMovieById } from "../../utils/fetchTrailers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import {
  faInfoCircle,
  faBookmark,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Modal from "../movieModal/MovieModal";
import "./bookmark.scss";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    trailers,
    playVideo,
    setPlayVideo,
    handlePlayVideo,
    handleCloseModal,
    handleNextTrailer,
    handlePrevTrailer,
  } = useMovieTrailers(movies);
  console.log(movies);
  const handlePlayTrailer = (index) => {
    setPlayVideo(index);
  };

  // Функция для получения закладок
  const fetchBookmarks = async (userId) => {
    try {
      const bookmarksCollection = collection(db, `users/${userId}/bookmarks`);
      const bookmarksSnapshot = await getDocs(bookmarksCollection);
      const bookmarksList = bookmarksSnapshot.docs.map((doc) => ({
        id: doc.data().movieId,
      }));
      return bookmarksList;
    } catch (error) {
      console.error("Ошибка при получении закладок: ", error);
      return [];
    }
  };

  // Функция для загрузки фильмов по закладкам
  const loadMovies = async (bookmarksList) => {
    try {
      const moviePromises = bookmarksList.map(async (bookmark) => {
        const movie = await fetchMovieById(bookmark.id);
        return movie;
      });
      const movies = await Promise.all(moviePromises);
      setMovies(movies);
    } catch (error) {
      console.error("Ошибка при загрузке фильмов", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect для загрузки закладок и фильмов
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const bookmarksList = await fetchBookmarks(user.uid);
        setBookmarks(bookmarksList);
        if (bookmarksList.length > 0) {
          await loadMovies(bookmarksList);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bookmarks">
      <h1 className="bookmarks__title">Bookmarks</h1>
      <ul className="bookmarks__wrapper">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={movie.id}>
              <div className="trending__btn-wrapper">
                <Link className="trending__info" to={`/movie-info/${movie.id}`}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color="white"
                    size="1x"
                  />
                </Link>
                <div className="trending__bookmark">
                  <FontAwesomeIcon icon={faBookmark} color="white" size="1x" />
                </div>
              </div>
              <h3 className="trending__movie-title">{movie.title}</h3>
              <div className="trending__movie-thumbnail-container">
                <img
                  className="trending__movie-thumbnail"
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={`${movie.title} thumbnail`}
                />
                <div className="trending__movie-thumbnail-overlay">
                  <span
                    className="trending__movie-thumbnail-overlay-text"
                    onClick={() => handlePlayTrailer(index)}
                  >
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
                        {new Date(movie.release_date).getFullYear()}
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
            </div>
          ))
        ) : (
          <p>No bookmarks found</p>
        )}
      </ul>

      <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
        {playVideo !== null &&
          trailers[playVideo]?.trailers?.length > 0 &&
          trailers[playVideo].currentTrailerIndex !== undefined && (
            <>
              <iframe
                className="trending__movie-frame"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${
                  trailers[playVideo].trailers[
                    trailers[playVideo].currentTrailerIndex
                  ]?.key || ""
                }`}
                title={
                  trailers[playVideo].trailers[
                    trailers[playVideo].currentTrailerIndex
                  ]?.name || "Trailer"
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="trending__movie-info">
                <div className="trending__movie-wrapper">
                  <div className="trending__movie-year">
                    {trailers[playVideo]?.release_year || "Unknown Year"}
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
    </div>
  );
};

export default Bookmarks;
