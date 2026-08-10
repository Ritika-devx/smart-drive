import { useState, useEffect } from "react";
import StatsCards from "../components/dashboard/StatsCards";
import StorageChart from "../components/dashboard/StorageChart";
import Storagetrend from "../components/dashboard/Storagetrend";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import Quickactions from "../components/dashboard/Quickactions";

export default function Dashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/dashboard", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Unable to load dashboard");
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      loadDashboard();
    });
  }, []);

  const stats = data?.stats || {};
  const breakdown = data?.breakdown || {};

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const firstName =
    storedUser?.name || storedUser?.username || storedUser?.email?.split("@")[0] || "User";

  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 17
      ? "Good Afternoon"
      : "Good Evening";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="sd-dashboard">
      {/* ===========================
          HEADER
      ============================ */}

      <div className="sd-dashboard-header">
        <div>
          <div className="sd-dashboard-title">
            {greeting}, {firstName} 
          </div>

          <div className="sd-dashboard-subtitle">
            Welcome back to Smart Drive. Manage, organize and optimize your
            storage effortlessly.
          </div>

          <div className="sd-dashboard-date">{today}</div>
        </div>
      </div>

      {error && (
        <div
          className="sd-card"
          style={{
            padding: 16,
            marginBottom: 20,
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* ===========================
          STATS
      ============================ */}

      <StatsCards stats={stats} loading={loading} />

      {/* ===========================
          STORAGE ROW
      ============================ */}

      <div
        className="sd-dashboard-storage"
        style={{ marginTop: 24 }}
      >
        <StorageChart
          totalBytes={stats.totalStorage}
          breakdown={breakdown}
          loading={loading}
          onNavigate={onNavigate}
        />

        <Storagetrend trend={data?.trend} loading={loading} />
      </div>

      {/* ===========================
          RECENT FILES / QUICK ACTIONS / ACTIVITY
      ============================ */}

      <div
        className="sd-bottom-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          marginTop: 24,
          alignItems: "start",
        }}
      >
        <ActivityFeed events={data?.activity || []} loading={loading} live />

        <Quickactions onNavigate={onNavigate} />
      </div>

      {/* ===========================
          STORAGE HEALTH
      ============================ */}

      <div
        className="sd-card"
        style={{
          marginTop: 24,
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div className="sd-eyebrow">STORAGE HEALTH</div>

          <div
            style={{
              marginTop: 8,
              fontSize: 20,
              fontWeight: 700,
              color: "var(--sd-text-hi)",
            }}
          >
            {stats.totalFiles || 0} Files Stored
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "var(--sd-text-low)",
            }}
          >
            Keep your storage organized by removing duplicate, unused and
            large files regularly.
          </div>
        </div>

        <button
          className="sd-btn sd-btn-primary"
          style={{ padding: "10px 22px", borderRadius: 12, fontWeight: 700 }}
          onClick={() => onNavigate?.("files")}
        >
          View My Files →
        </button>
      </div>

      {/* ===========================
          RESPONSIVE
      ============================ */}

      <style>{`
        .sd-dashboard{
          animation:fadeDashboard .4s ease;
        }

        @media (max-width:768px){
          .sd-dashboard-title{
            font-size:28px !important;
          }
          .sd-dashboard-subtitle{
            font-size:13px !important;
          }
        }

        @media (max-width:600px){
          .sd-card{
            padding:18px !important;
          }
        }
      `}</style>
    </div>
  );
}