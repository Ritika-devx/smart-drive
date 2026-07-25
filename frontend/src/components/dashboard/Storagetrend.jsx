const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Storagetrend({ trend, loading = false }) {
  const points =
    Array.isArray(trend) && trend.length === 7
      ? trend
      : [12, 18, 22, 27, 30, 34, 38];

  const max = Math.max(...points, 1);

  return (
    <div className="sd-card sd-trend-card">
      <div className="sd-trend-header">
        <div>
          <div className="sd-trend-title">Storage Trend</div>
          <div className="sd-trend-sub">This Week</div>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--sd-text-low)",
          }}
        >
          Loading...
        </div>
      ) : (
        <>
          <div className="sd-trend-chart">
            {points.map((v, i) => (
              <div
                key={i}
                className="sd-trend-bar"
                style={{ height: `${(v / max) * 100}%` }}
                title={`${v} GB`}
              />
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {DAYS.map((d) => (
              <span key={d} className="sd-trend-label" style={{ flex: 1 }}>
                {d}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}