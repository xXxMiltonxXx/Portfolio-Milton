import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  LineSegments,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from "three";

// Red de nodos en 3D, como un grafo de conocimiento / espacio vectorial de un RAG:
// nodos conectados por sus vecinos más cercanos y paquetes de datos que viajan por las aristas.
const brandStops = [
  [0.031, 0.58, 1.0],
  [0.788, 0.349, 0.867],
  [1.0, 0.18, 0.33],
  [1.0, 0.565, 0.016],
];

function brand(t: number) {
  const x = Math.min(Math.max(t, 0), 0.9999) * 3;
  const k = Math.floor(x);
  const f = x - k;
  return [0, 1, 2].map((j) => brandStops[k][j] + (brandStops[k + 1][j] - brandStops[k][j]) * f);
}

const depthChunk = /* glsl */ `
  uniform float uNear;
  uniform float uFar;
  float depthFade(float d) {
    return clamp((uFar - d) / (uFar - uNear), 0.0, 1.0);
  }
`;

const lineVertex = /* glsl */ `
  attribute vec3 color;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const lineFragment = /* glsl */ `
  ${depthChunk}
  uniform float uDark;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    float f = depthFade(vDepth);
    float a = mix(0.14, mix(0.62, 0.8, uDark), f);
    gl_FragColor = vec4(vColor, a);
  }
`;

const pointVertex = /* glsl */ `
  attribute vec3 color;
  attribute float size;
  uniform float uScale;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_PointSize = size * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const pointFragment = /* glsl */ `
  ${depthChunk}
  uniform float uDark;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float d = length(p);
    if (d > 1.0) discard;
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(1.0, 0.15, d);
    float f = depthFade(vDepth);
    vec3 coreColor = mix(vec3(1.0), vColor * 0.55, 1.0 - uDark);
    vec3 col = mix(vColor, coreColor, core * 0.8);
    gl_FragColor = vec4(col, (halo * 0.5 + core * 0.55) * mix(0.3, 1.0, f));
  }
`;

