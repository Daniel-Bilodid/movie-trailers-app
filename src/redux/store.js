import { configureStore, createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("appState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.warn("Ошибка при загрузке состояния из localStorage", e);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("appState", serializedState);
  } catch (e) {
    console.warn("Ошибка при сохранении состояния в localStorage", e);
  }
};

const isStateExpired = (timestamp) => {
  const EXPIRATION_TIME = 24 * 60 * 60 * 1000;
  return Date.now() - timestamp > EXPIRATION_TIME;
};

const persistedState = loadState();
const initialState = {
  timestamp: Date.now(),
  data: {
    value: "",
    selectedGenre: "",
    movies: [],
    moviesByGenre: [],
    currentPage: 1,
    contentType: "Movie",
    ...persistedState?.data,
  },
};

if (persistedState && isStateExpired(persistedState.timestamp)) {
  localStorage.removeItem("appState");
}

const dataSlice = createSlice({
  name: "data",
  initialState: initialState.data,
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

store.subscribe(() => {
  saveState({
    timestamp: Date.now(),
    data: store.getState().data,
    toast: store.getState().toast,
  });
});

export default store;
