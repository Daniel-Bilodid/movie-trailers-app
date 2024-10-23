import React from "react";
import "./authToast.scss";

const AuthToast = ({ show }) => {
  return (
    show && (
      <div className="toast">
        <p>Please auth</p>
      </div>
    )
  );
};

export default AuthToast;
