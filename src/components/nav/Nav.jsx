import React, { useState, useEffect } from "react";
import "./nav.scss";
import { onAuthStateChanged } from "firebase/auth";
import { auth, addUserToFirestore } from "../../firebase";

import { useNavigate, useLocation } from "react-router-dom";
import Burger from "../burger/Burger";
import NavList from "../navList/NavList";
const Nav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [activeIcon, setActiveIcon] = useState("home");
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await addUserToFirestore(currentUser);
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!user && location.pathname === "/bookmarks") {
      navigate("/");
    }
  }, [user, location.pathname, navigate]);

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
  };

  return (
    <>
      <div className="nav">
        <div className="nav__logo">
          <p> Movie Trailers</p>
          <svg width="33" height="27" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m26.463.408 3.2 6.4h-4.8l-3.2-6.4h-3.2l3.2 6.4h-4.8l-3.2-6.4h-3.2l3.2 6.4h-4.8l-3.2-6.4h-1.6a3.186 3.186 0 0 0-3.184 3.2l-.016 19.2a3.2 3.2 0 0 0 3.2 3.2h25.6a3.2 3.2 0 0 0 3.2-3.2V.408h-6.4Z"
              fill="#FC4747"
            />
          </svg>
        </div>
        <div className="nav__wrapper">
          <NavList isMenuOpen={isMenuOpen} />
        </div>
        <button className="nav__burger" onClick={toggleMenu}>
          Burger
        </button>

        <Burger
          isMenuOpen={isMenuOpen}
          handleIconClick={handleIconClick}
          activeIcon={activeIcon}
        />
      </div>
      <div className="nav__hr"></div>
    </>
  );
};

export default Nav;
