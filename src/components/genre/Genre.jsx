import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGenre } from "../../redux/store";
import {
  fetchMoviesWithGenres,
  fetchGenres,
  fetchMoviesByGenre,
} from "../../utils/fetchTrailers";
import "./genre.scss";

const Genre = () => {
  const dispatch = useDispatch();
  const selectedGenre = useSelector((state) => state.data.selectedGenre);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadMoviesAndGenres = async () => {
      try {
        const moviesData = await fetchMoviesByGenre();
        const genresData = await fetchGenres();
        setMovies(moviesData);
        setGenres(genresData);
      } catch (error) {
        console.error("Ошибка при загрузке фильмов и жанров", error);
      }
    };

    loadMoviesAndGenres();
  }, []);

  return (
    <div>
      <div className="genre-filter">
        <label htmlFor="genre">Genres: </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => dispatch(setSelectedGenre(e.target.value))}
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Genre;
