import React, { useState, useEffect } from "react";
import "./moreTrailers.scss";

import { fetchTrendingMovies } from "../../utils/fetchTrailers";

const MoreTrailers = () => {
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const loadTrailers = async () => {
      try {
        const trailersData = await fetchTrendingMovies();
        setTrailers(trailersData);
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
    <div className="trailers">
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
    </div>
  );
};

export default MoreTrailers;
