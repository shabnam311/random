import React, { useRef, useState } from 'react';
import { UploadCloud, File, Download } from 'lucide-react';
import { groupApi } from '../../lib/api/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './FileBrowser.css';

interface FileData {
  id: string;
  name: string;
  extension: string;
  size: string; // Formatting to be done higher up or locally
  file_versions?: any[];
}

interface FileBrowserProps {
  files: FileData[];
  groupId: string;
  onUploadSuccess: () => void;
}

export function FileBrowser({ files, groupId, onUploadSuccess }: FileBrowserProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleFile = async (file: File) => {
    if (!user) return;
    if (file.size > 25 * 1024 * 1024) {
      alert('File too large. Maximum size is 25MB.');
      return;
    }
    
    setIsUploading(true);
    try {
      await groupApi.uploadFile(groupId, file, user.id);
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = async (file: FileData) => {
    if (!file.file_versions || file.file_versions.length === 0) return;
    try {
      const url = await groupApi.getDownloadUrl(file.file_versions[0].storage_path);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      alert('Download failed.');
    }
  };

  return (
    <div className="panel" style={{ padding: 0 }}>
      <div 
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}
      >
        <UploadCloud size={24} style={{ marginBottom: '10px' }} />
        {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
      </div>

      <div className="file-list">
        {files.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
            No files uploaded yet.
          </div>
        )}
        {files.map(f => (
          <div key={f.id} className="file-row">
            <div className="file-info">
              <div className="icon">
                <File size={16} />
              </div>
              <div className="name">{f.name}</div>
            </div>
            <div className="file-meta">
              <span>{f.extension}</span>
              {f.file_versions && f.file_versions.length > 0 && <span>{Math.round(f.file_versions[0].size_bytes / 1024)} KB</span>}
              <button 
                className="btn-text" 
                onClick={() => handleDownload(f)}
                title="Download"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
