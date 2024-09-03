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

// Ваши конфигурационные параметры Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Auth и Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Экспортируем Firestore как db

// Функция для добавления пользователя в Firestore
const addUserToFirestore = async (user) => {
  if (auth.currentUser) {
    try {
      const userRef = doc(db, "users", user.uid); // Используем db вместо firestore

      await setDoc(userRef, {
        email: user.email,
        // добавьте другие данные пользователя здесь
      });

      console.log("User added to Firestore");
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
    }
  } else {
    console.error("User is not authenticated");
  }
};

export {
  auth,
  db, // Экспортируем db, чтобы использовать в других компонентах
  addUserToFirestore,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
