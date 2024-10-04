import axios from "axios";

import { useSelector } from "react-redux"; // для использования состояния из Redux

// Общая функция для построения URL на основе contentType
const getFetchUrl = (contentType, type, page) => {
  const baseUrl = "https://api.themoviedb.org/3";
  const movieEndpoints = {
    popular: "/movie/popular",
    nowPlaying: "/movie/now_playing",
    upcoming: "/movie/upcoming",
    topRated: "/movie/top_rated",
  };

  const tvEndpoints = {
    popular: "/tv/popular",
    nowPlaying: "/tv/on_the_air",
    upcoming: "/tv/airing_today",
    topRated: "/tv/top_rated",
  };

  const endpoints = contentType === "TV" ? tvEndpoints : movieEndpoints;
  return `${baseUrl}${endpoints[type]}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`;
};

export const fetchMovieById = async (id) => {
  try {
    console.log(`Запрос фильма с ID: ${id}`); // Логирование ID
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&append_to_response=videos`
    );
    const movie = movieResponse.data;
    console.log(movie); // Логирование ответа
    return movie;
  } catch (error) {
    console.error(
      `Ошибка при получении фильма с ID ${id}:`,
      error.response ? error.response.data : error
    );
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

export const fetchPopularMovies = async (contentType, page = 1) => {
  try {
    const popularResponse = await axios.get(
      getFetchUrl(contentType, "popular", page)
    );
    const popularMovies = popularResponse.data.results;

    const trailersPromises = popularMovies.map(async (movie) => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/${contentType.toLowerCase()}/${
          movie.id
        }/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
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

export const fetchNowPlayingMovies = async (contentType, page = 1) => {
  try {
    const nowPlayingResponse = await axios.get(
      getFetchUrl(contentType, "nowPlaying", page)
    );
    const nowPlayingMovies = nowPlayingResponse.data.results;

    const trailersPromises = nowPlayingMovies.map(async (movie) => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/${contentType.toLowerCase()}/${
          movie.id
        }/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
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

export const fetchUpcomingMovies = async (contentType, page = 1) => {
  try {
    const upcomingResponse = await axios.get(
      getFetchUrl(contentType, "upcoming", page)
    );
    const upcomingMovies = upcomingResponse.data.results;

    const trailersPromises = upcomingMovies.map(async (movie) => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/${contentType.toLowerCase()}/${
          movie.id
        }/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
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

export const fetchTopRatedMovies = async (contentType, page = 1) => {
  try {
    const topRatedResponse = await axios.get(
      getFetchUrl(contentType, "topRated", page)
    );
    const topRatedMovies = topRatedResponse.data.results;

    const trailersPromises = topRatedMovies.map(async (movie) => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/${contentType.toLowerCase()}/${
          movie.id
        }/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
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

export const fetchGenres = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
    );
    return response.data.genres;
  } catch (error) {
    console.error("Ошибка при получении жанров", error);
    throw error;
  }
};

export const fetchMoviesWithGenres = async (selectedGenre = null, page = 1) => {
  try {
    const [moviesResponse, genres] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
      ),
      fetchGenres(),
    ]);

    const movies = moviesResponse.data.results;

    const filteredMovies = selectedGenre
      ? movies.filter(
          (movie) => movie.genre_ids && movie.genre_ids.includes(selectedGenre)
        )
      : movies;

    const moviesWithGenres = filteredMovies.map((movie) => {
      const movieGenres = movie.genre_ids
        ? movie.genre_ids.map(
            (genreId) => genres.find((genre) => genre.id === genreId)?.name
          )
        : [];
      return {
        ...movie,
        genres: movieGenres,
      };
    });

    return moviesWithGenres;
  } catch (error) {
    console.error("Ошибка при получении фильмов с жанрами", error);
    throw error;
  }
};

const fetchTrailer = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Ошибка при получении трейлеров", error);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_APIKEY}&with_genres=${genreId}&page=${page}`
    );
    const movies = response.data.results;

    const moviesWithTrailers = await Promise.all(
      movies.map(async (movie) => {
        const trailers = await fetchTrailer(movie.id);
        return { ...movie, trailers };
      })
    );

    return moviesWithTrailers;
  } catch (error) {
    console.error("Ошибка при получении фильмов по жанру", error);
    throw error;
  }
};
export const fetchTrendingTVShows = async (page = 1) => {
  try {
    const trendingResponse = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`
    );
    const trendingTVShows = trendingResponse.data.results;

    const trailersPromises = trendingTVShows.map(async (movie) => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
      );
      const videos = videoResponse.data.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      const releaseYear = movie.first_air_date
        ? new Date(movie.first_air_date).getFullYear()
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
    console.error("Error fetching TV show trailers", error);
    throw error;
  }
};
