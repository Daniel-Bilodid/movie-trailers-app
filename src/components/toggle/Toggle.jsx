import { React, useState, useCallback, useEffect } from "react";
import { setContentType } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import "./toggle.scss";

const Toggle = () => {
  const dispatch = useDispatch();
  const currentContentType = useSelector(
    (state) => state.data.contentType || "Movie"
  );

  const [active, setActive] = useState(currentContentType);

  const onToggle = useCallback(
    (type) => {
      setActive(type);
      dispatch(setContentType(type));
    },
    [dispatch]
  );

  useEffect(() => {
    console.log("active toggle: ", active);
  }, [active]);

  return (
    <div className="toggle">
      <div className="toggle__wrapper">
        <div
          className={`toggle__slider ${active === "Movie" ? "movie" : "tv"}`}
        />
        <button
          className={`toggle__button ${active === "Movie" ? "active" : ""}`}
          onClick={() => onToggle("Movie")}
        >
          Movies
        </button>
        <button
          className={`toggle__button ${active === "TV" ? "active" : ""}`}
          onClick={() => onToggle("TV")}
        >
          TV Shows
        </button>
      </div>
    </div>
  );
};

export default Toggle;
