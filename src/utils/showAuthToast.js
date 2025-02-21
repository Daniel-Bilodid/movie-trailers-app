// src/utils/showAuthToast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showAuthToast = () => {
  toast.error("Please log in to continue!");
};
