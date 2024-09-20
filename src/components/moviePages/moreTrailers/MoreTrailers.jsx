import React from "react";

import { fetchTrendingMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";
const MoreTrailers = () => {
  return (
    <>
      <MovieList
        fetchMovies={fetchTrendingMovies}
        title="Trending Movies"
        enablePagination={true}
      />
    </>
  );
};

export default MoreTrailers;
