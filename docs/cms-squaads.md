# CMS de Squaads en el template

El template trae **dos** sistemas de contenido que no se pisan. Esta guía explica
cuál usar, qué tocar para un proyecto nuevo, y cómo agregar una página editable.
Para el contrato de anotación completo (cada primitiva, las cachés, los límites),
mirá el README de `@squaads/cms-next`.

## Cuál de los dos sistemas usar

> **El CMS del template (`/admin`) gobierna las páginas que viven en la base.
> El CMS de Squaads (`/panel`) gobierna el contenido que vive en el código.**

| Caso | Sistema | Dónde |
| --- | --- | --- |
| El cliente crea, ordena y publica páginas nuevas | Template | `/admin` |
| La home y cada `/[slug]` (contenido de la base) | Template | `/admin` |
| Una landing a medida que el desarrollador **escribe en código** | Squaads | `/panel` |
| Unas páginas legales o una sección fija que el cliente solo retoca | Squaads | `/panel` |
| Datos de negocio, catálogo, precios | Ninguno de contenido | tu base / API |

**No anotes con `data-cms` un texto que ya administra `/admin`.** Serían dos
sistemas escribiendo lo mismo, y gana el que publique último: el peor error,
porque aparece semanas después. La home y `/[slug]` leen de la base — quedan
intactas.

## Qué tocar para un proyecto nuevo

En `.env.local` (copiá de `.env.example`), el grupo `CMS_*`. **Todas son por
proyecto**: cada cliente tiene su propio par de claves y su propio panel.

| Variable | Qué poner |
| --- | --- |
| `CMS_SERVICE_URL` | El origen del servicio del CMS |
| `CMS_READ_KEY`, `CMS_WRITE_KEY`, `CMS_WEBHOOK_SECRET` | Las claves del proyecto (las da el arquitecto al crearlo) |
| `CMS_AUTH_USER`, `CMS_AUTH_PASSWORD` | Usuario y contraseña del panel (12+; `openssl rand -base64 24`) |

Sin `CMS_AUTH_USER` y `CMS_AUTH_PASSWORD`, `/panel` queda **cerrado** a propósito
(503) — no es un fallo. Y cambiá `projectKey` en `src/lib/cms.config.ts` por el de
tu proyecto.

## Qué ya está montado

| Pieza | Archivo |
| --- | --- |
| Declaración de páginas | `src/lib/cms.config.ts` |
| Rutas de API | `src/app/api/cms/{content,studio,revalidate,auth}` |
| Panel + gate de acceso | `src/app/panel/page.tsx` |
| Runtime (ediciones en vivo) | `src/app/examples/layout.tsx` |
| Página de ejemplo anotada | `src/app/examples/cms-demo/page.tsx` |

## Añadir una página editable

1. **Registrala** en `src/lib/cms.config.ts`, con su `path` y su metadata:

   ```ts
   pages: [
     // …
     {
       key: "legal",
       label: "Aviso legal",
       path: "/examples/legal",
       metadata: [
         { key: "meta.title", label: "Título SEO" },
         { key: "meta.description", label: "Descripción SEO", type: "multiline" },
       ],
     },
   ],
   ```

2. **Escribila y anotala** copiando `src/app/examples/cms-demo/page.tsx`: resolvé
   el contenido en el Server Component (`resolvePageContent`), envolvé cada valor
   con `content.*(key, default)` y dejá el `data-cms`. Si la página no cuelga de
   `/examples`, montá `<CmsRuntimeMount>` en un layout que la cubra (como hace
   `src/app/examples/layout.tsx`).

3. **Editá**: entrá a `/panel`, iniciá sesión, cambiá el texto, publicá, y miralo
   en la página.

## Límites que conviene saber

- El CMS de Squaads **no sube imágenes**: pegás una URL en el campo imagen. Para
  subir archivos, usá la biblioteca de medios del template (`/admin/imagenes`).
- No anotes atributos arbitrarios (`placeholder`, `aria-label`), datos de negocio,
  ni cadenas con interpolación. Ver el README de `@squaads/cms-next`.
- El build del template necesita `DATABASE_URL` definida (su `src/lib/db.ts` la
  exige al cargar), aunque tu página de código no use la base.
