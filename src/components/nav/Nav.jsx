import React, { useState, useEffect } from "react";
import "./nav.scss";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase";

const Nav = () => {
  const [user, setUser] = useState(null);
  const [showSignInOptions, setShowSignInOptions] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <div className="nav">
        <div className="nav__logo">
          <p> Movie Trailers</p>
          <svg width="33" height="27" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m26.463.408 3.2 6.4h-4.8l-3.2-6.4h-3.2l3.2 6.4h-4.8l-3.2-6.4h-3.2l3.2 6.4h-4.8l-3.2-6.4h-1.6a3.186 3.186 0 0 0-3.184 3.2l-.016 19.2a3.2 3.2 0 0 0 3.2 3.2h25.6a3.2 3.2 0 0 0 3.2-3.2V.408h-6.4Z"
              fill="#FC4747"
            />
          </svg>
        </div>
        <div className="nav__wrapper">
          <div className="nav__wrapper-home">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 0H1C.4 0 0 .4 0 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11H1c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1ZM19 0h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1Z"
                fill="#5A698F"
              />
            </svg>
          </div>
          <div className="nav__wrapper-movie">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"
                fill="#5A698F"
              />
            </svg>
          </div>
          <div className="nav__wrapper-tv">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"
                fill="#5A698F"
              />
            </svg>
          </div>
          <div
            className="nav__wrapper-bookmark"
            onMouseEnter={() => !user && setShowAuthWarning(true)}
            onMouseLeave={() => setShowAuthWarning(false)}
          >
            <svg width="17" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.387 0c.202 0 .396.04.581.119.291.115.522.295.694.542.172.247.258.52.258.82v17.038c0 .3-.086.573-.258.82a1.49 1.49 0 0 1-.694.542 1.49 1.49 0 0 1-.581.106c-.423 0-.79-.141-1.098-.423L8.46 13.959l-5.83 5.605c-.317.29-.682.436-1.097.436-.202 0-.396-.04-.581-.119a1.49 1.49 0 0 1-.694-.542A1.402 1.402 0 0 1 0 18.52V1.481c0-.3.086-.573.258-.82A1.49 1.49 0 0 1 .952.119C1.137.039 1.33 0 1.533 0h13.854Z"
                fill="#5A698F"
              />
            </svg>
            {!user && showAuthWarning && (
              <p className="auth-warning">Please sign in account</p>
            )}
          </div>
          <div className="nav__wrapper-sign">
            {user ? (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowSignInOptions(!showSignInOptions)}
                  className="sign-button"
                >
                  Sign in
                </button>
                {showSignInOptions && (
                  <div className="nav__sign-in-options">
                    <div className="nav__warning">
                      Create account to save and retrieve bookmarks across your
                      devices
                    </div>
                    <button className="google-btn" onClick={handleGoogleSignIn}>
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                      />
                      Sign in with Google
                    </button>
                    <button className="github-btn" onClick={handleGithubSignIn}>
                      <img
                        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub logo"
                      />
                      Sign in with GitHub
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="nav__hr"></div>
    </>
  );
};

export default Nav;
