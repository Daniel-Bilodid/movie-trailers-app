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
import { db } from "../firebase";

export const handleSave = async (
  newDisplayName,
  newDisplayPhoto,
  setShowIconConfirmation,
  user,
  auth,
  updateProfile,
  setUser,
  setNewDisplayName,
  setNewDisplayPhoto
) => {
  console.log("im here");
  if (!newDisplayName || !newDisplayPhoto) {
    console.warn("Display name or photo URL is empty, nothing to save.");
    return;
  }
  setShowIconConfirmation(false);
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

        await auth.currentUser.reload();
        setUser(auth.currentUser);

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
