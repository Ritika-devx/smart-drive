
import { useState } from "react";

function Search({ onSearch }) {

  const [name, setName] = useState("");

  const handleSearch = () => {

    onSearch(name);

  };

  return (

    <div style={{ marginBottom: "20px" }}>

      <input
        type="text"
        placeholder="Search file..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleSearch}>
        Search
      </button>

    </div>

  );

}

export default Search;