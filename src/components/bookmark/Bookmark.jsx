import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchMovieById } from "../../utils/fetchTrailers";
import { Trending } from "../../components/trending/Trending";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [movies, setMovies] = useState([]); // Хранит данные о фильмах
  const [loading, setLoading] = useState(true);

  // Функция для получения закладок
  const fetchBookmarks = async (userId) => {
    try {
      console.log("Загружаем закладки для пользователя:", userId);
      const bookmarksCollection = collection(db, `users/${userId}/bookmarks`);
      const bookmarksSnapshot = await getDocs(bookmarksCollection);
      const bookmarksList = bookmarksSnapshot.docs.map((doc) => ({
        id: doc.data().movieId, // Исправлено на movieId
      }));
      setBookmarks(bookmarksList);
      console.log("Закладки загружены:", bookmarksList);
    } catch (error) {
      console.error("Ошибка при получении закладок: ", error);
    }
  };

  // Функция для загрузки фильмов по ID
  const loadMovies = async () => {
    try {
      const moviePromises = bookmarks.map(async (bookmark) => {
        console.log("ID фильма из закладки:", bookmark.id);
        const movie = await fetchMovieById(bookmark.id);
        return movie;
      });
      const movies = await Promise.all(moviePromises);
      setMovies(movies);
    } catch (error) {
      console.error("Ошибка при загрузке фильмов", error);
    }
  };

  // Загружаем закладки и фильмы при монтировании компонента
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Пользователь аутентифицирован:", user.uid);
        await fetchBookmarks(user.uid);
      } else {
        console.error("Пользователь не аутентифицирован");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Когда закладки загружены, загружаем фильмы
  useEffect(() => {
    if (bookmarks.length > 0) {
      loadMovies(); // Загрузка фильмов после получения закладок
    } else {
      setLoading(false);
    }
  }, [bookmarks]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Закладки</h1>
      <ul>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id}>
              <div className="trending__btn-wrapper ">
                <Link className="trending__info" to={`/movie-info/${movie.id}`}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color="white"
                    size="1x"
                  />
                </Link>
                <div
                  className="trending__bookmark"
                  // onClick={() => handleBookmarkClick(movie.id)}
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
          ))
        ) : (
          <p>Нет закладок</p>
        )}
      </ul>
    </div>
  );
};

export default Bookmarks;
