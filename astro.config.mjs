import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import sanity from "@sanity/astro";

const defaultSanityProjectId = "nlg7146k";
const sanityProjectId =
  process.env.PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID ?? defaultSanityProjectId;
const sanityDataset =
  process.env.PUBLIC_SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? "atelier-ko-production";
const sanityApiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? "2026-07-03";

export default defineConfig({
  site: process.env.SITE ?? "https://atelier-ko.weihaobu.cn",
  image: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  integrations: [
    sanity({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: false,
      studioBasePath: "/admin",
    }),
    react(),
    sitemap(),
  ],
});
