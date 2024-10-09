import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import SearchResult from "./pages/searchResult/SearchResult";
import { Provider } from "react-redux";
import store from "./redux/store";
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Nav />
            <Routes>
              <Route path="/" element={<Trending />} />
              <Route path="/more-trailers" element={<MoreTrailers />} />
              <Route path="/movie-info/:movieId" element={<MovieInfo />} />
              <Route path="/tv-info/:movieId" element={<MovieInfo />} />
              <Route path="/bookmarks" element={<Bookmark />} />
              <Route path="/more-popular" element={<MorePopularMovies />} />
              <Route path="/more-now-playing" element={<MoreNowPlaying />} />
              <Route path="/more-top-rated" element={<MoreTopRated />} />
              <Route path="/more-upcoming" element={<MoreUpcoming />} />
              <Route path="/all-movies" element={<AllMovies />} />
              <Route path="/search-result" element={<SearchResult />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}
export default App;
