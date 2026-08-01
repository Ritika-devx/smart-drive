import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadBox({ onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      onFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.length) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div
      className={`sd-upload-dropzone ${isDragging ? 'sd-upload-dropzone-active' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" multiple onChange={handleChange} style={{ display: 'none' }} />
      <div className="sd-upload-dropzone-icon">
        <UploadCloud size={24} />
      </div>
      <div className="sd-upload-dropzone-title">
        {isDragging ? 'Drop to upload' : (
          <>Drag and drop files here <span className="sd-upload-dropzone-link">or click to browse</span></>
        )}
      </div>
      <div className="sd-upload-dropzone-sub">Any file type, up to 100MB</div>
    </div>
  );
}