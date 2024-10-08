import React from "react";
import { fetchNowPlayingMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";
import { useSelector } from "react-redux";

const NowPlayingMovies = () => {
  const contentType = useSelector((state) => state.data.contentType);

  return (
    <MovieList
      fetchMovies={fetchNowPlayingMovies}
      title={contentType === "Movie" ? "Now Playing Movies" : "On The Air"}
      moreLink="/more-now-playing"
    />
  );
};

export default NowPlayingMovies;
