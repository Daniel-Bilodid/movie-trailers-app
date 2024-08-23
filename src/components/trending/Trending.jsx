import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchTrendingMovies } from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";
import "./trending.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Trending = () => {
  const [trailers, setTrailers] = useState([]);

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
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const loadTrailers = async () => {
      try {
        const trailersData = await fetchTrendingMovies(3);
        setTrailers(trailersData.slice(0, 40));
      } catch (error) {
        console.error("Error loading trailers", error);
      }
    };

    loadTrailers();
  }, []);

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
      <Slider {...settings}>
        {trailers.map(({ movie, trailers, currentTrailerIndex }, index) => (
          <div key={movie.id}>
            <h3 className="trending__movie-title">{movie.title}</h3>
            {trailers.length > 0 ? (
              <div>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${trailers[currentTrailerIndex].key}`}
                  title={trailers[currentTrailerIndex].name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div>
                  <button onClick={() => handlePrevTrailer(index)}>
                    previous
                  </button>
                  <button onClick={() => handleNextTrailer(index)}>next</button>
                </div>
              </div>
            ) : (
              <p>No trailer</p>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Trending;
