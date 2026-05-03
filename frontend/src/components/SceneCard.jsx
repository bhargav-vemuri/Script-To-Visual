import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, ChevronDown, ChevronUp,
  Camera, Eye, Users, Zap, ImagePlus, Loader2,
  Film, Music, Scissors, Aperture, Hash
} from 'lucide-react';
import { generateImage } from '../api/client';
import toast from 'react-hot-toast';

const moodColors = ['chip-purple','chip-pink','chip-amber','chip-teal','chip-blue','chip-green'];

const Section = ({ icon: Icon, title, color, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
      <Icon size={14} color={color} />
      <span style={{ fontSize:'0.72rem', fontWeight:700, color, textTransform:'uppercase', letterSpacing:'0.1em' }}>
        {title}
      </span>
    </div>
    {children}
  </div>
);

const Chip = ({ label, colorClass }) => (
  <span className={`chip ${colorClass}`}>{label}</span>
);

/* ── Tab button used inside scene body ── */
const TabBtn = ({ active, onClick, icon: Icon, label, color }) => (
  <button
    onClick={onClick}
    style={{
      display:'flex', alignItems:'center', gap:6,
      padding:'8px 16px', borderRadius:8, border:'1px solid',
      borderColor: active ? color : 'var(--border)',
      background: active ? `${color}22` : 'transparent',
      color: active ? color : 'var(--text-secondary)',
      fontSize:'0.8rem', fontWeight:600, cursor:'pointer',
      transition:'all 0.2s',
    }}
  >
    <Icon size={13} />
    {label}
  </button>
);

export default function SceneCard({ scene, index, forceExpand, analysisId }) {
  const [expanded, setExpanded] = useState(index === 0);
  const [tab, setTab] = useState('storyboard'); // 'storyboard' | 'shots' | 'sound'
  const [imageUrl, setImageUrl] = useState(scene.imageUrl || null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (forceExpand !== undefined) setExpanded(forceExpand);
  }, [forceExpand]);

  const handleGenerateImage = async () => {
    setGenerating(true);
    try {
      const parts = ['cinematic film still','professional movie cinematography','dramatic lighting','35mm anamorphic lens','ultra realistic','8K'];
      if (scene.description) parts.push(scene.description);
      if (scene.location) parts.push(`location: ${scene.location}`);
      if (scene.mood?.length) parts.push(`mood: ${scene.mood.join(', ')}`);
      const cam = scene.camera || {};
      if (cam.shots?.length) parts.push(cam.shots[0]);
      if (cam.angles?.length) parts.push(cam.angles[0]);
      const vs = scene.visual_style || {};
      if (vs.lighting) parts.push(vs.lighting);
      if (vs.color_palette) parts.push(vs.color_palette);
      if (vs.style_reference) parts.push(`style of ${vs.style_reference}`);
      const data = await generateImage({ prompt: parts.filter(Boolean).join(', '), sceneId: scene._id, analysisId });
      setImageUrl(data.imageUrl);
      toast.success('Storyboard frame generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4, delay: index * 0.07 }}
      className="card-base card-hover"
      style={{ overflow:'hidden', marginBottom:16 }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width:'100%', background:'none', border:'none',
          cursor:'pointer', padding:'20px 24px',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:16, flex:1, minWidth:0 }}>
          <div style={{
            minWidth:44, height:44,
            background:'linear-gradient(135deg,#7c3aed22,#5b5bf622)',
            border:'1px solid rgba(124,58,237,0.4)', borderRadius:10,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontSize:'0.6rem', color:'#a78bfa', fontWeight:600, letterSpacing:'0.1em' }}>SCN</span>
            <span style={{ fontSize:'1rem', fontWeight:800, color:'#c4b5fd', lineHeight:1 }}>{scene.scene_number}</span>
          </div>
          <div style={{ minWidth:0 }}>
            <p className="font-grotesk" style={{ fontWeight:600, fontSize:'1rem', color:'var(--text-primary)', marginBottom:4, textAlign:'left' }}>
              {scene.location || `Scene ${scene.scene_number}`}
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {scene.location && (
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.8rem', color:'var(--text-secondary)' }}>
                  <MapPin size={12} /> {scene.location}
                </span>
              )}
              {scene.time && (
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.8rem', color:'var(--text-secondary)' }}>
                  <Clock size={12} /> {scene.time}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          {!expanded && scene.mood?.slice(0,2).map((m,i) => (
            <Chip key={i} label={m} colorClass={moodColors[i % moodColors.length]} />
          ))}
          {expanded ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
        </div>
      </button>

      {/* ── Body ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:0.35, ease:'easeInOut' }}
            style={{ overflow:'hidden' }}
          >
            <div style={{ borderTop:'1px solid var(--border)', padding:'24px 24px 28px' }}>

              {/* ── Scene Description label + text ── */}
              {scene.description && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <Film size={13} color="#a78bfa" />
                    <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#a78bfa', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                      Director's Scene Description
                    </span>
                  </div>
                  <p style={{
                    fontSize:'0.88rem', color:'var(--text-secondary)', lineHeight:1.75,
                    padding:'14px 16px', background:'rgba(124,58,237,0.05)',
                    border:'1px solid rgba(124,58,237,0.15)', borderRadius:10,
                    borderLeft:'3px solid rgba(124,58,237,0.5)',
                    fontStyle:'italic',
                  }}>
                    {scene.description}
                  </p>
                </div>
              )}

              {/* ── Mood chips ── */}
              {scene.mood?.length > 0 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
                  <span style={{ fontSize:'0.72rem', color:'var(--text-secondary)', alignSelf:'center', marginRight:4 }}>Mood:</span>
                  {scene.mood.map((m,i) => <Chip key={i} label={m} colorClass={moodColors[i % moodColors.length]} />)}
                </div>
              )}

              {/* ── Section tabs ── */}
              <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
                <TabBtn active={tab==='storyboard'} onClick={()=>setTab('storyboard')} icon={Aperture} label="Storyboard Frame" color="#a78bfa" />
                <TabBtn active={tab==='shots'} onClick={()=>setTab('shots')} icon={Camera} label="Shot Division" color="#5b5bf6" />
                <TabBtn active={tab==='sound'} onClick={()=>setTab('sound')} icon={Music} label="Music & Editing" color="#14b8a6" />
              </div>

              {/* ══ TAB: STORYBOARD ══ */}
              {tab === 'storyboard' && (
                <div>
                  {/* AI image */}
                  <div style={{ marginBottom:24 }}>
                    {imageUrl ? (
                      <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid var(--border)' }}>
                        <img src={imageUrl} alt={`Storyboard Scene ${scene.scene_number}`} style={{ width:'100%', height:'auto', display:'block' }} />
                        <div style={{ padding:'10px 14px', background:'var(--bg-card2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>🎨 AI-Generated Storyboard Frame • FLUX.1</span>
                          <button
                            onClick={handleGenerateImage} disabled={generating}
                            style={{ background:'none', border:'1px solid var(--border)', borderRadius:6, color:'#a78bfa', fontSize:'0.75rem', padding:'4px 10px', cursor:'pointer' }}
                          >
                            {generating ? 'Regenerating...' : 'Regenerate'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleGenerateImage} disabled={generating}
                        style={{
                          width:'100%', padding:'20px',
                          background: generating ? 'rgba(124,58,237,0.08)' : 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(91,91,246,0.08))',
                          border:'1px dashed rgba(124,58,237,0.4)', borderRadius:12,
                          cursor: generating ? 'wait' : 'pointer',
                          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                          color:'#a78bfa', fontSize:'0.88rem', fontWeight:500, transition:'all 0.2s',
                        }}
                      >
                        {generating
                          ? <><Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> Generating storyboard frame...</>
                          : <><ImagePlus size={18} /> Generate AI Storyboard Frame (FLUX.1-schnell)</>
                        }
                      </button>
                    )}
                  </div>

                  {/* Visual style + elements */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
                    {scene.visual_style && (scene.visual_style.lighting || scene.visual_style.color_palette || scene.visual_style.style_reference) && (
                      <Section icon={Eye} title="Visual Style" color="#fcd34d">
                        {scene.visual_style.lighting && (
                          <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:6 }}>
                            <span style={{ color:'#fcd34d', fontWeight:600 }}>Lighting: </span>{scene.visual_style.lighting}
                          </p>
                        )}
                        {scene.visual_style.color_palette && (
                          <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:6 }}>
                            <span style={{ color:'#fcd34d', fontWeight:600 }}>Palette: </span>{scene.visual_style.color_palette}
                          </p>
                        )}
                        {scene.visual_style.style_reference && (
                          <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                            <span style={{ color:'#fcd34d', fontWeight:600 }}>Ref: </span>{scene.visual_style.style_reference}
                          </p>
                        )}
                      </Section>
                    )}

                    {scene.elements && (scene.elements.characters?.length > 0 || scene.elements.props?.length > 0) && (
                      <Section icon={Users} title="Scene Elements" color="#fb923c">
                        {scene.elements.characters?.length > 0 && (
                          <div style={{ marginBottom:8 }}>
                            <p style={{ fontSize:'0.68rem', color:'var(--text-secondary)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Characters</p>
                            {scene.elements.characters.map((c,i) => (
                              <p key={i} style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:4, paddingLeft:8, borderLeft:'2px solid rgba(251,146,60,0.4)' }}>{c}</p>
                            ))}
                          </div>
                        )}
                        {scene.elements.props?.length > 0 && (
                          <div style={{ marginBottom:8 }}>
                            <p style={{ fontSize:'0.68rem', color:'var(--text-secondary)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Props</p>
                            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                              {scene.elements.props.map((p,i) => <Chip key={i} label={p} colorClass="chip-amber" />)}
                            </div>
                          </div>
                        )}
                        {scene.elements.actions?.length > 0 && (
                          <div>
                            <p style={{ fontSize:'0.68rem', color:'var(--text-secondary)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>Action Beats</p>
                            {scene.elements.actions.map((a,i) => (
                              <p key={i} style={{ fontSize:'0.79rem', color:'var(--text-secondary)', marginBottom:5, paddingLeft:8, borderLeft:'2px solid rgba(251,146,60,0.3)' }}>{a}</p>
                            ))}
                          </div>
                        )}
                      </Section>
                    )}
                  </div>
                </div>
              )}

              {/* ══ TAB: SHOT DIVISION ══ */}
              {tab === 'shots' && (
                <div>
                  {scene.shot_division?.length > 0 ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {scene.shot_division.map((shot, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity:0, x:-12 }}
                          animate={{ opacity:1, x:0 }}
                          transition={{ delay: i * 0.06 }}
                          style={{
                            background:'rgba(91,91,246,0.04)', border:'1px solid rgba(91,91,246,0.2)',
                            borderRadius:12, padding:'16px 18px',
                            borderLeft:'3px solid #5b5bf6',
                          }}
                        >
                          <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                            {/* Shot number badge */}
                            <div style={{
                              minWidth:32, height:32, borderRadius:8, flexShrink:0,
                              background:'rgba(91,91,246,0.2)', border:'1px solid rgba(91,91,246,0.4)',
                              display:'flex', alignItems:'center', justifyContent:'center',
                            }}>
                              <span style={{ fontSize:'0.78rem', fontWeight:800, color:'#818cf8' }}>{shot.shot_number}</span>
                            </div>

                            <div style={{ flex:1, minWidth:0 }}>
                              {/* Shot type + duration */}
                              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                                <span className="font-grotesk" style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text-primary)' }}>
                                  {shot.shot_type}
                                </span>
                                {shot.duration && (
                                  <span style={{ fontSize:'0.72rem', color:'#5b5bf6', background:'rgba(91,91,246,0.1)', border:'1px solid rgba(91,91,246,0.25)', padding:'2px 8px', borderRadius:6 }}>
                                    ⏱ {shot.duration}
                                  </span>
                                )}
                              </div>

                              {/* Chips row */}
                              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
                                {shot.angle && <Chip label={`📐 ${shot.angle}`} colorClass="chip-blue" />}
                                {shot.movement && <Chip label={`🎥 ${shot.movement}`} colorClass="chip-teal" />}
                                {shot.lens && <Chip label={`🔭 ${shot.lens}`} colorClass="chip-purple" />}
                              </div>

                              {/* Description */}
                              {shot.description && (
                                <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.65, marginBottom:8 }}>
                                  {shot.description}
                                </p>
                              )}

                              {/* Purpose */}
                              {shot.purpose && (
                                <div style={{ display:'flex', alignItems:'flex-start', gap:6 }}>
                                  <Hash size={11} color="#5b5bf6" style={{ marginTop:2, flexShrink:0 }} />
                                  <p style={{ fontSize:'0.78rem', color:'#818cf8', fontStyle:'italic', lineHeight:1.5 }}>
                                    {shot.purpose}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-secondary)', fontSize:'0.88rem' }}>
                      No shot division data. Re-analyze your script to get shot-by-shot breakdown.
                    </div>
                  )}

                  {/* Camera overview chips */}
                  {(scene.camera?.shots?.length > 0 || scene.camera?.movement?.length > 0 || scene.camera?.angles?.length > 0) && (
                    <div style={{ marginTop:20, padding:'14px 16px', background:'rgba(124,58,237,0.05)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:10 }}>
                      <p style={{ fontSize:'0.68rem', color:'#a78bfa', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Camera Language Overview</p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {scene.camera.shots?.map((s,i) => <Chip key={`s${i}`} label={s} colorClass="chip-blue" />)}
                        {scene.camera.movement?.map((m,i) => <Chip key={`m${i}`} label={m} colorClass="chip-teal" />)}
                        {scene.camera.angles?.map((a,i) => <Chip key={`a${i}`} label={a} colorClass="chip-green" />)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══ TAB: MUSIC & EDITING ══ */}
              {tab === 'sound' && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {scene.sound_design ? (
                    <>
                      {/* Music card */}
                      {scene.sound_design.music && (
                        <div style={{ background:'rgba(20,184,166,0.05)', border:'1px solid rgba(20,184,166,0.2)', borderRadius:12, padding:'20px', borderLeft:'3px solid #14b8a6' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                            <Music size={16} color="#14b8a6" />
                            <span className="font-grotesk" style={{ fontWeight:700, color:'#14b8a6', fontSize:'0.88rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Score & Sound</span>
                          </div>
                          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                            {scene.sound_design.music.genre && (
                              <div>
                                <p style={{ fontSize:'0.68rem', color:'var(--text-secondary)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Genre</p>
                                <p style={{ fontSize:'0.85rem', color:'var(--text-primary)', fontWeight:500 }}>{scene.sound_design.music.genre}</p>
                              </div>
                            )}
                            {scene.sound_design.music.tempo && (
                              <div>
                                <p style={{ fontSize:'0.68rem', color:'var(--text-secondary)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Tempo</p>
                                <p style={{ fontSize:'0.85rem', color:'var(--text-primary)', fontWeight:500 }}>{scene.sound_design.music.tempo}</p>
                              </div>
                            )}
                            {scene.sound_design.music.reference && (
                              <div style={{ gridColumn:'1/-1' }}>
                                <p style={{ fontSize:'0.68rem', color:'var(--text-secondary)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Reference</p>
                                <p style={{ fontSize:'0.85rem', color:'#5eead4', fontWeight:500, fontStyle:'italic' }}>🎵 {scene.sound_design.music.reference}</p>
                              </div>
                            )}
                            {scene.sound_design.music.instruments?.length > 0 && (
                              <div style={{ gridColumn:'1/-1' }}>
                                <p style={{ fontSize:'0.68rem', color:'var(--text-secondary)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Instrumentation</p>
                                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                                  {scene.sound_design.music.instruments.map((ins,i) => (
                                    <span key={i} className="chip chip-teal">{ins}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {scene.sound_design.music.emotional_intent && (
                              <div style={{ gridColumn:'1/-1', padding:'10px 14px', background:'rgba(20,184,166,0.08)', borderRadius:8 }}>
                                <p style={{ fontSize:'0.68rem', color:'#5eead4', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Emotional Intent</p>
                                <p style={{ fontSize:'0.83rem', color:'var(--text-secondary)', lineHeight:1.65 }}>{scene.sound_design.music.emotional_intent}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Editing card */}
                      {scene.sound_design.editing && (
                        <div style={{ background:'rgba(139,92,246,0.05)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:12, padding:'20px', borderLeft:'3px solid #8b5cf6' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                            <Scissors size={16} color="#8b5cf6" />
                            <span className="font-grotesk" style={{ fontWeight:700, color:'#8b5cf6', fontSize:'0.88rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Editing Style</span>
                          </div>
                          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                            {[
                              { label:'Style', val: scene.sound_design.editing.style },
                              { label:'Cut Type', val: scene.sound_design.editing.cut_type },
                              { label:'Rhythm', val: scene.sound_design.editing.rhythm },
                              { label:'Transition', val: scene.sound_design.editing.transition },
                            ].filter(r => r.val).map(({ label, val }) => (
                              <div key={label} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                                <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#8b5cf6', minWidth:72, paddingTop:1, textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0 }}>{label}</span>
                                <p style={{ fontSize:'0.83rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{val}</p>
                              </div>
                            ))}
                            {scene.sound_design.editing.pacing_note && (
                              <div style={{ marginTop:4, padding:'10px 14px', background:'rgba(139,92,246,0.08)', borderRadius:8, display:'flex', gap:10, alignItems:'flex-start' }}>
                                <span style={{ fontSize:'1rem', flexShrink:0 }}>💡</span>
                                <p style={{ fontSize:'0.83rem', color:'#c4b5fd', lineHeight:1.65, fontStyle:'italic' }}>{scene.sound_design.editing.pacing_note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-secondary)', fontSize:'0.88rem' }}>
                      No music & editing data. Re-analyze your script to get sound design.
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
