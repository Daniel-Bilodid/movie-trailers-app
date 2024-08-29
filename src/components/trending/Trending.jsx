import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchTrendingMovies } from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";
import Modal from "../movieModal/MovieModal";
import "./trending.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Trending = () => {
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

  return (
    <div className="trending">
      <div className="trending__wrapper">
        <h2 className="trending__title">Trending</h2>
        <Link className="trending__more" to="/more-trailers">
          More Trailers
        </Link>
      </div>
      <Slider {...settings} className="trending__slider">
        {trailers.map(
          ({ movie, trailers, currentTrailerIndex, release_year }, index) => (
            <div key={movie.id}>
              <Link
                className="trending__bookmark"
                to={`/movie-info/${movie.id}`}
              >
                Bookmark
              </Link>
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
