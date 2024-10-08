import React from "react";
import { fetchUpcomingMovies } from "../../../utils/fetchTrailers";
import MovieList from "../../movieList/MovieList";
import { useSelector } from "react-redux";

const UpcomingMovies = () => {
  const contentType = useSelector((state) => state.data.contentType);

  return (
    <MovieList
      fetchMovies={fetchUpcomingMovies}
      title={contentType === "Movie" ? "Upcoming Movies" : "Airing Today"}
      moreLink="/more-upcoming"
    />
  );
};

export default UpcomingMovies;
