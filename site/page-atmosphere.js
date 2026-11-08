// Background: a sheet of soft cloth that falls onto a sphere and drapes over it.
// The cloth is simulated once, on load and off the main thread, with a
// mass-spring model: Verlet integration in small substeps, distance
// constraints, air drag across the cloth's face, sphere friction and
// self-collision so folds never pass through each other. On the homepage the
// scroll scrubs through the stored result (eased, so it moves continuously);
// other pages show the cloth at rest.
// It is drawn with WebGL: smooth normals, soft wrapped light and a faint sheen,
// front layer only, so folds read as fabric rather than a mesh.
// Purely decorative: aria-hidden, no pointer events, never captures input.
const canvas = document.createElement('canvas');
canvas.className = 'page-atmosphere';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const scrubbed = document.body.dataset.page === 'home';

const N = 40;            // particles per side (simulation)
const S = 2;             // drawn at S× the resolution, smoothly interpolated
const SIZE = 1.9;        // cloth width, world units
const RADIUS = 0.5;      // sphere at the origin
const FLOOR = -2.4;      // far below: the corners hang free
const GRAVITY = 9.8;     // world units are metres: a 1.9 m sheet over a 1 m ball
const DAMPING = 0.996;   // light: the air drag below does the real work
const DRAG_MIDDLE = 0.14;
const DRAG_EDGE = 0.04;
const AIR = 0.35;        // m/s of slow, turning air
const AIR_UNTIL = 1.2;   // s: it fades out over the 0.6 s before this
const GRIP = 0.85;       // friction on the ball: the drape stays where it lands
const SUBSTEPS = 3;      // per 1/60 s step
const ITERATIONS = 6;    // constraint passes per substep
const STEPS = 150;       // 2.5 s at 60 Hz: falls by 0.6 s, drapes by 1.4 s, then rests
const FRAME_EVERY = 2;   // stored every 1/30 s

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
      // A real sheet is never perfectly flat: a slight, uneven wave.
      pos[k + 1] = 0.95 + x0 * 0.07 + 0.02 * Math.sin(2.1 * x0 + 0.6) * Math.cos(1.6 * z0 - 0.3) + (next() - 0.5) * 0.002;
      pos[k + 2] = x0 * Math.sin(yaw) + z0 * Math.cos(yaw) - 0.03;
    }
  }
  const prev = pos.slice();
  const list = [];
  const link = (a, b, stiffness) => list.push(a * 3, b * 3, Math.hypot(pos[a * 3] - pos[b * 3], pos[a * 3 + 1] - pos[b * 3 + 1], pos[a * 3 + 2] - pos[b * 3 + 2]), stiffness);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const a = i * N + j;
      if (j + 1 < N) link(a, a + 1, 1);
      if (i + 1 < N) link(a, a + N, 1);
      if (i + 1 < N && j + 1 < N) { link(a, a + N + 1, 0.8); link(a + 1, a + N, 0.8); }
      // Bending: soft, so the sheet falls into broad, rounded folds.
      if (j + 2 < N) link(a, a + 2, 0.18);
      if (i + 2 < N) link(a, a + 2 * N, 0.18);
    }
  }
  const links = Float64Array.from(list);
  // Self-collision: particles of different parts of the sheet keep a cloth
  // thickness apart (spatial hash, 27 neighbouring cells).
  const thickness = step * 0.9;
  const cellCount = 4096;
  const head = new Int32Array(cellCount);
  const chain = new Int32Array(count);
  const cellOf = (x, y, z) => ((Math.floor(x / thickness) * 73856093) ^ (Math.floor(y / thickness) * 19349663) ^ (Math.floor(z / thickness) * 83492791)) & (cellCount - 1);
  function separate() {
    head.fill(-1);
    for (let p = 0; p < count; p++) {
      const c = cellOf(pos[p * 3], pos[p * 3 + 1], pos[p * 3 + 2]);
      chain[p] = head[c];
      head[c] = p;
    }
    for (let p = 0; p < count; p++) {
      const k = p * 3;
      const pi = (p / N) | 0, pj = p % N;
      const gx = Math.floor(pos[k] / thickness), gy = Math.floor(pos[k + 1] / thickness), gz = Math.floor(pos[k + 2] / thickness);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
        for (let q = head[(((gx + dx) * 73856093) ^ ((gy + dy) * 19349663) ^ ((gz + dz) * 83492791)) & (cellCount - 1)]; q !== -1; q = chain[q]) {
          if (q <= p) continue;
          const qi = (q / N) | 0, qj = q % N;
          if (Math.abs(qi - pi) <= 1 && Math.abs(qj - pj) <= 1) continue;
          const m = q * 3;
          const ex = pos[m] - pos[k], ey = pos[m + 1] - pos[k + 1], ez = pos[m + 2] - pos[k + 2];
          const d2 = ex * ex + ey * ey + ez * ez;
          if (d2 >= thickness * thickness || d2 === 0) continue;
          const d = Math.sqrt(d2);
          const push = (thickness - d) / d * 0.5;
          pos[k] -= ex * push; pos[k + 1] -= ey * push; pos[k + 2] -= ez * push;
          pos[m] += ex * push; pos[m + 1] += ey * push; pos[m + 2] += ez * push;
        }
      }
    }
  }
  // Air drag acts on motion across the cloth's face, and more in the middle
  // than at the free edges where the air slips past: like a dropped sheet, the
  // edges lead and the middle billows, instead of the sheet falling as a board.
  const drag = new Float32Array(count);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) drag[i * N + j] = DRAG_EDGE + (DRAG_MIDDLE - DRAG_EDGE) * Math.min(1, Math.min(i, j, N - 1 - i, N - 1 - j) / 7);
  }
  const normal = new Float32Array(count * 3);
  const damping = DAMPING ** (1 / SUBSTEPS);
  function faceNormals() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const l = (i * N + Math.max(0, j - 1)) * 3, r = (i * N + Math.min(N - 1, j + 1)) * 3;
        const u = (Math.max(0, i - 1) * N + j) * 3, d = (Math.min(N - 1, i + 1) * N + j) * 3;
        const ax = pos[r] - pos[l], ay = pos[r + 1] - pos[l + 1], az = pos[r + 2] - pos[l + 2];
        const bx = pos[d] - pos[u], by = pos[d + 1] - pos[u + 1], bz = pos[d + 2] - pos[u + 2];
        const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
        const m = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        const k = (i * N + j) * 3;
        normal[k] = nx / m; normal[k + 1] = ny / m; normal[k + 2] = nz / m;
      }
    }
  }
  const frames = [pos.slice()];
  const dt = 1 / 60 / SUBSTEPS;
  const gravity = -GRAVITY * dt * dt;
  const surface = RADIUS + 0.02;
  // Small substeps keep the cloth nearly inextensible far better than more
  // passes of one big step; without them it sags under its own hanging weight.
  for (let s = 1; s <= STEPS * SUBSTEPS; s++) {
    const time = s * dt;
    // The air settles once the sheet has landed, so the drape comes to rest.
    const air = AIR * Math.max(0, Math.min(1, (AIR_UNTIL - time) / 0.6));
    faceNormals();
    for (let p = 0; p < count; p++) {
      const k = p * 3;
      // Slow, gently turning air, so the folds are not mirror images.
      const wx = air * Math.sin(1.7 * pos[k + 2] + 1.1 * time + 0.4) * dt;
      const wy = air * 0.35 * Math.sin(2.1 * pos[k] + 1.7 * pos[k + 2] + 2.3 * time) * dt;
      const wz = air * Math.cos(1.3 * pos[k] - 0.8 * time) * dt;
      let vx = (pos[k] - prev[k]) * damping, vy = (pos[k + 1] - prev[k + 1]) * damping, vz = (pos[k + 2] - prev[k + 2]) * damping;
      const nx = normal[k], ny = normal[k + 1], nz = normal[k + 2];
      const across = ((vx - wx) * nx + (vy - wy) * ny + (vz - wz) * nz) * drag[p] / SUBSTEPS;
      vx -= nx * across; vy -= ny * across; vz -= nz * across;
      prev[k] = pos[k]; prev[k + 1] = pos[k + 1]; prev[k + 2] = pos[k + 2];
      pos[k] += vx; pos[k + 1] += vy + gravity; pos[k + 2] += vz;
    }
    for (let iteration = 0; iteration < ITERATIONS; iteration++) {
      for (let l = 0; l < links.length; l += 4) {
        const a = links[l];
        const b = links[l + 1];
        const dx = pos[b] - pos[a];
        const dy = pos[b + 1] - pos[a + 1];
        const dz = pos[b + 2] - pos[a + 2];
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        const push = (length - links[l + 2]) / length * 0.5 * links[l + 3];
        pos[a] += dx * push; pos[a + 1] += dy * push; pos[a + 2] += dz * push;
        pos[b] -= dx * push; pos[b + 1] -= dy * push; pos[b + 2] -= dz * push;
      }
      for (let p = 0; p < count; p++) {
        const k = p * 3;
        const distance = Math.sqrt(pos[k] * pos[k] + pos[k + 1] * pos[k + 1] + pos[k + 2] * pos[k + 2]);
        if (distance < surface) {
          const scale = surface / (distance || 1e-6);
          pos[k] *= scale; pos[k + 1] *= scale; pos[k + 2] *= scale;
          // Friction: the cloth grips the sphere instead of sliding off.
          for (let c = 0; c < 3; c++) prev[k + c] += (pos[k + c] - prev[k + c]) * GRIP;
        }
        if (pos[k + 1] < FLOOR) {
          pos[k + 1] = FLOOR;
          prev[k] += (pos[k] - prev[k]) * 0.5;
          prev[k + 2] += (pos[k + 2] - prev[k + 2]) * 0.5;
        }
      }
    }
    separate();
    if (s % (FRAME_EVERY * SUBSTEPS) === 0) frames.push(pos.slice());
  }
  return frames;
}

