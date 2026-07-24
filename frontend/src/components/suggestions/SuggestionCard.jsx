import { FiFileText } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import {
  HiOutlineExclamationTriangle,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { BsFiles } from "react-icons/bs";
import { MdOutlineAccessTime } from "react-icons/md";

function SuggestionCard({ file }) {
  const suggestionCount = file.suggestions.length;

  return (
    <div className="sd-card suggestion-card">

      {/* ================= HEADER ================= */}

      <div className="card-header">

        <div className="card-title">

          <div className="file-icon-wrapper">
            <FiFileText className="file-icon" />
          </div>

          <div>

            <h3 className="file-title">
              {file.filename}
            </h3>

            <div className="card-meta">

              <span className="file-tag">
                File
              </span>

              <span className="suggestion-count">
                {suggestionCount} Suggestion
                {suggestionCount !== 1 ? "s" : ""}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ================= EMPTY ================= */}

      {suggestionCount === 0 ? (

        <div className="healthy-card">

          <div className="healthy-icon">

            <HiOutlineCheckCircle />

          </div>

          <h4>Storage Healthy</h4>

          <p>
            No optimization is required for this file.
          </p>

          <span className="sd-badge sd-badge-normal">
            Healthy
          </span>

        </div>

      ) : (

        file.suggestions.map((item, index) => {

          let badge = "sd-badge-normal";

          if (item.type.toLowerCase().includes("duplicate"))
            badge = "sd-badge-duplicate";

          else if (item.type.toLowerCase().includes("large"))
            badge = "sd-badge-large";

          else if (item.type.toLowerCase().includes("old"))
            badge = "sd-badge-old";

          return (

            <div
              key={index}
              className="suggestion-box"
            >

              <div className="suggestion-header">

                <span className={`sd-badge ${badge}`}>

                  {item.type.toLowerCase().includes("duplicate") && (
                    <BsFiles />
                  )}

                  {item.type.toLowerCase().includes("large") && (
                    <HiOutlineExclamationTriangle />
                  )}

                  {item.type.toLowerCase().includes("old") && (
                    <MdOutlineAccessTime />
                  )}

                  {item.type.toLowerCase().includes("healthy") && (
                    <HiOutlineCheckCircle />
                  )}

                  {item.type}

                </span>

              </div>

              <div className="info-block">

                <h4>

                  <HiOutlineSparkles />

                  Reason

                </h4>

                <p>{item.reason}</p>

              </div>

              <div className="info-block">

                <h4>

                  <HiOutlineSparkles />

                  Recommendation

                </h4>

                <p>{item.action}</p>

              </div>

            </div>

          );

        })

      )}

    </div>
  );
}

export default SuggestionCard;