// Background: a faint finite-element membrane, the kind of triangulated mesh a
// soft-body solver works on. A few contact points press dimples into it; they
// drift with scroll (slower than the page) so the membrane deforms only when
// the reader moves. Nothing animates on its own. Purely decorative: aria-hidden,
// no pointer events, never captures input.
const canvas = document.createElement('canvas');
canvas.className = 'page-atmosphere';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);
const context = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const style = getComputedStyle(document.documentElement);
const ink = style.getPropertyValue('--ink').trim() || '#181c1e';
const sim = style.getPropertyValue('--sim').trim() || '#216762';
const PARALLAX = 0.55;

// Deterministic per page, so every page has its own but stable layout.
function random(seed) {
  let state = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let mesh = null;
let contacts = [];
let frame = 0;

function build() {
  const width = innerWidth;
  const height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const compact = width < 700;
  const spacing = compact ? 40 : 54;
  const rowHeight = spacing * Math.sqrt(3) / 2;
  const next = random(`${document.body.dataset.page || 'page'}:${compact ? 's' : 'l'}`);
  const columns = Math.ceil(width / spacing) + 3;
  const rows = Math.ceil(height / rowHeight) + 3;
  const nodes = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      nodes.push({
        x: (column - 1 + (row % 2) * 0.5) * spacing + (next() - 0.5) * spacing * 0.32,
        y: (row - 1) * rowHeight + (next() - 0.5) * rowHeight * 0.32,
      });
    }
  }
  const edges = [];
  const at = (row, column) => row * columns + column;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (column + 1 < columns) edges.push([at(row, column), at(row, column + 1)]);
      if (row + 1 < rows) {
        const shift = row % 2;
        edges.push([at(row, column), at(row + 1, column)]);
        const diagonal = column + (shift ? 1 : -1);
        if (diagonal >= 0 && diagonal < columns) edges.push([at(row, column), at(row + 1, diagonal)]);
      }
    }
  }
  mesh = { nodes, edges, moved: nodes.map(node => ({ ...node, strain: 0, near: 0 })) };

  // Contacts live in a slower "background space" so they drift behind the page.
  const travel = Math.max(height, (document.documentElement.scrollHeight - height) * PARALLAX + height);
  const step = compact ? 520 : 640;
  contacts = [];
  for (let y = height * 0.42; y < travel + step; y += step * (0.8 + next() * 0.4)) {
    // Contacts stay in the open space on the right; the left edge is the text column.
    contacts.push({
      x: width * (compact ? 0.62 + next() * 0.3 : 0.68 + next() * 0.26),
      y,
      radius: (compact ? 110 : 170) * (0.8 + next() * 0.45),
      depth: (compact ? 14 : 24) * (0.8 + next() * 0.4),
    });
  }
}

function render() {
  frame = 0;
  if (!mesh) build();
  const width = innerWidth;
  const height = innerHeight;
  const offset = reduced.matches ? 0 : scrollY * PARALLAX;
  const active = contacts
    .map(contact => ({ ...contact, sy: contact.y - offset }))
    .filter(contact => contact.sy > -contact.radius * 2 && contact.sy < height + contact.radius * 2);

  for (let i = 0; i < mesh.nodes.length; i++) {
    const node = mesh.nodes[i];
    const moved = mesh.moved[i];
    let dx = 0;
    let dy = 0;
    let strain = 0;
    let near = 0;
    for (const contact of active) {
      const rx = node.x - contact.x;
      const ry = node.y - contact.sy;
      const distance = Math.hypot(rx, ry) || 1;
      const u = distance / contact.radius;
      near = Math.max(near, Math.exp(-u * u / 1.2));
      if (u > 2.4) continue;
      // Radial pinch toward the contact, peaking just inside its radius.
      const pull = contact.depth * u * Math.exp(-u * u) * 1.65;
      dx -= (rx / distance) * pull;
      dy -= (ry / distance) * pull;
      strain = Math.max(strain, Math.exp(-u * u * 1.4));
    }
    moved.x = node.x + dx;
    moved.y = node.y + dy;
    moved.strain = strain;
    moved.near = near;
  }

  context.clearRect(0, 0, width, height);
  // The membrane is barely there at rest and gathers definition around each
  // contact. On wide screens it also recedes behind the left text column and
  // fills the open space to the right. Edges are batched into a few alpha levels.
  const levels = 8;
  const bands = Array.from({ length: levels }, () => []);
  const wide = width >= 900;
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  for (const [a, b] of mesh.edges) {
    const A = mesh.moved[a];
    const B = mesh.moved[b];
    const x = (A.x + B.x) / 2;
    const field = wide ? 0.35 + 0.65 * smooth(width * 0.3, width * 0.8, x) : 0.7;
    const alpha = field * (0.03 + 0.1 * (A.near + B.near) / 2 + 0.11 * (A.strain + B.strain) / 2);
    bands[Math.min(levels - 1, Math.round(alpha / 0.22 * (levels - 1)))].push(a, b);
  }
  context.lineWidth = 1;
  context.strokeStyle = ink;
  bands.forEach((band, level) => {
    if (!band.length) return;
    context.globalAlpha = Math.max(0.012, level / (levels - 1) * 0.22);
    context.beginPath();
    for (let i = 0; i < band.length; i += 2) {
      const a = mesh.moved[band[i]];
      const b = mesh.moved[band[i + 1]];
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
    }
    context.stroke();
  });

  // Contact markers carry the simulation colour.
  context.strokeStyle = sim;
  context.fillStyle = sim;
  for (const contact of active) {
    context.globalAlpha = 0.7;
    context.beginPath();
    context.arc(contact.x, contact.sy, 2.5, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.45;
    context.beginPath();
    context.arc(contact.x, contact.sy, 9, 0, Math.PI * 2);
    context.stroke();
  }
  context.globalAlpha = 1;
}

function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
function rebuild() { mesh = null; schedule(); }
addEventListener('scroll', () => { if (!reduced.matches) schedule(); }, { passive: true });
addEventListener('resize', rebuild, { passive: true });
reduced.addEventListener('change', schedule);
document.addEventListener('visibilitychange', schedule);
// Page height settles once media and fonts load; contacts follow it.
addEventListener('load', rebuild);
document.fonts?.ready.then(rebuild);
new ResizeObserver(() => rebuild()).observe(document.body);
schedule();
