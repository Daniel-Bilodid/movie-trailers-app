import React from "react";
import "./toggle.scss";
const Toggle = () => {
  return (
    <div className="toggle">
      <div className="toggle__wrapper">
        <button className="toggle__movie">Movie</button>|
        <button className="toggle__tv">TV Shows</button>
      </div>
    </div>
  );
};

export default Toggle;
