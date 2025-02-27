import { auth, addUserToFirestore } from "../../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
} from "firebase/auth";

export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await addUserToFirestore(user);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
};

export const handleGithubSignIn = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await addUserToFirestore(user);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error(error);
  }
};

export const handleClickAuth = (e, user) => {
  if (!user) {
    e.preventDefault();
    console.log("Please sign in to bookmark.");
    return;
  }
};
