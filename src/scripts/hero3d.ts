import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  Group,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Mesh,
  Scene,
  ShaderMaterial,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";

// Nudo 3D con el degradado de la marca (el mismo de "piensa") que enmarca la foto.
const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uDark;
  uniform float uAlpha;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;

  vec3 brand(float t) {
    vec3 c0 = vec3(0.031, 0.580, 1.000);
    vec3 c1 = vec3(0.788, 0.349, 0.867);
    vec3 c2 = vec3(1.000, 0.180, 0.330);
    vec3 c3 = vec3(1.000, 0.565, 0.016);
    vec3 c = mix(c0, c1, smoothstep(0.0, 0.34, t));
    c = mix(c, c2, smoothstep(0.34, 0.68, t));
    return mix(c, c3, smoothstep(0.68, 1.0, t));
  }

  void main() {
    // Onda en vez de fract(): el degradado no tiene costura al cerrar el nudo.
    float t = 0.5 + 0.5 * sin(6.28318 * (vUv.x * 2.0 + uTime * 0.06));
    vec3 col = brand(t);
    vec3 n = normalize(vN);
    float lambert = 0.62 + 0.38 * dot(n, normalize(vec3(0.4, 0.8, 0.6)));
    float fres = pow(1.0 - max(dot(n, normalize(vV)), 0.0), 2.4);
    vec3 lit = col * lambert + fres * mix(0.5, 0.75, uDark);
    gl_FragColor = vec4(lit, uAlpha);
  }
`;

const brandStops = [
  [0.031, 0.58, 1.0],
  [0.788, 0.349, 0.867],
  [1.0, 0.18, 0.33],
  [1.0, 0.565, 0.016],
];

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.45, "rgba(255,255,255,0.9)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

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

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.z = 5.9;

  const rig = new Group();
  scene.add(rig);

  const uniforms = { uTime: { value: 0 }, uDark: { value: 0 }, uAlpha: { value: 1 } };
  const makeMaterial = (alpha: number) =>
    new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: { uTime: uniforms.uTime, uDark: uniforms.uDark, uAlpha: { value: alpha } },
      transparent: alpha < 1,
    });

  const tubular = small ? 220 : 420;
  const radial = small ? 8 : 14;
  const main = new Mesh(new TorusKnotGeometry(0.78, 0.05, tubular, radial, 2, 3), makeMaterial(1));
  const echo = new Mesh(new TorusKnotGeometry(0.98, 0.016, tubular, 6, 3, 4), makeMaterial(0.55));
  rig.add(main, echo);

  // Polvo de partículas con los mismos colores, para dar profundidad.
  const count = small ? 70 : 150;
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 1.0 + Math.random() * 0.75;
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), r * Math.cos(b)], i * 3);
    const t = Math.random() * 3;
    const k = Math.floor(t);
    const f = t - k;
    const c0 = brandStops[k];
    const c1 = brandStops[Math.min(k + 1, 3)];
    colors.set([0, 1, 2].map((j) => c0[j] + (c1[j] - c0[j]) * f), i * 3);
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  dustGeo.setAttribute("color", new Float32BufferAttribute(colors, 3));
  const dustMat = new PointsMaterial({
    size: 0.055,
    map: dotTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const dust = new Points(dustGeo, dustMat);
  rig.add(dust);

  // Tema: en oscuro las partículas se suman a la luz; en claro se pintan normales.
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const applyTheme = () => {
    const dark = (root.dataset.theme ?? (media.matches ? "dark" : "light")) === "dark";
    uniforms.uDark.value = dark ? 1 : 0;
    dustMat.blending = dark ? AdditiveBlending : 1;
    dustMat.needsUpdate = true;
    if (!running) draw();
  };
  media.addEventListener("change", applyTheme);
  new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Puntero: el conjunto se inclina hacia el cursor con suavidad.
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
  };
  new ResizeObserver(() => {
    size();
    if (!running) draw();
  }).observe(canvas);
  size();

  let running = false;
  let last = performance.now();
  let spin = 0.6;
  const draw = () => {
    renderer.render(scene, camera);
  };
  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    uniforms.uTime.value += dt;
    spin += dt * 0.18;
    cur.x += (target.x - cur.x) * Math.min(dt * 3, 1);
    cur.y += (target.y - cur.y) * Math.min(dt * 3, 1);
    rig.rotation.y = spin + cur.x * 0.5;
    rig.rotation.x = 0.35 + cur.y * 0.35;
    echo.rotation.z = -spin * 0.8;
    dust.rotation.y = -spin * 0.4;
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

  rig.rotation.set(0.35, spin, 0);
  applyTheme();
  draw();
  sync();
  return true;
}
