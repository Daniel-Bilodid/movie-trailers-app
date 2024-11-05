import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../../components/movieModal/MovieModal";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faBookmark } from "@fortawesome/free-solid-svg-icons";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import { AuthContext } from "../../components/context/AuthContext";
import Search from "../../components/search/Search";
import {
  faArrowRightLong,
  faArrowLeftLong,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/loading/Loading";

const SearchResult = () => {
  const data = useSelector((state) => state.data.value);
  const [playVideo, setPlayVideo] = useState(null);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);
  const contentType = useSelector((state) => state.data.contentType);
  const {
    movies,
    loading: bookmarksLoading,
    selected,
    selectedMovies,
    handleBookmarkClick,
  } = useBookmarkHandle();

  useEffect(() => {
    console.log("data", data);
  }, [data]);
  const handlePlayVideo = (index) => {
    setPlayVideo(index);
    setCurrentTrailer(0);
  };

  const handleCloseModal = () => {
    setPlayVideo(null);
    setCurrentTrailer(0);
  };

  const handleNextTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer((prev) => (prev + 1) % data[playVideo].trailers.length);
    }
  };

  const handlePrevTrailer = () => {
    if (playVideo !== null) {
      setCurrentTrailer(
        (prev) =>
          (prev - 1 + data[playVideo].trailers.length) %
          data[playVideo].trailers.length
      );
    }
  };
  if (bookmarksLoading && user) {
    return <Loading />;
  }

  return (
    <>
      <div className="search__wrapper">
        <Search />
      </div>
      <h1>Search Results</h1>

      <div className="popular">
        <div className="popular__wrapper">
          {data &&
            data.map(({ item, trailers, release_year }, index) => {
              if (!item || !item.id) return null;

              const isMovie = item.type === "Movie";
              const isBookmarked =
                (Array.isArray(movies) &&
                  movies.some((m) => m.id === item.id)) ||
                selectedMovies[item.id];

              return (
                <div key={item.id}>
                  <div className="trending__btn-wrapper">
                    <Link
                      className="trending__info"
                      to={`/${isMovie ? "movie-info" : "tv-info"}/${item.id}`}
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        color="white"
                        size="1x"
                      />
                    </Link>
                    <div
                      className="trending__bookmark"
                      onClick={() => {
                        handleBookmarkClick(item.id);
                        selected(item.id);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBookmark}
                        color={isBookmarked ? "yellow" : "white"}
                        size="1x"
                      />
                    </div>
                  </div>
                  <h3 className="trending__movie-title">
                    {isMovie ? item.title : item.name}
                  </h3>
                  <div className="trending__movie-thumbnail-container">
                    <img
                      className="trending__movie-thumbnail"
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
                          : "https://ih1.redbubble.net/image.1861329650.2941/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                      }
                      alt={
                        item.poster_path
                          ? `${item.title || item.name} thumbnail`
                          : "Default movie thumbnail"
                      }
                    />

                    {trailers.length > 0 && (
                      <div
                        className="trending__movie-thumbnail-overlay"
                        onClick={() => handlePlayVideo(index)}
                      >
                        <span className="trending__movie-thumbnail-overlay-text">
                          Play Trailer
                          <FontAwesomeIcon
                            className="trending__play-icon"
                            icon={faPlayCircle}
                            color="white"
                            size="1x"
                          />
                        </span>
                        <div className="trending__movie-thumbnail-wrapper">
                          <div className="trending__movie-thumbnail-info">
                            <div className="trending__thumbnail-movie-year">
                              {release_year}
                            </div>
                            <div className="trending__movie-thumbnail-dot">
                              ·
                            </div>
                            <div className="trending__movie-thumbnail-svg">
                              {isMovie ? (
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
                            </div>
                            <div className="trending__movie-thumbnail-dot">
                              ·
                            </div>
                            <div className="trending__movie-thumbnail-type">
                              {item.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
          {data?.[playVideo]?.trailers && (
            <>
              {console.log(data)}
              <iframe
                className="trending__movie-frame"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${
                  data[playVideo].trailers[currentTrailer]?.key ||
                  data[playVideo].trailers[0]?.key
                }`}
                title={
                  data[playVideo].trailers[currentTrailer]?.name || "Trailer"
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              <div className="trending__movie-info">
                <div className="trending__movie-wrapper">
                  <div className="trending__movie-year">
                    {data[playVideo]?.release_year}
                  </div>
                  <div className="trending__movie-dot">·</div>

                  <div className="trending__movie-thumbnail-svg">
                    {data[playVideo].item.type === "Movie" ? (
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
                  </div>
                  <div className="trending__movie-dot">·</div>
                  <div className="trending__movie-type">
                    {data[playVideo].item.type === "Movie" ? "Movie" : "TV"}
                  </div>
                </div>

                <div>
                  <button
                    className="trending__btn-handle"
                    onClick={handlePrevTrailer}
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeftLong}
                      color="white"
                      size="2x"
                    />
                  </button>
                  <button
                    className="trending__btn-handle"
                    onClick={handleNextTrailer}
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
    </>
  );
};

export default SearchResult;
