# Atelier Kō - Astro Furniture Theme

[![Atelier Kō theme preview](preview.webp)](https://atelier-ko-topaz.vercel.app/)

![Astro 6](https://img.shields.io/badge/Astro-6.4.8-ff5d01?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-f7df1e?style=for-the-badge&logo=javascript&logoColor=111)
![Static Theme](https://img.shields.io/badge/Output-static-27272a?style=for-the-badge)

Preview: [https://atelier-ko-topaz.vercel.app/](https://atelier-ko-topaz.vercel.app/)

Atelier Kō is a quiet, editorial Astro theme for a small furniture atelier or craft-led product catalogue. It is built as mostly static HTML, with small vanilla JavaScript enhancements for the catalogue filters, product gallery, newsletter preview, and local cart.

## Features

- Polished homepage with hero, featured products, material story, newsletter form, and footer.
- Catalogue page with client-side category/material filters and price sorting.
- Static product detail pages generated from local product data.
- LocalStorage cart flow with quantity controls and checkout preview.
- About page with workshop story, principles, image-led sections, and contact CTA.
- Astro-optimized images from `src/assets`.
- Self-hosted WOFF2 fonts in `src/assets/fonts`.
- Sitemap generation with `@astrojs/sitemap`.
- Dynamic `robots.txt` endpoint aligned to the configured Astro `site`.
- Canonical URLs, Open Graph metadata, Twitter card metadata, and JSON-LD for organization/product pages.
- No React, TanStack, Supabase, or direct TypeScript dependency.

## Tech Stack

- Astro 6
- Tailwind CSS 4
- Plain JavaScript
- Static output

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Theme Setup

Update the production URL before publishing:

```bash
SITE=https://your-domain.com npm run build
```

The configured `site` value is used for canonical URLs, sitemap generation, and `robots.txt`. The default preview site is `https://atelier-ko-topaz.vercel.app/`.

Main content files:

- `src/data/products.js` - product catalogue, categories, prices, and descriptions.
- `src/layouts/BaseLayout.astro` - shared metadata, global shell, header/footer slots, and cart helper.
- `src/components/SiteHeader.astro` - navigation and cart badge.
- `src/components/SiteFooter.astro` - footer links and studio copy.
- `src/styles.css` - design tokens, Tailwind setup, and local font declarations.

## Pages

- `/`
- `/catalog`
- `/products/oken-stool`
- `/products/arvid-chair`
- `/products/low-plinth-table`
- `/products/monolith-bench`
- `/products/halla-shelf`
- `/products/tora-desk`
- `/about`
- `/cart`
- `/404`

## Images and Fonts

Theme-controlled images live in `src/assets` and render through Astro's image pipeline. Local fonts live in `src/assets/fonts`; only the weights and styles used by the theme are included.

Use `public/` only for files that should be served as-is.

## SEO

The theme includes:

- Unique page titles and descriptions.
- Canonical URLs.
- Open Graph and Twitter card metadata.
- Sitemap generation.
- Dynamic `robots.txt`.
- Product JSON-LD on product pages.
- Organization JSON-LD on the homepage.
- `noindex` handling for cart and 404 pages.

## Deployment

The theme builds to static files in `dist/` and can be deployed to any static host. Set `SITE` to the production origin during deployment so SEO URLs are correct.

## Releases

Release notes are tracked in [CHANGELOG.md](CHANGELOG.md). For a GitHub release, tag the version and publish the changelog entry as the release notes.

## License

This project is licensed under the [MIT License](LICENSE).

## Notes

- Replace the demo product copy, prices, and images with your own catalogue before publishing.
- The newsletter and checkout flows are design previews; connect them to your preferred backend or form provider if needed.
- Keep images in `src/assets` when you want Astro to optimize them.
