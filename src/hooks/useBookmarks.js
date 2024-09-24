import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const useBookmarks = () => {
  const { user } = useContext(AuthContext);
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        try {
          const bookmarksRef = doc(db, `users/${user.uid}/bookmarks`);
          const bookmarksDoc = await getDoc(bookmarksRef);

          if (bookmarksDoc.exists()) {
            const bookmarksData = bookmarksDoc.data();

            setBookmarkedMovies(bookmarksData.movieIds || []);
          }
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      }
    };

    fetchBookmarks();
  }, [user]);

  return { bookmarkedMovies };
};

export default useBookmarks;
