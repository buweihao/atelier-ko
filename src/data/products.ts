import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { fetchSanityProducts, imageUrlFor, type SanityProductDocument } from "@/lib/sanity.js";
import { defaultLocale, localizeCategory, pickLocalized, type Locale } from "@/lib/i18n";

type ProductEntry = CollectionEntry<"products">;
export type ProductImage = ImageMetadata | string;
export type Product = Omit<ProductEntry["data"], "images"> & {
  slug: string;
  description: string;
  images: ProductImage[];
};

function slugFromEntry(entry: ProductEntry): string {
  return entry.id.replace(/\.(md|mdx)$/, "");
}

function descriptionFromEntry(entry: ProductEntry): string {
  return (entry.body ?? "").trim().replace(/\s+/g, " ");
}

function byOrderThenName(a: Product, b: Product): number {
  return a.order - b.order || a.name.localeCompare(b.name);
}

const localProductCopy: Record<string, Partial<Record<Locale, Partial<Product>>>> = {
  "amino-cleanser": {
    en: {
      name: "Amino Acid Clarity Cleanser",
      category: "Cleanse",
      material: "Amino acid surfactants",
      shortDescription: "Soft foam, never tight",
      description:
        "A gentle daily cleanser for morning and evening routines. Mild amino acid surfactants lift away excess oil and sunscreen residue while keeping skin comfortable after rinsing.",
      finish: "Dense soft foam",
      leadTime: "In stock",
    },
  },
  "hydration-serum": {
    en: {
      name: "Hyaluronic Water Serum",
      category: "Hydrate",
      material: "Multi-weight hyaluronic acid",
      shortDescription: "Light hydration, smooth layering",
      description:
        "A water-light serum for dry, dehydrated, or seasonal skin changes. It helps replenish surface hydration so creams and sunscreen layer more comfortably.",
      finish: "Clear watery feel",
      leadTime: "In stock",
    },
  },
  "daily-sunscreen": {
    en: {
      name: "Daily Sheer Sunscreen",
      category: "Protect",
      material: "Sheer UV filter system",
      shortDescription: "Fresh finish for daily wear",
      description:
        "A lightweight sunscreen for commuting and everyday outdoor exposure. The lotion spreads easily and leaves a breathable, clean finish.",
      finish: "Light lotion",
      leadTime: "In stock",
    },
  },
  "renewal-cream": {
    en: {
      name: "Peptide Renewal Cream",
      category: "Renew",
      material: "Peptides and plant oils",
      shortDescription: "Night nourishment, soft support",
      description:
        "A soft night cream with peptides, ceramides, and lightweight botanical oils to support comfort, barrier care, and the look of fine lines.",
      finish: "Soft cream",
      leadTime: "In stock",
    },
  },
};

function applyLocalProductLocale(product: Product, locale: Locale): Product {
  if (locale === "zh") return product;
  const copy = localProductCopy[product.slug]?.[locale];
  return {
    ...product,
    ...copy,
    collection: copy?.collection ?? product.collection,
    dimensions: copy?.dimensions ?? product.dimensions,
  };
}

function sanityProductToProduct(product: SanityProductDocument, locale: Locale): Product | undefined {
  const slug = product.slug?.trim();
  const name = pickLocalized(product.name, product.nameI18n, locale);
  const images = (product.images ?? [])
    .map((image) => imageUrlFor(image.asset))
    .filter((url): url is string => Boolean(url));

  if (!slug || !name || images.length === 0) return undefined;

  return {
    slug,
    name,
    collection: pickLocalized(product.collection, product.collectionI18n, locale, "buweihao"),
    category: pickLocalized(product.category, product.categoryI18n, locale, locale === "zh" ? "未分类" : "Uncategorized"),
    material: pickLocalized(product.material, product.materialI18n, locale, locale === "zh" ? "核心成分待补充" : "Ingredients to be confirmed"),
    price: Number(product.price ?? 0),
    shortDescription: pickLocalized(product.shortDescription, product.shortDescriptionI18n, locale, locale === "zh" ? "产品简介待补充" : "Product summary to be confirmed"),
    description: pickLocalized(product.description, product.descriptionI18n, locale, product.shortDescription?.trim() || (locale === "zh" ? "产品详情待补充。" : "Product details to be confirmed.")),
    dimensions: pickLocalized(product.dimensions, product.dimensionsI18n, locale, locale === "zh" ? "规格待补充" : "Size to be confirmed"),
    finish: pickLocalized(product.finish, product.finishI18n, locale, locale === "zh" ? "肤感待补充" : "Finish to be confirmed"),
    leadTime: pickLocalized(product.leadTime, product.leadTimeI18n, locale, locale === "zh" ? "现货" : "In stock"),
    images,
    order: Number(product.order ?? 999),
  };
}

async function getLocalProducts(): Promise<Product[]> {
  const entries = await getCollection("products");
  return entries
    .map((entry: ProductEntry) => ({
      slug: slugFromEntry(entry),
      description: descriptionFromEntry(entry),
      ...entry.data,
    }))
    .sort(byOrderThenName);
}

export async function getProducts(locale: Locale = defaultLocale): Promise<Product[]> {
  const sanityProducts = (await fetchSanityProducts())
    .map((product) => sanityProductToProduct(product, locale))
    .filter((product): product is Product => Boolean(product))
    .sort(byOrderThenName);

  if (sanityProducts.length > 0) return sanityProducts;
  return (await getLocalProducts()).map((product) => applyLocalProductLocale(product, locale)).sort(byOrderThenName);
}

export async function getProduct(slug: string, locale: Locale = defaultLocale): Promise<Product | undefined> {
  const products = await getProducts(locale);
  return products.find((product) => product.slug === slug);
}

export function getRelated(products: Product[], slug: string, limit = 3): Product[] {
  const current = products.find((product) => product.slug === slug);
  if (!current) return products.slice(0, limit);

  return products
    .filter((product) => product.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? -1 : 1;
      const bScore = b.category === current.category ? -1 : 1;
      return aScore - bScore || byOrderThenName(a, b);
    })
    .slice(0, limit);
}

export function getProductFilters(products: Product[]): {
  categories: string[];
  materials: string[];
} {
  return {
    categories: [...new Set(products.map((product) => product.category))],
    materials: [...new Set(products.map((product) => product.material))],
  };
}

export function formatPrice(value: number, locale: Locale = "zh"): string {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}

export { localizeCategory };

export function productForJson(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    collection: product.collection,
    category: product.category,
    material: product.material,
    price: product.price,
    shortDescription: product.shortDescription,
    description: product.description,
    dimensions: product.dimensions,
    finish: product.finish,
    leadTime: product.leadTime,
  };
}
