import "./popularMovies.scss";
import React from "react";
import { fetchPopularMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";

const PopularMovies = () => (
  <MovieList
    fetchMovies={fetchPopularMovies}
    title="Popular Movies"
    moreLink="/more-popular"
  />
);

export default PopularMovies;
