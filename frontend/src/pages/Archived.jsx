import { useEffect, useState, useCallback } from 'react';
import ArchiveCard from '../components/files/ArchiveCard';
import { categorizeType } from '../utils/fileType';
import { getToken } from "../utils/authStorage";

/**
 * Archived
 * ------------------------------------------------------------
 * Lists files that have been archived via GET /api/archived.
 * Files can be brought back with PUT /api/unarchive/:id.
 */

export default function Archived() {
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);

  const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadArchived = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/archived', { headers: authHeaders() });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      const rawFiles = Array.isArray(json) ? json : json.files || [];

      const normalized = rawFiles.map((f) => ({
        id: f.id,
        name: f.original_name || f.filename || 'Untitled',
        type: categorizeType(f.type),
        size: Number(f.size || 0),
        uploadedAt: f.upload_date,
        archivedAt: f.archived_at,
      }));

      setFiles(normalized);
    } catch (err) {
      setError(err.message || 'Could not load archived files.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await loadArchived();
    })();
    return () => {
      active = false;
    };
  }, [loadArchived]);

  const handleUnarchive = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div className="sd-eyebrow">File manager</div>
        <h1 className="sd-h1" style={{ fontSize: 26, margin: '6px 0 0' }}>Archived</h1>
      </div>

      {error && (
        <div className="sd-card" style={{ padding: 14, borderColor: 'rgba(251,91,124,0.4)', color: 'var(--sd-rose)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {files === null && <div className="sd-eyebrow">Loading archived files…</div>}
        {files !== null && files.length === 0 && (
          <div className="sd-card" style={{ padding: 28, textAlign: 'center', color: 'var(--sd-text-low)', fontSize: 13 }}>
            No archived files.
          </div>
        )}
        {files !== null && files.map((file, idx) => (
          <div key={file.id} style={{ animationDelay: `${idx * 35}ms` }}>
            <ArchiveCard file={file} onUnarchive={handleUnarchive} />
          </div>
        ))}
      </div>
    </div>
  );
}