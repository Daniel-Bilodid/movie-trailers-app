import { useEffect } from "react";
import { addHistory } from "../utils/firestoreUtils";

const useAddHistory = (playVideo, trailers, user, contentType) => {
  useEffect(() => {
    if (playVideo !== null && user) {
      const movieId =
        trailers?.[playVideo]?.movie?.id ?? trailers?.[playVideo]?.id ?? null;

      const movie = trailers[playVideo].movie
        ? trailers[playVideo].movie
        : trailers[playVideo];

      addHistory(
        user.uid,
        movieId.toString(),
        contentType === "Movie" ? movie.title : movie.name,
        contentType
      );
    }
  }, [playVideo, contentType, trailers, user]);
};

export default useAddHistory;
