import type { Metadata } from "next";
import { resolvePageContent } from "@squaads/cms-next/server";

import { cmsConfig } from "@/lib/cms.config";

/**
 * Example page for the Squaads CMS: written in code, edited by the client.
 *
 * The pattern to copy: resolve the page content once (server-side), keep the
 * code value as the fallback of every `content.*(key, default)`, and keep the
 * `data-cms` attribute so the editor discovers the field and applies live edits.
 * Lists iterate what the CMS resolves (published count + code array as template),
 * not the code array. Metadata is resolved in generateMetadata.
 *
 * This does NOT touch the template's own CMS: it is a code page, not a DB page.
 */

const PAGE_KEY = "cms-demo";

// Code defaults. These are the "content that lives in the code" the CMS overrides.
const FEATURES = [
  {
    title: "Contenido en el código",
    text: "El desarrollador escribe la página; el cliente solo retoca el texto.",
  },
  {
    title: "Publicación honesta",
    text: "El editor confirma que el cambio se ve en la página, no solo que se publicó.",
  },
  {
    title: "Sin intrusión",
    text: "Si el servicio falla, la página entrega los valores por defecto del código.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await resolvePageContent(cmsConfig, PAGE_KEY, "es");
  return {
    title: content.text("meta.title", "Demo del CMS · Squaads"),
    description: content.text(
      "meta.description",
      "Página de ejemplo escrita en código y editable con el CMS de Squaads.",
    ),
    robots: { index: false, follow: false },
  };
}

export default async function CmsDemoPage() {
  const content = await resolvePageContent(cmsConfig, PAGE_KEY, "es");
  const cta = content.link("demo.cta", { href: "/panel", label: "Abrir el editor" });
  const image = content.image("demo.image", { src: "/globe.svg", alt: "Ilustración de ejemplo" });

  return (
    <main className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1
              data-cms="demo.title"
              className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              {content.text("demo.title", "Una página escrita en código, editable por el cliente")}
            </h1>
            <p
              data-cms="demo.subtitle"
              className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {content.text(
                "demo.subtitle",
                "El desarrollador la maqueta una vez; el cliente cambia los textos, la imagen y el enlace desde el panel, sin tocar el código.",
              )}
            </p>
            <a
              data-cms="demo.cta"
              href={cta.href}
              className="mt-8 inline-flex items-center rounded-2xl bg-amber-500 px-7 py-3.5 font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              {cta.label}
            </a>
          </div>
          {/* Editable image. Plain <img> accepts any published src without
              next.config remotePatterns; a real project may prefer next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-cms="demo.image"
            src={image.src}
            alt={image.alt}
            width={480}
            height={360}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-10 dark:border-zinc-800 dark:bg-zinc-900/60"
          />
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2
            data-cms="demo.features.title"
            className="font-serif text-3xl font-semibold tracking-tight"
          >
            {content.text("demo.features.title", "Qué demuestra este ejemplo")}
          </h2>
          <ul className="mt-10 grid list-none gap-6 p-0 sm:grid-cols-3">
            {/* A list: iterate what the CMS resolves (add/remove/reorder items),
                not the code array. Each cell resolves per-field. */}
            {content.list("demo.features", FEATURES).map((feature, index) => (
              <li
                key={index}
                className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <h3
                  data-cms={`demo.features.${index}.title`}
                  className="text-lg font-semibold"
                >
                  {content.text(`demo.features.${index}.title`, feature.title)}
                </h3>
                <p
                  data-cms={`demo.features.${index}.text`}
                  className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400"
                >
                  {content.text(`demo.features.${index}.text`, feature.text)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        {/* Rich text: the delivered HTML carries sanitized published HTML, or the
            code default (using semantic tags the sanitizer keeps). */}
        <div
          data-cms="demo.note"
          data-cms-type="richtext"
          className="markdown max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400"
          dangerouslySetInnerHTML={content.richtext(
            "demo.note",
            "<p>Este bloque es <strong>texto enriquecido</strong>: admite negrita, enlaces y listas, y se sanea igual en el servidor y en el navegador.</p>",
          )}
        />
      </section>
    </main>
  );
}
