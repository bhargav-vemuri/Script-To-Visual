import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Clapperboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/upload', label: 'Analyze' },
  { to: '/history', label: 'History' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #7c3aed, #5b5bf6)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clapperboard size={18} color="#fff" />
          </div>
          <span className="font-grotesk" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Script<span className="gradient-text">Vision</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {links.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#a78bfa' : 'var(--text-secondary)',
                  background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Auth / CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="#a78bfa" />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '0.85rem' }}>
              <User size={15} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
