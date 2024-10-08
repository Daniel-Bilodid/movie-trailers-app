import React from "react";
import { fetchTopRatedMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";
import { useSelector } from "react-redux";
const TopRatedMovies = () => {
  const contentType = useSelector((state) => state.data.contentType);
  console.log("typee", contentType);
  return (
    <MovieList
      fetchMovies={fetchTopRatedMovies}
      title={contentType === "Movie" ? "Top Rated" : "Popular"}
      moreLink="/more-top-rated"
    />
  );
};

export default TopRatedMovies;
