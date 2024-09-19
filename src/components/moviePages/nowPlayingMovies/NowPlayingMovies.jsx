import React from "react";
import { fetchNowPlayingMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";

const NowPlayingMovies = () => (
  <MovieList
    fetchMovies={fetchNowPlayingMovies}
    title="Now Playing Movies"
    moreLink="/more-now-playing"
  />
);

export default NowPlayingMovies;
