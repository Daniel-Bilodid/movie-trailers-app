import React, { useState, useEffect, useContext, useMemo } from "react";
import { db } from "../../firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../components/context/AuthContext";
const StarRating = ({ movieId, userId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [ratings, setRatings] = useState([]);
  const { user } = useContext(AuthContext);

  const averageRating = useMemo(() => {
    console.log("ratings changed", ratings);
    if (ratings.length > 0) {
      return (
        ratings.reduce((total, current) => total + current.rating, 0) /
        ratings.length
      );
    }
  }, [ratings]);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!movieId) {
        console.error("Movie ID is missing.");
        return;
      }

      const docRef = doc(db, "ratings", movieId);
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRatings(data.ratings || []);
        } else {
          console.log("No ratings found for this movie.");
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, [movieId]);

  const saveRating = async (selectedRating) => {
    if (!userId || !movieId) {
      console.error("User ID or Movie ID is missing.");
      return;
    }

    const docRef = doc(db, "ratings", movieId);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingRatings = docSnap.data().ratings || [];
        const userRatingIndex = existingRatings.findIndex(
          (rating) => rating.userId === userId
        );

        if (userRatingIndex !== -1) {
          existingRatings[userRatingIndex].rating = selectedRating;

          await updateDoc(docRef, {
            ratings: existingRatings,
          });
        } else {
          await updateDoc(docRef, {
            ratings: [...existingRatings, { userId, rating: selectedRating }],
          });
        }
      } else {
        await setDoc(docRef, {
          ratings: [{ userId, rating: selectedRating }],
        });
      }

      // Обновить локальное состояние после сохранения
      const updatedDocSnap = await getDoc(docRef);
      if (updatedDocSnap.exists()) {
        setRatings(updatedDocSnap.data().ratings || []);
      }
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  const handleClick = async (selectedRating) => {
    setRating(selectedRating);
    await saveRating(selectedRating);
  };

  useEffect(() => {
    setRating(averageRating);
  }, [averageRating]);

  return (
    <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;

        return (
          <span
            key={index}
            style={{
              fontSize: "24px",
              color: starValue <= (hover || rating) ? "#FFD700" : "#CCCCCC",
            }}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
      <ul>{averageRating}</ul>
    </div>
  );
};

export default StarRating;
