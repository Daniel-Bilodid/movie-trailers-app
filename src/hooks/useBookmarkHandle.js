import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";

import useBookmarks from "../hooks/useBookmarks";

const useBookmarkHandle = () => {
  const contentType = useSelector((state) => state.data.contentType);
  const { user } = useContext(AuthContext);
  const [selectedMovies, setSelectedMovies] = useState({});
  const { movies, loading: bookmarksLoading } = useBookmarks();

  const handleBookmarkClick = async (movieId) => {
    if (!user) {
      console.log("Please sign in to bookmark.");
      return;
    }

    try {
      const bookmarkRef = doc(db, `users/${user.uid}/bookmarks/${movieId}`);
      const bookmarkDoc = await getDoc(bookmarkRef);

      if (bookmarkDoc.exists()) {
        await deleteDoc(bookmarkRef);
      } else {
        await setDoc(bookmarkRef, { movieId, movieType: contentType });
      }
    } catch (error) {
      console.error("Error handling bookmark click:", error);
    }
  };

  const selected = (movieId) => {
    setSelectedMovies((prevState) => ({
      ...prevState,
      [movieId]: !prevState[movieId],
    }));
  };

  return {
    movies,
    loading: bookmarksLoading,
    selected,
    selectedMovies,
    handleBookmarkClick,
  };
};

export default useBookmarkHandle;
