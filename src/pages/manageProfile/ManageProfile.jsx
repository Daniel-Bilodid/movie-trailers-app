import React, { useContext, useState } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import "./manageProfile.scss";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const ManageProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [newDisplayName, setNewDisplayName] = useState(
    user ? user.displayName : ""
  );

  const [newDisplayPhoto, setNewDisplayPhoto] = useState(
    user ? user.photoURL : ""
  );
  const [toggleProfileEdit, setToggleProfileEdit] = useState(false);
  const auth = getAuth();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSave = async (file) => {
    if (auth.currentUser) {
      try {
        let updatedPhotoURL = newDisplayPhoto;

        if (file) {
          const storage = getStorage();
          const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);

          await uploadBytes(storageRef, file);
          console.log("File uploaded successfully");

          updatedPhotoURL = await getDownloadURL(storageRef);
        }

        await updateProfile(auth.currentUser, {
          displayName: newDisplayName,
          photoURL: newDisplayPhoto || updatedPhotoURL,
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
  };
  function onProfileToggle() {
    setToggleProfileEdit((prevState) => !prevState);
  }

  return (
    <>
      <div className="manage">
        <div className="manage__title">Edit Profile</div>
        <div className="manage__hr"></div>
        {!toggleProfileEdit ? (
          <div className="manage__wrapper">
            <div className="manage__icon">
              <img
                src={user ? user.photoURL : ""}
                alt="User Avatar"
                onError={(e) => {
                  e.target.src = "";
                  console.error("Error loading image:", e.target.src);
                }}
              />

              <button className="avatar__icon-circle" onClick={onProfileToggle}>
                <FontAwesomeIcon icon={faPen} className="avatar-edit-icon" />
              </button>
            </div>

            <input
              className="manage__name"
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
            />
          </div>
        ) : (
          <div className="manage__avatar">
            <div className="manage__avatar-wrapper">
              <FontAwesomeIcon
                icon={faArrowLeftLong}
                className="manage__avatar-back"
                onClick={onProfileToggle}
              />

              <div className="manage__avatar-user">
                <span>{user ? user.displayName : ""}</span>
                <img src={user ? user.photoURL : ""} alt="User Avatar" />
              </div>
            </div>

            <div className="manage__avatar-link">
              <span>Add avatar via link</span>
              <input
                type="text"
                className="manage__avatar-input"
                placeholder="Add link to change your avatar"
                onChange={(e) => setNewDisplayPhoto(e.target.value)}
              />
            </div>
            <div
              className="manage__avatar-file"
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <span>Add avatar via file</span>
              <input
                type="file"
                className="manage__avatar-drop"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => handleSave(selectedFile)}
        className="manage__save-button"
      >
        Save
      </button>
    </>
  );
};

export default ManageProfile;
