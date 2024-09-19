// MovieCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faBookmark } from "@fortawesome/free-solid-svg-icons";

const MovieCard = ({
  movie,
  release_year,
  handleBookmarkClick,
  handlePlayVideo,
  index,
}) => (
  <div key={movie.id}>
    <div className="trending__btn-wrapper">
      <Link className="trending__info" to={`/movie-info/${movie.id}`}>
        <FontAwesomeIcon icon={faInfoCircle} color="white" size="1x" />
      </Link>
      <div
        className="trending__bookmark"
        onClick={() => handleBookmarkClick(movie.id)}
      >
        <FontAwesomeIcon icon={faBookmark} color="white" size="1x" />
      </div>
    </div>
    <h3 className="trending__movie-title">{movie.title}</h3>
    <div
      className="trending__movie-thumbnail-container"
      onClick={() => handlePlayVideo(index)}
    >
      <img
        className="trending__movie-thumbnail"
        src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
        alt={`${movie.title} thumbnail`}
      />
      <div className="trending__movie-thumbnail-overlay">
        <span className="trending__movie-thumbnail-overlay-text">
          Play Trailer
        </span>
        <div className="trending__movie-thumbnail-info">
          <div className="trending__thumbnail-movie-year">{release_year}</div>
          <div className="trending__movie-thumbnail-type">Movie</div>
        </div>
      </div>
    </div>
  </div>
);

export default MovieCard;
