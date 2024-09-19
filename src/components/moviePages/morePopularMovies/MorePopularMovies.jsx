import React, { useState, useCallback, useEffect } from "react";
import MovieList from "../../movieList/MovieList";
import { fetchPopularMovies } from "../../../utils/fetchTrailers";
import Modal from "../../movieModal/MovieModal";
import useMovieTrailers from "../../../hooks/useMovieTrailers";

const MorePopularMovies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { loadTrailers } = useMovieTrailers(fetchPopularMovies);

  const fetchPageData = useCallback(() => {
    loadTrailers(currentPage);
  }, [currentPage, loadTrailers]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  return (
    <>
      <MovieList
        fetchMovies={fetchPopularMovies}
        title="Popular Movies"
        moreLink="/more-popular"
      />
      <div className="pagination">
        <button
          className="pagination__button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <button className="pagination__button" onClick={handleNextPage}>
          Next Page
        </button>
      </div>
    </>
  );
};

export default MorePopularMovies;
