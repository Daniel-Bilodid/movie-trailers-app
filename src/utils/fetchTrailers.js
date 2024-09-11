import axios from "axios";

export const fetchMovieById = async (id) => {
  try {
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&append_to_response=videos`
    );
    const movie = movieResponse.data;
    return movie;
  } catch (error) {
    console.error(`Ошибка при получении фильма с ID ${id}:`, error);
    throw error;
  }
};

export const fetchTrendingMovies = async (page = 1) => {
  try {
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
      const releaseYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "Unknown";

      return {
        movie,
        trailers: videos,
        currentTrailerIndex: 0,
        poster_path: movie.poster_path,
        release_year: releaseYear,
      };
    });

    return await Promise.all(trailersPromises);
  } catch (error) {
    console.error("Error fetching trailers", error);
    throw error;
  }
};

export const fetchPopularMovies = async (page = 1) => {
  try {
    const popularResponse = await axios.get(
      `https://api.themoviedb.org/3/popular/movie/day?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
    );
    const popularMovies = popularResponse.data.results;

    const trailersPromises = popularMovies.map(async (movie) => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
      );
      const videos = videoResponse.data.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      const releaseYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "Unknown";

      return {
        movie,
        trailers: videos,
        currentTrailerIndex: 0,
        poster_path: movie.poster_path,
        release_year: releaseYear,
      };
    });

    return await Promise.all(trailersPromises);
  } catch (error) {
    console.error("Error fetching trailers", error);
    throw error;
  }
};
