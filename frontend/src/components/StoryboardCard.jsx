import { motion } from 'framer-motion';
import { MapPin, Clock, Camera, Eye, Zap } from 'lucide-react';

const moodColors = [
  'rgba(124,58,237,0.3)', 'rgba(219,39,119,0.3)', 'rgba(245,158,11,0.3)',
  'rgba(20,184,166,0.3)', 'rgba(59,130,246,0.3)', 'rgba(34,197,94,0.3)',
];

/**
 * Compact card for storyboard grid view — shows scene at a glance.
 */
export default function StoryboardCard({ scene, index }) {
  const moodBg = moodColors[index % moodColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="card-base card-hover"
      style={{ overflow: 'hidden' }}
    >
      {/* Colour header */}
      <div style={{
        height: 6,
        background: `linear-gradient(90deg, ${moodBg.replace('0.3', '0.8')}, transparent)`,
      }} />

      <div style={{ padding: '18px 20px 20px' }}>
        {/* Scene number */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{
            background: moodBg, padding: '3px 10px', borderRadius: 6,
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)',
            letterSpacing: '0.08em',
          }}>
            SCENE {scene.scene_number}
          </span>
        </div>

        {/* Location + time */}
        <p className="font-grotesk" style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 10 }}>
          {scene.location || `Scene ${scene.scene_number}`}
        </p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          {scene.time && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Clock size={11} />{scene.time}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {scene.description}
        </p>

        <hr className="divider" style={{ marginBottom: 14 }} />

        {/* Mood */}
        {scene.mood?.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Zap size={12} color="#a78bfa" />
              <span style={{ fontSize: '0.68rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mood</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {scene.mood.slice(0, 3).map((m, i) => (
                <span key={i} className="chip chip-purple">{m}</span>
              ))}
            </div>
          </div>
        )}

        {/* Camera shots — Groq schema: camera.shots is string[] */}
        {(scene.camera?.shots?.length > 0 || scene.camera?.movement?.length > 0) && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Camera size={12} color="#5b5bf6" />
              <span style={{ fontSize: '0.68rem', color: '#5b5bf6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Camera</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {scene.camera.shots?.slice(0, 2).map((s, i) => (
                <span key={i} className="chip chip-blue">{s}</span>
              ))}
              {scene.camera.movement?.slice(0, 1).map((m, i) => (
                <span key={`mv-${i}`} className="chip chip-teal">{m}</span>
              ))}
            </div>
          </div>
        )}

        {/* Visual style reference */}
        {scene.visual_style?.style_reference && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 4, fontStyle: 'italic' }}>
            Ref: {scene.visual_style.style_reference}
          </p>
        )}
      </div>
    </motion.div>
  );
}
