import React from "react";

import { fetchTopRatedMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";

const MoreTopRated = () => {
  return (
    <>
      <MovieList
        fetchMovies={fetchTopRatedMovies}
        title="Top Rated Movies"
        enablePagination={true}
      />
    </>
  );
};

export default MoreTopRated;
