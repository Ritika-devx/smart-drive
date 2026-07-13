import { useEffect, useState } from "react";

import SuggestionCard from "../components/suggestions/SuggestionCard";
import SearchBar from "../components/suggestions/SearchBar";

import { getSuggestions } from "../services/suggestionService";

function Suggestions() {

  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchSuggestions = async () => {

      try {

        const data = await getSuggestions();

        setFiles(data.data);
        setFilteredFiles(data.data);

      } catch (err) {

        setError(err.message || "Failed to load suggestions");

      } finally {

        setLoading(false);

      }

    };

    fetchSuggestions();

  }, []);

  const handleSearch = (results) => {

    if (results === null) {

      setFilteredFiles(files);

    } else {

      setFilteredFiles(results);

    }

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

      <hr style={{ margin: "25px 0" }} />

      <h2>Optimization Suggestions</h2>

      {filteredFiles.length === 0 ? (

        <p>No suggestions available.</p>

      ) : (

        filteredFiles.map((file) => (

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