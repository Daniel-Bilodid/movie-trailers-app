import { useState, useEffect, useCallback } from "react";
import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { fetchMovieById } from "../utils/fetchTrailers";
import { fetchTVShowById } from "../utils/fetchTrailers";
import { db, auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setMovies } from "../redux/store";
import { onAuthStateChanged } from "firebase/auth";

const useBookmarks = () => {
  const dispatch = useDispatch();
  const [movies, setMoviesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async (userId) => {
    try {
      const bookmarksCollection = collection(db, `users/${userId}/bookmarks`);
      const bookmarksSnapshot = await getDocs(bookmarksCollection);
      const bookmarksList = bookmarksSnapshot.docs.map((doc) => ({
        id: doc.data().movieId,
        movieType: doc.data().movieType || "Movie",
      }));

      return bookmarksList;
    } catch (error) {
      console.error("Ошибка при получении закладок: ", error);
      return [];
    }
  }, []);

  const loadMovies = useCallback(async (bookmarksList) => {
    try {
      if (!Array.isArray(bookmarksList)) {
        console.error("Bookmarks List is not an array:", bookmarksList);
        return;
      }

      const moviePromises = bookmarksList.map(async (bookmark) => {
        if (bookmark && bookmark.id) {
          try {
            let content = null;
            if (bookmark.movieType === "Movie") {
              content = await fetchMovieById(bookmark.id);
            } else if (bookmark.movieType === "TV") {
              content = await fetchTVShowById(bookmark.id);
            }

            if (content) {
              return {
                ...content,
                currentTrailerIndex: 0,
                movieType: bookmark.movieType,
              };
            }
          } catch (error) {
            console.error("Error fetching movie/TV show by ID:", error);
          }
        }
        return null;
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
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const bookmarksRef = collection(db, `users/${user.uid}/bookmarks`);

        const unsubscribeBookmarks = onSnapshot(
          bookmarksRef,
          async (snapshot) => {
            const bookmarksList = snapshot.docs.map((doc) => ({
              id: doc.data().movieId,
              movieType: doc.data().movieType || "Movie",
            }));
            await loadMovies(bookmarksList);
          }
        );

        return () => unsubscribeBookmarks();
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { movies, loadMovies, fetchBookmarks, loading };
};

export default useBookmarks;
