import React from 'react';

export default function UploadProgress({ progress, status }) {
  const isDone = status === 'done';
  return (
    <div className="sd-upload-progress-row">
      <div className="sd-upload-progress-track">
        <div
          className={`sd-upload-progress-fill ${isDone ? 'sd-upload-progress-fill-done' : 'sd-upload-progress-fill-active'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="sd-upload-progress-status" style={{ color: isDone ? 'var(--sd-green)' : 'var(--sd-text-mid)' }}>
        {isDone ? 'Completed' : `${progress}%`}
      </span>
    </div>
  );
}