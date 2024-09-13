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
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
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
    console.error("Error fetching popular movies", error);
    throw error;
  }
};

export const fetchNowPlayingMovies = async (page = 1) => {
  try {
    const nowPlayingResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
    );
    const nowPlayingMovies = nowPlayingResponse.data.results;

    const trailersPromises = nowPlayingMovies.map(async (movie) => {
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
    console.error("Error fetching popular movies", error);
    throw error;
  }
};

export const fetchUpcomingMovies = async (page = 1) => {
  try {
    const upcomingResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
    );
    const upcomingMovies = upcomingResponse.data.results;

    const trailersPromises = upcomingMovies.map(async (movie) => {
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
    console.error("Error fetching popular movies", error);
    throw error;
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  try {
    const topRatedResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
    );
    const topRatedMovies = topRatedResponse.data.results;

    const trailersPromises = topRatedMovies.map(async (movie) => {
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
    console.error("Error fetching popular movies", error);
    throw error;
  }
};

const fetchTotalPages = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
    );
    return response.data.total_pages;
  } catch (error) {
    console.error("Error fetching total pages", error);
    throw error;
  }
};
export const fetchAllMoviesWithTrailers = async () => {
  try {
    const totalPages = await fetchTotalPages();
    const allMovies = [];

    // Запрашиваем фильмы с каждой страницы
    for (let page = 1; page <= totalPages; page++) {
      const moviesResponse = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
      );
      const movies = moviesResponse.data.results;

      // Собираем данные о трейлерах для каждого фильма
      const trailersPromises = movies.map(async (movie) => {
        try {
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
        } catch (error) {
          console.error(
            `Error fetching videos for movie ID ${movie.id}`,
            error
          );
          return {
            movie,
            trailers: [],
            currentTrailerIndex: 0,
            poster_path: movie.poster_path,
            release_year: "Unknown",
          };
        }
      });

      // Добавляем результаты в массив
      const moviesWithTrailers = await Promise.all(trailersPromises);
      allMovies.push(...moviesWithTrailers);
    }

    return allMovies;
  } catch (error) {
    console.error("Error fetching all movies with trailers", error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const searchResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_APIKEY}&query=${query}&page=${page}`
    );
    const searchResults = searchResponse.data.results;

    const trailersPromises = searchResults.map(async (movie) => {
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
    console.error("Error searching movies", error);
    throw error;
  }
};
