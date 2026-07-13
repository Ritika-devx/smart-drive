import { useState } from "react";
import api from "../../services/api";

function Search({ onSearch }) {
  const [name, setName] = useState("");

  const handleSearch = async () => {
    console.log("Token:", localStorage.getItem("token"));

    if (!name.trim()) {
      onSearch(null);
      return;
    }

    try {
      const response = await api.get(`/search?name=${name}`);

      console.log(response.data);

      onSearch(response.data.files);

    } catch (error) {
      console.log(error.response);

      onSearch([]);
    }
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