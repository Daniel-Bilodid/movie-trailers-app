import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { fetchCommentsAndRating, addComment } from "../../utils/firestoreUtils";
import "./comments.scss";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarRating from "../../components/starRating/StarRating";
import { handleAddComment, deleteComments } from "../../utils/handleComments";
const Comments = () => {
  const { movieId } = useParams();
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [confirmation, setConfirmation] = useState(false);

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

  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchCommentsAndRating(movieId);
      console.log("comments data", data);
      setComments(data.comments);
    };

    if (movieId) {
      loadComments();
    }
  }, [movieId]);

  return (
    <>
      <div className="comments">
        <div className="comments__wrapper">
          <div className="comments__title">
            {movie
              ? movie.original_title
                ? movie.original_title
                : movie.name
              : "movie"}
          </div>
          <img
            className="comments__info-img"
            src={
              movie
                ? movie.poster_path
                  ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                  : "https://ih1.redbubble.net/image.1861329650.2941/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                : ""
            }
            alt={`${movie ? movie.title : "" || "Default"} thumbnail`}
          />
          <StarRating userId={user ? user.uid : ""} movieId={movieId} />
        </div>
        <div className="comments__body">
          <div className="comments__list">
            <span className="comments__count">
              Comments ({comments.length})
            </span>

            {comments.map((comment, index) => (
              <>
                <li key={index} className="comments__list-item">
                  <div className="comments__user-wrapper">
                    <div className="comments__user-avatar">
                      <img src={comment.userPhoto} alt="user_profile_photo" />
                    </div>
                    <div className="comments__user-name">
                      {comment.userName}
                    </div>

                    <div className="comment__user-date">
                      {new Date(comment.date).toLocaleDateString()}
                      {user && comment.userId === user.uid ? (
                        <FontAwesomeIcon
                          className="comments__icon"
                          icon={faTrash}
                          onClick={() =>
                            deleteComments(
                              movieId,
                              comment.id,
                              setConfirmation,
                              confirmation,
                              setComments
                            )
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="comments__user-text">{comment.text}</div>
                </li>
                <div
                  className={
                    confirmation
                      ? "comments__confirmation popup-btn"
                      : "comments__confirmation"
                  }
                >
                  <div className="comments__confirmation-text">
                    Delete your comment?
                  </div>

                  <div className="comments__confirmation-wrapper">
                    <button
                      className="comments__confirmation-btn"
                      onClick={() =>
                        deleteComments(
                          movieId,
                          comment.id,
                          setConfirmation,
                          confirmation,
                          setComments
                        )
                      }
                    >
                      Delete
                    </button>
                    <button
                      className="comments__confirmation-btn"
                      onClick={() => setConfirmation((prev) => !prev)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
      <div className="comments__input">
        <input
          type="text"
          value={newComment}
          placeholder="Leave your comment here"
          onChange={(e) => setNewComment(e.target.value)}
        />
      </div>
      <div className="comments__btn">
        <button
          onClick={
            user
              ? () =>
                  handleAddComment(
                    newComment,
                    setComments,
                    setNewComment,
                    user,
                    movieId,
                    type
                  )
              : null
          }
        >
          Add comment
        </button>
      </div>
    </>
  );
};

export default Comments;
