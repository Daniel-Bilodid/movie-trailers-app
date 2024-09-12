import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/nav/Nav";
import Trending from "./components/trending/Trending";
import MoreTrailers from "./components/moreTrailers/MoreTrailers";
import MovieInfo from "./components/movieInfo/MovieInfo";
import Bookmark from "./components/bookmark/Bookmark";
import { AuthProvider } from "./components/context/AuthContext";
import MorePopularMovies from "./components/morePopularMovies/MorePopularMovies";
import MoreNowPlaying from "./components/moreNowPlaying/MoreNowPlaying";
import MoreTopRated from "./components/moreTopRated/MoreTopRated";
import MoreUpcoming from "./components/moreUpcoming/MoreUpcoming";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<Trending />} />
            <Route path="/more-trailers" element={<MoreTrailers />} />
            <Route path="/movie-info/:movieId" element={<MovieInfo />} />
            <Route path="/bookmarks" element={<Bookmark />} />
            <Route path="/more-popular" element={<MorePopularMovies />} />
            <Route path="/more-now-playing" element={<MoreNowPlaying />} />
            <Route path="/more-top-rated" element={<MoreTopRated />} />
            <Route path="/more-upcoming" element={<MoreUpcoming />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
