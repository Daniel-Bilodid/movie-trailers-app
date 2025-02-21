import React, { useState } from "react";
import useFetchHistory from "../../hooks/useFetchHistory";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import HistoryList from "./HistoryList";
import ModalMovie from "../../components/modalMovie/ModalMovie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showAuthToast } from "../../utils/showAuthToast";
import "./history.scss";

const History = () => {
  const historyData = useFetchHistory();

  const {
    playVideo,
    setPlayVideo,
    handleCloseModal,
    handleNextMovie,
    handlePrevMovie,
  } = useMovieTrailers();

  const handlePlayTrailer = (index) => {
    setPlayVideo(index);
  };

  return (
    <div className="history">
      <ToastContainer />

      <div className="history__title">Your History:</div>
      <div className="history__wrapper">
        <HistoryList
          historyData={historyData}
          handlePlayTrailer={handlePlayTrailer}
          showAuthToast={showAuthToast}
        />
        <ModalMovie
          isOpen={playVideo !== null}
          onClose={handleCloseModal}
          playVideo={playVideo}
          trailers={historyData}
          handlePrevMovie={handlePrevMovie}
          handleNextMovie={handleNextMovie}
        />
      </div>
    </div>
  );
};

export default History;
