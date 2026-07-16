import { useEffect, useState } from "react";

import api from "../services/api";

import SuggestionCard from "../components/suggestions/SuggestionCard";
import SearchBar from "../components/suggestions/SearchBar";
import Filters from "../components/suggestions/Filters";

function Suggestions() {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  // ==========================
  // Fetch Files
  // ==========================
  const fetchFiles = async () => {

    try {

      setLoading(true);

      const response = await api.get("/search", {
        params: {
          name: searchTerm,
          category: category,
        },
      });

      setFiles(response.data.files);
      setError("");

    } catch (err) {

      console.error(err);

      setFiles([]);

      setError(
        err.response?.data?.message ||
        "Failed to fetch files"
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // Fetch whenever search/filter changes
  // ==========================
  useEffect(() => {

    fetchFiles();

  }, [searchTerm, category]);

  // ==========================
  // Search
  // ==========================
  const handleSearch = (value) => {

    setSearchTerm(value);

  };

  // ==========================
  // Filter
  // ==========================
  const handleFilter = (value) => {

    setCategory(value);

  };

  if (loading) {
    return <h2>Loading suggestions...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (

    <div className="suggestions-container">

      <h1>Smart Optimization Suggestions</h1>

      <SearchBar onSearch={handleSearch} />

      <Filters onFilter={handleFilter} />

      <hr style={{ margin: "25px 0" }} />

      <h2>Optimization Suggestions</h2>

      {files.length === 0 ? (

        <p>No files found.</p>

      ) : (

        files.map((file) => (

          <SuggestionCard
            key={file.id}
            file={file}
          />

        ))

      )}

    </div>

  );

}

export default Suggestions;