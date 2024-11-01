import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGenre } from "../../redux/store";
import { setMoviesByGenre } from "../../redux/store";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import {
  fetchMoviesWithGenres,
  fetchGenres,
  fetchMoviesByGenre,
  fetchTvShowsByGenre,
} from "../../utils/fetchTrailers";
import "./genre.scss";

const Genre = () => {
  const dispatch = useDispatch();
  const selectedGenre = useSelector((state) => state.data.selectedGenre);
  const currentPage = useSelector((state) => state.data.currentPage);
  const [genres, setGenres] = useState([]);
  const contentType = useSelector((state) => state.data.contentType);
  const { movieLoading, setMovieLoading } = useMovieTrailers();
  useEffect(() => {
    const loadMoviesAndGenres = async () => {
      try {
        setMovieLoading(true);
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

        const genresData = await fetchGenres(contentType);

        dispatch(setMoviesByGenre(moviesData));

        setGenres(genresData);
      } catch (error) {
        console.error("Ошибка при загрузке фильмов и жанров", error);
      } finally {
        setMovieLoading(false);
      }
    };

    loadMoviesAndGenres();
  }, [selectedGenre, dispatch, currentPage, contentType, setMovieLoading]);
  if (movieLoading) {
    return (
      <div className="loading__genre">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          width="200"
          height="200"
          style={{
            shapeRendering: "auto",
            display: "block",
            background: "rgba(255, 255, 255, 0)",
          }}
        >
          <g>
            <circle
              strokeDasharray="164.93361431346415 56.97787143782138"
              r="35"
              strokeWidth="10"
              stroke="#5a698f"
              fill="none"
              cy="50"
              cx="50"
            >
              <animateTransform
                keyTimes="0;1"
                values="0 50 50;360 50 50"
                dur="1s"
                repeatCount="indefinite"
                type="rotate"
                attributeName="transform"
              />
            </circle>
          </g>
        </svg>
      </div>
    );
  }

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
