import React, { useState, useContext, useEffect } from "react";
import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
const Profile = ({ handleLogout }) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const { user } = useContext(AuthContext);
  const [userProfilePic, setUserProfilePic] = useState(user.photoUrl);

  function OnProfileMenuToggle() {
    setToggleMenu((prevToggleMenu) => !prevToggleMenu);
  }

  useEffect(() => {
    setUserProfilePic(user.photoURL);
    console.log(user.photoURL);
    console.log(user);
  }, [user, user.photoURL]);

  return (
    <div className="profile">
      <div className="profile__wrapper">
        <div className="profile__pic" onClick={OnProfileMenuToggle}>
          <img src={userProfilePic} alt="User Avatar" />

          <FontAwesomeIcon className="profile__pic-drop" icon={faCaretDown} />
        </div>

        <div className={toggleMenu ? "profile__menu active" : "profile__menu"}>
          <ul className="profile__menu-list">
            <Link className="profile__menu-item" to="/manage-profile">
              Manage Profile
            </Link>

            <li className="profile__menu-item">Account</li>
            <li className="profile__menu-item">Smth</li>
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
