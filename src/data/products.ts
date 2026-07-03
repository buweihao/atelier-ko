import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { fetchSanityProducts, imageUrlFor, type SanityProductDocument } from "@/lib/sanity.js";

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

function sanityProductToProduct(product: SanityProductDocument): Product | undefined {
  const slug = product.slug?.trim();
  const name = product.name?.trim();
  const images = (product.images ?? [])
    .map((image) => imageUrlFor(image.asset))
    .filter((url): url is string => Boolean(url));

  if (!slug || !name || images.length === 0) return undefined;

  return {
    slug,
    name,
    collection: product.collection?.trim() || "buweihao",
    category: product.category?.trim() || "未分类",
    material: product.material?.trim() || "核心成分待补充",
    price: Number(product.price ?? 0),
    shortDescription: product.shortDescription?.trim() || "产品简介待补充",
    description: product.description?.trim() || product.shortDescription?.trim() || "产品详情待补充。",
    dimensions: product.dimensions?.trim() || "规格待补充",
    finish: product.finish?.trim() || "肤感待补充",
    leadTime: product.leadTime?.trim() || "现货",
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

export async function getProducts(): Promise<Product[]> {
  const sanityProducts = (await fetchSanityProducts())
    .map(sanityProductToProduct)
    .filter((product): product is Product => Boolean(product))
    .sort(byOrderThenName);

  if (sanityProducts.length > 0) return sanityProducts;
  return getLocalProducts();
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
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

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}

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
