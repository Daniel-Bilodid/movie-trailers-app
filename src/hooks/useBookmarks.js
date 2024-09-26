import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { fetchMovieById } from "../utils/fetchTrailers";
import { db, auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setMovies } from "../redux/store";
import { onAuthStateChanged } from "firebase/auth";

const useBookmarks = () => {
  const dispatch = useDispatch();
  const [movies, setMoviesList] = useState([]); // Состояние для хранения фильмов

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
      const moviePromises = bookmarksList.map(async (bookmark) => {
        const movie = await fetchMovieById(bookmark.id);
        return {
          ...movie,
          currentTrailerIndex: 0,
        };
      });
      const moviesData = await Promise.all(moviePromises);
      setMoviesList(moviesData); // Обновляем состояние с загруженными фильмами
      dispatch(setMovies(moviesData)); // Если нужно сохранить в Redux
    } catch (error) {
      console.error("Ошибка при загрузке фильмов", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const bookmarksList = await fetchBookmarks(user.uid);
        if (bookmarksList.length > 0) {
          await loadMovies(bookmarksList);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return movies; // Возвращаем список фильмов
};

export default useBookmarks;
