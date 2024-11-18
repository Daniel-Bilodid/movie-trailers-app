import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import "./manageProfile.scss";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

const ManageProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");

  const [newDisplayPhoto, setNewDisplayPhoto] = useState(user?.photoURL || "");
  const [toggleProfileEdit, setToggleProfileEdit] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const handleSave = async () => {
    if (!newDisplayName || !newDisplayPhoto) {
      console.warn("Display name or photo URL is empty, nothing to save.");
      return;
    }

    if (auth.currentUser) {
      try {
        const hasNameChanged = newDisplayName !== user?.displayName;
        const hasPhotoChanged = newDisplayPhoto !== user?.photoURL;

        if (hasNameChanged || hasPhotoChanged) {
          await updateProfile(auth.currentUser, {
            displayName: newDisplayName,
            photoURL: newDisplayPhoto,
          });

          console.log("Profile updated successfully");

          const userRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(
            userRef,
            {
              displayName: newDisplayName,
              photoURL: newDisplayPhoto,
            },
            { merge: true }
          );

          const avatarsRef = collection(
            db,
            "users",
            auth.currentUser.uid,
            "avatars"
          );
          const q = query(avatarsRef, where("photoURL", "==", newDisplayPhoto));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            await addDoc(avatarsRef, {
              photoURL: newDisplayPhoto,
              createdAt: new Date(),
            });
            console.log("New avatar added.");
          } else {
            console.log("Avatar with this URL already exists.");
          }

          // Перезагружаем данные пользователя
          await auth.currentUser.reload();
          setUser(auth.currentUser);

          // Обновляем состояние
          setNewDisplayName(newDisplayName);
          setNewDisplayPhoto(newDisplayPhoto);
        } else {
          console.log("No changes detected.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      console.warn("No file selected for upload.");
      return;
    }

    if (auth.currentUser) {
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/avatars/${file.name}`
      );
      try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);

        setNewDisplayPhoto(photoURL);
        console.log("File uploaded and URL obtained");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
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

  return (
    <>
      <div className="manage">
        <div className="manage__title">Edit Profile</div>
        <div className="manage__hr"></div>
        {!toggleProfileEdit ? (
          <div className="manage__wrapper">
            <div className="manage__icon">
              <img
                src={user?.photoURL || ""}
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
                <span>{user?.displayName || ""}</span>
                <img src={user?.photoURL || ""} alt="User Avatar" />
              </div>
            </div>
            <div className="manage__avatars-title">Your History: </div>
            <div className="manage__avatars-wrapper">
              {avatars.length > 0 ? (
                avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => setNewDisplayPhoto(avatar.photoURL)}
                  >
                    <img src={avatar.photoURL} alt={`Avatar ${avatar.id}`} />
                  </div>
                ))
              ) : (
                <p>No avatars found.</p>
              )}
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
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
          </div>
        )}
      </div>

      <button onClick={handleSave} className="manage__save-button">
        Save
      </button>
    </>
  );
};

export default ManageProfile;
