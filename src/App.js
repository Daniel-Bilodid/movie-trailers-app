import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/nav/Nav";
import Trending from "./components/trending/Trending";
import MoreTrailers from "./components/moreTrailers/MoreTrailers";
import MovieInfo from "./components/movieInfo/MovieInfo";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/more-trailers" element={<MoreTrailers />} />
          <Route path="/movie-info/:movieId" element={<MovieInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
