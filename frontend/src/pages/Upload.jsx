import React, { useState, useCallback, useRef } from 'react';
import UploadBox from '../components/upload/UploadBox';
import UploadPreview from '../components/upload/UploadPreview';
import { AlertTriangle, UploadCloud, FileText, PieChart, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const LARGE_FILE_THRESHOLD = 25 * 1024 * 1024;

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function UploadIllustration() {
  return (
    <div style={{ marginLeft: 'auto', alignSelf: 'flex-start', width: '110px', height: '90px', position: 'relative' }}>
      <svg viewBox="0 0 130 110" width="110" height="90" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="sdFolderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--sd-blue)" />
            <stop offset="100%" stopColor="var(--sd-violet)" />
          </linearGradient>
        </defs>

        {/* soft ground shadow */}
        <ellipse cx="65" cy="98" rx="42" ry="7" fill="var(--sd-violet)" opacity="0.08" />

        {/* white file card, back */}
        <rect x="52" y="18" width="30" height="38" rx="4" fill="var(--sd-glass)" stroke="var(--sd-glass-border)" transform="rotate(-8 67 37)" />

        {/* blue image card, front */}
        <g transform="rotate(6 60 32)">
          <rect x="42" y="14" width="34" height="32" rx="5" fill="var(--sd-glass)" stroke="var(--sd-glass-border)" />
          <circle cx="51" cy="24" r="3.2" fill="var(--sd-blue)" opacity="0.5" />
          <path d="M45 40 L56 29 L63 36 L72 27 L72 40 Z" fill="var(--sd-blue)" opacity="0.35" />
        </g>

        {/* folder back flap */}
        <path d="M18 46 L48 46 L54 38 L112 38 L112 92 Q112 96 108 96 L22 96 Q18 96 18 92 Z" fill="url(#sdFolderGrad)" opacity="0.55" />

        {/* folder front */}
        <path d="M14 50 Q14 46 18 46 L112 46 Q116 46 116 50 L116 92 Q116 96 112 96 L18 96 Q14 96 14 92 Z" fill="url(#sdFolderGrad)" />

        {/* sparkles */}
        <g fill="var(--sd-violet)" opacity="0.55">
          <path d="M100 8 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" />
        </g>
        <g fill="var(--sd-blue)" opacity="0.45">
          <path d="M14 14 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4 Z" />
        </g>
        <circle cx="118" cy="60" r="2" fill="var(--sd-violet)" opacity="0.5" />
      </svg>
    </div>
  );
}

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [duplicatePrompt, setDuplicatePrompt] = useState(null);
  const [toast, setToast] = useState(null);
  const pendingQueueRef = useRef([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isDuplicateName = (name) =>
    files.some((f) => f.name === name && f.status !== 'error');

  const enqueueFiles = useCallback((incomingFiles) => {
    const list = Array.from(incomingFiles);
    const queue = [];

    for (const file of list) {
      if (file.size > MAX_FILE_SIZE) {
        showToast(`${file.name} exceeds 100MB limit`, 'error');
        continue;
      }
      if (isDuplicateName(file.name)) {
        queue.push(file);
        continue;
      }
      addToUploadList(file);
    }

    if (queue.length) {
      pendingQueueRef.current = queue;
      setDuplicatePrompt({ incoming: queue[0] });
    }
  }, [files]);

  const addToUploadList = (file, overrideName = null) => {
    const id = genId();
    const name = overrideName || file.name;
    const badge = file.size > LARGE_FILE_THRESHOLD ? 'large' : 'normal';

    setFiles((prev) => [
      ...prev,
      { id, file, name, size: file.size, progress: 0, status: 'uploading', badge },
    ]);

    uploadFile(id, file, name);
  };

  const uploadFile = (id, file, name) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file, name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const progress = Math.round((e.loaded / e.total) * 100);
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress: 100, status: 'done' } : f)));
        showToast(`${name} uploaded successfully`, 'success');
      } else {
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'error' } : f)));
        showToast(`${name} failed to upload`, 'error');
      }
    };

    xhr.onerror = () => {
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'error' } : f)));
      showToast(`${name} failed to upload`, 'error');
    };

    xhr.send(formData);
  };

  const resolveDuplicate = (action) => {
    const [current, ...rest] = pendingQueueRef.current;
    if (!current) return;

    if (action === 'replace') {
      setFiles((prev) => prev.filter((f) => f.name !== current.name));
      addToUploadList(current);
    } else if (action === 'keep-both') {
      const ext = current.name.includes('.') ? current.name.split('.').pop() : '';
      const base = ext ? current.name.slice(0, -(ext.length + 1)) : current.name;
      let copyName = `${base} (copy)${ext ? '.' + ext : ''}`;
      let n = 1;
      while (files.some((f) => f.name === copyName)) {
        n += 1;
        copyName = `${base} (copy ${n})${ext ? '.' + ext : ''}`;
      }
      addToUploadList(current, copyName);
    }

    pendingQueueRef.current = rest;
    setDuplicatePrompt(rest.length ? { incoming: rest[0] } : null);
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const retryFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) uploadFile(id, target.file, target.name);
      return prev.map((f) => (f.id === id ? { ...f, progress: 0, status: 'uploading' } : f));
    });
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <div className="sd-upload-container">
      <div className="sd-upload-header">
        <div className="sd-upload-header-icon">
          <UploadCloud size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="sd-h1" style={{ fontSize: '28px', margin: '0 0 5px' }}>Upload files</h1>
          <p style={{ color: 'var(--sd-text-mid)', fontSize: '13.5px', margin: 0 }}>
            Add files to your Smart Drive — drag and drop or browse from your device
          </p>
        </div>

        <UploadIllustration />
      </div>

      {files.length > 0 && (
        <div className="sd-upload-stats-row">
          <div className="sd-upload-stat-card">
            <div className="sd-upload-stat-icon sd-upload-stat-icon-blue"><FileText size={19} /></div>
            <div>
              <div className="sd-upload-stat-num">{files.length}</div>
              <div className="sd-upload-stat-label"><span className="sd-upload-stat-dot" style={{ background: 'var(--sd-blue)' }} />Queued</div>
            </div>
          </div>
          <div className="sd-upload-stat-card">
            <div className="sd-upload-stat-icon sd-upload-stat-icon-violet"><PieChart size={19} /></div>
            <div>
              <div className="sd-upload-stat-num">{formatBytes(totalSize)}</div>
              <div className="sd-upload-stat-label"><span className="sd-upload-stat-dot" style={{ background: 'var(--sd-violet)' }} />Total size</div>
            </div>
          </div>
          <div className="sd-upload-stat-card">
            <div className="sd-upload-stat-icon sd-upload-stat-icon-green"><CheckCircle2 size={19} /></div>
            <div>
              <div className="sd-upload-stat-num">{doneCount}/{files.length}</div>
              <div className="sd-upload-stat-label"><span className="sd-upload-stat-dot" style={{ background: 'var(--sd-green)' }} />Completed</div>
            </div>
          </div>
        </div>
      )}

      <UploadBox onFilesSelected={enqueueFiles} />

      {files.length > 0 && (
        <div className="sd-upload-list-card" style={{ marginTop: '16px' }}>
          <div className="sd-upload-list-header">
            <div className="sd-eyebrow">{files.length} file{files.length > 1 ? 's' : ''}</div>
            <button className="sd-upload-btn" onClick={() => setFiles([])}>Clear all</button>
          </div>
          <div>
            {files.map((f) => (
              <UploadPreview key={f.id} file={f} onRemove={() => removeFile(f.id)} onRetry={() => retryFile(f.id)} />
            ))}
          </div>
        </div>
      )}

      <div className="sd-upload-tip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="sd-upload-tip-icon"><ShieldCheck size={18} /></div>
          <div>
            <div className="sd-upload-tip-title">Tip: Keep your storage organized</div>
            <div className="sd-upload-tip-sub">Upload only the files you need and remove duplicates to save space.</div>
          </div>
        </div>
        <button className="sd-upload-btn sd-upload-btn-primary">
          Go to My Files <ArrowRight size={14} />
        </button>
      </div>

      {duplicatePrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,12,24,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="sd-upload-list-card" style={{ padding: '20px', width: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={17} color="var(--sd-amber)" />
              <span className="sd-h1" style={{ fontSize: '14.5px' }}>Duplicate file</span>
            </div>
            <p style={{ color: 'var(--sd-text-mid)', fontSize: '12.5px', lineHeight: 1.5 }}>
              A file named <span className="sd-mono">{duplicatePrompt.incoming.name}</span> already exists. What would you like to do?
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button className="sd-upload-btn sd-upload-btn-primary" onClick={() => resolveDuplicate('replace')}>Replace</button>
              <button className="sd-upload-btn" onClick={() => resolveDuplicate('keep-both')}>Keep both</button>
              <button className="sd-upload-btn" onClick={() => resolveDuplicate('skip')}>Skip</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: 'var(--sd-glass-strong)',
          border: `1px solid ${toast.type === 'error' ? 'var(--sd-rose)' : 'var(--sd-green)'}`,
          borderRadius: '9px', padding: '10px 14px', fontSize: '12.5px',
          color: 'var(--sd-text-hi)', boxShadow: 'var(--sd-shadow-card)', zIndex: 200,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}