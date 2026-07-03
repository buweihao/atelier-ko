# buweihao Atelier KO

[![buweihao skincare site preview](preview.webp)](https://atelier-ko.weihaobu.cn/)

![Astro 6](https://img.shields.io/badge/Astro-6.4.8-ff5d01?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-ready-f03e2f?style=for-the-badge&logo=sanity&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-27272a?style=for-the-badge)

Preview: [https://atelier-ko.weihaobu.cn/](https://atelier-ko.weihaobu.cn/)

buweihao 是一个基于 Atelier Kō Astro 模板改造的电商产品展示站，面向个人护肤品牌，覆盖清洁、补水、防晒、抗衰四类产品。站点保持静态前台的速度，同时预留 Sanity Studio 后台 schema，便于后续把产品内容迁移到 CMS。

## Features

- 首页首屏品牌展示、产品分类入口和精选产品陈列
- `/products` 产品页，支持分类、核心成分筛选和价格排序
- `/products/[slug]` 静态产品详情页，包含产品 JSON-LD
- `/about` 品牌介绍页和 `/contact` 联系页
- 本地购物车和结算信息预览
- Sanity Studio 配置与产品 schema
- Astro 图片优化、sitemap、robots、canonical 和社交分享 metadata

## Pages

- `/` — 首页
- `/products` — 产品
- `/products/[slug]` — 产品详情
- `/about` — 关于
- `/contact` — 联系
- `/cart` — 购物车预览

## Product Categories

- 清洁
- 补水
- 防晒
- 抗衰

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
SITE=https://atelier-ko.weihaobu.cn npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Sanity

Sanity Studio files live in:

- `sanity.config.ts`
- `sanity.cli.ts`
- `sanity/schemaTypes/productType.ts`
- `/admin` — embedded Studio route when Sanity environment variables are available during build

Set your real Sanity project before starting Studio:

```bash
PUBLIC_SANITY_PROJECT_ID=yourProjectId PUBLIC_SANITY_DATASET=production npm run dev
```

The Astro frontend now reads products from Sanity first. If Sanity is not configured, fails to respond, or has no valid product documents with images, it falls back to `src/content/products/*.md`.

Required Cloudflare Pages environment variables:

```text
PUBLIC_SANITY_PROJECT_ID=yourProjectId
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-07-03
SANITY_STUDIO_PROJECT_ID=yourProjectId
SANITY_STUDIO_DATASET=production
```

In Sanity Manage, add CORS origins for:

- `http://localhost:4321`
- `https://atelier-ko.weihaobu.cn`

Enable credentials for the Studio origins. To rebuild the static Cloudflare site after content changes, add a Sanity webhook for publish/unpublish events that calls your Cloudflare Pages Deploy Hook. Do not commit the deploy hook URL to the repository.

## Deployment

- Repository: [https://github.com/buweihao/atelier-ko.git](https://github.com/buweihao/atelier-ko.git)
- Production branch: `master`
- Cloudflare domain: [https://atelier-ko.weihaobu.cn](https://atelier-ko.weihaobu.cn)
- Contact email: [buweihao@qq.com](mailto:buweihao@qq.com)
- Social link: [baidu.com](https://baidu.com)

For Cloudflare Pages, use:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `SITE=https://atelier-ko.weihaobu.cn`

## License

This project keeps the original MIT license from Andrei Alba's Atelier Kō template.
