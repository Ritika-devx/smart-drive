import {
  FaExclamationTriangle,
  FaCopy,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";

const DuplicateModal = ({
  isOpen,
  fileName,
  onReplace,
  onKeepBoth,
  onCancel,
}) => {

  if (!isOpen) return null;

  return (

    <div className="duplicate-overlay">

      <div className="duplicate-modal">

        <FaExclamationTriangle className="warning-icon" />

        <h2>Duplicate File Detected</h2>

        <p className="duplicate-text">

          <strong>{fileName}</strong>

          <br />

          already exists in Smart Drive.

        </p>

        <p>

          What would you like to do?

        </p>

        <div className="duplicate-buttons">

          <button
            className="replace-btn"
            onClick={onReplace}
          >

            <FaSyncAlt />

            <span style={{ marginLeft: "8px" }}>
              Replace File
            </span>

          </button>

          <button
            className="keep-btn"
            onClick={onKeepBoth}
          >

            <FaCopy />

            <span style={{ marginLeft: "8px" }}>
              Keep Both
            </span>

          </button>

          <button
            className="cancel-btn"
            onClick={onCancel}
          >

            <FaTimes />

            <span style={{ marginLeft: "8px" }}>
              Cancel
            </span>

          </button>

        </div>

      </div>

    </div>

  );

};

export default DuplicateModal;