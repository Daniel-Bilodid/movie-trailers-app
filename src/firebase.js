import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Добавляем пользователя в Firestore
const addUserToFirestore = async (user) => {
  if (auth.currentUser) {
    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(userRef, {
        email: user.email,
        // другие данные пользователя, если нужно
      });

      console.log("User added to Firestore");
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
    }
  } else {
    console.error("User is not authenticated");
  }
};

// Добавляем закладку в Firestore
const addBookmarkToUser = async (user, bookmark) => {
  if (auth.currentUser) {
    try {
      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", bookmark.id);

      await setDoc(bookmarkRef, {
        title: bookmark.title,
        url: bookmark.url,
        // другие данные закладки, если нужно
      });

      console.log("Bookmark added to Firestore");
    } catch (error) {
      console.error("Error adding bookmark to Firestore: ", error);
    }
  } else {
    console.error("User is not authenticated");
  }
};

export {
  auth,
  db,
  addUserToFirestore,
  addBookmarkToUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
