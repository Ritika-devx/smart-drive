import React, { useState } from 'react';
import { FiRotateCcw } from 'react-icons/fi';

/**
 * ArchiveCard
 * ------------------------------------------------------------
 * Row-style card for a single archived file. Shows metadata plus
 * an Unarchive action to bring it back to My Files.
 *
 * Props:
 *  file: {
 *    id, name, type, size (bytes), uploadedAt (ISO), archivedAt (ISO)
 *  }
 *  onUnarchive(id) - called after a successful unarchive
 */

const TYPE_ICON = {
  image: '[IMG]', pdf: '[PDF]', video: '[VID]', audio: '[AUD]', archive: '[ZIP]', doc: '[DOC]', default: '[FILE]',
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

export default function ArchiveCard({ file, onUnarchive }) {
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUnarchive = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/unarchive/${file.id}`, {
        method: 'PUT',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Unarchive failed');
      setRemoved(true);
      setTimeout(() => onUnarchive?.(file.id), 250);
    } catch (err) {
      setBusy(false);
      window.alert(err.message || 'Could not unarchive file.');
    }
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
        <div className="sd-eyebrow" style={{ fontSize: 9.5, marginBottom: 2 }}>Archived</div>
        {formatDate(file.archivedAt)}
      </div>

      <div style={{ display: 'flex', gap: 6, flex: '0 0 auto' }}>
        <button
          className="sd-btn sd-btn-ghost"
          title="Move back to My Files"
          onClick={handleUnarchive}
          disabled={busy}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FiRotateCcw size={14} /> Unarchive
        </button>
      </div>
    </div>
  );
}