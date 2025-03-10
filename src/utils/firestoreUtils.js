// firestoreUtils.js
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

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
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { comments: [comment] });
    } else {
      await updateDoc(docRef, {
        comments: arrayUnion(comment),
      });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

export const addHistory = async (userId, movieId, title, type) => {
  try {
    const movieRef = doc(db, "users", userId, "history", movieId);
    console.log("Adding to history:", {
      userId,
      movieId,
      title,
      type,
    });

    const docSnap = await getDoc(movieRef);
    if (!docSnap.exists()) {
      await setDoc(movieRef, { title, type, timestamp: new Date() });
    } else {
      await updateDoc(movieRef, { type, timestamp: new Date() });
    }

    console.log("Movie added to history:", movieId, "Type:", type);
  } catch (error) {
    console.error("Error adding movie to history:", error);
  }
};
export const removeMovieFromHistory = async (userId, movieId) => {
  try {
    console.log("UserID:", userId, "MovieID:", movieId);
    const movieRef = doc(db, `users/${userId}/history/${movieId}`);
    await deleteDoc(movieRef);
    console.log("Movie removed successfully");
  } catch (error) {
    console.error("Error removing movie: ", error);
  }
};
