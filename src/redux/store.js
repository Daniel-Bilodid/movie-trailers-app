import { configureStore, createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    value: "",
    selectedGenre: "",
    movies: [],
    moviesByGenre: [],
    currentPage: 1,
    contentType: "Movie",
  },
  reducers: {
    setData: (state, action) => {
      state.value = action.payload;
    },
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
    },
    setMoviesByGenre: (state, action) => {
      state.moviesByGenre = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    addMovie: (state, action) => {
      state.movies.push(action.payload);
    },
    removeMovie: (state, action) => {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload
      );
    },
    setContentType: (state, action) => {
      state.contentType = action.payload;
    },
  },
});

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    showToast: false,
  },
  reducers: {
    showToast: (state) => {
      state.showToast = true;
    },
    hideToast: (state) => {
      state.showToast = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const {
  setData,
  setSelectedGenre,
  setMovies,
  addMovie,
  removeMovie,
  setMoviesByGenre,
  setCurrentPage,
  setContentType,
} = dataSlice.actions;

export const selectMovies = (state) => state.data.movies;

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    toast: toastSlice.reducer,
  },
});

export default store;
