import "./popularMovies.scss";
import React from "react";
import { fetchPopularMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";
import { useSelector } from "react-redux";

const PopularMovies = () => {
  const contentType = useSelector((state) => state.data.contentType);

  return (
    <MovieList
      fetchMovies={fetchPopularMovies}
      title={contentType === "Movie" ? "Popular Movies" : "Top Rated"}
      moreLink="/more-popular"
      enablePagination={false}
    />
  );
};

export default PopularMovies;
