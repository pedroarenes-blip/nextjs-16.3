import type { Metadata } from "next";
import { CmsPanelGate } from "@squaads/cms-next/server";

import { cmsConfig } from "@/lib/cms.config";

export const metadata: Metadata = {
  title: "Editor de contenido",
  robots: { index: false, follow: false },
};

// The gate checks the session on the server: without CMS_AUTH_USER +
// CMS_AUTH_PASSWORD the panel stays closed, and an anonymous visitor gets the
// access form, never the editor.
export default function PanelPage() {
  return <CmsPanelGate config={cmsConfig} />;
}
