import React, { useContext, useEffect, useState } from "react";
import HistoryCard from "./HistoryCard";
import "./history.scss";
import { AuthContext } from "../../components/context/AuthContext";
import { removeMovieFromHistory } from "../../utils/firestoreUtils";

const HistoryList = ({
  history,
  setHistory,
  historyData,
  handlePlayTrailer,
  showAuthToast,
}) => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setHistory(historyData);
  }, [historyData]);

  return (
    <>
      {history.length > 0 ? (
        history.map((movie, index) => (
          <HistoryCard
            key={movie.id}
            movie={movie}
            index={index}
            handlePlayTrailer={handlePlayTrailer}
            removeMovieFromHistory={removeMovieFromHistory}
            showAuthToast={showAuthToast}
            user={user.uid}
          />
        ))
      ) : (
        <div>There is nothing yet.</div>
      )}
    </>
  );
};

export default HistoryList;
