import React, { useContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../../components/context/AuthContext";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./userComments.scss";
import { fetchMovieById, fetchTVShowById } from "../../utils/fetchTrailers";

const UserComments = () => {
  const { user, setUser } = useContext(AuthContext);
  const auth = getAuth();
  const db = getFirestore();
  const [trailers, setTrailers] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "comments"));
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    } catch (error) {
      console.error("Ошибка при получении комментариев:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const loadTrailers = async () => {
      try {
        const trailersData = await Promise.all(
          comments.map(async (item) => {
            const firstComment = item.comments?.[0];

            if (!firstComment || !firstComment.type) return null;

            return firstComment.type === "movie"
              ? fetchMovieById(item.id)
              : fetchTVShowById(item.id);
          })
        );

        setTrailers(trailersData.filter(Boolean));
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    };

    loadTrailers();
  }, [comments]);

  return (
    <>
      <div className="user__comments-header">Your Comments:</div>
      <div className="user__comments">
        {comments.length > 0 ? (
          comments
            .filter((element) =>
              element.comments.some((comment) => comment.userId === user.uid)
            )
            .map((element, index) => {
              const relatedMovie = trailers.find(
                (movie) => String(movie.id) === String(element.id)
              );

              return (
                <div key={index}>
                  <div className="user__comments-name">
                    {relatedMovie
                      ? element.comments?.[0].type === "movie"
                        ? relatedMovie.title || "No title"
                        : relatedMovie.name || "No name"
                      : "Loading..."}
                  </div>

                  {relatedMovie && (
                    <div className="user__comments-img">
                      <Link
                        to={`/${
                          element.comments?.[0].type === "movie"
                            ? "movie-info"
                            : "tv-info"
                        }/comments/${element.id}`}
                      >
                        <img
                          className="img"
                          key={relatedMovie.id}
                          src={`https://image.tmdb.org/t/p/w780${relatedMovie.poster_path}`}
                          alt={
                            relatedMovie.title ||
                            relatedMovie.name ||
                            "No title"
                          }
                        />
                      </Link>
                    </div>
                  )}

                  {element.comments && element.comments.length > 0
                    ? element.comments
                        .slice(0, 3)
                        .filter((comment) => user.uid === comment.userId)
                        .map((comment) => (
                          <div key={comment.id}>
                            <Link
                              to={`/${
                                comment.type === "movie"
                                  ? "movie-info"
                                  : "tv-info"
                              }/comments/${element.id}`}
                            >
                              <div className="user__comments-comment">
                                Comment:{" "}
                                {comment.text.length > 40
                                  ? comment.text.slice(0, 90) + "..."
                                  : comment.text}
                              </div>
                            </Link>
                          </div>
                        ))
                    : null}
                </div>
              );
            })
        ) : (
          <div>Loading comments...</div>
        )}
      </div>
    </>
  );
};

export default UserComments;
