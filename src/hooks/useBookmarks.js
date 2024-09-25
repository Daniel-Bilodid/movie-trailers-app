import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { fetchMovieById } from "../utils/fetchTrailers";
import { db } from "../firebase";

const useBookmarks = (userId) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const bookmarksCollection = collection(db, `users/${userId}/bookmarks`);
      const bookmarksSnapshot = await getDocs(bookmarksCollection);
      const bookmarksList = bookmarksSnapshot.docs.map((doc) => ({
        id: doc.data().movieId, // Извлечение ID фильма из закладки
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
          currentTrailerIndex: 0, // Индекс текущего трейлера
        };
      });
      const movies = await Promise.all(moviePromises);
      setMovies(movies);
    } catch (error) {
      console.error("Ошибка при загрузке фильмов", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      const loadBookmarksAndMovies = async () => {
        const bookmarksList = await fetchBookmarks();
        setBookmarks(bookmarksList);
        if (bookmarksList.length > 0) {
          await loadMovies(bookmarksList);
        } else {
          setLoading(false);
        }
      };
      loadBookmarksAndMovies();
    }
  }, [userId]);

  return {
    bookmarks,
    movies,
    loading,
  };
};

export default useBookmarks;
