import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import {
  fetchTrendingMovies,
  fetchTrendingTVShows,
} from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";

import "./trending.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import PopularMovies from "../moviePages/popularMovies/PopularMovies";
import NowPlayingMovies from "../moviePages/nowPlayingMovies/NowPlayingMovies";
import UpcomingMovies from "../moviePages/upcomingMovies/UpcomingMovies";
import TopRatedMovies from "../moviePages/topRatedMovies/TopRatedMovies";
import useBookmarkHandle from "../../hooks/useBookmarkHandle";

import Toggle from "../toggle/Toggle";
import Search from "../search/Search";
import { showToast, hideToast } from "../../redux/store";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Loading from "../loading/Loading";

import ModalMovie from "../modalMovie/ModalMovie";
import sliderSettings from "../../utils/sliderSettings";
import MovieCard from "../movieCard/MovieCard";
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
        <Slider {...sliderSettings} className="trending__slider">
          {trailers.map(
            ({ movie, trailers, currentTrailerIndex, release_year }, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                key={movie.id}
              >
                <MovieCard
                  movie={movie}
                  trailers={trailers}
                  release_year={release_year}
                  first_air_date={
                    contentType !== "Movie" ? movie.first_air_date : ""
                  }
                  onPlayVideo={() => handlePlayVideo(index)}
                  onBookmarkClick={handleBookmarkClick}
                  movies={movies}
                  selected={() => selected(movie.id)}
                  contentType={contentType}
                  user={user}
                  showAuthToast={showAuthToast}
                  showToastState={showToastState}
                />
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
