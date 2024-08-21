import React from "react";
import "./nav.scss";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";

// Авторизация через Google
const handleGoogleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Авторизация через GitHub
const handleGithubSignIn = () => {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.error(error);
    });
};

const Nav = () => {
  return (
    <>
      <div className="nav">
        <div className="nav__logo">LOGO</div>
        <div className="nav__wrapper">
          <div className="nav__wrapper-home">HOME</div>
          <div className="nav__wrapper-bookmark">MOVIE</div>
          <div className="nav__wrapper-tv">TV</div>
          <div className="nav__wrapper-bookmark">BOOKMARK</div>
          <div className="nav__wrapper-sign">
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            <button onClick={handleGithubSignIn}>Sign in with GitHub</button>
          </div>
        </div>
      </div>
      <div className="nav__hr"></div>
    </>
  );
};

export default Nav;
