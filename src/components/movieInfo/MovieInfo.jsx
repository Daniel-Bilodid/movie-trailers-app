import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import "./movieInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

const fetchMovieById = async (id) => {
  try {
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&append_to_response=videos`
    );
    const movie = movieResponse.data;
    return movie;
  } catch (error) {
    console.error(
      `Ошибка при получении фильма с ID ${id}:`,
      error.response ? error.response.data : error
    );
    throw error;
  }
};

const MovieInfo = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const location = useLocation();
  const [localMovies, setLocalMovies] = useState([]);
  const [playVideo, setPlayVideo] = useState(null);
  const contentType = useSelector((state) => state.data.contentType);

  const type = location.pathname.includes("movie-info") ? "movie" : "tv";

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieResponse, castResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&language=en-US`
          ),
          fetch(
            `https://api.themoviedb.org/3/${type}/${movieId}/credits?api_key=${process.env.REACT_APP_TMDB_APIKEY}&language=en-US`
          ),
        ]);

        const movieData = await movieResponse.json();
        const castData = await castResponse.json();

        setMovie(movieData);
        setCast(castData.cast.slice(0, 8));
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [movieId, type]);

  const handlePlayTrailer = async (id) => {
    try {
      let selectedMovie = localMovies.find((movie) => movie.id === id);

      if (!selectedMovie) {
        const fetchedMovie = await fetchMovieById(id);
        selectedMovie = {
          ...fetchedMovie,
          currentTrailerIndex: 0,
        };

        setLocalMovies((prevMovies) => [...prevMovies, selectedMovie]);
      }

      setPlayVideo(localMovies.findIndex((movie) => movie.id === id));
    } catch (error) {
      console.error("Ошибка при воспроизведении трейлера:", error);
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie__info">
      <div className="movie__info-title-wrapper">
        <img
          className="movie__info-img"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
              : "https://ih1.redbubble.net/image.1861329650.2941/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
          }
          alt={`${movie.title || "Default"} thumbnail`}
          onClick={() => handlePlayTrailer(movie.id)}
        />
      </div>
      <div className="movie__info-wrapper">
        <h1 className="movie__info-title">{movie.title}</h1>
        <div className="movie__info-rating adaptive">
          Rating <br />
          <div className="movie__info-rating-wrapper">
            <FontAwesomeIcon icon={faStar} size="2x" color="gold" />
            <span>{movie.vote_average}</span>/10
          </div>
        </div>
        <div className="movie__info-genres">
          <span>Genres:</span>{" "}
          {movie.genres.map((genre) => genre.name).join(", ")}
        </div>
        <div className="movie__info-tagline">
          <span>Tagline:</span> {movie.tagline}
        </div>
        <div className="movie__info-overview">
          <span>Overview:</span>
          <div className="movie__info-overview-text">{movie.overview}</div>
        </div>
        <div className="movie__info-cast">
          <span>Cast:</span>
          <ul>
            {cast.map((member) => (
              <li key={member.cast_id}>{member.name}</li>
            ))}
          </ul>
        </div>
        <div className="movie__info-footer">
          <div className="movie__info-runtime">
            <span>Runtime:</span> {movie.runtime} minutes
          </div>
          <div className="movie__info-language">
            <span>Language:</span> {movie.spoken_languages[0]?.name}
          </div>
          <div className="movie__info-release">
            <span>Release date:</span> {movie.release_date}
          </div>
          <div className="movie__info-status">
            <span>Status:</span> {movie.status}
          </div>
        </div>
        <div className="movie__info-websites">
          {movie.imdb_id && (
            <a href={`https://www.imdb.com/title/${movie.imdb_id}/`}>
              <button className="movie__info-homepage">IMDb</button>
            </a>
          )}
          {movie.homepage && (
            <a href={movie.homepage}>
              <button className="movie__info-homepage">Website</button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
