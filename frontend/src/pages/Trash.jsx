// import { useEffect, useState, useCallback } from 'react';
// import TrashCard from '../components/files/TrashCard';

// /**
//  * Trash
//  * ------------------------------------------------------------
//  * Lists files that have been moved to trash (soft-deleted) via
//  * GET /api/trash. Files can be restored (PUT /api/restore/:id)
//  * or permanently deleted (DELETE /api/trash/:id). "Empty Trash"
//  * wipes everything at once via DELETE /api/trash.
//  */

// export default function Trash() {
//   const [files, setFiles] = useState(null);
//   const [error, setError] = useState(null);
//   const [emptying, setEmptying] = useState(false);

//   const authHeaders = () => {
//     const token = localStorage.getItem('token');
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const loadTrash = useCallback(async () => {
//     setError(null);
//     try {
//       const res = await fetch('/api/trash', { headers: authHeaders() });
//       if (!res.ok) throw new Error(`Request failed (${res.status})`);
//       const json = await res.json();
//       const rawFiles = Array.isArray(json) ? json : json.files || [];

//       // Normalize backend field names (original_name, upload_date,
//       // deleted_at) to what the card expects (name, uploadedAt, deletedAt).
//       const normalized = rawFiles.map((f) => ({
//         id: f.id,
//         name: f.original_name || f.filename || 'Untitled',
//         type: (f.type || '').split('/')[0] || 'file',
//         size: Number(f.size || 0),
//         uploadedAt: f.upload_date,
//         deletedAt: f.deleted_at,
//       }));

//       setFiles(normalized);
//     } catch (err) {
//       setError(err.message || 'Could not load trash.');
//     }
//   }, []);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       if (!active) return;
//       await loadTrash();
//     })();
//     return () => {
//       active = false;
//     };
//   }, [loadTrash]);

//   const handleRestore = (id) => {
//     setFiles((prev) => prev.filter((f) => f.id !== id));
//   };

//   const handlePermanentDelete = (id) => {
//     setFiles((prev) => prev.filter((f) => f.id !== id));
//   };

//   const handleEmptyTrash = async () => {
//     if (!files || files.length === 0) return;
//     if (!window.confirm(`Permanently delete all ${files.length} file(s) in trash? This can't be undone.`)) return;

//     setEmptying(true);
//     try {
//       const res = await fetch('/api/trash', {
//         method: 'DELETE',
//         headers: authHeaders(),
//       });
//       if (!res.ok) throw new Error('Could not empty trash');
//       setFiles([]);
//     } catch (err) {
//       window.alert(err.message || 'Could not empty trash.');
//     } finally {
//       setEmptying(false);
//     }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
//         <div>
//           <div className="sd-eyebrow">File manager</div>
//           <h1 className="sd-h1" style={{ fontSize: 26, margin: '6px 0 0' }}>Trash</h1>
//         </div>
//         <button
//           className="sd-btn sd-btn-ghost sd-btn-danger"
//           onClick={handleEmptyTrash}
//           disabled={emptying || !files || files.length === 0}
//         >
//           {emptying ? 'Emptying…' : 'Empty Trash'}
//         </button>
//       </div>

//       {error && (
//         <div className="sd-card" style={{ padding: 14, borderColor: 'rgba(251,91,124,0.4)', color: 'var(--sd-rose)', fontSize: 13 }}>
//           {error}
//         </div>
//       )}

//       <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//         {files === null && <div className="sd-eyebrow">Loading trash…</div>}
//         {files !== null && files.length === 0 && (
//           <div className="sd-card" style={{ padding: 28, textAlign: 'center', color: 'var(--sd-text-low)', fontSize: 13 }}>
//             Trash is empty.
//           </div>
//         )}
//         {files !== null && files.map((file, idx) => (
//           <div key={file.id} style={{ animationDelay: `${idx * 35}ms` }}>
//             <TrashCard file={file} onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useCallback } from 'react';
import TrashCard from '../components/files/TrashCard';
import { categorizeType } from '../utils/fileType';

/**
 * Trash
 * ------------------------------------------------------------
 * Lists files that have been moved to trash (soft-deleted) via
 * GET /api/trash. Files can be restored (PUT /api/restore/:id)
 * or permanently deleted (DELETE /api/trash/:id). "Empty Trash"
 * wipes everything at once via DELETE /api/trash.
 */

export default function Trash() {
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);
  const [emptying, setEmptying] = useState(false);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadTrash = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/trash', { headers: authHeaders() });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      const rawFiles = Array.isArray(json) ? json : json.files || [];

      // Normalize backend field names (original_name, upload_date,
      // deleted_at) to what the card expects (name, uploadedAt, deletedAt).
      const normalized = rawFiles.map((f) => ({
        id: f.id,
        name: f.original_name || f.filename || 'Untitled',
        type: categorizeType(f.type),
        size: Number(f.size || 0),
        uploadedAt: f.upload_date,
        deletedAt: f.deleted_at,
      }));

      setFiles(normalized);
    } catch (err) {
      setError(err.message || 'Could not load trash.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await loadTrash();
    })();
    return () => {
      active = false;
    };
  }, [loadTrash]);

  const handleRestore = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePermanentDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleEmptyTrash = async () => {
    if (!files || files.length === 0) return;
    if (!window.confirm(`Permanently delete all ${files.length} file(s) in trash? This can't be undone.`)) return;

    setEmptying(true);
    try {
      const res = await fetch('/api/trash', {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Could not empty trash');
      setFiles([]);
    } catch (err) {
      window.alert(err.message || 'Could not empty trash.');
    } finally {
      setEmptying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="sd-eyebrow">File manager</div>
          <h1 className="sd-h1" style={{ fontSize: 26, margin: '6px 0 0' }}>Trash</h1>
        </div>
        <button
          className="sd-btn sd-btn-ghost sd-btn-danger"
          onClick={handleEmptyTrash}
          disabled={emptying || !files || files.length === 0}
        >
          {emptying ? 'Emptying…' : 'Empty Trash'}
        </button>
      </div>

      {error && (
        <div className="sd-card" style={{ padding: 14, borderColor: 'rgba(251,91,124,0.4)', color: 'var(--sd-rose)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {files === null && <div className="sd-eyebrow">Loading trash…</div>}
        {files !== null && files.length === 0 && (
          <div className="sd-card" style={{ padding: 28, textAlign: 'center', color: 'var(--sd-text-low)', fontSize: 13 }}>
            Trash is empty.
          </div>
        )}
        {files !== null && files.map((file, idx) => (
          <div key={file.id} style={{ animationDelay: `${idx * 35}ms` }}>
            <TrashCard file={file} onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}