import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Film, Zap, Camera, Palette, Eye, ChevronRight, Star } from 'lucide-react';

const features = [
  {
    icon: Film,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
    title: 'Scene Breakdown',
    desc: 'Auto-detect every scene with location, time, and rich description extracted by GPT-4o.',
  },
  {
    icon: Zap,
    color: '#db2777',
    bg: 'rgba(219,39,119,0.12)',
    title: 'Mood Detection',
    desc: 'Understand the emotional tone of each scene with multi-tag mood analysis.',
  },
  {
    icon: Camera,
    color: '#5b5bf6',
    bg: 'rgba(91,91,246,0.12)',
    title: 'Camera Suggestions',
    desc: 'Get shot types, movements, and angles tailored to each scene\'s dramatic needs.',
  },
  {
    icon: Palette,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Visual Style',
    desc: 'Lighting recommendations, color palettes, and cinematic style references per scene.',
  },
  {
    icon: Eye,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    title: 'Key Elements',
    desc: 'Extract characters, props, and actions automatically — ready for your production sheet.',
  },
  {
    icon: Star,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    title: 'Save & Export',
    desc: 'Save analyses to your history and export as JSON or PDF for your crew.',
  },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function LandingPage() {
  return (
    <div className="hero-bg grain" style={{ minHeight: '100vh' }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '90px 24px 80px', textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.35)',
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: 600 }}>✦ Powered by GPT-4o</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="font-grotesk"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 24 }}
        >
          Turn Scripts into{' '}
          <span className="gradient-text">Visual Stories</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 40 }}
        >
          Upload any script and get an instant AI-powered cinematic breakdown — scene by scene,
          with mood, camera suggestions, visual style, and production elements.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/upload" className="btn-primary glow-purple" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '1rem' }}>
            <Film size={18} />
            Analyze Your Script
            <ChevronRight size={16} />
          </Link>
          <Link to="/history" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1rem' }}>
            View History
          </Link>
        </motion.div>

        {/* Floating visual stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginTop: 56 }}
        >
          {[
            { value: 'GPT-4o', label: 'AI Engine' },
            { value: '< 30s', label: 'Analysis Time' },
            { value: '6 Dimensions', label: 'Per Scene' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              padding: '16px 28px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <p className="font-grotesk gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <hr className="divider" />
      </div>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <p style={{ color: '#a78bfa', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            What You Get
          </p>
          <h2 className="font-grotesk" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700 }}>
            Every dimension of your script,{' '}
            <span className="gradient-text">decoded</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="card-base card-hover"
              style={{ padding: '28px 24px' }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 className="font-grotesk" style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px 100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '700px', margin: '0 auto', textAlign: 'center',
            padding: '56px 40px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(91,91,246,0.1))',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 24,
          }}
        >
          <h2 className="font-grotesk" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>
            Ready to visualize your script?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem' }}>
            Upload a PDF or paste your script text — results in under 30 seconds.
          </p>
          <Link to="/upload" className="btn-primary glow-purple" style={{ textDecoration: 'none', padding: '14px 36px', fontSize: '1rem' }}>
            <Film size={18} />
            Start Analyzing
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
