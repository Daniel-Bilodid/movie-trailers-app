import React from "react";
import "./authToast.scss";
import { motion } from "framer-motion";

const AuthToast = ({ show }) => {
  return (
    show && (
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="toast"
      >
        <p>Please login to bookmark</p>
      </motion.div>
    )
  );
};

export default AuthToast;
