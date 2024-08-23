import React, { useEffect, useState } from "react";
import axios from "axios";

import "./trending.scss";
const Trending = () => {
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const trendingResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
        );
        const trendingMovies = trendingResponse.data.results;

        const trailersPromises = trendingMovies.map(async (movie) => {
          const videoResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
          );
          const videos = videoResponse.data.results.filter(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          return { movie, trailers: videos, currentTrailerIndex: 0 };
        });

        const trailersData = await Promise.all(trailersPromises);
        setTrailers(trailersData);
      } catch (error) {
        console.error("Error ", error);
      }
    };

    fetchTrendingMovies();
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
    <div>
      <h2>Trending</h2>
      {trailers.map(({ movie, trailers, currentTrailerIndex }, index) => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
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
                <button onClick={() => handlePrevTrailer(index)}>next</button>
                <button onClick={() => handleNextTrailer(index)}>
                  previous
                </button>
              </div>
            </div>
          ) : (
            <p>no trailer</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Trending;
