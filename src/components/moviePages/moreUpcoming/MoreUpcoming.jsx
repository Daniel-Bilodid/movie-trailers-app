import React from "react";

import { fetchUpcomingMovies } from "../../../utils/fetchTrailers";

import MovieList from "../../movieList/MovieList";

const MoreUpcoming = () => {
  return (
    <>
      <MovieList
        fetchMovies={fetchUpcomingMovies}
        title="Upcoming Movies"
        enablePagination={true}
      />
    </>
  );
};

export default MoreUpcoming;
