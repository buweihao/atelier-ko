import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: process.env.SITE ?? "https://atelier-ko.weihaobu.cn",
  integrations: [sitemap()],
});