// Hardware only: a software-rendered context would stall the page for a decoration.
const gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: true, premultipliedAlpha: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true });

let frames = null;
let resources = null;
let view = null;
let frame = 0;
let shown = null;        // the timeline position currently drawn
let lastTime = 0;
const M = (N - 1) * S + 1;   // drawn grid
const current = new Float32Array(N * N * 3);
const rows = new Float32Array(N * M * 3);
const fine = new Float32Array(M * M * 3);
const normals = new Float32Array(M * M * 3);
const indices = new Uint16Array((M - 1) * (M - 1) * 6);
for (let i = 0, t = 0; i + 1 < M; i++) {
  for (let j = 0; j + 1 < M; j++, t += 6) {
    const a = i * M + j;
    indices.set([a, a + 1, a + M, a + M, a + 1, a + M + 1], t);
  }
}
// Catmull-Rom weights for each drawn point between two simulated ones.
const taps = Array.from({ length: S }, (_, f) => {
  const t = f / S, t2 = t * t, t3 = t2 * t;
  return [(-t3 + 2 * t2 - t) / 2, (3 * t3 - 5 * t2 + 2) / 2, (-3 * t3 + 4 * t2 + t) / 2, (t3 - t2) / 2];
});
// One axis of the smooth upsampling: `count` lines of `n` points to `m` points.
function upsample(source, target, lines, n, stride, lineStride, outStride, outLineStride) {
  for (let line = 0; line < lines; line++) {
    for (let o = 0; o < (n - 1) * S + 1; o++) {
      const c = Math.min(n - 2, Math.floor(o / S));
      const w = taps[o - c * S] ?? [0, 0, 1, 0];
      const at = d => line * lineStride + Math.min(n - 1, Math.max(0, c + d)) * stride;
      const p0 = at(-1), p1 = at(0), p2 = at(1), p3 = at(2);
      const out = line * outLineStride + o * outStride;
      for (let k = 0; k < 3; k++) target[out + k] = w[0] * source[p0 + k] + w[1] * source[p1 + k] + w[2] * source[p2 + k] + w[3] * source[p3 + k];
    }
  }
}

