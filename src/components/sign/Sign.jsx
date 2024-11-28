import React from "react";
import "./sign.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const Sign = ({ signModal, setSignModal }) => {
  return (
    <div className="sign">
      <>
        <div className={signModal ? "box active" : "box"}>
          <span className="borderLine"></span>

          <form action="">
            <FontAwesomeIcon
              className="sign__icon"
              icon={faXmark}
              onClick={() => setSignModal(false)}
            />
            <h2>Sign in</h2>
            <div className="inputBox">
              <input type="text" required />

              <span>Username</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input type="password" required />
              <span>Password</span>
              <i></i>
            </div>
            <div className="links">
              <a href="#">Forgot Password</a>
              <a href="#">Signup</a>
            </div>
            <input type="submit" id="submit" value="Login" />
          </form>
        </div>
      </>
    </div>
  );
};

export default Sign;
