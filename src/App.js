import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/nav/Nav";
import Trending from "./components/trending/Trending";
import MoreTrailers from "./components/moreTrailers/MoreTrailers";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/more-trailers" element={<MoreTrailers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