// Camera: turned a little to the side and looking slightly down. The cloth is
// projected exactly as the page layout asks: centre (cx, cy), `unit` pixels per
// world unit at the sphere, perspective from `DISTANCE` units away.
const YAW = -0.5;
const PITCH = 0.42;
const DISTANCE = 5.2;

const VERTEX = `
attribute vec3 position;
attribute vec3 normal;
uniform vec2 center;
uniform vec2 scale;
uniform vec4 turn;
varying vec3 vNormal;
varying vec3 vView;
vec3 toCamera(vec3 p) {
  float x1 = p.x * turn.x + p.z * turn.y;
  float z1 = -p.x * turn.y + p.z * turn.x;
  return vec3(x1, p.y * turn.z - z1 * turn.w, p.y * turn.w + z1 * turn.z);
}
void main() {
  vec3 p = toCamera(position);
  float w = (${DISTANCE.toFixed(2)} - p.z) / ${DISTANCE.toFixed(2)};
  gl_Position = vec4(center * w + p.xy * scale, -p.z * 0.2 * w, w);
  vNormal = toCamera(normal);
  vView = vec3(-p.xy, ${DISTANCE.toFixed(2)} - p.z);
}`;

// Shadows tint the page with ink, the sheen lifts it towards white; flat, lit
// cloth adds almost nothing, so the drape shows only through its folds.
const FRAGMENT = `
precision mediump float;
uniform vec3 ink;
uniform vec3 light;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  if (dot(n, v) < 0.0) n = -n;
  float diffuse = clamp((dot(n, light) + 0.45) / 1.45, 0.0, 1.0);
  float shade = 1.0 - diffuse;
  float sheen = pow(max(dot(n, normalize(light + v)), 0.0), 18.0);
  float grazing = pow(1.0 - max(dot(n, v), 0.0), 2.5);
  float dark = 0.016 + shade * shade * 0.11 + grazing * 0.035;
  float lift = sheen * 0.42 + 0.05;
  vec4 colour = vec4(ink * dark, dark);
  colour = colour * (1.0 - lift) + vec4(lift);
  gl_FragColor = colour;
}`;

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

