import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Camera, Sparkles } from 'lucide-react';

export default function ImageUploader({ onImageSelected, samplePresets = [], label = "Upload Construction Site Image" }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target.result;
      setPreview(dataUri);
      if (onImageSelected) {
        onImageSelected(file, dataUri);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onImageSelected) onImageSelected(null, null);
  };

  const selectSample = (sample) => {
    setPreview(sample.url);
    setFileName(sample.name);
    // Convert sample data uri or url to base64 if needed
    if (onImageSelected) {
      onImageSelected(null, sample.url);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: preview ? '16px' : '36px 20px',
          background: isDragging ? 'var(--accent-amber-glow)' : 'var(--bg-input)',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all var(--transition-fast)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: preview ? '240px' : '180px'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {preview ? (
          <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={preview}
              alt="Uploaded Preview"
              style={{
                maxHeight: '260px',
                maxWidth: '100%',
                borderRadius: 'var(--radius-md)',
                objectFit: 'contain',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}
            />
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {fileName || "Active Inspection Image"}
              </span>
              <button
                type="button"
                onClick={clearImage}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <Upload size={24} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {label}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Drag and drop high-resolution site photo, or browse JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
      </div>

      {samplePresets.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color="var(--accent-amber)" /> Or pick sample inspection:
          </span>
          {samplePresets.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectSample(sample)}
              style={{
                fontSize: '11.5px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-amber)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {sample.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
