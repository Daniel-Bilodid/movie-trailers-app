import React, { useState } from "react";
import "./sign.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { updateProfile } from "firebase/auth";

const Sign = ({ signModal, setSignModal }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: userName,
      });

      console.log("User registered:", userCredential.user);
      alert("Registration successful!");
      setSignModal("");
    } catch (error) {
      console.error("Error during registration:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="sign">
      <>
        <div className={signModal === "login" ? "box active" : "box"}>
          <span className="borderLine"></span>

          <form action="">
            <FontAwesomeIcon
              className="sign__icon"
              icon={faXmark}
              onClick={() => setSignModal("")}
            />
            <h2>Sign in</h2>
            <div className="inputBox">
              <input type="text" required />

              <span>Email</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input type="password" required />
              <span>Password</span>
              <i></i>
            </div>
            <div className="links">
              <a href="#">Forgot Password</a>
              <a href="#" onClick={() => setSignModal("sign")}>
                Signup
              </a>
            </div>
            <input type="submit" id="submit" value="Login" />
          </form>
        </div>
      </>
      <>
        <div className={signModal === "sign" ? "box sign__up active" : "box"}>
          <span className="borderLine"></span>

          <form action="" onSubmit={handleSignUp}>
            <FontAwesomeIcon
              className="sign__icon"
              icon={faXmark}
              onClick={() => setSignModal("")}
            />
            <h2>Sign in</h2>
            <div className="inputBox">
              <input
                type="text"
                required
                onChange={(e) => setUserName(e.target.value)}
              />

              <span>Username</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                type="password"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <span>Email</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span>Password</span>
              <i></i>
            </div>

            <div className="inputBox">
              <input
                type="password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span>Confirm Password</span>
              <i></i>
            </div>

            <input
              type="submit"
              id="submit"
              className="sign__btn"
              value="Register"
            />
          </form>
        </div>
      </>
    </div>
  );
};

export default Sign;
