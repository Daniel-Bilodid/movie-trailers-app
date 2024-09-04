import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Убедитесь, что пути правильные

import { getDocs, collection } from "firebase/firestore";
const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // Получаем коллекцию bookmarks
        const bookmarksCollection = collection(db, "bookmarks");
        const bookmarksSnapshot = await getDocs(bookmarksCollection);
        // Преобразуем документы в массив данных
        const bookmarksList = bookmarksSnapshot.docs.map((doc) => doc.data());
        setBookmarks(bookmarksList);
      } catch (error) {
        console.error("Error fetching bookmarks: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus, possimus
      ullam in doloremque assumenda eaque veniam quisquam accusamus culpa
      delectus officiis laborum quis neque distinctio odio ratione perspiciatis
      deleniti quibusdam!
      <h1>Bookmarks</h1>
      <ul>
        {bookmarks.map((bookmark, index) => (
          <li key={index}>{bookmark.movies}</li>
        ))}
      </ul>
    </div>
  );
};

export default Bookmarks;
