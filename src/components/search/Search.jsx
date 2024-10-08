import React, { useEffect, useState } from "react";
import "./search.scss";
import { searchMoviesAndTVShows } from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setData } from "../../redux/store";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        searchTrailers();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchTrailers = async () => {
    setLoading(true);
    try {
      const moviesAndTVShows = await searchMoviesAndTVShows(query);
      setResults(moviesAndTVShows);
      dispatch(setData(moviesAndTVShows));
    } catch (error) {
      console.error("Error searching movies and TV shows", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search">
      <div className="search__wrapper">
        <input
          type="text"
          placeholder="Search Movies or TV"
          className="search__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p>Loading...</p>}
        <div className="search__results">
          {results.length > 0
            ? results.map((result) => (
                <div key={result.item.id} className="search__result-item">
                  <p>{result.item.title || result.item.name}</p>
                  <p>{result.item.type === "Movie" ? "Movie" : "TV Show"}</p>
                </div>
              ))
            : !loading && query && <p>No results found</p>}
        </div>
      </div>

      <Link to="/search-result">
        <button disabled={!query}>
          <FaSearch className="search__icon" />
        </button>
      </Link>
    </div>
  );
};

export default Search;
