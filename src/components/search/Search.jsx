import React, { useEffect, useState } from "react";
import "./search.scss";
import { searchMovies } from "../../utils/fetchTrailers"; // измените импорт

const Search = () => {
  const [query, setQuery] = useState(""); // запрос
  const [results, setResults] = useState([]); // результаты поиска
  const [loading, setLoading] = useState(false); // состояние загрузки

  useEffect(() => {
    const searchTrailers = async () => {
      if (query.length > 0) {
        setLoading(true);
        try {
          const movies = await searchMovies(query); // вызываем поиск
          setResults(movies);
        } catch (error) {
          console.error("Error searching movies", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]); // очищаем результаты, если запрос короткий
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchTrailers(); // задержка для предотвращения частых запросов
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search Movies or TV"
        className="search__input"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // обновляем запрос
      />
      {loading && <p>Loading...</p>}
      <div className="search__results">
        {
          results.length > 0
            ? results.map((result, index) => (
                <div key={index} className="search__result-item">
                  <p>{result.movie.title || result.movie.name}</p>{" "}
                  {/* название фильма */}
                </div>
              ))
            : !loading && query && <p>No results found</p> // если нет результатов
        }
      </div>
    </div>
  );
};

export default Search;
