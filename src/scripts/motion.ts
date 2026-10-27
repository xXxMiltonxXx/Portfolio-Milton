import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  gsap.to(".hero .stage", {
    yPercent: 14,
    opacity: 0.35,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero .lines", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // ---------- Contadores ----------
  $("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => (el.textContent = String(Math.round(obj.v))),
    });
  });

  // ---------- Líneas que se dibujan ----------
  $("[data-line]").forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });

  // ---------- Titulares de sección ----------
  $("section:not(.hero) .section-head").forEach((head) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: "top 85%", once: true } });
    tl.from(head.querySelector(".eyebrow"), { y: 16, opacity: 0, duration: 0.7, ease: "power3.out" })
      .from(head.querySelector(".headline"), { y: 60, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.05)
      .from(head.querySelector(".headline .soft"), { opacity: 0, duration: 1.2, ease: "power2.out" }, 0.45);
  });

  // ---------- Aparición escalonada de bloques ----------
  const blocks = $(".reveal").filter((el) => !el.classList.contains("section-head"));
  gsap.set(blocks, { y: 48, opacity: 0 });
  ScrollTrigger.batch(blocks, {
    start: "top 90%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true, clearProps: "transform,opacity" }),
  });


  // ---------- Línea de tiempo de experiencia ----------
  const fill = document.querySelector("[data-progress-line]");
  if (fill) {
    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
      },
    );
  }

  // ---------- Tecnologías: cascada de logos ----------
  $("#tecnologias .tiles").forEach((list) => {
    gsap.from(list.children, {
      y: 30,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "back.out(1.6)",
      stagger: 0.035,
      scrollTrigger: { trigger: list, start: "top 88%", once: true },
    });
  });

  // ---------- Contacto ----------
  gsap.from("#contacto .headline", {
    scale: 0.75,
    letterSpacing: "0.04em",
    opacity: 0.2,
    ease: "none",
    scrollTrigger: { trigger: "#contacto", start: "top 95%", end: "center 60%", scrub: true },
  });

  // ---------- Brillo animado del asistente ----------
  gsap.to(".ai-box", { backgroundPosition: "100% 50%", duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
});


// Recalcular cuando cargan fuentes e imágenes.
window.addEventListener("load", () => ScrollTrigger.refresh());
