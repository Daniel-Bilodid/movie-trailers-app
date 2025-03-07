import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import "./manageProfile.scss";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { handleSave } from "../../utils/handleProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faArrowLeftLong,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";

import profilePic from "../../assets/image-avatar.png";
import imgPlaceholder from "../../assets/image-placeholder.png";

const ManageProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");

  const [newDisplayPhoto, setNewDisplayPhoto] = useState(user?.photoURL || "");
  const [toggleProfileEdit, setToggleProfileEdit] = useState(false);

  const [showIconConfirmation, setShowIconConfirmation] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  const openIconConfirmation = () => {
    setShowIconConfirmation(true);
  };

  const closeIconConfirmation = () => {
    setShowIconConfirmation(false);
  };

  const uploadToImgdb = async (file) => {
    const apiKey = process.env.REACT_APP_IMGDB_APIKEY;
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        console.error("Error uploading image to imgdb:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error uploading to imgdb:", error);
      return null;
    }
  };
  const handleFileUpload = async (file) => {
    if (!file) {
      console.warn("No file selected for upload.");
      return;
    }

    try {
      const photoURL = await uploadToImgdb(file);

      if (photoURL) {
        setNewDisplayPhoto(photoURL);
        console.log("File uploaded to imgdb and URL obtained:", photoURL);
      } else {
        console.warn("Failed to upload file to imgdb.");
      }
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
    }
  };

  function onProfileToggle() {
    setToggleProfileEdit((prevState) => !prevState);
  }

  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      if (auth.currentUser) {
        try {
          const avatarsRef = collection(
            db,
            "users",
            auth.currentUser.uid,
            "avatars"
          );

          const querySnapshot = await getDocs(avatarsRef);

          const avatarsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAvatars(avatarsData);
        } catch (error) {
          console.error("Error fetching avatars:", error);
        }
      }
    };

    fetchAvatars();
  }, [auth.currentUser]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <div className="manage">
        <div className="manage__title">Edit Profile</div>
        <div className="manage__hr"></div>
        {!toggleProfileEdit ? (
          <div className="manage__wrapper">
            <div className="manage__icon">
              <img
                src={newDisplayPhoto || user?.photoURL || profilePic}
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
            {showIconConfirmation ? (
              <div className="manage__confirmation">
                <div className="manage__confirmation-wrapper">
                  <div className="manage__confirmation-title">
                    Change profile icon?
                  </div>

                  <div className="manage__confirmation-hr"></div>

                  <div className="manage__confirmation-icons">
                    <div className="manage__confirmation-icons-old">
                      <div className="manage__conf-wrapper">
                        <img
                          src={user.photoURL}
                          alt={`user`}
                          className="manage__avatars-avatar"
                        />
                        <span className="test">Current</span>
                      </div>

                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="manage__avatars-icon"
                      />
                      <div className="manage__conf-wrapper">
                        <img
                          src={newDisplayPhoto}
                          alt={`user`}
                          className="manage__avatars-avatar"
                        />
                        <span className="test">New</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="manage__avatar-wrapper">
                  <FontAwesomeIcon
                    icon={faArrowLeftLong}
                    className="manage__avatar-back"
                    onClick={onProfileToggle}
                  />

                  <div className="manage__avatar-user">
                    <span>{user?.displayName || ""}</span>
                    <img
                      src={newDisplayPhoto || user?.photoURL || imgPlaceholder}
                      alt="User Avatar"
                      className="manage__avatars-avatar"
                    />
                  </div>
                </div>
                <div className="manage__avatars-title">Your History: </div>
                {avatars.length !== 0 ? (
                  <Slider {...settings} className="manage__avatars-wrapper">
                    {avatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        onClick={() => {
                          setNewDisplayPhoto(avatar.photoURL);
                          openIconConfirmation();
                        }}
                      >
                        <img
                          src={avatar.photoURL || user.photoURL}
                          alt={`Avatar ${avatar.id}`}
                          className="manage__avatars-avatar"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  "No avatars in your history. Add a new one!"
                )}
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
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </div>
              </>
            )}
          </div>
        )}
        <div
          className={showIconConfirmation ? "manage__confirmation-btns" : ""}
        >
          <button
            onClick={() =>
              handleSave(
                newDisplayName,
                newDisplayPhoto,
                setShowIconConfirmation,
                user,
                auth,
                updateProfile,
                setUser,
                setNewDisplayName,
                setNewDisplayPhoto
              )
            }
            className={
              showIconConfirmation
                ? "manage__save-button manage__confirmation-btn"
                : "manage__save-button"
            }
          >
            {showIconConfirmation ? "Let`s do it" : "Save"}
          </button>
          {showIconConfirmation ? (
            <button
              onClick={closeIconConfirmation}
              className={
                showIconConfirmation
                  ? "manage__exit-button manage__confirmation-btn"
                  : "manage__exit-button"
              }
            >
              Not yet
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ManageProfile;
