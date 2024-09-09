import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция для получения закладок
  const fetchBookmarks = async (userId) => {
    try {
      // Получаем коллекцию закладок для конкретного пользователя
      const bookmarksCollection = collection(db, `bookmarks/${userId}/movies`);
      const bookmarksSnapshot = await getDocs(bookmarksCollection);

      // Преобразуем документы в массив данных
      const bookmarksList = bookmarksSnapshot.docs.map((doc) => ({
        id: doc.id, // сохраняем ID документа
        ...doc.data(), // извлекаем данные документа
      }));

      setBookmarks(bookmarksList);
    } catch (error) {
      console.error("Ошибка при получении закладок: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Отслеживаем состояние аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Пользователь аутентифицирован, загружаем его закладки
        fetchBookmarks(user.uid);
      } else {
        console.error("Пользователь не аутентифицирован");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Закладки</h1>
      <ul>
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <h2>Документ ID: {bookmark.id}</h2>
              <pre>{JSON.stringify(bookmark.movies, null, 2)}</pre>{" "}
              {/* Простой вывод массива */}
            </li>
          ))
        ) : (
          <p>Нет закладок</p>
        )}
      </ul>
    </div>
  );
};

export default Bookmarks;
