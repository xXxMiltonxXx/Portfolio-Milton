// Genera public/Milton-Angamarca-CV.pdf a partir de la página /cv.
// Uso: npm run build && npm run cv   (requiere Playwright con Chromium instalado)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, normalize } from "node:path";

const require = createRequire(import.meta.url);
let chromium;
for (const name of ["playwright", "playwright-core"]) {
  try {
    ({ chromium } = require(name));
    break;
  } catch {}
}
if (!chromium) {
  console.error("Falta Playwright: instala con `npx playwright install chromium` y `npm i -D playwright-core`.");
  process.exit(1);
}

const root = join(process.cwd(), ".vercel/output/static");
try {
  await stat(join(root, "cv/index.html"));
} catch {
  console.error("No encuentro el build. Ejecuta primero `npm run build`.");
  process.exit(1);
}

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const out = "public/Milton-Angamarca-CV.pdf";
await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
server.close();
console.log(`Listo: ${out}`);
