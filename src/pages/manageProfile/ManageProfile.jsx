import React, { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import "./manageProfile.scss";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";

const ManageProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const auth = getAuth();
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
          value={user ? user.displayName : ""}
          onChange={async (e) => {
            const newDisplayName = e.target.value;

            setUser((prev) => ({ ...prev, displayName: newDisplayName }));

            if (auth.currentUser) {
              try {
                await updateProfile(auth.currentUser, {
                  displayName: newDisplayName,
                });
                console.log("Profile updated successfully");

                onAuthStateChanged(auth, (updatedUser) => {
                  if (updatedUser) {
                    setUser(updatedUser);
                  }
                });
              } catch (error) {
                console.error("Error updating profile:", error);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ManageProfile;
