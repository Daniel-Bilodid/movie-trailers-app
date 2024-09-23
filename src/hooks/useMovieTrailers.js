import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const useMovieTrailers = (fetchMovies) => {
  const [trailers, setTrailers] = useState([]);
  const [playVideo, setPlayVideo] = useState(null);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);

  const loadTrailers = useCallback(
    async (page) => {
      try {
        const trailersData = await fetchMovies(page);
        setTrailers(trailersData);
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    },
    [fetchMovies]
  );

  useEffect(() => {
    loadTrailers(currentPage);
  }, [loadTrailers, currentPage]);

  const handlePlayVideo = (index) => {
    setPlayVideo(index);
  };

  const handleCloseModal = () => {
    setPlayVideo(null);
  };

  const handleNextTrailer = (index) => {
    setTrailers((prevTrailers) => {
      const updatedTrailers = [...prevTrailers];
      const currentTrailer = updatedTrailers[index];
      const nextIndex =
        (currentTrailer.currentTrailerIndex + 1) %
        currentTrailer.trailers.length;
      updatedTrailers[index] = {
        ...currentTrailer,
        currentTrailerIndex: nextIndex,
      };
      return updatedTrailers;
    });
  };

  const handlePrevTrailer = (index) => {
    setTrailers((prevTrailers) => {
      const updatedTrailers = [...prevTrailers];
      const currentTrailer = updatedTrailers[index];
      const prevIndex =
        (currentTrailer.currentTrailerIndex -
          1 +
          currentTrailer.trailers.length) %
        currentTrailer.trailers.length;
      updatedTrailers[index] = {
        ...currentTrailer,
        currentTrailerIndex: prevIndex,
      };
      return updatedTrailers;
    });
  };

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
        await setDoc(bookmarkRef, { movieId });
      }
    } catch (error) {
      console.error("Error handling bookmark click:", error);
    }
  };

  return {
    trailers,
    setTrailers,
    playVideo,
    setPlayVideo,
    handlePlayVideo,
    handleCloseModal,
    handleNextTrailer,
    handlePrevTrailer,
    handleBookmarkClick,
    loadTrailers,
  };
};

export default useMovieTrailers;
