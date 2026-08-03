import React, { useState } from 'react';

/**
 * FileCard
 * ------------------------------------------------------------
 * Row-style card for a single file in the file manager. Shows
 * metadata, a status badge, and download / delete / archive
 * actions wired to the specified endpoints.
 *
 * Props:
 *  file: {
 *    id, name, type, size (bytes), uploadedAt (ISO),
 *    lastAccessed (ISO), status: 'normal'|'duplicate'|'old'|'large'
 *  }
 *  onDelete(id)   - called after a successful DELETE
 *  onArchive(id)  - called when "Archive" is pressed (parent owns the request)
 */

const TYPE_ICON = {
  image: '[IMG]', pdf: '[PDF]', video: '[VID]', audio: '[AUD]', archive: '[ZIP]', doc: '[DOC]', default: '[FILE]',
};

const STATUS_LABEL = {
  normal: 'Normal', duplicate: 'Duplicate', old: 'Old', large: 'Large',
};

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function FileCard({ file, onDelete, onArchive }) {
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleDownload = () => {
    window.open(`/api/download/${file.id}`, '_blank');
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${file.name}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/delete/${file.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Delete failed');
      setRemoved(true);
      setTimeout(() => onDelete?.(file.id), 250);
    } catch (err) {
      setBusy(false);
      window.alert(err.message || 'Could not delete file.');
    }
  };

  const handleArchive = () => {
    onArchive?.(file.id);
  };

  return (
    <div
      className="sd-card sd-anim-in"
      style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: removed ? 0 : 1,
        transform: removed ? 'scale(0.97)' : 'scale(1)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      <span
        style={{
          width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(91,124,255,0.1)', border: '1px solid var(--sd-glass-border)', fontSize: 11, flexShrink: 0,
        }}
      >
        {TYPE_ICON[file.type] || TYPE_ICON.default}
      </span>

      <div style={{ minWidth: 0, flex: '2 1 180px' }}>
        <div style={{ fontSize: 14, color: 'var(--sd-text-hi)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {file.name}
        </div>
        <div className="sd-mono" style={{ fontSize: 11, color: 'var(--sd-text-low)', marginTop: 2 }}>
          {file.type?.toUpperCase() || 'FILE'} - {formatBytes(file.size)}
        </div>
      </div>

      <div style={{ flex: '1 1 110px', fontSize: 12, color: 'var(--sd-text-mid)' }}>
        <div className="sd-eyebrow" style={{ fontSize: 9.5, marginBottom: 2 }}>Uploaded</div>
        {formatDate(file.uploadedAt)}
      </div>

      <div style={{ flex: '1 1 110px', fontSize: 12, color: 'var(--sd-text-mid)' }}>
        <div className="sd-eyebrow" style={{ fontSize: 9.5, marginBottom: 2 }}>Last accessed</div>
        {formatDate(file.lastAccessed)}
      </div>

      <div style={{ flex: '0 0 auto' }}>
        <span className={`sd-badge sd-badge-${file.status || 'normal'}`}>{STATUS_LABEL[file.status] || 'Normal'}</span>
      </div>

      <div style={{ display: 'flex', gap: 6, flex: '0 0 auto' }}>
        <button className="sd-btn sd-btn-ghost" title="Download" onClick={handleDownload} disabled={busy}>DL</button>
        <button className="sd-btn sd-btn-ghost" title="Archive" onClick={handleArchive} disabled={busy}>AR</button>
        <button className="sd-btn sd-btn-ghost sd-btn-danger" title="Delete" onClick={handleDelete} disabled={busy}>X</button>
      </div>
    </div>
  );
}