import React from "react";
import MovieList from "../../movieList/MovieList";
import { fetchNowPlayingMovies } from "../../../utils/fetchTrailers";

const MoreNowPlaying = () => {
  return (
    <>
      <MovieList
        fetchMovies={fetchNowPlayingMovies}
        title="Now Playing Movies"
        enablePagination={true}
      />
    </>
  );
};

export default MoreNowPlaying;
