import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Trash2, Clock, ChevronRight, AlertCircle, History } from 'lucide-react';
import { fetchAnalyses, deleteAnalysis } from '../api/client';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]  = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAnalyses()
      .then(setAnalyses)
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id, e) {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteAnalysis(id);
      setAnalyses(prev => prev.filter(a => a._id !== id));
      toast.success('Analysis deleted');
    } catch {
      toast.error('Failed to delete analysis');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 36 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(91,91,246,0.3))',
            border: '1px solid rgba(124,58,237,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <History size={20} color="#a78bfa" />
          </div>
          <div>
            <h1 className="font-grotesk" style={{ fontSize: '1.8rem', fontWeight: 700 }}>Analysis History</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              All your saved script breakdowns
            </p>
          </div>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading analyses...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
          color: '#f87171', marginBottom: 24,
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && analyses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center', padding: '80px 40px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20,
          }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Film size={30} color="#a78bfa" />
          </div>
          <h2 className="font-grotesk" style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 10 }}>
            No analyses yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>
            Upload your first script and the breakdown will appear here.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/upload')}
          >
            <Film size={16} />
            Analyze a Script
          </button>
        </motion.div>
      )}

      {/* Analysis list */}
      {!loading && analyses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {analyses.map((a, i) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                onClick={() => navigate(`/dashboard/${a._id}`)}
                className="card-base card-hover"
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                {/* Scene count badge */}
                <div style={{
                  minWidth: 52, height: 52, borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(91,91,246,0.2))',
                  border: '1px solid rgba(124,58,237,0.3)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>
                    {a.scenes?.length ?? '?'}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
                    SCENES
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="font-grotesk" style={{
                    fontWeight: 600, fontSize: '1rem', marginBottom: 6,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {a.title || 'Untitled Script'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {new Date(a.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Mood tag preview */}
                  {a.scenes?.[0]?.mood?.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                      {[...new Set(a.scenes.flatMap(s => s.mood))].slice(0, 4).map((m, idx) => (
                        <span key={idx} className="chip chip-purple" style={{ fontSize: '0.68rem' }}>{m}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <button
                    onClick={e => handleDelete(a._id, e)}
                    disabled={deletingId === a._id}
                    style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                      color: '#f87171', borderRadius: 8, padding: '7px 10px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      transition: 'all 0.2s', opacity: deletingId === a._id ? 0.5 : 1,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    title="Delete analysis"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronRight size={18} color="var(--text-secondary)" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
