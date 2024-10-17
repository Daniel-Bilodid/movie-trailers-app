import { React, useState, useCallback } from "react";
import { setContentType } from "../../redux/store";
import { useDispatch } from "react-redux";
import "./toggle.scss";

const Toggle = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState("Movie");

  const onToggle = useCallback(
    (type) => {
      setActive(type);
      dispatch(setContentType(type));
    },
    [dispatch]
  );

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
