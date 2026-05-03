import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Film, UploadCloud, FileText, X, Clapperboard, AlertCircle } from 'lucide-react';
import { analyzeScript } from '../api/client';
import LoadingOverlay from '../components/LoadingOverlay';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('file'); // 'file' | 'text'
  const [file, setFile] = useState(null);
  const [scriptText, setScriptText] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ── Dropzone ─────────────────────────────────────────────────────────── */
  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length > 0) {
      setError('Only PDF and TXT files up to 10 MB are accepted.');
      return;
    }
    setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const [streamContent, setStreamContent] = useState('');

  /* ── Submit ───────────────────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'file' && !file) return setError('Please upload a script file.');
    if (mode === 'text' && scriptText.trim().length < 50)
      return setError('Please paste at least 50 characters of script text.');

    setLoading(true);
    setStreamContent('');

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      let body;
      if (mode === 'file') {
        body = new FormData();
        body.append('script', file);
        body.append('title', title || file.name.replace(/\.[^.]+$/, ''));
      } else {
        body = JSON.stringify({ scriptText, title: title || 'Untitled Script' });
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const finalAnalysis = data.analysis;

      if (finalAnalysis) {
        navigate(`/dashboard/${finalAnalysis._id}`, { state: { analysis: finalAnalysis } });
      } else {
        throw new Error('Analysis completed but no final data was returned.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>{loading && <LoadingOverlay streamContent={streamContent} />}</AnimatePresence>

      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '660px' }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: 'linear-gradient(135deg, #7c3aed, #5b5bf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 30px rgba(124,58,237,0.4)',
            }}>
              <Clapperboard size={28} color="#fff" />
            </div>
            <h1 className="font-grotesk gradient-text" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
              Analyze Your Script
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Upload a PDF/TXT file or paste your script text below
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-base" style={{ padding: '32px' }}>
              {/* Title Input */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>
                  Script Title (optional)
                </label>
                <input
                  id="script-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Blade Runner 2099 - Act 1"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--bg-card2)', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Mode Toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {[{ key: 'file', label: 'Upload File', icon: UploadCloud }, { key: 'text', label: 'Paste Text', icon: FileText }].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setMode(key); setError(''); }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 8, padding: '10px',
                      borderRadius: 10, border: '1px solid',
                      borderColor: mode === key ? '#7c3aed' : 'var(--border)',
                      background: mode === key ? 'rgba(124,58,237,0.12)' : 'transparent',
                      color: mode === key ? '#a78bfa' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <AnimatePresence mode="wait">
                {mode === 'file' ? (
                  <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div
                      {...getRootProps()}
                      id="dropzone"
                      style={{
                        border: `2px dashed ${isDragActive ? '#7c3aed' : file ? '#5b5bf6' : 'var(--border)'}`,
                        borderRadius: 14,
                        padding: '48px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isDragActive ? 'rgba(124,58,237,0.08)' : file ? 'rgba(91,91,246,0.06)' : 'var(--bg-card2)',
                        transition: 'all 0.25s',
                      }}
                    >
                      <input {...getInputProps()} />

                      {file ? (
                        <div>
                          <div style={{
                            width: 52, height: 52, borderRadius: 12,
                            background: 'rgba(91,91,246,0.2)', border: '1px solid rgba(91,91,246,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 12px',
                          }}>
                            <FileText size={24} color="#5b5bf6" />
                          </div>
                          <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{file.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setFile(null); }}
                            style={{
                              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                              color: '#f87171', borderRadius: 8, padding: '6px 14px',
                              cursor: 'pointer', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 6,
                            }}
                          >
                            <X size={14} /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={40} color={isDragActive ? '#7c3aed' : 'var(--text-secondary)'} style={{ margin: '0 auto 16px' }} />
                          <p style={{ fontWeight: 600, marginBottom: 6 }}>
                            {isDragActive ? 'Drop it here!' : 'Drag & drop your script'}
                          </p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            PDF or TXT · up to 10 MB · or click to browse
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <textarea
                      id="script-text"
                      value={scriptText}
                      onChange={e => setScriptText(e.target.value)}
                      placeholder="Paste your script here...&#10;&#10;INT. COFFEE SHOP - DAY&#10;SARAH sits at a corner table, hands shaking around a steaming mug..."
                      rows={14}
                      style={{
                        width: '100%', padding: '14px 16px',
                        background: 'var(--bg-card2)', border: '1px solid var(--border)',
                        borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.88rem',
                        fontFamily: 'inherit', lineHeight: 1.65, resize: 'vertical',
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#7c3aed'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 8, textAlign: 'right' }}>
                      {scriptText.length} characters
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: 16, padding: '12px 16px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
                    color: '#f87171', fontSize: '0.875rem',
                  }}
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                id="analyze-btn"
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: 24, padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
              >
                <Film size={18} />
                {loading ? 'Analyzing...' : 'Analyze Script'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
