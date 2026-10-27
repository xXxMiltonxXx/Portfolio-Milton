import { gsap } from "gsap";

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

// Brillo que sigue al cursor en las tarjetas (también sin animaciones).
document.addEventListener("pointermove", (e) => {
  const tile = (e.target as Element | null)?.closest?.<HTMLElement>(".tile");
  if (!tile) return;
  const r = tile.getBoundingClientRect();
  tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
  tile.style.setProperty("--my", `${e.clientY - r.top}px`);
});


// Dispara cb cuando los elementos entran en pantalla (una sola vez cada uno).
// IntersectionObserver mide en vivo, así que sigue funcionando aunque la página
// cambie de alto (filtros de proyectos, imágenes que cargan tarde).
const onView = (els: Element[], cb: (batch: HTMLElement[]) => void, rootMargin = "0px 0px -8% 0px") => {
  let queue: HTMLElement[] = [];
  let frame = 0;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        queue.push(e.target as HTMLElement);
      });
      if (queue.length && !frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          const batch = queue;
          queue = [];
          cb(batch);
        });
    },
    { rootMargin },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
};

// Animación ligada al scroll (scrub). El progreso se calcula en cada frame con
// la posición real del elemento: no hay medidas guardadas que queden viejas
// cuando la página cambia de alto. Los puntos son pares
// [punto del elemento (0 arriba, 0.5 centro, 1 abajo), punto del viewport].
type Scrub = { el: Element; anim: gsap.core.Animation; start: [number, number]; end: [number, number]; smooth: number };
const scrubs: Scrub[] = [];
const scrub = (sel: string, anim: gsap.core.Animation, start: [number, number], end: [number, number], smooth = 0) => {
  const el = document.querySelector(sel);
  if (!el) return anim.kill();
  anim.pause();
  scrubs.push({ el, anim, start, end, smooth });
};
const updateScrubs = () => {
  const vh = innerHeight;
  scrubs.forEach(({ el, anim, start, end, smooth }) => {
    const r = el.getBoundingClientRect();
    const a = start[1] * vh - (r.top + r.height * start[0]);
    const total = (start[1] - end[1]) * vh + r.height * (end[0] - start[0]);
    const p = gsap.utils.clamp(0, 1, total > 0 ? a / total : 0);
    if (smooth) gsap.to(anim, { progress: p, duration: smooth, ease: "power3.out", overwrite: true });
    else anim.progress(p);
  });
};
let scrubFrame = 0;
const queueScrubs = () => {
  if (!scrubFrame)
    scrubFrame = requestAnimationFrame(() => {
      scrubFrame = 0;
      updateScrubs();
    });
};
addEventListener("scroll", queueScrubs, { passive: true });
addEventListener("resize", queueScrubs);

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  // ---------- Hero ----------
  const lines = $<SVGPathElement>(".hero .ln");
  lines.forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });

  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    .to(lines, { strokeDashoffset: 0, duration: 2.4, stagger: 0.18, ease: "power2.inOut" }, 0)
    .from(".hero [data-hero='photo']", { scale: 0.6, opacity: 0, duration: 1.3 }, 0.1)
    .from(".hero .ring", { scale: 0.4, opacity: 0, duration: 1.6, stagger: 0.12 }, 0.15)
    .from(".hero .wi", { yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.07 }, 0.3)
    .from(".hero [data-hero='fade']", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.75)
    .from(".hero [data-hero='chip']", { y: 30, opacity: 0, scale: 0.85, duration: 1, stagger: 0.12 }, 0.9);

  $(".hero [data-hero='chip']").forEach((chip, i) => {
    gsap.to(chip, { y: i % 2 ? 12 : -12, duration: 3 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 });
  });
  gsap.to(".hero .r1", { rotate: 360, duration: 60, ease: "none", repeat: -1 });
  gsap.to(".hero .r3", { rotate: -360, duration: 90, ease: "none", repeat: -1 });
  gsap.to(".hero .ln-ai", { x: -50, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".hero .ln-soft", { x: 40, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1 });

  // Parallax suave del hero al bajar.
  scrub(".hero", gsap.to(".hero .stage", { yPercent: 14, opacity: 0.35, ease: "none" }), [0, 0], [1, 0]);
  scrub(".hero", gsap.to(".hero .lines", { yPercent: 30, ease: "none" }), [0, 0], [1, 0]);

  const stops: (() => void)[] = [];

  // ---------- Contadores ----------
  const counters = $("[data-count]");
  counters.forEach((el) => (el.textContent = "0"));
  stops.push(
    onView(counters, (batch) =>
      batch.forEach((el) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: Number(el.dataset.count),
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        });
      }),
    ),
  );

  // ---------- Líneas que se dibujan ----------
  const rules = $("[data-line]");
  gsap.set(rules, { scaleX: 0 });
  stops.push(onView(rules, (batch) => gsap.to(batch, { scaleX: 1, duration: 1.4, ease: "expo.out", clearProps: "transform" })));

  // ---------- Titulares de sección ----------
  const heads = $("section:not(.hero) .section-head");
  heads.forEach((head) => {
    gsap.set(head.querySelector(".eyebrow"), { y: 16, opacity: 0 });
    gsap.set(head.querySelector(".headline"), { y: 60, opacity: 0 });
    gsap.set(head.querySelector(".headline .soft"), { opacity: 0 });
  });
  stops.push(
    onView(heads, (batch) =>
      batch.forEach((head) =>
        gsap
          .timeline()
          .to(head.querySelector(".eyebrow"), { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
          .to(head.querySelector(".headline"), { y: 0, opacity: 1, duration: 1.1, ease: "expo.out" }, 0.05)
          .to(head.querySelector(".headline .soft"), { opacity: 1, duration: 1.2, ease: "power2.out" }, 0.45),
      ),
    ),
  );

  // ---------- Aparición escalonada de bloques ----------
  const blocks = $(".reveal").filter((el) => !el.classList.contains("section-head"));
  gsap.set(blocks, { y: 48, opacity: 0 });
  stops.push(
    onView(blocks, (batch) =>
      gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true, clearProps: "transform,opacity" }),
    ),
  );


  // ---------- Línea de tiempo de experiencia ----------
  if (document.querySelector("[data-progress-line]"))
    scrub(".timeline", gsap.fromTo("[data-progress-line]", { scaleY: 0 }, { scaleY: 1, ease: "none" }), [0, 0.7], [1, 0.6], 0.6);

  // ---------- Tecnologías: cascada de logos ----------
  const tileLists = $("#tecnologias .tiles");
  tileLists.forEach((list) => gsap.set(list.children, { y: 30, opacity: 0, scale: 0.9 }));
  stops.push(
    onView(tileLists, (batch) =>
      batch.forEach((list) =>
        gsap.to(list.children, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
          stagger: 0.035,
          clearProps: "transform,opacity",
        }),
      ),
    ),
  );

  // ---------- Contacto ----------
  scrub(
    "#contacto",
    gsap.from("#contacto .headline", { scale: 0.75, letterSpacing: "0.04em", opacity: 0.2, ease: "none" }),
    [0, 0.95],
    [0.5, 0.6],
  );

  // ---------- Brillo animado del asistente ----------
  gsap.to(".ai-box", { backgroundPosition: "100% 50%", duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });

  updateScrubs();

  return () => {
    stops.forEach((stop) => stop());
    scrubs.length = 0;
  };
});
