import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchMovieById } from "../../utils/fetchTrailers";
import "./bookmark.scss";
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
    return <div>Loading...</div>;
  }

  return (
    <div className="bookmarks">
      <h1 className="bookmarks__title">Bookmarks</h1>
      <ul className="bookmarks__wrapper">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <li className="bookmarks__movie-item" key={movie.id}>
              <h2 className="bookmarks__movie-title">{movie.title}</h2>
              <div className="trending__movie-thumbnail-container">
                <img
                  className="trending__movie-thumbnail"
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={`${movie.title} thumbnail`}
                />
              </div>
              {/* <div className="trending__movie-thumbnail-overlay">
                <span className="trending__movie-thumbnail-overlay-text">
                  Play Trailer
                </span>
                <div className="trending__movie-thumbnail-wrapper">
                  <div className="trending__movie-thumbnail-info">
                    <div className="trending__thumbnail-movie-year">
                      {new Date(movie.release_date).getFullYear()}
                    </div>
                    <div className="trending__movie-thumbnail-dot">·</div>
                    <div className="trending__movie-thumbnail-type">Movie</div>
                  </div>
                  <div className="trending__movie-thumbnail-overlay-name">
                    {movie.title}
                  </div>
                </div>
              </div> */}
            </li>
          ))
        ) : (
          <p>Нет закладок</p>
        )}
      </ul>
    </div>
  );
};

export default Bookmarks;
