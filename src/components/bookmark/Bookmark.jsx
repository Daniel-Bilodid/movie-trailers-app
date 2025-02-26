import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchMovieById } from "../../utils/fetchTrailers";
import { fetchTVShowById } from "../../utils/fetchTrailers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import { useDispatch, useSelector } from "react-redux";

import { setMovies } from "../../redux/store";
import {
  faInfoCircle,
  faXmark,
  faPlayCircle,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "./bookmark.scss";
import ModalMovie from "../modalMovie/ModalMovie.jsx";
import MovieCard from "../movieCard/MovieCard.jsx";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [localMovies, setLocalMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const moviesFromStore = useSelector((state) => state.data.movies);

  const {
    playVideo,
    setPlayVideo,

    handleCloseModal,
    handleBookmarkClick,
  } = useMovieTrailers();

  const handlePlayTrailer = (index) => {
    setPlayVideo(index);
  };

  const fetchBookmarks = async (userId) => {
    try {
      const bookmarksCollection = collection(db, `users/${userId}/bookmarks`);
      const bookmarksSnapshot = await getDocs(bookmarksCollection);
      const bookmarksList = bookmarksSnapshot.docs.map((doc) => ({
        id: doc.data().movieId,
        movieType: doc.data().movieType || "Movie",
      }));

      return bookmarksList;
    } catch (error) {
      console.error("Error with bookmarks loading: ", error);
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

          let content = null;

          if (bookmark.movieType === "Movie") {
            content = await fetchMovieById(bookmark.id).catch((error) => {
              console.error(
                `Error fetching movie with ID ${bookmark.id}:`,
                error
              );
              return null;
            });
          } else if (bookmark.movieType === "TV") {
            content = await fetchTVShowById(bookmark.id).catch((error) => {
              console.error(
                `Error fetching TV show with ID ${bookmark.id}:`,
                error
              );
              return null;
            });
          }

          if (content) {
            return {
              ...content,
              currentTrailerIndex: 0,
              movieType: bookmark.movieType,
            };
          } else {
            return null;
          }
        } else {
          console.warn("Invalid bookmark structure:", bookmark);
          return null;
        }
      });

      const moviesData = await Promise.all(moviePromises);
      console.log(moviesData);
      const validMoviesData = moviesData.filter((movie) => movie !== null);
      dispatch(setMovies(validMoviesData));
      setLocalMovies(validMoviesData);
    } catch (error) {
      console.error("Error with movies loading", error);
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
                <Link
                  className="trending__info"
                  to={`/${
                    movie.movieType === "Movie" ? "movie-info" : "tv-info"
                  }/${movie.id}`}
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color="white"
                    size="1x"
                  />
                </Link>
                <Link
                  className="movie__info-comments"
                  to={`/${
                    movie.movieType === "Movie" ? "movie-info" : "tv-info"
                  }/comments/${movie.id}`}
                >
                  <FontAwesomeIcon icon={faComment} color="white" size="1x" />
                </Link>
                <div
                  className="trending__bookmark"
                  onClick={() => handleBookmarkClick(movie.id)}
                >
                  <FontAwesomeIcon icon={faXmark} color="white" size="1x" />
                </div>
              </div>
              <h3 className="trending__movie-title">
                {movie.movieType === "Movie" ? movie.title : movie.name}
              </h3>
              <div className="trending__movie-thumbnail-container">
                <img
                  className="trending__movie-thumbnail"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                      : "https://ih1.redbubble.net/image.1861329650.2941/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                  }
                  alt={`${movie.title || "Default"} thumbnail`}
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
                        {movie.movieType === "Movie"
                          ? new Date(movie.release_date).getFullYear()
                          : movie.first_air_date
                          ? movie.first_air_date.slice(0, 4)
                          : "Unknown Year"}
                      </div>
                      <div className="trending__movie-thumbnail-dot">·</div>
                      {movie.movieType === "Movie" ? (
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
                      ) : (
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
                      )}
                      <div className="trending__movie-thumbnail-dot">·</div>
                      <div className="trending__movie-thumbnail-type">
                        {movie.movieType}
                      </div>
                    </div>
                    <div className="trending__movie-thumbnail-overlay-name">
                      {movie.movieType === "Movie" ? movie.title : movie.name}
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

      <ModalMovie
        isOpen={playVideo !== null}
        onClose={handleCloseModal}
        playVideo={playVideo}
        trailers={localMovies}
        setTrailers={setLocalMovies}
        contentType={localMovies}
      />
    </div>
  );
};

export default Bookmarks;
