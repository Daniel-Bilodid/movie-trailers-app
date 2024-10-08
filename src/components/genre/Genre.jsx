import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGenre } from "../../redux/store";
import { setMoviesByGenre } from "../../redux/store";
import {
  fetchMoviesWithGenres,
  fetchGenres,
  fetchMoviesByGenre,
} from "../../utils/fetchTrailers";
import "./genre.scss";

const Genre = () => {
  const dispatch = useDispatch();
  const selectedGenre = useSelector((state) => state.data.selectedGenre);
  const currentPage = useSelector((state) => state.data.currentPage);
  const [genres, setGenres] = useState([]);
  const contentType = useSelector((state) => state.data.contentType);

  useEffect(() => {
    const loadMoviesAndGenres = async () => {
      try {
        const moviesData = await fetchMoviesByGenre(
          contentType,
          selectedGenre,
          currentPage
        );

        const genresData = await fetchGenres(contentType);

        dispatch(setMoviesByGenre(moviesData));
        console.log(moviesData);
        setGenres(genresData);
      } catch (error) {
        console.error("Ошибка при загрузке фильмов и жанров", error);
      }
    };

    loadMoviesAndGenres();
  }, [selectedGenre, dispatch, currentPage, contentType]);

  console.log(genres);
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
