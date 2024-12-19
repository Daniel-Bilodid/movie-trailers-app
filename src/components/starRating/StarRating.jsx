import React, { useState } from "react";
import { db } from "../../firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

const StarRating = ({ movieId, userId }) => {
  const [rating, setRating] = useState(0); // Текущее количество звезд
  const [hover, setHover] = useState(0); // Количество звезд при наведении

  // Функция для сохранения рейтинга в Firestore
  const saveRating = async (selectedRating) => {
    if (!userId || !movieId) {
      console.error("User ID or Movie ID is missing.");
      return;
    }

    const docRef = doc(db, "ratings", movieId);
    try {
      // Проверяем, существует ли документ
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Обновляем массив рейтингов
        await updateDoc(docRef, {
          ratings: [
            ...docSnap.data().ratings,
            { userId, rating: selectedRating },
          ],
        });
      } else {
        // Создаем новый документ
        await setDoc(docRef, {
          ratings: [{ userId, rating: selectedRating }],
        });
      }
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  // Обработка клика на звезду
  const handleClick = async (selectedRating) => {
    setRating(selectedRating);
    await saveRating(selectedRating);

    console.log("rating", rating);
  };

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
    </div>
  );
};

export default StarRating;
