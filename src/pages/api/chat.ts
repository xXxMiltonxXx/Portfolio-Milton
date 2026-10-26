import type { APIRoute } from "astro";
import Anthropic from "@anthropic-ai/sdk";
import { getSecret } from "astro:env/server";
import { profile, profileAsContext } from "../../data/profile";

export const prerender = false;

const MAX_HISTORY = 12;
const MAX_CHARS = 1200;

const SYSTEM = `Eres "MiltonAI", el asistente del portafolio de ${profile.name}. Respondes preguntas de reclutadores, clientes y curiosos sobre su experiencia, proyectos, stack y comunidad.

Reglas:
- Responde en el idioma del usuario (por defecto español), en tono cercano y profesional, en 2 a 5 frases o una lista corta.
- Usa solo la información del perfil de abajo. Si algo no está, dilo con honestidad y sugiere contactar a Milton por LinkedIn o GitHub.
- No inventes cifras, empresas, fechas ni clientes.
- Habla de Milton en tercera persona.
- Si te piden algo ajeno al portafolio, redirige amablemente la conversación hacia Milton y su trabajo.

PERFIL:
${profileAsContext()}`;

type Msg = { role: "user" | "assistant"; content: string };

function sanitize(raw: unknown): Msg[] | null {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter(
      (m): m is Msg =>
        !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "",
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_HISTORY);
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  return msgs;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = getSecret("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ai_disabled" }), { status: 503 });
  }

  let messages: Msg[] | null = null;
  try {
    messages = sanitize((await request.json())?.messages);
  } catch {
    // cuerpo inválido
  }
  if (!messages) {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const model = getSecret("ANTHROPIC_MODEL") || "claude-opus-5-5";

  const stream = client.messages.stream({
    model,
    max_tokens: 1024,
    output_config: { effort: "low" },
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("Prefiero no responder eso. ¿Te cuento sobre los proyectos de Milton?"));
        }
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          controller.enqueue(encoder.encode("\n\n(Hay mucha demanda ahora mismo, intenta de nuevo en un momento.)"));
        } else {
          console.error("chat error", err);
          controller.enqueue(encoder.encode("\n\n(No pude completar la respuesta. Intenta de nuevo.)"));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
};
