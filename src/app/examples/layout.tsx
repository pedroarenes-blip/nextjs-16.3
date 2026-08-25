import type { ReactNode } from "react";
import { CmsRuntimeMount } from "@squaads/cms-next";

import { cmsConfig } from "@/lib/cms.config";

/**
 * Mounts the Squaads CMS runtime for the example route(s). It resolves the page
 * from the pathname and renders nothing for unregistered routes, so it is inert
 * everywhere except the annotated pages. To use the CMS on code pages elsewhere,
 * mount <CmsRuntimeMount> in a layout that covers those routes (single-locale
 * here, so a fixed "es"; derive the locale for a multi-locale project).
 */
export default function ExamplesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CmsRuntimeMount config={cmsConfig} locale="es" />
    </>
  );
}
