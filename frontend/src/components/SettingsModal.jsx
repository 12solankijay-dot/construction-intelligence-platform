import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, ShieldCheck, CheckCircle2, AlertCircle, Server, Globe, RefreshCw } from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredBackendUrl, 
  setStoredBackendUrl, 
  getApiBaseUrl 
} from '../api/client';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [backendUrl, setBackendUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'checking' | 'connected' | 'failed'
  const [serverInfo, setServerInfo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setBackendUrl(getStoredBackendUrl());
      setSavedSuccess(false);
      setConnectionStatus(null);
      setServerInfo('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const testConnection = async () => {
    setConnectionStatus('checking');
    setServerInfo('');
    try {
      let target = (backendUrl.trim() || getApiBaseUrl()).replace(/\/+$/, "");
      if (!target.endsWith("/api/v1")) {
        target = `${target}/api/v1`;
      }
      const res = await fetch(`${target}/health`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus('connected');
        setServerInfo(data.status === 'healthy' ? 'Backend Online & Healthy' : 'Connected');
      } else {
        setConnectionStatus('failed');
        setServerInfo(`Server responded with HTTP ${res.status}`);
      }
    } catch (err) {
      setConnectionStatus('failed');
      setServerInfo(err.message || 'Unable to reach backend endpoint');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKey.trim());
    setStoredBackendUrl(backendUrl.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setApiKey('');
    setBackendUrl('');
    setStoredApiKey('');
    setStoredBackendUrl('');
    setSavedSuccess(true);
    setConnectionStatus(null);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        background: '#0f172a',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        borderRadius: '16px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Multimodal AI Configuration</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage Gemini 2.0 API Key & Offline Fallbacks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Backend Server URL Configuration */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Server size={14} color="var(--accent-cyan)" /> Backend API Endpoint (Render / Cloud)
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Active: <code style={{ color: 'var(--accent-amber)', fontSize: '11px' }}>{getApiBaseUrl()}</code>
              </span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="https://your-backend.onrender.com (or leave empty for default)"
                value={backendUrl}
                onChange={(e) => {
                  setBackendUrl(e.target.value);
                  setConnectionStatus(null);
                }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', flex: 1 }}
              />
              <button
                type="button"
                onClick={testConnection}
                disabled={connectionStatus === 'checking'}
                className="btn btn-secondary"
                style={{ fontSize: '11.5px', padding: '6px 12px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Test backend connection"
              >
                <RefreshCw size={12} className={connectionStatus === 'checking' ? 'spin' : ''} />
                {connectionStatus === 'checking' ? 'Testing...' : 'Test Ping'}
              </button>
            </div>
            {connectionStatus && (
              <div style={{
                marginTop: '6px',
                fontSize: '11.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: connectionStatus === 'connected' ? '#34d399' : '#f87171'
              }}>
                {connectionStatus === 'connected' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                <span>{serverInfo}</span>
              </div>
            )}
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Leave blank to use default (<strong>{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}</strong>). Set this to your Render service URL when running the cloud backend.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Google Gemini API Key</span>
              <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} /> Stored Locally in Browser
              </span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
            />
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Leave blank to use the built-in <strong>High-Fidelity Civil Engineering Vision Engine</strong> (works offline without any API key).
            </p>
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px 16px',
            margin: '18px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Cpu size={16} color="var(--accent-cyan)" /> Active Multimodal Engine Status:
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {apiKey ? (
                <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> Gemini 2.0 Flash Vision Active (Cloud Multimodal LLM)
                </span>
              ) : (
                <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} /> Embedded Civil Engineering Simulator Active (Zero API Key Required)
                </span>
              )}
            </div>
          </div>

          {savedSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={14} /> Settings Saved Successfully!
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px' }}
            >
              Reset to Simulation Mode
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: '12px', padding: '8px 18px' }}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
