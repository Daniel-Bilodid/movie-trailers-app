import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { fetchMovieById, fetchTVShowById } from "../../utils/fetchTrailers";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const History = () => {
  const { user } = useContext(AuthContext);
  const db = getFirestore();
  const [history, setHistory] = useState([]);
  const [trailers, setTrailers] = useState([]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      const historyRef = collection(db, "users", user.uid, "history");
      const querySnapshot = await getDocs(historyRef);
      const fetchedHistory = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        userId: user.uid,
      }));
      setHistory(fetchedHistory);
    } catch (error) {
      console.error("Ошибка при получении истории:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);
  console.log("historyyy", history);
  useEffect(() => {
    const loadTrailers = async () => {
      if (!history.length) return;
      try {
        const trailersData = await Promise.all(
          history.map(async (item) => {
            return item.type === "Movie"
              ? fetchMovieById(item.id)
              : fetchTVShowById(item.id);
          })
        );
        setTrailers(trailersData.filter(Boolean));
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    };
    loadTrailers();
  }, [history]);
  console.log("traileers", trailers);
  return (
    <div className="history">
      <div className="history__title">Your History:</div>

      {trailers.length > 0
        ? trailers.map((item, index) =>
            item.id.toString() === history[index].id.toString() &&
            history[index].userId === user.uid ? (
              <>
                <div className="history__wrapper">
                  <div className="history__card">
                    <div className="history__card-title">{item.title}</div>

                    <img
                      className="img"
                      key={item.id}
                      src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
                      alt={item.title || item.name || "No title"}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>Ni</div>
              </>
            )
          )
        : ""}
    </div>
  );
};

export default History;
