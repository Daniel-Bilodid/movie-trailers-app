// src/components/HistoryCard.js
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MovieActions from "../../components/movieActions/MovieActions";
import { faPlayCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

const HistoryCard = ({
  movie,
  index,
  handlePlayTrailer,
  user,
  movies,
  handleRemove,
  selected,
  showAuthToast,
  removeMovieFromHistory,
}) => {
  const handleRemoveClick = (movieId) => {
    if (user) {
      removeMovieFromHistory(user, movieId);
    } else {
      showAuthToast();
    }
  };

  return (
    <div className="history__card">
      <MovieActions
        movie={movie}
        contentType={movie.type}
        user={user}
        movies={movies}
        selected={selected}
        handleRemoveClick={(movieId) => handleRemoveClick(movieId)}
        showAuthToast={showAuthToast}
      />

      <div className="history__card-title">
        {movie.type === "Movie" ? movie.title : movie.name}
      </div>

      <div className="trending__movie-thumbnail-container">
        <img
          className="img"
          src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
          alt={movie.title || movie.name || "No title"}
        />

        <div className="trending__movie-thumbnail-overlay">
          <span
            className="trending__movie-thumbnail-overlay-text"
            onClick={() => handlePlayTrailer(index)}
          >
            Play Trailer
            <FontAwesomeIcon icon={faPlayCircle} color="white" size="1x" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
