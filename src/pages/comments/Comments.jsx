import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import {
  createMovieDocIfNotExists,
  fetchCommentsAndRating,
  addComment,
} from "../../utils/firestoreUtils";
import "./comments.scss";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarRating from "../../components/starRating/StarRating";
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
const Comments = () => {
  const { movieId } = useParams();
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [movie, setMovie] = useState(null);

  const location = useLocation();
  const type = location.pathname.includes("movie-info") ? "movie" : "tv";
  console.log(user);
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      id: crypto.randomUUID(),
      userId: user.uid ? user.uid : "",
      userName: user.displayName,
      userPhoto: user.photoURL,
      text: newComment,
      date: new Date().toISOString(),
    };

    await addComment(movieId, comment);

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  async function deleteComments(movieId, commentId) {
    try {
      const docRef = doc(db, "comments", movieId);

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error(`Document with movieId ${movieId} does not exist.`);
        return;
      }

      const data = docSnap.data();
      const comments = data.comments || [];

      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );

      await updateDoc(docRef, { comments: updatedComments });

      console.log(`Comment with ID ${commentId} successfully deleted.`);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error while deleting comment:", error);
    }
  }

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
              <li key={index} className="comments__list-item">
                <div className="comments__user-wrapper">
                  <div className="comments__user-avatar">
                    <img src={comment.userPhoto} alt="smth" />
                  </div>
                  <div className="comments__user-name">{comment.userName}</div>

                  <div className="comment__user-date">
                    {new Date(comment.date).toLocaleDateString()}
                    {user && comment.userId === user.uid ? (
                      <FontAwesomeIcon
                        className="comments__icon"
                        icon={faTrash}
                        onClick={() => deleteComments(movieId, comment.id)}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="comments__user-text">{comment.text}</div>
              </li>
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
        <button onClick={user ? handleAddComment : null}>Add comment</button>
      </div>
    </>
  );
};

export default Comments;
