import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const STATUS_MESSAGES = [
  'Parsing cinematic structure...',
  'Identifying scene boundaries...',
  'Analyzing mood & atmosphere...',
  'Mapping camera language...',
  'Extracting visual style...',
  'Building storyboard data...',
  'Almost ready...',
];

/**
 * Full-screen cinematic loading overlay shown while the script is being analyzed.
 */
export default function LoadingOverlay({ streamContent = '' }) {
  const contentRef = useRef(null);
  const [statusIdx, setStatusIdx] = useState(0);

  // Cycle through status messages
  useEffect(() => {
    const id = setInterval(() => {
      setStatusIdx(i => (i + 1) % STATUS_MESSAGES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll to bottom of stream content
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamContent]);

  return (
    <motion.div
      key="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,5,8,0.96)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
      }}
    >
      {/* ── Icon + Ring — properly wrapped so ring orbits icon ── */}
      <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer glow backdrop */}
        <div style={{
          position: 'absolute',
          inset: -16,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }} />

        {/* Spinning conic-gradient ring — perfectly centered around the 100x100 box */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            padding: 3,
            background: 'conic-gradient(from 0deg, transparent 0%, #7c3aed 40%, #5b5bf6 70%, transparent 100%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
          }}
        />

        {/* Counter-rotating inner ring for depth */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 6,
            borderRadius: '50%',
            border: '1.5px dashed rgba(124,58,237,0.3)',
          }}
        />

        {/* Pulsing clapperboard icon */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(91,91,246,0.35))',
            border: '1.5px solid rgba(124,58,237,0.55)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(124,58,237,0.3)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Clapperboard size={32} color="#a78bfa" />
        </motion.div>
      </div>

      {/* ── Text content ── */}
      <div style={{ textAlign: 'center', maxWidth: '560px', width: '100%', padding: '0 24px' }}>
        <p className="font-grotesk gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 10 }}>
          Analyzing Script...
        </p>

        {/* Cycling status messages */}
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 28 }}
          >
            {STATUS_MESSAGES[statusIdx]}
          </motion.p>
        </AnimatePresence>

        {/* Live stream output */}
        {streamContent && (
          <div
            ref={contentRef}
            style={{
              background: '#0a0a12',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16,
              height: 180,
              overflowY: 'auto',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#5eead4',
              boxShadow: 'inset 0 0 24px rgba(0,0,0,0.6)',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {streamContent}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              style={{ display: 'inline-block', width: 7, height: 13, background: '#5eead4', marginLeft: 3, verticalAlign: 'middle' }}
            />
          </div>
        )}
      </div>

      {/* Bouncing dots (only when no stream content yet) */}
      {!streamContent && (
        <div style={{ display: 'flex', gap: 10 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
              style={{
                width: 9, height: 9, borderRadius: '50%',
                background: i === 1 ? '#5b5bf6' : '#7c3aed',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
