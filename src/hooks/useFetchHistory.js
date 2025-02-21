import { useState, useEffect, useContext } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { AuthContext } from "../components/context/AuthContext";
import { fetchMovieById, fetchTVShowById } from "../utils/fetchTrailers";

const useFetchHistory = () => {
  const { user } = useContext(AuthContext);
  const db = getFirestore();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, "users", user.uid, "history");
        const querySnapshot = await getDocs(historyRef);
        const history = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const trailersData = await Promise.all(
          history.map(async (item) => {
            const trailer =
              item.type === "Movie"
                ? await fetchMovieById(item.id)
                : await fetchTVShowById(item.id);

            return trailer
              ? { ...trailer, type: item.type, userId: user.uid }
              : null;
          })
        );

        setHistoryData(trailersData.filter(Boolean));
      } catch (error) {
        console.error("Ошибка при получении истории:", error);
      }
    };

    fetchHistory();
  }, [user]);

  return historyData;
};

export default useFetchHistory;
