import React from "react";
import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Profile = ({ handleLogout }) => {
  return (
    <div className="profile">
      <div className="profile__wrapper">
        <div className="profile__pic">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbbf_6MVz-RQB-3TQeFZEda67RDeErnkr3yA&s"
            alt="profile_picture"
          />

          <FontAwesomeIcon className="profile__pic-drop" icon={faCaretDown} />
        </div>

        <div className="profile__menu">
          <ul className="profile__menu-list">
            <li className="profile__menu-item">Manage Profile</li>
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
