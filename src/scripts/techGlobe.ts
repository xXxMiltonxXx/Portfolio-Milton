import {
  CanvasTexture,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from "three";

export interface GlobeItem {
  name: string;
  path?: string;
  color: string;
  monogram: string;
}

const R = 1.0;
const TEX = 160;

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return (t ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";
};

// Ficha redonda con el logo, como las fichas de la lista pero en una esfera.
function paint(ctx: CanvasRenderingContext2D, item: GlobeItem, dark: boolean) {
  const c = TEX / 2;
  ctx.clearRect(0, 0, TEX, TEX);
  ctx.save();
  ctx.shadowColor = dark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.arc(c, c, c - 14, 0, Math.PI * 2);
  ctx.fillStyle = dark ? "#2a2a2e" : "#ffffff";
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.09)";
  ctx.beginPath();
  ctx.arc(c, c, c - 14, 0, Math.PI * 2);
  ctx.stroke();

  const fg = dark ? "#f5f5f7" : "#1d1d1f";
  const fill = item.color === "currentColor" ? fg : item.color;
  if (item.path) {
    const size = (TEX - 28) * 0.54;
    ctx.save();
    ctx.translate(c - size / 2, c - size / 2);
    ctx.scale(size / 24, size / 24);
    ctx.fillStyle = fill;
    ctx.fill(new Path2D(item.path));
    ctx.restore();
  } else {
    ctx.fillStyle = fg;
    ctx.font = "600 44px -apple-system, 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.monogram, c, c + 2);
  }
}

export function startTechGlobe(canvas: HTMLCanvasElement, host: HTMLElement, items: GlobeItem[], label?: HTMLElement | null) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = matchMedia("(max-width: 640px)").matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return false;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.z = 4.5;
  const globe = new Group();
  scene.add(globe);

  // Malla tenue que da forma de esfera.
  const wire = new LineSegments(
    new WireframeGeometry(new IcosahedronGeometry(R * 0.985, 1)),
    new LineBasicMaterial({ transparent: true, opacity: 0.07, depthWrite: false }),
  );
  wire.renderOrder = -1;
  globe.add(wire);

  // Fibonacci: reparte los logos de forma pareja por toda la esfera.
  const sprites: { sprite: Sprite; ctx: CanvasRenderingContext2D; tex: CanvasTexture; item: GlobeItem }[] = [];
  const n = items.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const size = small ? 0.36 : 0.33;
  items.forEach((item, i) => {
    const y = 1 - (i + 0.5) * (2 / n);
    const r = Math.sqrt(1 - y * y);
    const a = golden * i;
    const cv = document.createElement("canvas");
    cv.width = cv.height = TEX;
    const ctx = cv.getContext("2d")!;
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    const sprite = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.position.set(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R);
    sprite.scale.setScalar(size);
    sprite.userData.item = item;
    globe.add(sprite);
    sprites.push({ sprite, ctx, tex, item });
  });

  const repaint = () => {
    const dark = isDark();
    sprites.forEach(({ ctx, tex, item }) => {
      paint(ctx, item, dark);
      tex.needsUpdate = true;
    });
    (wire.material as LineBasicMaterial).color.set(dark ? 0xffffff : 0x1d1d1f);
  };
  repaint();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    repaint();
    kick();
  });
  new MutationObserver(() => {
    repaint();
    kick();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Arrastrar para girar, con inercia; girando sola cuando nadie la toca.
  let vx = 0;
  let vy = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let idle = 0;
  globe.rotation.set(0.28, 0.6, 0);

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
    kick();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      vy = dx * 0.006;
      vx = dy * 0.006;
      globe.rotation.y += vy;
      globe.rotation.x = Math.max(-1.1, Math.min(1.1, globe.rotation.x + vx));
      idle = 0;
    } else {
      hover(e);
    }
    kick();
  });
  const release = () => {
    dragging = false;
    canvas.style.cursor = "grab";
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("pointerleave", () => {
    if (label) label.textContent = defaultLabel;
  });

  // Nombre del logo bajo el cursor.
  const ray = new Raycaster();
  const ndc = new Vector2();
  const defaultLabel = label?.textContent ?? "";
  const hover = (e: PointerEvent) => {
    if (!label) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const front = sprites.filter((s) => s.sprite.material.opacity > 0.6).map((s) => s.sprite);
    const hit = ray.intersectObjects(front, false)[0];
    label.textContent = hit ? hit.object.userData.item.name : defaultLabel;
  };

  const size2 = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(() => {
    size2();
    kick();
  }).observe(canvas);
  size2();

  const tmp = new Vector3();
  const draw = () => {
    // Los logos del fondo se atenúan para que se lea el frente.
    sprites.forEach(({ sprite }) => {
      sprite.getWorldPosition(tmp);
      const f = Math.min(Math.max((tmp.z / R + 0.35) / 1.05, 0), 1);
      sprite.material.opacity = 0.12 + 0.88 * f * f;
      sprite.scale.setScalar(size * (0.82 + 0.28 * f));
    });
    renderer.render(scene, camera);
  };

  let running = false;
  let visible = true;
  let last = performance.now();
  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!dragging) {
      vy *= Math.pow(0.04, dt);
      vx *= Math.pow(0.04, dt);
      globe.rotation.y += vy + (reduce ? 0 : dt * 0.22 * Math.min(idle, 1));
      globe.rotation.x = Math.max(-1.1, Math.min(1.1, globe.rotation.x + vx));
      idle = Math.min(idle + dt * 0.8, 1);
      // Vuelve poco a poco a una inclinación suave.
      globe.rotation.x += (0.28 - globe.rotation.x) * Math.min(dt * 0.6, 1);
    }
    draw();
    const moving = dragging || Math.abs(vx) > 0.0004 || Math.abs(vy) > 0.0004;
    if (reduce && !moving) {
      running = false;
      return;
    }
    requestAnimationFrame(frame);
  };
  const kick = () => {
    if (running || !visible || document.hidden) {
      if (!running) draw();
      return;
    }
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  };
  const sync = () => {
    if (visible && !document.hidden) kick();
    else running = false;
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  }).observe(host);
  document.addEventListener("visibilitychange", sync);

  draw();
  sync();
  return true;
}
