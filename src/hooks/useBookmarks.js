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
  const [loading, setLoading] = useState(true);
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
      setMoviesList(validMoviesData);
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
        if (bookmarksList.length > 0) {
          await loadMovies(bookmarksList);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
  console.log(movies);
  return movies; // Возвращаем список фильмов
};

export default useBookmarks;
