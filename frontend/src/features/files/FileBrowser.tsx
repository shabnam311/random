import React from 'react';
import './FileBrowser.css';

interface FileItem {
  id: string;
  name: string;
  extension: string;
  version: string;
  size: string;
  uploader: string;
}

interface FileBrowserProps {
  files: FileItem[];
}

export function FileBrowser({ files }: FileBrowserProps) {
  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0 }}>Files</h3>
        <button className="btn btn-primary btn-sm">Upload</button>
      </div>
      
      {files.map(file => (
        <div key={file.id} className="file-row">
          <div className="file-icon">{file.extension}</div>
          <div className="fname">{file.name}</div>
          <div className="fmeta">{file.version} &middot; {file.size} &middot; uploaded by {file.uploader}</div>
        </div>
      ))}
      
      <div className="dropzone">
        Drag files here, or <strong>browse to upload</strong> &mdash; 25 MB limit per file
      </div>
    </div>
  );
}
