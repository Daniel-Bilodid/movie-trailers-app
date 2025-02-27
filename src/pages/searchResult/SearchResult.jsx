import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import { AuthContext } from "../../components/context/AuthContext";
import Search from "../../components/search/Search";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/loading/Loading";
import ModalMovie from "../../components/modalMovie/ModalMovie";
import { showAuthToast } from "../../utils/showAuthToast";
import MovieActions from "../../components/movieActions/MovieActions";
import MovieCard from "../../components/movieCard/MovieCard";

const SearchResult = () => {
  const data = useSelector((state) => state.data.value);

  const showToastState = useSelector((state) => state.toast.showToast);
  const [results, setResults] = useState(data);
  const [playVideo, setPlayVideo] = useState(null);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);

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
                  {/* <MovieCard
                    movie={item}
                    trailers={trailers}
                    release_year={release_year}
                    first_air_date={
                      isMovie !== "Movie" ? item.first_air_date : ""
                    }
                    onPlayVideo={() => handlePlayVideo(index)}
                    onBookmarkClick={handleBookmarkClick}
                    movies={movies}
                    selected={() => selected(item.id)}
                    contentType={isMovie}
                    user={user}
                    showAuthToast={showAuthToast}
                    showToastState={showToastState}
                  /> */}

                  <MovieActions
                    movie={item}
                    contentType={item.type}
                    user={user}
                    movies={movies}
                    selected={selected}
                    showAuthToast={showAuthToast}
                    handleBookmarkClick={handleBookmarkClick}
                  />

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

        <ModalMovie
          isOpen={playVideo !== null}
          onClose={handleCloseModal}
          playVideo={playVideo}
          trailers={results}
          setTrailers={setResults}
          contentType={results}
        />
      </div>
    </>
  );
};

export default SearchResult;
