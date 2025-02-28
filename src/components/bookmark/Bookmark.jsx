import React, { useEffect, useState, useContext } from "react";
import useBookmarks from "../../hooks/useBookmarks";

import { db, auth } from "../../firebase";

import { onAuthStateChanged } from "firebase/auth";

import useMovieTrailers from "../../hooks/useMovieTrailers";
import { useDispatch, useSelector } from "react-redux";
import { showToast, hideToast } from "../../redux/store";

import { AuthContext } from "../context/AuthContext";

import "./bookmark.scss";
import ModalMovie from "../modalMovie/ModalMovie.jsx";
import MovieCard from "../movieCard/MovieCard.jsx";

const Bookmarks = () => {
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [localMovies, setLocalMovies] = useState([]);
  const showToastState = useSelector((state) => state.toast.showToast);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const moviesFromStore = useSelector((state) => state.data.movies);

  const {
    playVideo,
    setPlayVideo,

    handleCloseModal,

    handleRemoveClick,
  } = useMovieTrailers();

  const { fetchBookmarks, loadMovies } = useBookmarks();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const bookmarksList = await fetchBookmarks(user.uid);
        await loadMovies(bookmarksList, dispatch);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    };

    fetchData();
  }, [user, dispatch, fetchBookmarks, loadMovies]);

  const handlePlayTrailer = (index) => {
    setPlayVideo(index);
  };

  const showAuthToast = () => {
    dispatch(showToast());
    setTimeout(() => {
      dispatch(hideToast());
    }, 5000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const bookmarksList = await fetchBookmarks(user.uid);
        setBookmarks(bookmarksList);
        if (bookmarksList.length > 0) {
          await loadMovies(bookmarksList);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLocalMovies(moviesFromStore);
    setLoading(false);
  }, [moviesFromStore]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bookmarks">
      <h1 className="bookmarks__title">Bookmarks</h1>
      <ul className="bookmarks__wrapper">
        {localMovies.length > 0 ? (
          localMovies.map((movie, index) => (
            <div key={movie.id}>
              <MovieCard
                movie={movie}
                trailers={localMovies}
                release_year={
                  movie.movieType === "Movie"
                    ? new Date(movie.release_date).getFullYear()
                    : movie.first_air_date
                    ? movie.first_air_date.slice(0, 4)
                    : "Unknown Year"
                }
                first_air_date={
                  movie.movieType !== "Movie" ? movie.first_air_date : ""
                }
                onPlayVideo={() => handlePlayTrailer(index)}
                handleRemoveClick={handleRemoveClick}
                movies={loadMovies}
                contentType={movie.movieType}
                user={user}
                showAuthToast={showAuthToast}
                showToastState={showToastState}
              />
            </div>
          ))
        ) : (
          <p>No bookmarks found</p>
        )}
      </ul>

      <ModalMovie
        isOpen={playVideo !== null}
        onClose={handleCloseModal}
        playVideo={playVideo}
        trailers={localMovies}
        setTrailers={setLocalMovies}
        contentType={localMovies}
      />
    </div>
  );
};

export default Bookmarks;
