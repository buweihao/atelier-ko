import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Locale } from "@/lib/i18n";

const env = import.meta.env;

const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? "nlg7146k";
const dataset = env.PUBLIC_SANITY_DATASET ?? "atelier-ko-production";
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
  nameI18n?: Partial<Record<Locale, string | null>> | null;
  slug?: string | null;
  collection?: string | null;
  collectionI18n?: Partial<Record<Locale, string | null>> | null;
  category?: string | null;
  categoryI18n?: Partial<Record<Locale, string | null>> | null;
  material?: string | null;
  materialI18n?: Partial<Record<Locale, string | null>> | null;
  price?: number | null;
  shortDescription?: string | null;
  shortDescriptionI18n?: Partial<Record<Locale, string | null>> | null;
  description?: string | null;
  descriptionI18n?: Partial<Record<Locale, string | null>> | null;
  dimensions?: string | null;
  dimensionsI18n?: Partial<Record<Locale, string | null>> | null;
  finish?: string | null;
  finishI18n?: Partial<Record<Locale, string | null>> | null;
  leadTime?: string | null;
  leadTimeI18n?: Partial<Record<Locale, string | null>> | null;
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
      *[_type == "atelierProduct" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
        name,
        nameI18n,
        "slug": slug.current,
        collection,
        collectionI18n,
        category,
        categoryI18n,
        material,
        materialI18n,
        price,
        shortDescription,
        shortDescriptionI18n,
        description,
        descriptionI18n,
        dimensions,
        dimensionsI18n,
        finish,
        finishI18n,
        leadTime,
        leadTimeI18n,
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
