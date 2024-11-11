import React from "react";
import "./burger.scss";
import { Link } from "react-router-dom";
import NavList from "../navList/NavList";
const Burger = ({ isMenuOpen, handleIconClick, activeIcon }) => {
  return (
    <div className={isMenuOpen ? "burger active" : "burger"}>
      <div className="burger__wrapper">
        <div className="burger__list">
          <NavList isMenuOpen={isMenuOpen} />
        </div>
      </div>
    </div>
  );
};

export default Burger;
