import * as icons from "simple-icons";

// Nombre visible -> slug de simple-icons. Sin slug se muestra un monograma.
const slugs: Record<string, string> = {
  "LangGraph": "langchain",
  "LangChain": "langchain",
  "Claude": "claude",
  "PyTorch": "pytorch",
  "OpenCV": "opencv",
  "TensorFlow Lite": "tensorflow",
  "Hugging Face": "huggingface",
  "React": "react",
  "Next.js": "nextdotjs",
  "Astro": "astro",
  "Angular": "angular",
  "TypeScript": "typescript",
  "JavaScript": "javascript",
  "Tailwind CSS": "tailwindcss",
  "GSAP": "gsap",
  "Three.js": "threedotjs",
  "Framer Motion": "framer",
  "Vite": "vite",
  "tRPC": "trpc",
  "Zod": "zod",
  "Python": "python",
  "FastAPI": "fastapi",
  "Flask": "flask",
  "Go": "go",
  "Node.js": "nodedotjs",
  "Express": "express",
  "Celery": "celery",
  "Redis": "redis",
  "Prisma": "prisma",
  "Flutter": "flutter",
  "Dart": "dart",
  "Kotlin": "kotlin",
  "Jetpack Compose": "jetpackcompose",
  "Android": "android",
  "Firebase": "firebase",
  "Supabase": "supabase",
  "PostgreSQL": "postgresql",
  "MongoDB": "mongodb",
  "Docker": "docker",
  "Vercel": "vercel",
  "Linux": "linux",
  "Ubuntu": "ubuntu",
  "Bash": "gnubash",
  "GitHub Actions": "githubactions",
  "Git": "git",
  "GitHub": "github",
  "Stripe": "stripe",
  "LiveKit": "livekit",
  "MQTT": "mqtt",
  "ElevenLabs": "elevenlabs",
  "OpenRouter": "openrouter",
  "n8n": "n8n",
  "WhatsApp API": "whatsapp",
  "Meta": "meta",
  "Instagram": "instagram",
  "Messenger": "messenger",
  "Facebook": "facebook",
  "Telegram": "telegram",
  "TikTok": "tiktok",
  "Gmail": "gmail",
  "Google Calendar": "googlecalendar",
  "Figma": "figma",
  "SWR": "swr",
  "Nginx": "nginx",
  "Cloudflare": "cloudflare",
  "Contabo": "contabo",
  "Udemy": "udemy",
  "Coursera": "coursera",
  "Cisco Networking Academy": "cisco",
};

export interface TechIconData {
  name: string;
  path?: string;
  color: string;
  monogram: string;
}

function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function tech(name: string): TechIconData {
  const slug = slugs[name];
  const key = slug ? `si${slug[0].toUpperCase()}${slug.slice(1)}` : "";
  const icon = key ? (icons as unknown as Record<string, { path: string; hex: string }>)[key] : undefined;
  const monogram = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (!icon) return { name, color: "currentColor", monogram };
  const l = luminance(icon.hex);
  // Logos casi negros o blancos siguen el color del texto para verse en ambos temas.
  const color = l < 0.22 || l > 0.9 ? "currentColor" : `#${icon.hex}`;
  return { name, path: icon.path, color, monogram };
}
