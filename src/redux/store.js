import { configureStore, createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    value: "",
    selectedGenre: "",
    movies: [],
    moviesByGenre: [],
  },
  reducers: {
    setData: (state, action) => {
      state.value = action.payload;
      console.log("data");
    },
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
      console.log("genre");
    },
    setMoviesByGenre: (state, action) => {
      state.moviesByGenre = action.payload;
    },
    setMovies: (state, action) => {
      console.log("Previous movies:", state.movies);
      state.movies = action.payload;
      console.log("Updated movies:", state.movies);
    },
    addMovie: (state, action) => {
      state.movies.push(action.payload);
      console.log("add");
    },
    removeMovie: (state, action) => {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload
      );
    },
  },
});

export const {
  setData,
  setSelectedGenre,
  setMovies,
  addMovie,
  removeMovie,
  setMoviesByGenre,
} = dataSlice.actions;

export const selectMovies = (state) => state.data.movies;

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
  },
});

export default store;
