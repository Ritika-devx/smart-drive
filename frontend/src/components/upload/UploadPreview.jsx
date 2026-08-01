import React from 'react';
import { File, FileText, Image as ImageIcon, FileArchive, X, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { formatBytes } from '../../pages/Upload';
import UploadProgress from './UploadProgress';

function getFileMeta(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return { Icon: ImageIcon, chip: 'image' };
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return { Icon: FileArchive, chip: 'archive' };
  if (ext === 'pdf') return { Icon: FileText, chip: 'pdf' };
  if (['txt', 'doc', 'docx', 'md'].includes(ext)) return { Icon: FileText, chip: 'doc' };
  return { Icon: File, chip: 'file' };
}

export default function UploadPreview({ file, onRemove, onRetry }) {
  const { Icon, chip } = getFileMeta(file.name);
  const ext = file.name.split('.').pop().toUpperCase();

  return (
    <div className="sd-upload-file-row">
      <div className="sd-upload-file-top">
        <div className={`sd-upload-icon-chip sd-upload-icon-chip-${chip}`}>
          <Icon size={18} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sd-upload-file-name">{file.name}</div>
          <div className="sd-mono sd-upload-file-meta">{formatBytes(file.size)} · {ext}</div>
        </div>

        {file.badge === 'large' && <span className="sd-upload-badge-large">Large</span>}

        {file.status === 'done' && <CheckCircle2 size={19} color="var(--sd-green)" />}
        {file.status === 'error' && (
          <>
            <AlertCircle size={19} color="var(--sd-rose)" />
            <button className="sd-upload-btn sd-upload-btn-icon" onClick={onRetry} title="Retry">
              <RotateCcw size={14} />
            </button>
          </>
        )}

        <button className="sd-upload-btn sd-upload-btn-icon" onClick={onRemove} title="Remove">
          <X size={14} />
        </button>
      </div>

      {(file.status === 'uploading' || file.status === 'done') && (
        <UploadProgress progress={file.progress} status={file.status} />
      )}
    </div>
  );
}