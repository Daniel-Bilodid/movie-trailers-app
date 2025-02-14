import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { fetchMovieById, fetchTVShowById } from "../../utils/fetchTrailers";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import "./history.scss";

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

  useEffect(() => {
    const loadTrailers = async () => {
      if (!history.length) return;
      try {
        const trailersData = await Promise.all(
          history.map(async (item) => {
            const trailer =
              item.type === "Movie"
                ? await fetchMovieById(item.id)
                : await fetchTVShowById(item.id);

            return trailer ? { ...trailer, type: item.type } : null;
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

      <div className="history__wrapper">
        {trailers.length > 0 ? (
          trailers.map((item, index) =>
            item.id.toString() === history[index].id.toString() &&
            history[index].userId === user.uid ? (
              <>
                <div className="history__card-wrapper">
                  <div className="history__card">
                    <div className="history__card-title">
                      {item.type === "Movie" ? item.title : item.name}

                      {console.log("item", item)}
                    </div>

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
              <></>
            )
          )
        ) : (
          <>
            <div>There is nothing yet.</div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
