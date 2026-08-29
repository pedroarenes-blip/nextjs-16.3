import { createContentRoute } from "@squaads/cms-next/server";

import { cmsConfig } from "@/lib/cms.config";

export const { GET } = createContentRoute(cmsConfig);
