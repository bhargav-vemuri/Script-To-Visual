const mongoose = require('mongoose');

/**
 * Sub-schema for a single shot in the shot division breakdown.
 */
const ShotSchema = new mongoose.Schema({
  shot_number: Number,
  shot_type: String,
  angle: String,
  movement: String,
  lens: String,
  description: String,
  duration: String,
  purpose: String,
}, { _id: false });

/**
 * Schema for a single scene returned by the AI analysis.
 */
const SceneSchema = new mongoose.Schema({
  scene_number: Number,
  location: String,
  time: String,
  description: String,
  mood: [String],
  camera: {
    shots: [String],
    movement: [String],
    angles: [String],
  },
  visual_style: {
    lighting: String,
    color_palette: String,
    style_reference: String,
  },
  elements: {
    characters: [String],
    props: [String],
    actions: [String],
  },
  // Shot-by-shot division breakdown
  shot_division: [ShotSchema],
  // Music & editing style derived from script content
  sound_design: {
    music: {
      genre: String,
      tempo: String,
      instruments: [String],
      reference: String,
      emotional_intent: String,
    },
    editing: {
      style: String,
      cut_type: String,
      rhythm: String,
      transition: String,
      pacing_note: String,
    },
  },
  imageUrl: { type: String },
});

/**
 * Top-level schema that stores the original script text
 * and the AI-generated scene breakdown.
 */
const AnalysisSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled Script' },
    scriptText: { type: String, required: true },
    scenes: [SceneSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);
