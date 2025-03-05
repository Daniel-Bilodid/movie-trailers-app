import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";

import useBookmarkHandle from "../../hooks/useBookmarkHandle";
import { AuthContext } from "../../components/context/AuthContext";
import Search from "../../components/search/Search";

import Loading from "../../components/loading/Loading";
import ModalMovie from "../../components/modalMovie/ModalMovie";
import { showAuthToast } from "../../utils/showAuthToast";

import MovieCard from "../../components/movieCard/MovieCard";
import useAddHistory from "../../hooks/useAddHistory";
const SearchResult = () => {
  const data = useSelector((state) => state.data.value);

  const showToastState = useSelector((state) => state.toast.showToast);
  const [results, setResults] = useState(data);
  const [playVideo, setPlayVideo] = useState(null);
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { user } = useContext(AuthContext);

  const {
    movies,
    loading: bookmarksLoading,
    selected,

    handleBookmarkClick,
  } = useBookmarkHandle();

  useAddHistory(playVideo, movies, user, data[playVideo]?.item.type);

  const handlePlayVideo = (index) => {
    setPlayVideo(index);
    setCurrentTrailer(0);
  };

  const handleCloseModal = () => {
    setPlayVideo(null);
    setCurrentTrailer(0);
  };

  if (bookmarksLoading && user) {
    return <Loading />;
  }

  return (
    <>
      <div className="search__wrapper">
        <Search />
      </div>
      <h1>Search Results</h1>

      <div className="popular">
        <div className="popular__wrapper">
          {data &&
            data.map(({ item, trailers, release_year }, index) => {
              if (!item || !item.id) return null;

              return (
                <div key={item.id}>
                  <MovieCard
                    movie={item}
                    trailers={trailers}
                    release_year={release_year}
                    first_air_date={
                      item.type !== "Movie" ? item.first_air_date : ""
                    }
                    onPlayVideo={() => handlePlayVideo(index)}
                    onBookmarkClick={() =>
                      handleBookmarkClick(item.id, item.type)
                    }
                    movies={movies}
                    selected={() => selected(item.id)}
                    contentType={item.type}
                    user={user}
                    showAuthToast={showAuthToast}
                    showToastState={showToastState}
                  />
                </div>
              );
            })}
        </div>

        <ModalMovie
          isOpen={playVideo !== null}
          onClose={handleCloseModal}
          playVideo={playVideo}
          trailers={results}
          setTrailers={setResults}
          contentType={results[playVideo] ? results[playVideo].item.type : ""}
        />
      </div>
    </>
  );
};

export default SearchResult;
