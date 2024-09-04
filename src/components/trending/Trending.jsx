import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchTrendingMovies } from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";
import Modal from "../movieModal/MovieModal";
import "./trending.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

import Search from "../search/Search";

const Trending = () => {
  const { user } = useContext(AuthContext);
  const [trailers, setTrailers] = useState([]);
  const [playVideo, setPlayVideo] = useState(null);

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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const loadTrailers = async () => {
      try {
        const trailersData = await fetchTrendingMovies(1);
        setTrailers(trailersData);
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    };

    loadTrailers();
  }, []);

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

  const handleBookmarkClick = async (movieId) => {
    if (!user) {
      console.log("Please sign in to bookmark.");
      return;
    }

    try {
      const bookmarkRef = doc(db, "bookmarks", user.uid);
      const userBookmarks = await getDoc(bookmarkRef);

      const bookmarks = userBookmarks.exists()
        ? userBookmarks.data().movies || []
        : [];

      const isBookmarked = bookmarks.includes(movieId);
      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter((id) => id !== movieId);
        await setDoc(bookmarkRef, { movies: updatedBookmarks });
      } else {
        const updatedBookmarks = [...bookmarks, movieId];
        await setDoc(bookmarkRef, { movies: updatedBookmarks });
      }
    } catch (error) {
      console.error("Error handling bookmark click:", error);
    }
  };

  return (
    <div className="trending">
      <Search />
      <div className="trending__wrapper">
        <h2 className="trending__title">Trending</h2>
        <div className="more">
          <Link className="trending__more" to="/more-trailers">
            More Trailers
          </Link>
        </div>
      </div>
      <Slider {...settings} className="trending__slider">
        {trailers.map(
          ({ movie, trailers, currentTrailerIndex, release_year }, index) => (
            <div key={movie.id}>
              <div className="trending__btn-wrapper ">
                <Link className="trending__info" to={`/movie-info/${movie.id}`}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color="white"
                    size="1x"
                  />
                </Link>
                <div
                  className="trending__bookmark"
                  onClick={() => handleBookmarkClick(movie.id)}
                >
                  <FontAwesomeIcon icon={faBookmark} color="white" size="1x" />
                </div>
              </div>
              <h3 className="trending__movie-title">{movie.title}</h3>
              {trailers.length > 0 ? (
                <div className="trending__movie-thumbnail-container">
                  <img
                    className="trending__movie-thumbnail"
                    src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                    alt={`${movie.title} thumbnail`}
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
                <p>No trailer</p>
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
  );
};

export default Trending;
