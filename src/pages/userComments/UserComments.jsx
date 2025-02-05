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
          comments.map((item) => {
            const firstComment = item.comments?.[0];

            if (!fetchComments) return null;

            return firstComment.type === "movie"
              ? fetchMovieById(item.id)
              : fetchTVShowById(item.id);
          })
        );

        setTrailers(trailersData);
        console.log("comments", comments);
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    };

    loadTrailers();
  }, [comments]);

  return (
    <>
      <div>Your Comments:</div>
      <div className="user__comments">
        {comments && comments.length > 0 ? (
          comments.map((element, index) => (
            <div key={index}>
              {element.comments && element.comments.length > 0
                ? element.comments.map((comment) =>
                    user.uid === comment.userId ? (
                      <div key={comment.id}>
                        <Link
                          to={`/${
                            comment.type === "movie" ? "movie-info" : "tv-info"
                          }/comments/${element.id}`}
                        >
                          {trailers.map((movie, i) => (
                            <div>
                              {String(movie.id) === String(element.id) ? (
                                <div>
                                  {movie.title}
                                  <img
                                    className="img"
                                    key={movie.id}
                                    src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </Link>
                        <div>Comment: {comment.text}</div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : null}
            </div>
          ))
        ) : (
          <div>Loading comments...</div>
        )}
      </div>
    </>
  );
};

export default UserComments;
