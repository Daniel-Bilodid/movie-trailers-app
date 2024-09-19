import React from "react";
import { fetchUpcomingMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";

const UpcomingMovies = () => (
  <MovieList
    fetchMovies={fetchUpcomingMovies}
    title="Upcoming Movies"
    moreLink="/more-upcoming"
  />
);

export default UpcomingMovies;
