import React, { useContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../../components/context/AuthContext";

const UserComments = () => {
  const { user, setUser } = useContext(AuthContext);
  const auth = getAuth();
  const db = getFirestore();

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
  console.log(comments[0]);
  console.log("user", user);
  return (
    <div>
      UserComments
      {comments && comments.length > 0 ? (
        comments.map((element, index) => (
          <div key={index}>
            {element.comments && element.comments.length > 0 ? (
              element.comments.map((comment) =>
                user.uid === comment.userId ? (
                  <div key={comment.id}>
                    <div>Movie: {element.id}</div>
                    <div>Comment: {comment.text}</div>
                  </div>
                ) : (
                  ""
                )
              )
            ) : (
              <div>No comments available</div>
            )}
          </div>
        ))
      ) : (
        <div>Loading comments...</div>
      )}
    </div>
  );
};

export default UserComments;
