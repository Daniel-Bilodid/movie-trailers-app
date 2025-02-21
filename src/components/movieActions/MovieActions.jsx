// src/components/MovieActions.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faComment,
  faBookmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const MovieActions = ({
  movie,
  contentType,
  user,
  movies,
  handleBookmarkClick,
  handleRemoveClick,
  selected,
  showAuthToast,
}) => {
  return (
    <div className="trending__btn-wrapper">
      <Link
        className="trending__info"
        to={`/${contentType === "Movie" ? "movie-info" : "tv-info"}/${
          movie.id
        }`}
      >
        <FontAwesomeIcon icon={faInfoCircle} color="white" size="1x" />
      </Link>
      <Link
        className="movie__info-comments"
        to={`/${contentType === "Movie" ? "movie-info" : "tv-info"}/comments/${
          movie.id
        }`}
      >
        <FontAwesomeIcon icon={faComment} color="white" size="1x" />
      </Link>
      <div
        className="trending__bookmark"
        onClick={() => {
          if (user) {
            handleBookmarkClick(movie.id);
            selected(movie.id);
          } else {
            showAuthToast();
          }
        }}
      >
        {handleBookmarkClick ? (
          <FontAwesomeIcon
            icon={faBookmark}
            color={
              user &&
              Array.isArray(movies) &&
              movies.some((m) => m.id === movie.id)
                ? "yellow"
                : "white"
            }
            size="1x"
          />
        ) : (
          ""
        )}
      </div>

      {handleRemoveClick ? (
        <div
          className="trending__bookmark"
          onClick={() => handleRemoveClick(movie.id)}
        >
          <FontAwesomeIcon icon={faXmark} color="white" size="1x" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MovieActions;
