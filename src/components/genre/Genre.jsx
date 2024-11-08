import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGenre, setMoviesByGenre } from "../../redux/store";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import {
  fetchGenres,
  fetchMoviesByGenre,
  fetchTvShowsByGenre,
} from "../../utils/fetchTrailers";
import "./genre.scss";

const Genre = () => {
  const dispatch = useDispatch();
  const selectedGenre = useSelector((state) => state.data.selectedGenre);
  const currentPage = useSelector((state) => state.data.currentPage);
  const contentType = useSelector((state) => state.data.contentType);
  const { movieLoading, setMovieLoading } = useMovieTrailers();
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    dispatch(setSelectedGenre("16"));
  }, [contentType, dispatch]);
  useEffect(() => {
    const loadGenresAndMovies = async () => {
      try {
        setMovieLoading(true);
        const genresData = await fetchGenres(contentType);
        setGenres(genresData);

        let moviesData;
        if (contentType === "TV") {
          moviesData = await fetchTvShowsByGenre(
            contentType,
            selectedGenre,
            currentPage
          );
        } else {
          moviesData = await fetchMoviesByGenre(
            contentType,
            selectedGenre,
            currentPage
          );
        }

        dispatch(setMoviesByGenre(moviesData));
      } catch (error) {
        console.error("Ошибка при загрузке фильмов и жанров", error);
      } finally {
        setMovieLoading(false);
      }
    };

    loadGenresAndMovies();
  }, [selectedGenre, currentPage, contentType, dispatch, setMovieLoading]);

  return (
    <div>
      <div className="genre-filter">
        <label htmlFor="genre">Genres: </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => dispatch(setSelectedGenre(e.target.value))}
        >
          {console.log(genres)}
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
