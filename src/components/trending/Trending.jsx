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
import {
  faInfoCircle,
  faPlayCircle,
  faArrowRightLong,
  faArrowLeftLong,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import PopularMovies from "../moviePages/popularMovies/PopularMovies";
import NowPlayingMovies from "../moviePages/nowPlayingMovies/NowPlayingMovies";
import UpcomingMovies from "../moviePages/upcomingMovies/UpcomingMovies";
import TopRatedMovies from "../moviePages/topRatedMovies/TopRatedMovies";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import AuthToast from "../authToast/AuthToast";
import Toggle from "../toggle/Toggle";
import Search from "../search/Search";
import { showToast, hideToast } from "../../redux/store";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Loading from "../loading/Loading";
import MovieActions from "../movieActions/MovieActions";
import ModalMovie from "../modalMovie/ModalMovie";
const Trending = () => {
  const { user } = useContext(AuthContext);
  const [trailers, setTrailers] = useState([]);
  const [playVideo, setPlayVideo] = useState(null);
  const dispatch = useDispatch();

  const showToastState = useSelector((state) => state.toast.showToast);
  let [load, setLoad] = useState(true);
  const {
    movies,
    loading: bookmarksLoading,
    selected,
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
        breakpoint: 720,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1084,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
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
      } finally {
        setLoad(false);
      }
    };

    loadTrailers();
  }, [fetchContent]);

  useEffect(() => {
    if (fetchContent) {
      setLoad(true);
    }
  }, [fetchContent]);

  const handlePlayVideo = (index) => {
    setPlayVideo(index);
  };

  const handleCloseModal = () => {
    setPlayVideo(null);
  };

  const showAuthToast = () => {
    dispatch(showToast());
    setTimeout(() => {
      dispatch(hideToast());
    }, 5000);
  };

  return (
    <>
      <div className="welcome__message">
        <span>Welcome: {user ? user.displayName : "Not signed in"}</span>
      </div>
      <div className="wrapper">
        <Toggle />
        <Search />
      </div>
      <div className="trending">
        {load ? <Loading /> : ""}
        <div className="trending__wrapper">
          <h2 className="trending__title">Trending</h2>

          <Link className="trending__more" to="/more-trailers">
            See more
          </Link>
        </div>
        <Slider {...settings} className="trending__slider">
          {trailers.map(
            ({ movie, trailers, currentTrailerIndex, release_year }, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                key={movie.id}
              >
                <MovieActions
                  movie={movie}
                  contentType={contentType}
                  user={user}
                  movies={movies}
                  selected={selected}
                  showAuthToast={showAuthToast}
                  handleBookmarkClick={handleBookmarkClick}
                />

                <AuthToast show={showToastState} />
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
                        <FontAwesomeIcon
                          icon={faPlayCircle}
                          color="white"
                          size="1x"
                          className="trending__play-icon"
                        />
                      </span>

                      <div className="trending__movie-thumbnail-wrapper">
                        <div className="trending__movie-thumbnail-info">
                          <div className="trending__thumbnail-movie-year">
                            {release_year}
                          </div>

                          <div className="trending__movie-thumbnail-dot">·</div>

                          <div className="trending__movie-thumbnail-svg">
                            {contentType === "Movie" ? (
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
                          <div className="trending__movie-thumbnail-dot">·</div>
                          <div className="trending__movie-thumbnail-type">
                            {contentType === "Movie" ? "Movie" : "TV"}
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
              </motion.div>
            )
          )}
        </Slider>

        <ModalMovie
          isOpen={playVideo !== null}
          onClose={handleCloseModal}
          playVideo={playVideo}
          trailers={trailers}
          setTrailers={setTrailers}
          contentType={contentType}
        />
      </div>
      <PopularMovies />
      <NowPlayingMovies />
      <UpcomingMovies />
      <TopRatedMovies />
    </>
  );
};

export default Trending;
