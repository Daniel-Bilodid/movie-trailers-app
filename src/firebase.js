import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
  getDocs,
  collection,
} from "firebase/firestore";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Добавляем пользователя в Firestore
export const addUserToFirestore = async (user) => {
  const userRef = doc(db, `users/${user.uid}`);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
  }
};

// Функция для добавления закладки
export const addBookmark = async (userId, bookmark) => {
  const bookmarksRef = collection(db, `users/${userId}/bookmarks`);
  await addDoc(bookmarksRef, bookmark);
};

// Функция для получения закладок
export const getBookmarks = async (userId) => {
  const bookmarksRef = collection(db, `users/${userId}/bookmarks`);
  const snapshot = await getDocs(bookmarksRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Обновляем данные пользователя
const updateUserInFirestore = async (userId, updatedData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updatedData);
    console.log("User updated in Firestore with ID: ", userId);
  } catch (error) {
    console.error("Error updating user in Firestore: ", error);
  }
};

// Удаляем пользователя из Firestore
const deleteUserFromFirestore = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    console.log("User deleted from Firestore with ID: ", userId);
  } catch (error) {
    console.error("Error deleting user from Firestore: ", error);
  }
};

// Экспортируем функции и объекты
export {
  auth,
  db,
  updateUserInFirestore,
  deleteUserFromFirestore,
  onAuthStateChanged,
};
