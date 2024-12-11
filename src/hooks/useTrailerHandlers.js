import { useCallback } from "react";

export const useTrailerHandlers = (setLocalMovies, setPlayVideo) => {
  const handlePlayTrailer = useCallback(
    (index) => {
      setPlayVideo(index);
    },
    [setPlayVideo]
  );

  const handleNextMovie = useCallback(
    (index) => {
      setLocalMovies((prevMovies) => {
        const updatedMovies = [...prevMovies];
        const currentMovie = updatedMovies[index];

        if (currentMovie.videos && currentMovie.videos.results.length > 0) {
          const nextIndex =
            (currentMovie.currentTrailerIndex + 1) %
            currentMovie.videos.results.length;

          updatedMovies[index] = {
            ...currentMovie,
            currentTrailerIndex: nextIndex,
          };
        }

        return updatedMovies;
      });
    },
    [setLocalMovies]
  );

  const handlePrevMovie = useCallback(
    (index) => {
      setLocalMovies((prevMovies) => {
        const updatedMovies = [...prevMovies];
        const currentMovie = updatedMovies[index];

        if (currentMovie.videos && currentMovie.videos.results.length > 0) {
          const prevIndex =
            (currentMovie.currentTrailerIndex -
              1 +
              currentMovie.videos.results.length) %
            currentMovie.videos.results.length;

          updatedMovies[index] = {
            ...currentMovie,
            currentTrailerIndex: prevIndex,
          };
        }

        return updatedMovies;
      });
    },
    [setLocalMovies]
  );

  return { handlePlayTrailer, handleNextMovie, handlePrevMovie };
};
