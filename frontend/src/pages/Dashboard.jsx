import React, { useState, useEffect, useCallback } from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import StorageChart from '../components/dashboard/StorageChart';
import RecentUploads from '../components/dashboard/RecentUploads';
import ActivityFeed from '../components/dashboard/ActivityFeed';

/**
 * Dashboard
 * ------------------------------------------------------------
 * Top-level analytics page. Fetches GET /api/dashboard once on
 * mount and hands the relevant slices down to child components.
 *
 * Expected response shape from GET /api/dashboard:
 * {
 *   stats: {
 *     totalFiles, totalStorage, duplicateFiles,
 *     oldUnusedFiles, largeFiles, wastedStorage
 *   },
 *   breakdown: { normal, duplicate, old, large },   // bytes, sums to totalStorage
 *   recentUploads: [{ id, name, type, size, uploadedAt }],
 *   activity: [{ id, type, message, timestamp }]
 * }
 */

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('sd_token');
      const res = await fetch('/api/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || 'Could not load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // schedule the load after paint to avoid synchronous setState inside effect
    Promise.resolve().then(loadDashboard);
  }, [loadDashboard]);

  const stats = data?.stats || {};
  const breakdown = data?.breakdown || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div className="sd-eyebrow">Overview</div>
          <h1 className="sd-h1" style={{ fontSize: 26, margin: '6px 0 0' }}>Storage dashboard</h1>
        </div>
        <button className="sd-btn sd-btn-ghost" onClick={loadDashboard} disabled={loading}>
          ⟳ {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="sd-card" style={{ padding: 14, borderColor: 'rgba(251,91,124,0.4)', color: 'var(--sd-rose)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <StatsCards stats={stats} loading={loading} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)',
          gap: 18,
        }}
        className="sd-dashboard-grid"
      >
        <StorageChart totalBytes={stats.totalStorage} breakdown={breakdown} loading={loading} />
        <ActivityFeed events={data?.activity || []} loading={loading} live />
      </div>

      <RecentUploads files={data?.recentUploads || []} loading={loading} />

      <style>{`
        @media (max-width: 820px) {
          .sd-dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}