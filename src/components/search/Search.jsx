import React, { useEffect, useState } from "react";
import "./search.scss";
import { searchMovies } from "../../utils/fetchTrailers";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setData } from "../../redux/store";

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
      const movies = await searchMovies(query);
      setResults(movies);
      dispatch(setData(movies));
    } catch (error) {
      console.error("Error searching movies", error);
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
                <div key={result.movie.id} className="search__result-item">
                  <p>{result.movie.title || result.movie.name}</p>
                </div>
              ))
            : !loading && query && <p>No results found</p>}
        </div>
      </div>
      <Link to="/search-result">
        <button disabled={!query}>Search</button>
      </Link>
    </div>
  );
};

export default Search;
