// Background: a sheet of cloth that falls onto a sphere and drapes over it.
// The cloth is simulated once, on load and off the main thread, with a
// mass-spring model (Verlet integration, distance constraints, sphere and floor
// contact). On the homepage
// scrolling scrubs through the stored result, so the page scroll is the
// simulation's timeline; other pages show the cloth at rest. Purely decorative:
// aria-hidden, no pointer events, never captures input.
const canvas = document.createElement('canvas');
canvas.className = 'page-atmosphere';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);
const context = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#181c1e';
const scrubbed = document.body.dataset.page === 'home';

const N = 34;            // particles per side
const SIZE = 1.9;        // cloth width, world units
const RADIUS = 0.5;      // sphere at the origin
const FLOOR = -2.4;      // far below: the corners hang free

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

// Deterministic: the same seed and steps give the same drape on every visit.
function simulate() {
  const next = random('tezoi-cloth');
  const count = N * N;
  const pos = new Float32Array(count * 3);
  const step = SIZE / (N - 1);
  const yaw = 0.32;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x0 = (j - (N - 1) / 2) * step;
      const z0 = (i - (N - 1) / 2) * step;
      const k = (i * N + j) * 3;
      pos[k] = x0 * Math.cos(yaw) - z0 * Math.sin(yaw) + 0.06;
      pos[k + 1] = 0.95 + x0 * 0.07 + (next() - 0.5) * 0.004;
      pos[k + 2] = x0 * Math.sin(yaw) + z0 * Math.cos(yaw) - 0.03;
    }
  }
  const prev = pos.slice();
  const links = [];
  const link = (a, b, stiffness) => links.push(a, b, Math.hypot(pos[a * 3] - pos[b * 3], pos[a * 3 + 1] - pos[b * 3 + 1], pos[a * 3 + 2] - pos[b * 3 + 2]), stiffness);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const a = i * N + j;
      if (j + 1 < N) link(a, a + 1, 1);
      if (i + 1 < N) link(a, a + N, 1);
      if (i + 1 < N && j + 1 < N) { link(a, a + N + 1, 0.9); link(a + 1, a + N, 0.9); }
      if (j + 2 < N) link(a, a + 2, 0.25);
      if (i + 2 < N) link(a, a + 2 * N, 0.25);
    }
  }
  const frames = [pos.slice()];
  const dt = 1 / 60;
  const gravity = -3.2 * dt * dt;
  for (let s = 1; s <= 216; s++) {
    for (let p = 0; p < count; p++) {
      for (let c = 0; c < 3; c++) {
        const k = p * 3 + c;
        const velocity = (pos[k] - prev[k]) * 0.986;
        prev[k] = pos[k];
        pos[k] += velocity + (c === 1 ? gravity : 0);
      }
    }
    for (let iteration = 0; iteration < 8; iteration++) {
      for (let l = 0; l < links.length; l += 4) {
        const a = links[l] * 3;
        const b = links[l + 1] * 3;
        const dx = pos[b] - pos[a];
        const dy = pos[b + 1] - pos[a + 1];
        const dz = pos[b + 2] - pos[a + 2];
        const length = Math.hypot(dx, dy, dz) || 1e-6;
        const push = (length - links[l + 2]) / length * 0.5 * links[l + 3];
        pos[a] += dx * push; pos[a + 1] += dy * push; pos[a + 2] += dz * push;
        pos[b] -= dx * push; pos[b + 1] -= dy * push; pos[b + 2] -= dz * push;
      }
      for (let p = 0; p < count; p++) {
        const k = p * 3;
        const distance = Math.hypot(pos[k], pos[k + 1], pos[k + 2]);
        const surface = RADIUS + 0.015;
        if (distance < surface) {
          const scale = surface / (distance || 1e-6);
          pos[k] *= scale; pos[k + 1] *= scale; pos[k + 2] *= scale;
          // Friction: the cloth grips the sphere instead of sliding off.
          for (let c = 0; c < 3; c++) prev[k + c] += (pos[k + c] - prev[k + c]) * 0.6;
        }
        if (pos[k + 1] < FLOOR) {
          pos[k + 1] = FLOOR;
          prev[k] += (pos[k] - prev[k]) * 0.5;
          prev[k + 2] += (pos[k + 2] - prev[k + 2]) * 0.5;
        }
      }
    }
    if (s % 3 === 0) frames.push(pos.slice());
  }
  return frames;
}

