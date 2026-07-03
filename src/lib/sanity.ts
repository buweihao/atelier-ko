import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const env = import.meta.env;

const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? "8i1ohj6g";
const dataset = env.PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = env.PUBLIC_SANITY_API_VERSION ?? "2026-07-03";

export const hasSanityConfig = Boolean(projectId);

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    })
  : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;
let productsRequest: Promise<SanityProductDocument[]> | undefined;

export type SanityProductDocument = {
  name?: string | null;
  slug?: string | null;
  collection?: string | null;
  category?: string | null;
  material?: string | null;
  price?: number | null;
  shortDescription?: string | null;
  description?: string | null;
  dimensions?: string | null;
  finish?: string | null;
  leadTime?: string | null;
  order?: number | null;
  images?: Array<{
    asset?: unknown;
    alt?: string | null;
  }> | null;
};

export async function fetchSanityProducts(): Promise<SanityProductDocument[]> {
  if (!sanityClient) return [];
  if (productsRequest) return productsRequest;

  productsRequest = sanityClient
    .fetch<SanityProductDocument[]>(`
      *[_type == "product" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
        name,
        "slug": slug.current,
        collection,
        category,
        material,
        price,
        shortDescription,
        description,
        dimensions,
        finish,
        leadTime,
        order,
        "images": coalesce(images, [])[] {
          asset,
          alt
        }
      }
    `)
    .catch((error) => {
      console.warn("[sanity] Falling back to local products:", error);
      return [];
    });

  return productsRequest;
}

export function imageUrlFor(source: unknown, width = 1400, height = 1750): string | undefined {
  if (!builder || !source) return undefined;

  try {
    return builder.image(source).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return undefined;
  }
}
