import React from "react";

import { fetchMoreTrendingMovies } from "../../../utils/fetchTrailers";

import MovieList from "../../movieList/MovieList";
const MoreTrailers = () => {
  return (
    <>
      <MovieList
        fetchMovies={fetchMoreTrendingMovies}
        title="Trending Movies"
        enablePagination={true}
      />
    </>
  );
};

export default MoreTrailers;
