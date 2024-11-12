import React, { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import "./manageProfile.scss";
const ManageProfile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="manage">
      <div className="manage__title">Edit Profile</div>
      <div className="manage__hr"></div>
      <div className="manage__wrapper">
        <div className="manage__icon">
          <img src={user ? user.photoURL : ""} alt="User Avatar" />
        </div>

        <input
          className="manage__name"
          type="text"
          placeholder={user ? user.displayName : ""}
        />
      </div>
    </div>
  );
};

export default ManageProfile;
