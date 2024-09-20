import React from "react";
import MovieList from "../../movieList/MovieList";
import { fetchPopularMovies } from "../../../utils/fetchTrailers";

const MorePopularMovies = () => {
  return (
    <>
      <MovieList
        fetchMovies={fetchPopularMovies}
        title="Popular Movies"
        enablePagination={true}
      />
    </>
  );
};
export default MorePopularMovies;
