import React from "react";
import { fetchTopRatedMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";

const TopRatedMovies = () => (
  <MovieList
    fetchMovies={fetchTopRatedMovies}
    title="Top Rated"
    moreLink="/more-top-rated"
  />
);

export default TopRatedMovies;
