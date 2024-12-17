import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./comments.scss";
const Comments = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const location = useLocation();
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

        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [movieId, type]);
  return (
    <div className="comments">
      <div className="comments__wrapper">
        {movie ? movie.original_title : "error"}
        <img
          className="movie__info-img"
          src={
            movie
              ? movie.poster_path
                ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                : "https://ih1.redbubble.net/image.1861329650.2941/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
              : ""
          }
          alt={`${movie ? movie.title : "" || "Default"} thumbnail`}
        />
        stars
      </div>
      <div className="comments__body">
        <div className="comments__list">
          Comments (0)
          <div className="comments__list-item">
            <div className="comments__user-wrapper">
              <div className="comments__user-name">Silco</div>
              <div className="comments__user-avatar">
                <img src="" alt="" />
              </div>
            </div>
            <div className="comments__user-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
              soluta necessitatibus officia quae quas, voluptatem modi accusamus
              iure explicabo eius quasi inventore, aspernatur voluptas nostrum
              placeat fugiat, ipsam cupiditate laborum? Voluptates dicta aliquid
              porro praesentium placeat nam rerum suscipit facere ea vero fugiat
              quaerat modi vel expedita sapiente est itaque non, veniam impedit
              excepturi consectetur veritatis? Non perferendis libero eius.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
