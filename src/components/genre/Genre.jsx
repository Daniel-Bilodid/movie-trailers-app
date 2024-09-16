import React, { useEffect, useState } from "react";
import "./genre.scss";
import { fetchMoviesWithGenres, fetchGenres } from "../../utils/fetchTrailers";

const Genre = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const loadMoviesAndGenres = async () => {
      try {
        const moviesData = await fetchMoviesWithGenres();
        const genresData = await fetchGenres();
        setMovies(moviesData);
        setGenres(genresData);
      } catch (error) {
        console.error("Ошибка при загрузке фильмов и жанров", error);
      }
    };

    loadMoviesAndGenres();
  }, []);

  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genres.includes(selectedGenre))
    : movies;

  return (
    <div>
      <div className="genre-filter">
        <label htmlFor="genre">Genres: </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Genre;
