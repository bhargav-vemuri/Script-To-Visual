import { Link } from 'react-router-dom';
import { Clapperboard, Heart, Globe, Camera, Mail, Sparkles, Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      background: 'var(--bg-card)',
      marginTop: 'auto',
      overflow: 'hidden'
    }}>
      {/* Glowing top border */}
      <div style={{
        height: 1, width: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(91,91,246,0.5), transparent)'
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '50px 24px 30px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px'
      }}>
        
        {/* Column 1: Brand & Social */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #5b5bf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)'
            }}>
              <Clapperboard size={18} color="#fff" />
            </div>
            <span className="font-grotesk" style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              Script<span className="gradient-text">Vision</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            {[Globe, Camera, Mail].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', transition: 'all 0.2s', textDecoration: 'none'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.borderColor = '#a78bfa'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: The Magic of Cinema */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h4 className="font-grotesk" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Film size={14} color="#a78bfa" /> The Magic of Cinema</span>
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.65, fontStyle: 'italic' }}>
            Cinema is a universal language. From the chaotic, raw energy of <span style={{ color: '#c4b5fd', fontWeight: 500 }}>Fight Club</span> to the tender, poetic love of <span style={{ color: '#c4b5fd', fontWeight: 500 }}>Sita Ramam</span>. It is the fierce intensity of <span style={{ color: '#c4b5fd', fontWeight: 500 }}>Aravinda Sametha</span>, the hilarious vulnerabilities of <span style={{ color: '#c4b5fd', fontWeight: 500 }}>Ante Sundaraniki</span>, the emotional warmth of <span style={{ color: '#c4b5fd', fontWeight: 500 }}>Hi Nanna</span>, and the relentless grit of <span style={{ color: '#c4b5fd', fontWeight: 500 }}>12th Fail</span>.
            <br/><br/>
            Whether it's Hollywood framing or Tollywood mass storytelling, cinema connects our shared human experience. We built this tool for the storytellers who keep that magic alive.
          </p>
        </div>

        {/* Column 3: Resources & Tech Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4 className="font-grotesk" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>Resources</h4>
            {[['Documentation', '/docs'], ['API Reference', '/docs']].map(([label, path]) => (
              <Link key={label} to={path} style={{
                color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s', width: 'fit-content'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4 className="font-grotesk" style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Powered By</h4>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <Sparkles size={14} color="#fb923c" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Groq LPU™</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <span style={{ fontSize: '0.85rem' }}>🤗</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>FLUX.1 Schnell</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: 16 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} ScriptVision. All rights reserved.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          Crafted with <Heart size={12} color="#db2777" fill="#db2777" /> for filmmakers
        </p>
      </div>

      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', bottom: -100, right: -100, width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)', pointerEvents: 'none'
      }} />
    </footer>
  );
}
