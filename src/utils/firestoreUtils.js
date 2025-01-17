// firestoreUtils.js
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

/**

 * @param {string} movieId
 * @param {object} comment
 */

export const fetchCommentsAndRating = async (movieId) => {
  const docRef = doc(db, "comments", movieId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return { comments: [], averageRating: 0, totalRatings: 0 };
    }
  } catch (error) {
    console.error("Error fetching comments and rating:", error);
    return { comments: [], averageRating: 0, totalRatings: 0 };
  }
};
export const addComment = async (movieId, comment) => {
  const docRef = doc(db, "comments", movieId);

  try {
    // Создаем документ с пустым массивом, если он не существует
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { comments: [comment] });
    } else {
      // Если документ существует, добавляем комментарий
      await updateDoc(docRef, {
        comments: arrayUnion(comment),
      });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};
