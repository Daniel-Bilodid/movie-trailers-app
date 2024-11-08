import React from "react";
import "./burger.scss";
const Burger = ({ isMenuOpen }) => {
  return (
    <div className={isMenuOpen ? "burger active" : "burger"}>
      <div className="burger__wrapper">
        <ul className="burger__list">
          <li className="burger__list-item">All</li>
          <li className="burger__list-item">Movies</li>
          <li className="burger__list-item">TV</li>
          <li className="burger__list-item">Bookmarks</li>
          <li className="burger__list-item">Logout</li>
        </ul>
      </div>
    </div>
  );
};

export default Burger;
