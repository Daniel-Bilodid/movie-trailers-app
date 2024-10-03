import { React, useState, useCallback } from "react";
import { setContentType } from "../../redux/store";
import { useDispatch } from "react-redux";
import "./toggle.scss";

const Toggle = () => {
  const dispatch = useDispatch();

  const onToggle = useCallback((type) => {
    dispatch(setContentType(type));
  }, []);
  return (
    <div className="toggle">
      <div className="toggle__wrapper">
        <button className="toggle__movie" onClick={() => onToggle("Movie")}>
          Movie
        </button>
        |
        <button className="toggle__tv" onClick={() => onToggle("TV")}>
          TV Shows
        </button>
      </div>
    </div>
  );
};

export default Toggle;
