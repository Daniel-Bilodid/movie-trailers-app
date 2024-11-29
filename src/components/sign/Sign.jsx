import React, { useState } from "react";
import "./sign.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Sign = ({ signModal, setSignModal }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState(""); // Для логина
  const [loginPassword, setLoginPassword] = useState(""); // Для логина

  // Функция регистрации
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

      // Сохраняем username в профиле пользователя
      await updateProfile(user, { displayName: userName });

      // Сохраняем дополнительные данные в Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userName,
        createdAt: new Date(),
        photoURL:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Approve_icon.svg/2048px-Approve_icon.svg.png",
      });

      console.log("User registered and added to Firestore:", user.displayName);
      alert("Registration successful!");
      setSignModal("");
    } catch (error) {
      console.error("Error during registration:", error.message);
      alert(error.message);
    }
  };

  // Функция входа
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log("User logged in:", loginEmail);
      alert("Login successful!");
      setSignModal(""); // Закрываем модал
    } catch (error) {
      console.error("Error during login:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="sign">
      {/* Форма входа */}
      <div className={signModal === "login" ? "box active" : "box"}>
        <span className="borderLine"></span>
        <form onSubmit={handleLogin}>
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
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <span>Email</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
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

      {/* Форма регистрации */}
      <div className={signModal === "sign" ? "box sign__up active" : "box"}>
        <span className="borderLine"></span>
        <form onSubmit={handleSignUp}>
          <FontAwesomeIcon
            className="sign__icon"
            icon={faXmark}
            onClick={() => setSignModal("")}
          />
          <h2>Sign up</h2>
          <div className="inputBox">
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <span>Username</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="password"
              required
              value={confirmPassword}
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
    </div>
  );
};

export default Sign;
