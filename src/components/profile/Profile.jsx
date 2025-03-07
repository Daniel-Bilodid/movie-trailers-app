import React, { useState, useContext, useEffect, useRef } from "react";
import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import profilePic from "../../assets/image-avatar.png";
import { onAuthStateChanged, getAuth } from "firebase/auth";
const Profile = ({ handleLogout }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [userProfilePic, setUserProfilePic] = useState(user.photoURL);

  function onProfileMenuToggle() {
    setToggleMenu((prevToggleMenu) => !prevToggleMenu);
  }

  useEffect(() => {
    console.log("user.photoURL updated:", user?.photoURL);
    setUserProfilePic(user?.photoURL || profilePic);
  }, [user?.photoURL]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggleMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile" ref={menuRef}>
      <div className="profile__wrapper">
        <div className="profile__pic" onClick={onProfileMenuToggle}>
          <img
            key={userProfilePic}
            src={userProfilePic ? userProfilePic : profilePic}
            alt="User Avatar"
          />
          {console.log("userProfilePic", userProfilePic)}

          <FontAwesomeIcon
            className={
              toggleMenu
                ? "profile__pic-drop profile__pic-drop-active"
                : "profile__pic-drop"
            }
            icon={faCaretDown}
          />
        </div>
        {console.log(toggleMenu)}
        <div className={toggleMenu ? "profile__menu active" : "profile__menu"}>
          <ul className="profile__menu-list">
            <Link className="profile__menu-item" to="/manage-profile">
              Manage Profile
            </Link>

            <Link className="profile__menu-item" to="/user-comments">
              Comments
            </Link>
            <Link className="profile__menu-item" to="/history">
              History
            </Link>
          </ul>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
