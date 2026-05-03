import { jsPDF } from 'jspdf';

/**
 * Download analysis data as a formatted JSON file.
 * @param {Object} analysis - Full analysis document.
 */
export function exportToJSON(analysis) {
  const data = {
    title: analysis.title,
    exportedAt: new Date().toISOString(),
    totalScenes: analysis.scenes?.length,
    scenes: analysis.scenes,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(analysis.title)}_breakdown.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a styled PDF of the script breakdown.
 * @param {Object} analysis - Full analysis document.
 */
export function exportToPDF(analysis) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const scenes = analysis.scenes || [];
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ── Helper: add new page if needed ──────────────────────────────────────────
  const checkPage = (needed = 10) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Helper: wrapped text ────────────────────────────────────────────────────
  const addWrappedText = (text, x, fontSize = 10, color = [200, 200, 210]) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text || ''), contentW - (x - margin));
    checkPage(lines.length * (fontSize * 0.4 + 1));
    doc.text(lines, x, y);
    y += lines.length * (fontSize * 0.4 + 1) + 1;
  };

  // ── Cover page ──────────────────────────────────────────────────────────────
  // Dark background
  doc.setFillColor(5, 5, 8);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), 'F');

  // Purple accent bar
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, pageW, 4, 'F');

  // App label
  doc.setFontSize(9);
  doc.setTextColor(168, 139, 250);
  doc.text('SCRIPTVISION · AI CINEMATIC BREAKDOWN', margin, 22);

  // Title
  doc.setFontSize(26);
  doc.setTextColor(240, 240, 250);
  const titleLines = doc.splitTextToSize(analysis.title || 'Script Breakdown', contentW);
  doc.text(titleLines, margin, 36);
  y = 36 + titleLines.length * 10 + 4;

  // Divider
  doc.setDrawColor(42, 42, 64);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Meta
  doc.setFontSize(9);
  doc.setTextColor(136, 136, 170);
  doc.text(`Scenes: ${scenes.length}`, margin, y);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    pageW - margin,
    y,
    { align: 'right' }
  );
  y += 14;

  // ── Scenes ──────────────────────────────────────────────────────────────────
  scenes.forEach((scene, idx) => {
    checkPage(40);

    // Scene header background
    doc.setFillColor(18, 18, 28);
    doc.roundedRect(margin - 2, y - 4, contentW + 4, 12, 2, 2, 'F');

    // Scene number + location
    doc.setFontSize(11);
    doc.setTextColor(124, 58, 237);
    doc.text(`Scene ${scene.scene_number}`, margin + 2, y + 4);

    if (scene.location) {
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 210);
      doc.text(`  ·  ${scene.location}${scene.time ? `  (${scene.time})` : ''}`, margin + 22, y + 4);
    }
    y += 14;

    // Description
    if (scene.description) {
      addWrappedText(scene.description, margin, 9, [160, 160, 180]);
      y += 2;
    }

    // Mood
    if (scene.mood?.length) {
      doc.setFontSize(8);
      doc.setTextColor(167, 139, 250);
      doc.text('MOOD:', margin, y);
      doc.setTextColor(196, 181, 253);
      doc.text(scene.mood.join('  ·  '), margin + 14, y);
      y += 6;
    }

    // Camera
    if (scene.camera) {
      const camParts = [];
      if (scene.camera.shots?.length)    camParts.push(`Shots: ${scene.camera.shots.join(', ')}`);
      if (scene.camera.movement?.length) camParts.push(`Movement: ${scene.camera.movement.join(', ')}`);
      if (scene.camera.angles?.length)   camParts.push(`Angles: ${scene.camera.angles.join(', ')}`);
      if (camParts.length) {
        doc.setFontSize(8);
        doc.setTextColor(91, 91, 246);
        doc.text('CAMERA:', margin, y);
        doc.setTextColor(147, 197, 253);
        const camText = doc.splitTextToSize(camParts.join('   '), contentW - 20);
        doc.text(camText, margin + 20, y);
        y += camText.length * 4 + 3;
      }
    }

    // Visual Style
    const vs = scene.visual_style;
    if (vs?.lighting || vs?.color_palette || vs?.style_reference) {
      doc.setFontSize(8);
      doc.setTextColor(245, 158, 11);
      doc.text('VISUAL:', margin, y);
      const vsParts = [vs.lighting, vs.color_palette, vs.style_reference].filter(Boolean);
      doc.setTextColor(252, 211, 77);
      const vsText = doc.splitTextToSize(vsParts.join('  ·  '), contentW - 18);
      doc.text(vsText, margin + 18, y);
      y += vsText.length * 4 + 3;
    }

    // Elements
    const el = scene.elements;
    if (el) {
      const elParts = [];
      if (el.characters?.length) elParts.push(`Characters: ${el.characters.join(', ')}`);
      if (el.props?.length)      elParts.push(`Props: ${el.props.join(', ')}`);
      if (el.actions?.length)    elParts.push(`Actions: ${el.actions.join(', ')}`);
      if (elParts.length) {
        doc.setFontSize(8);
        doc.setTextColor(20, 184, 166);
        doc.text('ELEMENTS:', margin, y);
        doc.setTextColor(94, 234, 212);
        const elText = doc.splitTextToSize(elParts.join('   '), contentW - 24);
        doc.text(elText, margin + 24, y);
        y += elText.length * 4 + 3;
      }
    }

    // Separator between scenes
    if (idx < scenes.length - 1) {
      checkPage(8);
      doc.setDrawColor(26, 26, 40);
      doc.line(margin, y + 3, pageW - margin, y + 3);
      y += 10;
    }
  });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(88, 88, 120);
    doc.text(`${i} / ${pageCount}`, pageW - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    doc.text('ScriptVision', margin, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`${slugify(analysis.title)}_breakdown.pdf`);
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function slugify(str = 'script') {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50) || 'script';
}