let frames = null;
function ready(result) {
  frames = result;
  canvas.classList.add('is-ready');
  schedule();
}
try {
  const source = `const N=${N},SIZE=${SIZE},RADIUS=${RADIUS},FLOOR=${FLOOR};\n${random}\n${simulate}\n` +
    'const f=simulate();postMessage(f,f.map(x=>x.buffer));';
  const worker = new Worker(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
  worker.onmessage = event => { ready(event.data); worker.terminate(); };
  worker.onerror = () => { worker.terminate(); setTimeout(() => ready(simulate()), 0); };
} catch {
  setTimeout(() => ready(simulate()), 0);
}
const current = new Float32Array(N * N * 3);
const screen = new Float32Array(N * N * 2);
const triangles = [];
for (let i = 0; i + 1 < N; i++) {
  for (let j = 0; j + 1 < N; j++) {
    const a = i * N + j;
    triangles.push(a, a + 1, a + N, a + N, a + 1, a + N + 1);
  }
}
const light = (() => { const v = [-0.35, 0.85, 0.42]; const m = Math.hypot(...v); return v.map(c => c / m); })();

let view = null;
let frame = 0;

function measure() {
  // 100lvh in CSS: the canvas keeps the largest viewport height, so the mobile
  // address bar showing or hiding never resizes or re-lays the drawing.
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (view && view.width === width && view.height === height) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  // Phones place the cloth by width alone, so even a browser that resizes the
  // canvas with its toolbar only extends the drawing; the cloth never moves.
  if (view && view.width === width && width < 900) { view.height = height; return; }
  const wide = width >= 900;
  view = {
    width,
    height,
    // The sheet is larger than the screen: the page sits on a field of folds.
    cx: width * (wide ? 0.6 : 0.55),
    cy: wide ? height * 0.4 : width * 0.9,
    unit: wide ? Math.min(width * 0.62, height * 1.05) : width * 0.95,
    runway: wide ? height : width * 2.1,
  };
}

function progress() {
  if (!scrubbed || reduced.matches) return 1;
  // Measured from the top in a fixed runway, never from the page length or the
  // live viewport height, so late-loading media and toolbars cannot jolt it.
  const runway = view.runway;
  return Math.min(1, Math.max(0, (scrollY - runway * 0.45) / (runway * 2.6)));
}

function render() {
  frame = 0;
  if (!frames) return;
  measure();
  const { width, height, cx, cy, unit } = view;
  const position = progress() * (frames.length - 1);
  const index = Math.floor(position);
  const from = frames[index];
  const to = frames[Math.min(frames.length - 1, index + 1)];
  const blend = position - index;
  for (let k = 0; k < current.length; k++) current[k] = from[k] + (to[k] - from[k]) * blend;

  // Camera: turned a little to the side and looking slightly down.
  const yaw = -0.5;
  const pitch = 0.42;
  const distance = 5.2;
  const cosYaw = Math.cos(yaw), sinYaw = Math.sin(yaw), cosPitch = Math.cos(pitch), sinPitch = Math.sin(pitch);
  for (let p = 0; p < N * N; p++) {
    const x = current[p * 3], y = current[p * 3 + 1], z = current[p * 3 + 2];
    const x1 = x * cosYaw + z * sinYaw;
    const z1 = -x * sinYaw + z * cosYaw;
    const y2 = y * cosPitch - z1 * sinPitch;
    const z2 = y * sinPitch + z1 * cosPitch;
    const scale = unit * distance / (distance - z2);
    screen[p * 2] = cx + x1 * scale;
    screen[p * 2 + 1] = cy - y2 * scale;
  }

  context.clearRect(0, 0, width, height);
  context.fillStyle = ink;
  context.strokeStyle = ink;
  // Folds turned away from the light read darker; batched into a few levels.
  const levels = 10;
  const bands = Array.from({ length: levels }, () => []);
  for (let t = 0; t < triangles.length; t += 3) {
    const a = triangles[t] * 3, b = triangles[t + 1] * 3, c = triangles[t + 2] * 3;
    const ux = current[b] - current[a], uy = current[b + 1] - current[a + 1], uz = current[b + 2] - current[a + 2];
    const vx = current[c] - current[a], vy = current[c + 1] - current[a + 1], vz = current[c + 2] - current[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const shade = Math.abs(nx * light[0] + ny * light[1] + nz * light[2]) / (Math.hypot(nx, ny, nz) || 1);
    bands[Math.min(levels - 1, Math.floor((1 - shade) * levels))].push(triangles[t], triangles[t + 1], triangles[t + 2]);
  }
  bands.forEach((band, level) => {
    if (!band.length) return;
    context.globalAlpha = 0.006 + level / (levels - 1) * 0.026;
    context.beginPath();
    for (let i = 0; i < band.length; i += 3) {
      context.moveTo(screen[band[i] * 2], screen[band[i] * 2 + 1]);
      context.lineTo(screen[band[i + 1] * 2], screen[band[i + 1] * 2 + 1]);
      context.lineTo(screen[band[i + 2] * 2], screen[band[i + 2] * 2 + 1]);
      context.closePath();
    }
    context.fill();
  });
  // The weave: rows and columns of the particle grid.
  context.globalAlpha = 0.075;
  context.lineWidth = 0.75;
  context.beginPath();
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const p = (i * N + j) * 2;
      if (j + 1 < N) { context.moveTo(screen[p], screen[p + 1]); context.lineTo(screen[p + 2], screen[p + 3]); }
      if (i + 1 < N) { context.moveTo(screen[p], screen[p + 1]); context.lineTo(screen[p + N * 2], screen[p + N * 2 + 1]); }
    }
  }
  context.stroke();
  context.globalAlpha = 1;
}

function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
addEventListener('scroll', () => { if (scrubbed && !reduced.matches) schedule(); }, { passive: true });
addEventListener('resize', schedule, { passive: true });
reduced.addEventListener('change', schedule);
document.addEventListener('visibilitychange', schedule);
schedule();
