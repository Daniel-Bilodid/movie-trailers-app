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
    popular: "/tv/top_rated",
    nowPlaying: "/tv/on_the_air",
    upcoming: "/tv/airing_today",
    topRated: "/tv/popular",
  };

  const endpoints = contentType === "TV" ? tvEndpoints : movieEndpoints;
  return `${baseUrl}${endpoints[type]}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`;
};

const getGenreUrl = (contentType) => {
  const baseUrl = "https://api.themoviedb.org/3/genre/";
  const endpoints = contentType === "Movie" ? "movie" : "tv";

  return `${baseUrl}${endpoints}/list?api_key=${process.env.REACT_APP_TMDB_APIKEY}`;
};

const getAllMovieUrl = (contentType, genreId, page) => {
  const baseUrl = "https://api.themoviedb.org/3/discover/";
  const endpoints = "movie";

  return `${baseUrl}${endpoints}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&with_genres=${genreId}&page=${page}`;
};
const getTrendingFetchUrl = (contentType, page) => {
  const baseUrl = "https://api.themoviedb.org/3/trending";
  const endpoints = contentType === "TV" ? "/tv/day" : "/movie/day";
  return `${baseUrl}${endpoints}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&page=${page}`;
};
export const fetchMoreTrendingMovies = async (contentType, page = 1) => {
  try {
    const trendingResponse = await axios.get(
      getTrendingFetchUrl(contentType, page)
    );
    const trendingMovies = trendingResponse.data.results;

    const trailersPromises = trendingMovies.map(async (movie) => {
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
    console.error("Error fetching trending movies", error);
    throw error;
  }
};

export const fetchMovieById = async (id) => {
  try {
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&append_to_response=videos`
    );
    const movie = movieResponse.data;

    return movie;
  } catch (error) {
    console.error(
      `Ошибка при получении фильма с ID ${id}:`,
      error.response ? error.response.data : error
    );
    throw error;
  }
};
export const fetchTVShowById = async (id) => {
  try {
    const tvShowResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&append_to_response=videos`
    );
    const tvShow = tvShowResponse.data;

    return tvShow;
  } catch (error) {
    console.error(
      `Ошибка при получении ТВ-шоу с ID ${id}:`,
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

export const searchMoviesAndTVShows = async (query, page = 1) => {
  try {
    const movieSearchResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_APIKEY}&query=${query}&page=${page}`
    );
    const tvSearchResponse = await axios.get(
      `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_APIKEY}&query=${query}&page=${page}`
    );

    const movieResults = movieSearchResponse.data.results.map((movie) => ({
      ...movie,
      type: "Movie",
    }));

    const tvResults = tvSearchResponse.data.results.map((tv) => ({
      ...tv,
      type: "TV",
    }));

    const combinedResults = [...movieResults, ...tvResults];

    const trailersPromises = combinedResults.map(async (item) => {
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/${item.type.toLowerCase()}/${
          item.id
        }/videos?api_key=${process.env.REACT_APP_TMDB_APIKEY}`
      );
      const videos = videoResponse.data.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      const releaseYear =
        item.release_date || item.first_air_date
          ? new Date(item.release_date || item.first_air_date).getFullYear()
          : "Unknown";

      return {
        item,
        trailers: videos,
        currentTrailerIndex: 0,
        poster_path: item.poster_path,
        release_year: releaseYear,
      };
    });

    return await Promise.all(trailersPromises);
  } catch (error) {
    console.error("Error searching movies and TV shows", error);
    throw error;
  }
};

export const fetchGenres = async (contentType) => {
  try {
    const response = await axios.get(getGenreUrl(contentType));
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

export const fetchMoviesByGenre = async (contentType, genreId, page = 1) => {
  try {
    const response = await axios.get(
      getAllMovieUrl(contentType, genreId, page)
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

const fetchTvShowTrailer = async (tvShowId) => {
  const API_KEY = process.env.REACT_APP_TMDB_APIKEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  try {
    const response = await axios.get(`${BASE_URL}/tv/${tvShowId}/videos`, {
      params: {
        api_key: API_KEY,
      },
    });

    if (response.data.results.length === 0) {
      return [];
    }

    return response.data.results;
  } catch (error) {
    console.error(
      `Ошибка при получении трейлеров для ТВ-шоу с ID ${tvShowId}:`,
      error
    );
    return [];
  }
};

const getAllTvShowsUrl = (contentType, genreId, page) => {
  const baseUrl = "https://api.themoviedb.org/3/discover/";
  const endpoints = "tv";

  return `${baseUrl}${endpoints}?api_key=${process.env.REACT_APP_TMDB_APIKEY}&with_genres=${genreId}&page=${page}`;
};

export const fetchTvShowsByGenre = async (contentType, genreId, page = 1) => {
  try {
    const response = await axios.get(
      getAllTvShowsUrl(contentType, genreId, page)
    );
    const tvShows = response.data.results;

    // Для каждого ТВ-шоу получаем его трейлеры
    const tvShowsWithTrailers = await Promise.all(
      tvShows.map(async (tvShow) => {
        const trailers = await fetchTvShowTrailer(tvShow.id);
        return { ...tvShow, trailers };
      })
    );

    return tvShowsWithTrailers;
  } catch (error) {
    console.error("Ошибка при получении ТВ-шоу по жанру", error);
    throw error;
  }
};
