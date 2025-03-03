import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import AuthToast from "../authToast/AuthToast";
import MovieActions from "../movieActions/MovieActions";
import { motion } from "framer-motion";

const MovieCard = React.memo(
  ({
    movie,
    trailers,

    release_year,

    onPlayVideo,
    onBookmarkClick,
    handleRemoveClick,
    movies,

    contentType,
    user,
    showAuthToast,
    selected,
    showToastState,
  }) => (
    <>
      {console.log("im here")}
      <MovieActions
        movie={movie}
        contentType={contentType}
        user={user}
        movies={movies}
        selected={selected}
        showAuthToast={showAuthToast}
        handleBookmarkClick={onBookmarkClick}
        handleRemoveClick={handleRemoveClick}
      />

      <AuthToast show={showToastState} />

      <h3 className="trending__movie-title">
        {contentType === "Movie" ? movie.title : movie.name}
      </h3>
      {trailers.length > 0 ? (
        <div className="trending__movie-thumbnail-container">
          <img
            className="trending__movie-thumbnail"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                : "https://ih1.redbubble.net/image.1861329650.2941/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
            }
            alt={`${movie.title || movie.name || "Unknown"} thumbnail`}
          />

          <div
            className="trending__movie-thumbnail-overlay"
            onClick={onPlayVideo}
          >
            <span className="trending__movie-thumbnail-overlay-text">
              Play Trailer
              <FontAwesomeIcon
                className="trending__play-icon"
                icon={faPlayCircle}
                color="white"
                size="1x"
              />
            </span>
            <div className="trending__movie-thumbnail-wrapper">
              <div className="trending__movie-thumbnail-info">
                <div className="trending__thumbnail-movie-year">
                  {contentType === "Movie"
                    ? release_year
                    : movie.first_air_date
                    ? movie.first_air_date.slice(0, 4)
                    : ""}
                </div>
                <div className="trending__movie-thumbnail-dot">·</div>
                <div className="trending__movie-thumbnail-svg">
                  {contentType === "Movie" ? (
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"
                        fill="#ffffff"
                      />
                    </svg>
                  )}
                </div>
                <div className="trending__movie-thumbnail-dot">·</div>
                <div className="trending__movie-thumbnail-type">
                  {contentType === "Movie" ? "Movie" : "TV"}
                </div>
              </div>
              <div className="trending__movie-thumbnail-overlay-name">
                {contentType === "Movie" ? movie.title : movie.name}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <img
          className="trending__movie-thumbnail"
          src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
          alt={`${movie.title} thumbnail`}
          loading="lazy"
          width="342"
          height="513"
        />
      )}
    </>
  )
);
export default React.memo(MovieCard);
