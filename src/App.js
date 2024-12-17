import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/nav/Nav";
import Trending from "./components/trending/Trending";
import MoreTrailers from "./components/moviePages/moreTrailers/MoreTrailers";
import MovieInfo from "./components/movieInfo/MovieInfo";
import Bookmark from "./components/bookmark/Bookmark";
import { AuthProvider } from "./components/context/AuthContext";
import MorePopularMovies from "./components/moviePages/morePopularMovies/MorePopularMovies";
import MoreNowPlaying from "./components/moviePages/moreNowPlaying/MoreNowPlaying";
import MoreTopRated from "./components/moviePages/moreTopRated/MoreTopRated";
import MoreUpcoming from "./components/moviePages/moreUpcoming/MoreUpcoming";
import AllMovies from "./pages/allMovies/AllMovies";
import AllTv from "./pages/allTv/AllTv";
import SearchResult from "./pages/searchResult/SearchResult";
import ManageProfile from "./pages/manageProfile/ManageProfile";
import Comments from "./pages/comments/Comments";
import { Provider } from "react-redux";
import store from "./redux/store";
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Trending />
            </motion.div>
          }
        />
        <Route
          path="/more-trailers"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <MoreTrailers />
            </motion.div>
          }
        />
        <Route
          path="/movie-info/:movieId"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <MovieInfo />
            </motion.div>
          }
        />
        <Route
          path="/tv-info/:movieId"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <MovieInfo />
            </motion.div>
          }
        />
        <Route
          path="/movie-info/comments/:movieId"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Comments />
            </motion.div>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Bookmark />
            </motion.div>
          }
        />
        <Route
          path="/more-popular"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <MorePopularMovies />
            </motion.div>
          }
        />
        <Route
          path="/more-now-playing"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <MoreNowPlaying />
            </motion.div>
          }
        />
        <Route
          path="/more-top-rated"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <MoreTopRated />
            </motion.div>
          }
        />
        <Route
          path="/more-upcoming"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <MoreUpcoming />
            </motion.div>
          }
        />
        <Route
          path="/all-movies"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <AllMovies />
            </motion.div>
          }
        />
        <Route
          path="/all-tv"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <AllTv />
            </motion.div>
          }
        />
        <Route
          path="/search-result"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <SearchResult />
            </motion.div>
          }
        />

        <Route
          path="manage-profile"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <ManageProfile />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Nav />
            <AnimatedRoutes />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
