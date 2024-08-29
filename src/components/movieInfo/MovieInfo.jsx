import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./movieInfo.scss";

const MovieInfo = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  useEffect(() => {
    // Здесь вы можете использовать movieId для получения данных о фильме
    const fetchMovieInfo = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&language=en-US`
        );
        const data = await response.json();
        console.log(data);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie info:", error);
      }
    };

    const fetchMovieCast = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.REACT_APP_TMDB_APIKEY}&language=en-US`
        );
        const data = await response.json();
        console.log(data);
        setCast(data.cast.slice(0, 8));
      } catch (error) {
        console.error("Error fetching movie cast:", error);
      }
    };

    fetchMovieInfo();
    fetchMovieCast();
  }, [movieId]);

  return (
    <div className="movie__info">
      {movie ? (
        <>
          <h1 className="movie__info-title">{movie.title}</h1>
          <img
            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            alt={`${movie.title} thumbnail`}
          />
          <div className="movie__info-genres">
            Genres: {movie.genres.map((genre) => genre.name).join(",")}
          </div>
          <div className="movie__info-tagline">Tagline: {movie.tagline}</div>
          <div className="movie__info-overview">
            Overview:
            <br />
            {movie.overview}
          </div>

          <div className="movie__info-cast">
            <ul>
              {cast.map((member) => (
                <li key={member.cast_id}>{member.name}</li>
              ))}
            </ul>
          </div>

          <div className="movie__info-runtime">
            Runtime: {movie.runtime} minutes
          </div>
          <div className="movie__info-language">
            Language: {movie.spoken_languages[0]?.name}
          </div>

          <div className="movie__info-release">
            Release date: {movie.release_date}
          </div>

          <div className="movie__info-status">Status: {movie.status}</div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MovieInfo;
