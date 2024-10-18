import React, { useContext, useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import {
  fetchTrendingMovies,
  fetchTrendingTVShows,
} from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";
import Modal from "../movieModal/MovieModal";
import "./trending.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import PopularMovies from "../moviePages/popularMovies/PopularMovies";
import NowPlayingMovies from "../moviePages/nowPlayingMovies/NowPlayingMovies";
import UpcomingMovies from "../moviePages/upcomingMovies/UpcomingMovies";
import TopRatedMovies from "../moviePages/topRatedMovies/TopRatedMovies";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";

import Toggle from "../toggle/Toggle";
import Search from "../search/Search";

const Trending = () => {
  const { user } = useContext(AuthContext);
  const [trailers, setTrailers] = useState([]);
  const [playVideo, setPlayVideo] = useState(null);
  const {
    movies,
    loading: bookmarksLoading,
    selected,
    selectedMovies,
    handleBookmarkClick,
  } = useBookmarkHandle();

  const contentType = useSelector((state) => state.data.contentType);

  const fetchContent =
    contentType === "Movie" ? fetchTrendingMovies : fetchTrendingTVShows;
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-next-arrow" onClick={onClick}>
        →
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-prev-arrow" onClick={onClick}>
        ←
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const loadTrailers = async () => {
      try {
        const trailersData = await fetchContent(1);

        setTrailers(trailersData);
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    };

    loadTrailers();
  }, [fetchContent]);

  const handlePlayVideo = (index) => {
    setPlayVideo(index);
  };

  const handleCloseModal = () => {
    setPlayVideo(null);
  };

  const handleNextTrailer = (index) => {
    setTrailers((prevTrailers) => {
      const updatedTrailers = [...prevTrailers];
      const currentTrailer = updatedTrailers[index];
      const nextIndex =
        (currentTrailer.currentTrailerIndex + 1) %
        currentTrailer.trailers.length;
      updatedTrailers[index] = {
        ...currentTrailer,
        currentTrailerIndex: nextIndex,
      };
      return updatedTrailers;
    });
  };

  const handlePrevTrailer = (index) => {
    setTrailers((prevTrailers) => {
      const updatedTrailers = [...prevTrailers];
      const currentTrailer = updatedTrailers[index];
      const prevIndex =
        (currentTrailer.currentTrailerIndex -
          1 +
          currentTrailer.trailers.length) %
        currentTrailer.trailers.length;
      updatedTrailers[index] = {
        ...currentTrailer,
        currentTrailerIndex: prevIndex,
      };
      return updatedTrailers;
    });
  };

  if (bookmarksLoading) {
    return <div>Loading movies...</div>;
  }

  return (
    <>
      <div className="wrapper">
        <Toggle />
        <Search />
      </div>

      <div className="trending">
        <div className="trending__wrapper">
          <h2 className="trending__title">Trending</h2>

          <Link className="trending__more" to="/more-trailers">
            See more
          </Link>
        </div>
        <Slider {...settings} className="trending__slider">
          {trailers.map(
            ({ movie, trailers, currentTrailerIndex, release_year }, index) => (
              <div key={movie.id}>
                <div className="trending__btn-wrapper ">
                  <Link
                    className="trending__info"
                    to={`/${
                      contentType === "Movie" ? "movie-info" : "tv-info"
                    }/${movie.id}`}
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
                      handleBookmarkClick(movie.id);
                      selected(movie.id);
                      console.log(movie.id);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBookmark}
                      color={
                        (Array.isArray(movies) &&
                          movies.some((m) => m.id === movie.id)) ||
                        selectedMovies[movie.id]
                          ? "yellow"
                          : "white"
                      }
                      size="1x"
                    />
                  </div>
                </div>
                <h3 className="trending__movie-title">
                  {contentType === "Movie" ? movie.title : movie.name}
                </h3>
                {trailers.length > 0 ? (
                  <div className="trending__movie-thumbnail-container">
                    <img
                      className="trending__movie-thumbnail"
                      src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                      alt={`${movie.title} thumbnail`}
                      width="342"
                      height="auto"
                    />
                    <div
                      className="trending__movie-thumbnail-overlay"
                      onClick={() => handlePlayVideo(index)}
                    >
                      <span className="trending__movie-thumbnail-overlay-text">
                        Play Trailer
                      </span>

                      <div className="trending__movie-thumbnail-wrapper">
                        <div className="trending__movie-thumbnail-info">
                          <div className="trending__thumbnail-movie-year">
                            {release_year}
                          </div>

                          <div className="trending__movie-thumbnail-dot">·</div>

                          <div className="trending__movie-thumbnail-svg">
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
                          </div>
                          <div className="trending__movie-thumbnail-dot">·</div>
                          <div className="trending__movie-thumbnail-type">
                            Movie
                          </div>
                        </div>
                        <div className="trending__movie-thumbnail-overlay-name">
                          {movie.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    className="trending__movie-thumbnail"
                    src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                    alt={`${movie.title} thumbnail`}
                    width="342"
                    height="auto"
                  />
                )}
              </div>
            )
          )}
        </Slider>

        <Modal isOpen={playVideo !== null} onClose={handleCloseModal}>
          {playVideo !== null && (
            <>
              <iframe
                className="trending__movie-frame"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${
                  trailers[playVideo].trailers[
                    trailers[playVideo].currentTrailerIndex
                  ].key
                }`}
                title={
                  trailers[playVideo].trailers[
                    trailers[playVideo].currentTrailerIndex
                  ].name
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="trending__movie-info">
                <div className="trending__movie-wrapper">
                  <div className="trending__movie-year">
                    {trailers[playVideo].release_year}
                  </div>

                  <div className="trending__movie-dot">·</div>

                  <div className="trending__movie-svg">
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
                  </div>
                  <div className="trending__movie-dot">·</div>
                  <div className="trending__movie-type">Movie</div>
                </div>

                <div>
                  <button onClick={() => handlePrevTrailer(playVideo)}>
                    previous
                  </button>
                  <button onClick={() => handleNextTrailer(playVideo)}>
                    next
                  </button>
                </div>
              </div>
            </>
          )}
        </Modal>
      </div>

      <PopularMovies />

      <NowPlayingMovies />

      <UpcomingMovies />

      <TopRatedMovies />
    </>
  );
};

export default Trending;
