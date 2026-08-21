import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Clapperboard, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/upload', label: 'Analyze' },
  { to: '/history', label: 'History' },
  { to: '/docs', label: 'Docs' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = (active) => ({
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: active ? 600 : 400,
    color: active ? '#e4e4e7' : 'var(--text-secondary)',
    background: active ? 'rgba(255, 255, 255,0.12)' : 'transparent',
    transition: 'all 0.2s',
    display: 'block',
  });

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(8,7,10,0.85)',
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
        position: 'relative',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #ffffff, #a1a1aa)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clapperboard size={18} color="#fff" />
          </div>
          <span className="font-grotesk" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Script<span className="gradient-text">Vision</span>
          </span>
        </Link>

        {/* ── Desktop Nav links ── */}
        <nav className="nav-links">
          {links.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={navLinkStyle(active)}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255, 255, 255,0.06)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Auth ── */}
        <div className="nav-links" style={{ gap: '16px' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="#e4e4e7" />
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

        {/* ── Hamburger (mobile only) ── */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
            color: 'var(--text-secondary)', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#a1a1aa'; e.currentTarget.style.color = '#e4e4e7'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile slide-down sheet ── */}
      <div className={`nav-mobile-sheet${menuOpen ? ' open' : ''}`}>
        {links.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                ...navLinkStyle(active),
                padding: '11px 16px',
                fontSize: '0.95rem',
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* Mobile auth row */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <User size={14} color="#e4e4e7" />
                <span style={{ fontWeight: 500 }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <LogOut size={14} /> Log out
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 24px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
              <User size={15} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
