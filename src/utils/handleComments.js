import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { addComment } from "../utils/firestoreUtils";

export const handleAddComment = async (
  newComment,
  setComments,
  setNewComment,
  user,
  movieId,
  type
) => {
  if (!newComment.trim()) return;

  const comment = {
    id: crypto.randomUUID(),
    userId: user.uid ? user.uid : "",
    userName: user.displayName,
    userPhoto: user.photoURL,
    text: newComment,
    date: new Date().toISOString(),
    type: type,
  };

  await addComment(movieId, comment);

  setComments((prev) => [...prev, comment]);
  setNewComment("");
};

export async function deleteComments(
  movieId,
  commentId,
  setConfirmation,
  confirmation,
  setComments
) {
  setConfirmation((prev) => !prev);
  if (confirmation) {
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
}
