import axios from "axios";

export const fetchTrendingMovies = async (pagesToFetch = 2) => {
  try {
    const trailersData = [];

    for (let page = 1; page <= pagesToFetch; page++) {
      const trendingResponse = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
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

      const fetchedTrailers = await Promise.all(trailersPromises);
      trailersData.push(...fetchedTrailers);
    }

    return trailersData;
  } catch (error) {
    console.error("Error fetching trailers", error);
    throw error;
  }
};
