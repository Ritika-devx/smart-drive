// 

import { useState } from "react";
import { IoSearch } from "react-icons/io5";

function Search({ onSearch }) {
  const [name, setName] = useState("");

  const handleSearch = () => {
    onSearch(name.trim());
  };

  return (
    <div className="search-container">

      <div className="search-box">

        <IoSearch className="search-icon" />

        <input
          className="search-input"
          type="text"
          placeholder="Search files by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

      </div>

      <button
        className="sd-btn sd-btn-primary search-btn"
        onClick={handleSearch}
      >
        <IoSearch />
        Search
      </button>

    </div>
  );
}

export default Search;