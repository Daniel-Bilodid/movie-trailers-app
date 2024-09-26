import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchMovieById } from "../../utils/fetchTrailers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import { useDispatch, useSelector } from "react-redux";
import { useBookmarks } from "../../hooks/useBookmarks.js";
import { setMovies } from "../../redux/store";
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
  const [localMovies, setLocalMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const moviesFromStore = useSelector((state) => state.data.movies);

  const {
    trailers,
    setTrailers,
    playVideo,
    setPlayVideo,
    handlePlayVideo,
    handleCloseModal,
  } = useMovieTrailers();

  const handlePlayTrailer = (index) => {
    setPlayVideo(index);
  };

  const handleNextMovie = (index) => {
    setLocalMovies((prevMovies) => {
      const updatedMovies = [...prevMovies];
      const currentMovie = updatedMovies[index];

      if (currentMovie.videos && currentMovie.videos.results.length > 0) {
        const nextIndex =
          (currentMovie.currentTrailerIndex + 1) %
          currentMovie.videos.results.length;

        updatedMovies[index] = {
          ...currentMovie,
          currentTrailerIndex: nextIndex,
        };
      }

      return updatedMovies;
    });
  };

  const handlePrevMovie = (index) => {
    setLocalMovies((prevMovies) => {
      const updatedMovies = [...prevMovies];
      const currentMovie = updatedMovies[index];

      if (currentMovie.videos && currentMovie.videos.results.length > 0) {
        const prevIndex =
          (currentMovie.currentTrailerIndex -
            1 +
            currentMovie.videos.results.length) %
          currentMovie.videos.results.length;

        updatedMovies[index] = {
          ...currentMovie,
          currentTrailerIndex: prevIndex,
        };
      }

      return updatedMovies;
    });
  };

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

  const loadMovies = async (bookmarksList) => {
    try {
      if (!Array.isArray(bookmarksList)) {
        console.error("Bookmarks List is not an array:", bookmarksList);
        return;
      }

      const moviePromises = bookmarksList.map(async (bookmark) => {
        if (
          typeof bookmark === "object" &&
          bookmark !== null &&
          "id" in bookmark
        ) {
          if (Array.isArray(bookmark.id)) {
            console.warn("Bookmark id is an array, skipping:", bookmark);
            return null;
          }

          const movie = await fetchMovieById(bookmark.id);
          return {
            ...movie,
            currentTrailerIndex: 0,
          };
        } else {
          console.warn("Invalid bookmark structure:", bookmark);
          return null;
        }
      });

      const moviesData = await Promise.all(moviePromises);

      const validMoviesData = moviesData.filter((movie) => movie !== null);

      dispatch(setMovies(validMoviesData));
      setLocalMovies(validMoviesData);
    } catch (error) {
      console.error("Ошибка при загрузке фильмов", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    setLocalMovies(moviesFromStore);
    setLoading(false);
  }, [moviesFromStore]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bookmarks">
      <h1 className="bookmarks__title">Bookmarks</h1>
      <ul className="bookmarks__wrapper">
        {localMovies.length > 0 ? (
          localMovies.map((movie, index) => (
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
        {playVideo !== null && localMovies.length > 0 && (
          <>
            <iframe
              className="trending__movie-frame"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${
                localMovies[playVideo].videos.results?.[
                  localMovies[playVideo].currentTrailerIndex
                ]?.key || ""
              }`}
              title={
                localMovies[playVideo]?.videos.results?.[
                  localMovies[playVideo].currentTrailerIndex
                ]?.name || "Trailer"
              }
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            <div className="trending__movie-info">
              <div className="trending__movie-wrapper">
                <div className="trending__movie-year">
                  {localMovies[playVideo]?.release_date.slice(0, 4) ||
                    "Unknown Year"}
                </div>
                <div className="trending__movie-dot">·</div>
                <div className="trending__movie-type">Movie</div>
              </div>
              <div>
                <button onClick={() => handlePrevMovie(playVideo)}>
                  previous
                </button>
                <button onClick={() => handleNextMovie(playVideo)}>next</button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Bookmarks;
