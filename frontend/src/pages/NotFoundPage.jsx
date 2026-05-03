import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated number */}
        <p className="font-grotesk gradient-text" style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
          404
        </p>
        <h1 className="font-grotesk" style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 12 }}>
          Scene Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 36, maxWidth: 400, margin: '0 auto 36px' }}>
          Looks like this page got cut from the final edit. Let's get you back on set.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            <Home size={16} /> Go Home
          </Link>
          <Link to="/upload" className="btn-secondary" style={{ textDecoration: 'none' }}>
            <Film size={16} /> Analyze a Script
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
