import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../redux/store";

const usePageHandle = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.data.currentPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    handleNextPage,
    handlePreviousPage,
  };
};

export default usePageHandle;