function setup() {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const buffer = (data, target, usage) => { const b = gl.createBuffer(); gl.bindBuffer(target, b); gl.bufferData(target, data, usage); return b; };
  const position = buffer(fine, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
  const normal = buffer(normals, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
  buffer(indices, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
  const attribute = (name, b) => {
    const location = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
  };
  attribute('position', position);
  attribute('normal', normal);
  const uniform = name => gl.getUniformLocation(program, name);
  const inkColour = (getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#181c1e').match(/\w\w/g).map(h => parseInt(h, 16) / 255);
  gl.uniform3fv(uniform('ink'), inkColour);
  const lightDirection = [-0.45, 0.8, 0.4];
  const m = Math.hypot(...lightDirection);
  gl.uniform3fv(uniform('light'), lightDirection.map(c => c / m));
  gl.uniform4f(uniform('turn'), Math.cos(YAW), Math.sin(YAW), Math.cos(PITCH), Math.sin(PITCH));
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  resources = { position, normal, center: uniform('center'), scale: uniform('scale') };
  view = null;
}

function measure() {
  // 100lvh in CSS: the canvas keeps the largest viewport height, so the mobile
  // address bar showing or hiding never resizes or re-lays the drawing.
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (view && view.width === width && view.height === height) return;
  // A soft, faint drape needs no retina detail: cap the drawing buffer at about
  // 2.4 million pixels so large and dense screens do not pay for invisible sharpness.
  const ratio = Math.min(devicePixelRatio || 1, 2, Math.sqrt(2.4e6 / Math.max(1, width * height)));
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  gl.viewport(0, 0, canvas.width, canvas.height);
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

function refine() {
  // Smooth surface first: rows, then columns, through the simulated points.
  upsample(current, rows, N, N, 3, N * 3, 3, M * 3);
  upsample(rows, fine, M, N, M * 3, 3, M * 3, 3);
  // Per-vertex normals from the grid neighbours: the light varies smoothly
  // across each triangle instead of in flat facets.
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < M; j++) {
      const l = (i * M + Math.max(0, j - 1)) * 3, r = (i * M + Math.min(M - 1, j + 1)) * 3;
      const u = (Math.max(0, i - 1) * M + j) * 3, d = (Math.min(M - 1, i + 1) * M + j) * 3;
      const ax = fine[r] - fine[l], ay = fine[r + 1] - fine[l + 1], az = fine[r + 2] - fine[l + 2];
      const bx = fine[d] - fine[u], by = fine[d + 1] - fine[u + 1], bz = fine[d + 2] - fine[u + 2];
      const k = (i * M + j) * 3;
      normals[k] = ay * bz - az * by;
      normals[k + 1] = az * bx - ax * bz;
      normals[k + 2] = ax * by - ay * bx;
    }
  }
}

function render(now) {
  frame = 0;
  if (!frames || !resources || gl.isContextLost()) return;
  measure();
  const { width, height, cx, cy, unit } = view;
  // The cloth follows the scroll with a little inertia (about 0.2 s) instead of
  // jumping a whole wheel notch at once, so it always moves continuously.
  const target = progress();
  if (shown === null || !scrubbed || reduced.matches) shown = target;
  else shown += (target - shown) * (1 - Math.exp(-Math.min(1 / 30, (now - lastTime) / 1000) / 0.18));
  lastTime = now;
  if (Math.abs(target - shown) < 0.0004) shown = target;
  else schedule();
  const position = shown * (frames.length - 1);
  const index = Math.floor(position);
  const from = frames[index];
  const to = frames[Math.min(frames.length - 1, index + 1)];
  const blend = position - index;
  for (let k = 0; k < current.length; k++) current[k] = from[k] + (to[k] - from[k]) * blend;
  refine();
  gl.bindBuffer(gl.ARRAY_BUFFER, resources.position);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, fine);
  gl.bindBuffer(gl.ARRAY_BUFFER, resources.normal);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, normals);
  gl.uniform2f(resources.center, 2 * cx / width - 1, 1 - 2 * cy / height);
  gl.uniform2f(resources.scale, 2 * unit / width, 2 * unit / height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Depth first, then colour on the nearest surface only: folds behind the
  // front layer never show through it.
  gl.colorMask(false, false, false, false);
  gl.depthMask(true);
  gl.depthFunc(gl.LESS);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  gl.colorMask(true, true, true, true);
  gl.depthMask(false);
  gl.depthFunc(gl.LEQUAL);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  gl.depthMask(true);
  canvas.classList.add('is-ready');
}

function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }

function ready(result) {
  frames = result;
  schedule();
}

if (gl) {
  try {
    setup();
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); resources = null; canvas.classList.remove('is-ready'); });
    canvas.addEventListener('webglcontextrestored', () => { setup(); schedule(); });
    try {
      const source = `const N=${N},SIZE=${SIZE},RADIUS=${RADIUS},FLOOR=${FLOOR},GRAVITY=${GRAVITY},DAMPING=${DAMPING},DRAG_MIDDLE=${DRAG_MIDDLE},DRAG_EDGE=${DRAG_EDGE},AIR=${AIR},AIR_UNTIL=${AIR_UNTIL},GRIP=${GRIP},SUBSTEPS=${SUBSTEPS},ITERATIONS=${ITERATIONS},STEPS=${STEPS},FRAME_EVERY=${FRAME_EVERY};\n${random}\n${simulate}\n` +
        'const f=simulate();postMessage(f,f.map(x=>x.buffer));';
      const worker = new Worker(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
      worker.onmessage = event => { ready(event.data); worker.terminate(); };
      worker.onerror = () => { worker.terminate(); setTimeout(() => ready(simulate()), 0); };
    } catch {
      setTimeout(() => ready(simulate()), 0);
    }
    addEventListener('scroll', () => { if (scrubbed && !reduced.matches) schedule(); }, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    reduced.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', schedule);
  } catch {
    // No usable WebGL: the page simply has no background.
    resources = null;
  }
}
