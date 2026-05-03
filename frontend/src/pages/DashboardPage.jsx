import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Film, Download, List, LayoutGrid, ArrowLeft,
  ChevronDown, ChevronUp, Maximize2, Minimize2
} from 'lucide-react';
import { fetchAnalysis } from '../api/client';
import SceneCard from '../components/SceneCard';
import StoryboardCard from '../components/StoryboardCard';
import { exportToJSON, exportToPDF } from '../utils/export';

export default function DashboardPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(state?.analysis || null);
  const [loading, setLoading] = useState(!state?.analysis);
  const [error, setError] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'storyboard'
  const [allExpanded, setAllExpanded] = useState(false);

  /* Fetch if arriving directly via URL */
  useEffect(() => {
    if (!analysis && id) {
      fetchAnalysis(id)
        .then(setAnalysis)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ color: '#f87171', fontSize: '1.1rem' }}>{error || 'Analysis not found.'}</p>
        <button className="btn-secondary" style={{ marginTop: 24 }} onClick={() => navigate('/upload')}>
          Try Again
        </button>
      </div>
    );
  }

  const scenes = analysis.scenes || [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}
      >
        <button
          className="btn-secondary"
          onClick={() => navigate(-1)}
          style={{ padding: '8px 14px', flexShrink: 0 }}
        >
          <ArrowLeft size={16} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="font-grotesk" style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 }}>
            {analysis.title || 'Script Breakdown'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {scenes.length} scene{scenes.length !== 1 ? 's' : ''} detected · {new Date(analysis.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Expand / Collapse All */}
          <button
            className="btn-secondary"
            onClick={() => setAllExpanded(e => !e)}
            style={{ padding: '8px 14px' }}
            title={allExpanded ? 'Collapse all' : 'Expand all'}
          >
            {allExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            {allExpanded ? 'Collapse' : 'Expand'} All
          </button>

          {/* View toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, overflow: 'hidden',
          }}>
            {[{ key: 'list', icon: List }, { key: 'storyboard', icon: LayoutGrid }].map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                style={{
                  padding: '8px 14px', background: view === key ? 'rgba(124,58,237,0.2)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: view === key ? '#a78bfa' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
                title={key === 'list' ? 'List view' : 'Storyboard view'}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* Export */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ExportMenu analysis={analysis} />
          </div>
        </div>
      </motion.div>

      {/* ── Summary Strip ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap',
        }}
      >
        {getSummaryStats(scenes).map(({ label, value, color }) => (
          <div key={label} style={{
            flex: '1 1 140px', padding: '14px 18px',
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
          }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{value}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Scene List / Storyboard ─────────────────────────────────────── */}
      {view === 'list' ? (
        <div>
          {scenes.map((scene, i) => (
            <SceneCard key={scene.scene_number || i} scene={scene} index={i} forceExpand={allExpanded} analysisId={analysis._id} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {scenes.map((scene, i) => (
            <StoryboardCard key={scene.scene_number || i} scene={scene} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Export dropdown ──────────────────────────────────────────────────────── */
function ExportMenu({ analysis }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn-secondary"
        onClick={() => setOpen(o => !o)}
        style={{ padding: '8px 14px', gap: 6 }}
      >
        <Download size={15} />
        Export
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', right: 0, top: '110%',
            background: 'var(--bg-card2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '6px', minWidth: 160, zIndex: 50,
          }}
        >
          {[
            { label: 'Export as JSON', action: () => { exportToJSON(analysis); setOpen(false); } },
            { label: 'Export as PDF', action: () => { exportToPDF(analysis); setOpen(false); } },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 14px', background: 'none', border: 'none',
                color: 'var(--text-secondary)', fontSize: '0.88rem',
                cursor: 'pointer', borderRadius: 7, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ── Summary stats helper ─────────────────────────────────────────────────── */
function getSummaryStats(scenes) {
  const allMoods = [...new Set(scenes.flatMap(s => s.mood || []))];
  const allShots = [...new Set(scenes.flatMap(s => s.camera?.shots || []))];
  const totalIndividualShots = scenes.reduce((sum, s) => sum + (s.shot_division?.length || 0), 0);
  const allLocations = [...new Set(scenes.map(s => s.location).filter(Boolean))];
  return [
    { label: 'Total Scenes', value: scenes.length, color: '#a78bfa' },
    { label: 'Mood Tags', value: allMoods.length, color: '#fcd34d' },
    { label: 'Shot Types', value: allShots.length, color: '#5eead4' },
    { label: 'Total Shots', value: totalIndividualShots || allLocations.length, color: '#fb923c' },
  ];
}
