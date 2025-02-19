import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { fetchMovieById, fetchTVShowById } from "../../utils/fetchTrailers";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faXmark,
  faPlayCircle,
  faComment,
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import useMovieTrailers from "../../hooks/useMovieTrailers";
import { Link } from "react-router-dom";
import Modal from "../../components/movieModal/MovieModal";
import "./history.scss";

const History = () => {
  const { user } = useContext(AuthContext);
  const db = getFirestore();
  const [history, setHistory] = useState([]);
  const [trailers, setTrailers] = useState([]);

  const {
    playVideo,
    setPlayVideo,
    handlePlayVideo,
    handleCloseModal,
    handleBookmarkClick,
  } = useMovieTrailers();

  const handlePlayTrailer = (index) => {
    setPlayVideo(index);
  };

  const handleNextMovie = (index) => {
    setTrailers((prevMovies) => {
      const updatedMovies = [...prevMovies];
      const currentMovie = updatedMovies[index];

      if (currentMovie.videos && currentMovie.videos.results.length > 0) {
        const nextIndex =
          (currentMovie.currentTrailerIndex + 1) %
          currentMovie.videos.results.length;

        updatedMovies[index] = {
          ...currentMovie,
          currentTrailerIndex: nextIndex,
        };
      }

      return updatedMovies;
    });
  };

  const handlePrevMovie = (index) => {
    setTrailers((prevMovies) => {
      const updatedMovies = [...prevMovies];
      const currentMovie = updatedMovies[index];

      if (currentMovie.videos && currentMovie.videos.results.length > 0) {
        const prevIndex =
          (currentMovie.currentTrailerIndex -
            1 +
            currentMovie.videos.results.length) %
          currentMovie.videos.results.length;

        updatedMovies[index] = {
          ...currentMovie,
          currentTrailerIndex: prevIndex,
        };
      }

      return updatedMovies;
    });
  };

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
          trailers.map((movie, index) =>
            movie.id.toString() === history[index].id.toString() &&
            history[index].userId === user.uid ? (
              <div key={movie.id}>
                <div className="trending__btn-wrapper">
                  <Link
                    className="trending__info"
                    to={`/${
                      movie.type === "Movie" ? "movie-info" : "tv-info"
                    }/${movie.id}`}
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      color="white"
                      size="1x"
                    />
                  </Link>
                  <Link
                    className="movie__info-comments"
                    to={`/${
                      movie.type === "Movie" ? "movie-info" : "tv-info"
                    }/comments/${movie.id}`}
                  >
                    <FontAwesomeIcon icon={faComment} color="white" size="1x" />
                  </Link>
                  <div className="trending__bookmark">
                    <FontAwesomeIcon icon={faXmark} color="white" size="1x" />
                  </div>
                </div>

                <div className="history__card">
                  <div className="history__card-title">
                    {movie.type === "Movie" ? movie.title : movie.name}
                  </div>

                  <div className="trending__movie-thumbnail-container">
                    <img
                      className="img"
                      key={movie.id}
                      src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                      alt={movie.title || movie.name || "No title"}
                    />

                    <div className="trending__movie-thumbnail-overlay">
                      <span
                        className="trending__movie-thumbnail-overlay-text"
                        onClick={() => handlePlayTrailer(index)}
                      >
                        Play Trailer
                        <FontAwesomeIcon
                          icon={faPlayCircle}
                          color="white"
                          size="1x"
                        />
                      </span>
                      <div className="trending__movie-thumbnail-wrapper">
                        <div className="trending__movie-thumbnail-info">
                          <div className="trending__thumbnail-movie-year">
                            {movie.movieType === "Movie"
                              ? new Date(movie.release_date).getFullYear()
                              : movie.first_air_date
                              ? movie.first_air_date.slice(0, 4)
                              : "Unknown Year"}
                          </div>
                          <div className="trending__movie-thumbnail-dot">·</div>
                          {movie.movieType === "Movie" ? (
                            <svg
                              width="20"
                              height="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"
                                fill="#FFFFFF"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"
                                fill="#ffffff"
                              />
                            </svg>
                          )}
                          <div className="trending__movie-thumbnail-dot">·</div>
                          <div className="trending__movie-thumbnail-type">
                            {movie.movieType}
                          </div>
                        </div>
                        <div className="trending__movie-thumbnail-overlay-name">
                          {movie.movieType === "Movie"
                            ? movie.title
                            : movie.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
                  {playVideo !== null && trailers.length > 0 && (
                    <>
                      <iframe
                        className="trending__movie-frame"
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${
                          trailers[playVideo].videos.results?.[
                            trailers[playVideo].currentTrailerIndex
                          ]?.key || ""
                        }`}
                        title={
                          trailers[playVideo]?.videos.results?.[
                            trailers[playVideo].currentTrailerIndex
                          ]?.name || "Trailer"
                        }
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>

                      <div className="trending__movie-info">
                        <div className="trending__movie-wrapper">
                          <div className="trending__movie-year">
                            {trailers[playVideo]?.release_date
                              ? trailers[playVideo]?.release_date.slice(0, 4)
                              : "Unknown Year" ||
                                trailers[playVideo]?.first_air_date
                              ? trailers[playVideo]?.first_air_date.slice(0, 4)
                              : "Unknown Year"}
                          </div>
                          <div className="trending__movie-dot">·</div>
                          <div className="trending__movie-type">Movie</div>
                          <div className="">.</div>

                          <Link
                            className="movie__info-comments"
                            to={`/${
                              trailers[playVideo].movieType === "Movie"
                                ? "movie-info"
                                : "tv-info"
                            }/comments/${trailers[playVideo].id}`}
                          >
                            <FontAwesomeIcon
                              icon={faComment}
                              color="white"
                              size="1x"
                            />
                          </Link>
                        </div>
                        <div>
                          <button
                            className="trending__btn-handle"
                            onClick={() => handlePrevMovie(playVideo)}
                          >
                            <FontAwesomeIcon
                              icon={faArrowLeftLong}
                              color="white"
                              size="2x"
                            />
                          </button>
                          <button
                            className="trending__btn-handle"
                            onClick={() => handleNextMovie(playVideo)}
                          >
                            <FontAwesomeIcon
                              icon={faArrowRightLong}
                              color="white"
                              size="2x"
                            />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Modal>
              </div>
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
