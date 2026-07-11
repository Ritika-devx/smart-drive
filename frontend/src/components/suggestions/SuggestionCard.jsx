function SuggestionCard({ file }) {
  return (
    <div className="suggestion-card">

      <h3>{file.filename}</h3>

      {file.suggestions.length === 0 ? (

        <p>No optimization suggestions.</p>

      ) : (

        <div>

          {file.suggestions.map((item, index) => (

            <div
              key={index}
              className="suggestion-item"
              style={{
                marginBottom: "15px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px"
              }}
            >

              <h4>{item.type}</h4>

              <p>
                <strong>Reason:</strong> {item.reason}
              </p>

              <p>
                <strong>Recommendation:</strong> {item.action}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SuggestionCard;