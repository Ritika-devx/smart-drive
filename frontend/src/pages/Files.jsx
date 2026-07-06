import  { useEffect, useState, useCallback, useMemo } from 'react';
import FileCard from '../components/files/FileCard';

/**
 * Files
 * ------------------------------------------------------------
 * File manager page. Fetches the full file list from
 * GET /api/files, and can switch to GET /api/largest-files for
 * the "Largest" sort view. Delete removes the row via
 * DELETE /api/delete/:id (handled inside FileCard); archive is
 * surfaced as a callback so it can be wired to whatever archive
 * endpoint / mutation the team decides on.
 *
 * Expected item shape from both endpoints:
 * { id, name, type, size, uploadedAt, lastAccessed, status }
 */

const SORTS = [
  { key: 'recent',  label: 'Recent' },
  { key: 'name',    label: 'Name' },
  { key: 'size',    label: 'Size' },
  { key: 'largest', label: 'Largest' }, // uses /api/largest-files
];

export default function Files() {
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('recent');

  const authHeaders = () => {
    const token = localStorage.getItem('sd_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadFiles = useCallback(async (sortKey) => {
    setError(null);
    try {
      const endpoint = sortKey === 'largest' ? '/api/largest-files' : '/api/files';
      const res = await fetch(endpoint, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      setFiles(Array.isArray(json) ? json : json.files || []);
    } catch (err) {
      setError(err.message || 'Could not load files.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await loadFiles(sort);
    })();
    return () => {
      active = false;
    };
  }, [sort, loadFiles]);

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleArchive = async (id) => {
    // Archive endpoint not specified in the API list yet — optimistic
    // local update so the UI stays responsive; swap in a real request
    // (e.g. PATCH /api/archive/:id) once the backend exposes one.
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, archived: true } : f)));
  };

 const sortedFiles = useMemo(() => {
  if (!files) return [];
  if (sort === 'largest') return files;
  const copy = [...files];
  if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'size') copy.sort((a, b) => (b.size || 0) - (a.size || 0));
  if (sort === 'recent') copy.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  return copy;
}, [files, sort]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="sd-eyebrow">File manager</div>
          <h1 className="sd-h1" style={{ fontSize: 26, margin: '6px 0 0' }}>My files</h1>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SORTS.map((s) => (
            <button
              key={s.key}
              className="sd-btn sd-btn-ghost"
              style={sort === s.key ? {
                background: 'var(--sd-grad-primary)', border: 'none', boxShadow: 'var(--sd-shadow-glow-blue)', color: '#fff',
              } : undefined}
              onClick={() => {
                setFiles(null);
                setSort(s.key);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="sd-card" style={{ padding: 14, borderColor: 'rgba(251,91,124,0.4)', color: 'var(--sd-rose)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {files === null && <div className="sd-eyebrow">Loading files…</div>}
        {files !== null && sortedFiles.length === 0 && (
          <div className="sd-card" style={{ padding: 28, textAlign: 'center', color: 'var(--sd-text-low)', fontSize: 13 }}>
            No files yet. Upload something to see it here.
          </div>
        )}
        {files !== null && sortedFiles.map((file, idx) => (
          <div key={file.id} style={{ animationDelay: `${idx * 35}ms` }}>
            <FileCard file={file} onDelete={handleDelete} onArchive={handleArchive} />
          </div>
        ))}
      </div>
    </div>
  );
}