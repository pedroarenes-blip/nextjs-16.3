import type { CmsAdapterConfig } from "@squaads/cms-next";

/**
 * Squaads CMS declaration for the CODE-authored pages this project edits.
 *
 * Coexistence rule: the template's built-in CMS (/admin) governs DB-backed pages
 * (the home and every /[slug]); this CMS governs pages written in code that the
 * client only retouches. Never annotate content that already comes from the DB —
 * see the README coexistence note.
 *
 * `projectKey` and the `CMS_*` keys are PER PROJECT: each project has its own
 * key pair and its own panel.
 */
export const cmsConfig: CmsAdapterConfig = {
  projectKey: "demo",
  locales: ["es"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  pages: [
    {
      key: "cms-demo",
      label: "Demo CMS",
      path: "/examples/cms-demo",
      metadata: [
        { key: "meta.title", label: "Título SEO" },
        { key: "meta.description", label: "Descripción SEO", type: "multiline" },
      ],
    },
  ],
};
