# Portafolio — Milton Angamarca

Portafolio personal hecho con [Astro](https://astro.build), con un asistente de IA ("MiltonAI") que responde preguntas sobre mi experiencia y proyectos.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

Requiere Node 22.12 o superior.

## Contenido

Todo el contenido (experiencia, proyectos, stack, comunidad) vive en `src/data/profile.ts`. Las secciones de la página y el asistente de IA leen de ahí, así que basta con editar ese archivo.

- **Foto:** coloca tu foto en `public/milton.jpg`. Mientras no exista se usa la foto de LinkedIn.
- **LinkedIn:** reemplaza `links.linkedin` en `profile.ts` por la URL de tu perfil.

## Asistente de IA

`src/pages/api/chat.ts` es una función serverless (Vercel) que usa la API de Claude con streaming.

1. Crea una API key en https://console.anthropic.com
2. En Vercel → Project → Settings → Environment Variables agrega `ANTHROPIC_API_KEY`.
3. Opcional: `ANTHROPIC_MODEL` para cambiar el modelo (por defecto `claude-opus-5-5`).

Sin la variable, el chat sigue funcionando con respuestas locales generadas a partir de `profile.ts`.

## Despliegue

Importa el repositorio en Vercel; el adaptador `@astrojs/vercel` ya está configurado.
