import { useEffect, useState } from "react";
import api from "../services/api";

import {
  HiOutlineArrowPath,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

import { BsFiles } from "react-icons/bs";

import SuggestionCard from "../components/suggestions/SuggestionCard";
import SearchBar from "../components/suggestions/SearchBar";
import Filters from "../components/suggestions/Filters";

function Suggestions() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

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
      setError(err.response?.data?.message || "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [searchTerm, category]);

  /* ---------------- Statistics ---------------- */

  const totalFiles = files.length;

  const duplicateFiles = files.filter((file) =>
    file.suggestions?.some((s) =>
      s.type.toLowerCase().includes("duplicate")
    )
  ).length;

  const largeFiles = files.filter((file) =>
    file.suggestions?.some((s) =>
      s.type.toLowerCase().includes("large")
    )
  ).length;

  const oldFiles = files.filter((file) =>
    file.suggestions?.some((s) =>
      s.type.toLowerCase().includes("old")
    )
  ).length;

  return (
    <div className="sd-root">
      <div className="suggestions-page">

        {/* ================= HEADER ================= */}

        <div className="suggestions-header sd-card">

          <div>

            <p className="sd-eyebrow">
              SMART STORAGE
            </p>

            <h1 className="sd-h1">
              Smart Optimization
            </h1>

            <p className="suggestions-subtitle">
              Analyze your storage and discover duplicate,
              large and old files that can be cleaned up to
              improve organization and free valuable space.
            </p>

          </div>

          <button
            className="sd-btn sd-btn-primary"
            onClick={fetchFiles}
          >
            <HiOutlineArrowPath />
            Refresh
          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="stats-grid">

          <div className="sd-card stat-card">

            <div className="stat-icon blue">
              <HiOutlineDocumentText />
            </div>

            <div>

              <p>Total Files</p>

              <h2>{totalFiles}</h2>

            </div>

          </div>

          <div className="sd-card stat-card">

            <div className="stat-icon amber">
              <BsFiles />
            </div>

            <div>

              <p>Duplicate Files</p>

              <h2>{duplicateFiles}</h2>

            </div>

          </div>

          <div className="sd-card stat-card">

            <div className="stat-icon red">
              <HiOutlineExclamationTriangle />
            </div>

            <div>

              <p>Large Files</p>

              <h2>{largeFiles}</h2>

            </div>

          </div>

          <div className="sd-card stat-card">

            <div className="stat-icon slate">
              <HiOutlineClock />
            </div>

            <div>

              <p>Old Files</p>

              <h2>{oldFiles}</h2>

            </div>

          </div>

        </div>

        {/* ================= TOOLBAR ================= */}

        <div className="toolbar sd-card">

          <SearchBar onSearch={setSearchTerm} />

          <Filters onFilter={setCategory} />

        </div>

        {/* ================= RESULT COUNT ================= */}

        <div className="results-row">

          <h3>

            {files.length} Suggestion
            {files.length !== 1 ? "s" : ""}

          </h3>

        </div>

        {/* ================= CONTENT ================= */}

        {loading ? (

          <div className="sd-card state-card">
            Loading optimization suggestions...
          </div>

        ) : error ? (

          <div className="sd-card state-card error-state">
            {error}
          </div>

        ) : files.length === 0 ? (

          <div className="sd-card state-card">
            No files found.
          </div>

        ) : (

          <div className="suggestions-grid">

            {files.map((file) => (

              <SuggestionCard
                key={file.id}
                file={file}
              />

            ))}

          </div>

        )}

      </div>
    </div>
  );
}

export default Suggestions;