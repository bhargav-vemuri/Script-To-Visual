import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Layers, Zap, Database } from 'lucide-react';

export default function DocsPage() {
  useEffect(() => { document.title = 'Docs — ScriptVision'; }, []);
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
            System Architecture
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A high-performance, deeply integrated stack designed to process heavy cinematic workflows instantly.
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
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(191, 49, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="#BF3100" />
            </div>
            <h2 className="font-grotesk" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Groq LPU Inference</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 16 }}>
            ScriptVision bypasses traditional GPU bottlenecks by utilizing Groq's Language Processing Units (LPUs). 
            When a script is uploaded, the raw text is parsed and instantly streamed to the Llama 3 model running on Groq. 
            This allows us to extract highly complex JSON cinematic structures—including mood, lighting, camera angles, and sound design—in under 2 seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-base"
          style={{ padding: '32px', marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(91, 89, 65, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} color="#5B5941" />
            </div>
            <h2 className="font-grotesk" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Asynchronous Storyboarding</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 16 }}>
            To prevent rate-limiting and timeouts, image generation is decoupled from the main analysis thread. 
            We utilize a global in-memory queuing system that proxies requests to the Hugging Face Serverless API (running FLUX.1-schnell). 
            Images are generated sequentially in the background while the user continues to interact with the frontend.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card-base"
          style={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(186, 151, 144, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={20} color="#BA9790" />
            </div>
            <h2 className="font-grotesk" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>OOM-Protected Storage</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Handling large PDF scripts in memory can easily crash Node.js servers under heavy load (100k+ requests). 
            ScriptVision utilizes Multer disk storage pointing to the OS temporary directory, streaming chunks directly to disk before parsing them. 
            Once the cinematic breakdown is complete, the data is indexed in MongoDB for lightning-fast history retrieval.
          </p>
        </motion.div>

      </div>
    </div>
  );
}