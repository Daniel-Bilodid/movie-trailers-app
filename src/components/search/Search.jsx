import React from "react";
import "./search.scss";

const Search = () => {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search Movies or TV"
        className="search__input"
      />
    </div>
  );
};

export default Search;
