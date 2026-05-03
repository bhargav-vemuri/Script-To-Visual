import { motion } from 'framer-motion';
import { BookOpen, Code, Terminal, Sparkles } from 'lucide-react';

export default function DocsPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '60px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h1 className="font-grotesk gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>
            Developer Documentation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Integrate the power of ScriptVision's cinematic AI into your own workflow. 
            Access our API endpoints to generate storyboards, analyze scripts, and extract shot divisions programmatically.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-base"
          style={{ padding: '32px', marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={20} color="#a78bfa" />
            </div>
            <h2 className="font-grotesk" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>API Reference</h2>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', color: '#fcd34d', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={14} /> POST /api/analyze-script-stream
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12, lineHeight: 1.6 }}>
              The primary endpoint. Accepts a raw script text or PDF file and streams back an expert cinematic breakdown using the Groq API.
            </p>
            <div style={{ background: '#0a0a0f', padding: '16px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.85rem', color: '#86efac' }}>
              curl -X POST https://api.scriptvision.ai/v1/analyze-script-stream \<br/>
              &nbsp;&nbsp;-H "Authorization: Bearer YOUR_TOKEN" \<br/>
              &nbsp;&nbsp;-F "script=@/path/to/script.pdf"
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <h3 style={{ fontSize: '1rem', color: '#fcd34d', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={14} /> POST /api/generate-image
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12, lineHeight: 1.6 }}>
              Generates a cinematic storyboard frame using FLUX.1-schnell via Hugging Face.
            </p>
            <div style={{ background: '#0a0a0f', padding: '16px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.85rem', color: '#86efac' }}>
              curl -X POST https://api.scriptvision.ai/v1/generate-image \<br/>
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
              &nbsp;&nbsp;-d '&#123;"prompt": "cinematic film still, low angle, neon lights"&#125;'
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-base"
          style={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="#5eead4" />
            </div>
            <h2 className="font-grotesk" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Documentation</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Our comprehensive documentation is currently being updated to reflect the new Groq-powered architecture. 
            Check back soon for extensive guides on customizing the LLM prompts, integrating with Final Draft formats, and advanced image generation parameters.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
