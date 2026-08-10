import { useEffect, useState, useCallback } from 'react';
import FileCard from '../components/files/FileCard';
import { categorizeType } from '../utils/fileType';

/**
 * Recent
 * ------------------------------------------------------------
 * Recently uploaded files — moved here from the Dashboard's old
 * "Just landed" widget so it has its own full page with real
 * open / download / archive / delete actions via FileCard.
 * ("Live Activity" stays on the Dashboard.)
 */

export default function Recent() {
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadRecent = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/files', { headers: authHeaders() });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      const rawFiles = Array.isArray(json) ? json : json.files || [];

      const normalized = rawFiles.map((f) => ({
        id: f.id,
        name: f.original_name || f.filename || 'Untitled',
        type: categorizeType(f.type),
        size: Number(f.size || 0),
        uploadedAt: f.upload_date,
        lastAccessed: f.last_accessed,
        status: f.suggestion || (f.duplicate_flag ? 'duplicate' : 'normal'),
      }));

      normalized.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));

      setFiles(normalized.slice(0, 20));
    } catch (err) {
      setError(err.message || 'Could not load recent files.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await loadRecent();
    })();
    return () => { active = false; };
  }, [loadRecent]);

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleArchive = async (id) => {
    try {
      const res = await fetch(`/api/archive/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Could not archive file');
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      window.alert(err.message || 'Could not archive file.');
    }
  };

  const handleDownload = (id) => {
    setFiles((prev) => prev.map((f) => (
      f.id === id ? { ...f, lastAccessed: new Date().toISOString() } : f
    )));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div className="sd-eyebrow">File manager</div>
        <h1 className="sd-h1" style={{ fontSize: 26, margin: '6px 0 0' }}>Recent</h1>
      </div>

      {error && (
        <div className="sd-card" style={{ padding: 14, borderColor: 'rgba(251,91,124,0.4)', color: 'var(--sd-rose)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {files === null && <div className="sd-eyebrow">Loading recent files…</div>}
        {files !== null && files.length === 0 && (
          <div className="sd-card" style={{ padding: 28, textAlign: 'center', color: 'var(--sd-text-low)', fontSize: 13 }}>
            No files uploaded yet.
          </div>
        )}
        {files !== null && files.map((file, idx) => (
          <div key={file.id} style={{ animationDelay: `${idx * 35}ms` }}>
            <FileCard
              file={file}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onDownload={handleDownload}
            />
          </div>
        ))}
      </div>
    </div>
  );
}