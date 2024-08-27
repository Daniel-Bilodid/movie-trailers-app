import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchTrendingMovies } from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";
import "./trending.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Trending = () => {
  const [trailers, setTrailers] = useState([]);
  const [playVideo, setPlayVideo] = useState({});

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
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const loadTrailers = async () => {
      try {
        const trailersData = await fetchTrendingMovies(1);
        console.log("Trailers Data in Component:", trailersData);
        setTrailers(trailersData);
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    };

    loadTrailers();
  }, []);

  const handlePlayVideo = (index) => {
    setPlayVideo((prevState) => ({
      ...prevState,
      [index]: true,
    }));
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
              <h3 className="trending__movie-title">{movie.title}</h3>
              {trailers.length > 0 ? (
                <div>
                  {playVideo[index] ? (
                    <>
                      <div className="trending__movie-modal">
                        <iframe
                          className="trending__movie-frame"
                          width="560"
                          height="315"
                          src={`https://www.youtube.com/embed/${trailers[currentTrailerIndex].key}`}
                          title={trailers[currentTrailerIndex].name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <div className="trending__movie-info">
                          <div className="trending__movie-year">
                            {release_year}
                          </div>

                          <div>
                            <button onClick={() => handlePrevTrailer(index)}>
                              previous
                            </button>
                            <button onClick={() => handleNextTrailer(index)}>
                              next
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      className="trending__movie-thumbnail"
                      src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                      alt={`${movie.title} thumbnail`}
                      onClick={() => handlePlayVideo(index)}
                    />
                  )}
                </div>
              ) : (
                <p>No trailer</p>
              )}
            </div>
          )
        )}
      </Slider>
    </div>
  );
};

export default Trending;