export function startHero3D(canvas: HTMLCanvasElement, host: HTMLElement) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = matchMedia("(max-width: 640px)").matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return false;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75));

  const fov = 30;
  const camZ = 6.4;
  const scene = new Scene();
  const camera = new PerspectiveCamera(fov, 1, 0.1, 50);
  camera.position.z = camZ;
  const rig = new Group();
  scene.add(rig);

  // ---------- Nodos: cáscara esférica con relieve, vacía en el centro (ahí va la foto) ----------
  const n = small ? 44 : 72;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes: Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i + 0.5) * (2 / n);
    const r = Math.sqrt(1 - y * y);
    const a = golden * i;
    const jitter = () => (Math.random() - 0.5) * 0.18;
    const v = new Vector3(Math.cos(a) * r + jitter(), y + jitter(), Math.sin(a) * r + jitter()).normalize();
    nodes.push(v.multiplyScalar(0.95 + Math.random() * 0.3));
  }
  const hubs = new Set<number>();
  while (hubs.size < (small ? 5 : 8)) hubs.add(Math.floor(Math.random() * n));

  const nodeColor = nodes.map((p) => brand(0.5 + 0.5 * Math.sin(p.x * 1.7 + p.y * 1.3 + 0.8)));
  const baseSize = nodes.map((_, i) => (hubs.has(i) ? 0.17 : 0.07 + Math.random() * 0.04));

  // ---------- Aristas: cada nodo con sus 3 vecinos más cercanos y los hubs entre sí ----------
  const edgeKey = new Set<string>();
  const edges: [number, number][] = [];
  const addEdge = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a === b || edgeKey.has(k)) return;
    edgeKey.add(k);
    edges.push([a, b]);
  };
  nodes.forEach((p, i) => {
    nodes
      .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .forEach((o) => addEdge(i, o.j));
  });
  const hubList = [...hubs];
  hubList.forEach((h) => {
    hubList
      .filter((o) => o !== h)
      .map((o) => ({ o, d: nodes[h].distanceToSquared(nodes[o]) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
      .forEach(({ o }) => addEdge(h, o));
  });
  const adj: number[][] = nodes.map(() => []);
  edges.forEach(([a, b]) => {
    adj[a].push(b);
    adj[b].push(a);
  });

  const linePos = new Float32Array(edges.length * 6);
  const lineCol = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    linePos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], i * 6);
    lineCol.set([...nodeColor[a], ...nodeColor[b]], i * 6);
  });
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute("position", new BufferAttribute(linePos, 3));
  lineGeo.setAttribute("color", new BufferAttribute(lineCol, 3));

  const shared = {
    uDark: { value: 0 },
    uNear: { value: camZ - 1.4 },
    uFar: { value: camZ + 1.4 },
  };
  const lineMat = new ShaderMaterial({
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
    uniforms: { ...shared },
    transparent: true,
    depthWrite: false,
  });
  const lines = new LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  rig.add(lines);

  // ---------- Puntos de los nodos y paquetes de datos ----------
  const uScale = { value: 600 };
  const makePointMaterial = () =>
    new ShaderMaterial({
      vertexShader: pointVertex,
      fragmentShader: pointFragment,
      uniforms: { ...shared, uScale },
      transparent: true,
      depthWrite: false,
    });

  const nodePos = new Float32Array(n * 3);
  const nodeCol = new Float32Array(n * 3);
  nodes.forEach((p, i) => {
    nodePos.set([p.x, p.y, p.z], i * 3);
    nodeCol.set(nodeColor[i], i * 3);
  });
  const sizeArr = new Float32Array(baseSize);
  const nodeGeo = new BufferGeometry();
  nodeGeo.setAttribute("position", new BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute("color", new BufferAttribute(nodeCol, 3));
  const sizeAttr = new BufferAttribute(sizeArr, 1);
  nodeGeo.setAttribute("size", sizeAttr);
  const nodeMat = makePointMaterial();
  const nodePoints = new Points(nodeGeo, nodeMat);
  nodePoints.frustumCulled = false;
  rig.add(nodePoints);

  const packetCount = small ? 9 : 16;
  const packets = Array.from({ length: packetCount }, () => {
    const a = Math.floor(Math.random() * n);
    const b = adj[a][Math.floor(Math.random() * adj[a].length)];
    return { a, b, t: Math.random(), speed: 0.55 + Math.random() * 0.7 };
  });
  const pPos = new Float32Array(packetCount * 3);
  const pCol = new Float32Array(packetCount * 3);
  const pSize = new Float32Array(packetCount).fill(0.1);
  const packetGeo = new BufferGeometry();
  const pPosAttr = new BufferAttribute(pPos, 3);
  const pColAttr = new BufferAttribute(pCol, 3);
  packetGeo.setAttribute("position", pPosAttr);
  packetGeo.setAttribute("color", pColAttr);
  packetGeo.setAttribute("size", new BufferAttribute(pSize, 1));
  const packetMat = makePointMaterial();
  const packetPoints = new Points(packetGeo, packetMat);
  packetPoints.frustumCulled = false;
  rig.add(packetPoints);

  const flash = new Float32Array(n);
  const tmp = new Vector3();
  const placePackets = () => {
    packets.forEach((p, i) => {
      tmp.copy(nodes[p.a]).lerp(nodes[p.b], p.t);
      pPos.set([tmp.x, tmp.y, tmp.z], i * 3);
      const ca = nodeColor[p.a];
      const cb = nodeColor[p.b];
      // Los paquetes van más claros que su arista para que se noten.
      pCol.set([0, 1, 2].map((j) => Math.min(1, (ca[j] + (cb[j] - ca[j]) * p.t) * 0.6 + 0.4)), i * 3);
    });
    pPosAttr.needsUpdate = true;
    pColAttr.needsUpdate = true;
  };
  placePackets();

  // ---------- Tema ----------
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const applyTheme = () => {
    const dark = (root.dataset.theme ?? (media.matches ? "dark" : "light")) === "dark";
    shared.uDark.value = dark ? 1 : 0;
    [lineMat, nodeMat, packetMat].forEach((m) => {
      m.blending = dark ? AdditiveBlending : NormalBlending;
      m.needsUpdate = true;
    });
    if (!running) draw();
  };
  media.addEventListener("change", applyTheme);
  new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // ---------- Puntero ----------
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  if (!reduce) {
    addEventListener(
      "pointermove",
      (e) => {
        target.x = (e.clientX / innerWidth - 0.5) * 2;
        target.y = (e.clientY / innerHeight - 0.5) * 2;
      },
      { passive: true },
    );
  }

  const size = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uScale.value = renderer.domElement.height / (2 * Math.tan((fov * Math.PI) / 360));
  };
  new ResizeObserver(() => {
    size();
    if (!running) draw();
  }).observe(canvas);
  size();

  let running = false;
  let last = performance.now();
  let spin = 0.4;
  const draw = () => renderer.render(scene, camera);

  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    spin += dt * 0.12;
    cur.x += (target.x - cur.x) * Math.min(dt * 3, 1);
    cur.y += (target.y - cur.y) * Math.min(dt * 3, 1);
    rig.rotation.y = spin + cur.x * 0.45;
    rig.rotation.x = 0.28 + cur.y * 0.3;

    // Cada paquete avanza por su arista; al llegar enciende el nodo y sigue por otra.
    packets.forEach((p) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        flash[p.b] = 1;
        const next = adj[p.b].filter((k) => k !== p.a);
        const options = next.length ? next : adj[p.b];
        p.a = p.b;
        p.b = options[Math.floor(Math.random() * options.length)];
        p.t = 0;
      }
    });
    placePackets();
    for (let i = 0; i < n; i++) {
      flash[i] = Math.max(0, flash[i] - dt * 1.8);
      sizeArr[i] = baseSize[i] * (1 + flash[i] * 1.6);
    }
    sizeAttr.needsUpdate = true;
    draw();
    requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
  };

  // Solo anima mientras el hero está en pantalla y la pestaña visible.
  let visible = true;
  const sync = () => (visible && !document.hidden ? start() : stop());
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  }).observe(host);
  document.addEventListener("visibilitychange", sync);

  rig.rotation.set(0.28, spin, 0);
  applyTheme();
  draw();
  sync();
  return true;
}
