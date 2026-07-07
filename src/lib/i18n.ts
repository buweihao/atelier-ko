export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "中文",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
};

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function localePath(locale: Locale, path = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

export function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (isLocale(parts[0])) {
    const stripped = `/${parts.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped.replace(/\/$/, "");
  }
  return pathname === "/" ? "/" : pathname.replace(/\/$/, "");
}

export function alternateLinks(pathname: string): Array<{ locale: Locale; hreflang: string; href: string }> {
  const path = stripLocale(pathname);
  return [
    { locale: "en", hreflang: "en", href: localePath("en", path) },
    { locale: "zh", hreflang: "zh-CN", href: localePath("zh", path) },
  ];
}

export function pickLocalized(
  value: string | null | undefined,
  localized: Partial<Record<Locale, string | null | undefined>> | null | undefined,
  locale: Locale,
  fallback = "",
): string {
  return localized?.[locale]?.trim() || value?.trim() || localized?.[defaultLocale]?.trim() || localized?.zh?.trim() || fallback;
}

export const ui = {
  en: {
    skip: "Skip to main content",
    cart: "Cart",
    cartAria: (count: number) => `Cart, ${count} items`,
    nav: [
      { href: "/", label: "Home" },
      { href: "/products", label: "Products" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    featuredProduct: "Featured product",
    contact: "Contact",
    footerCopy: "A focused skincare line for cleansing, hydration, sunscreen, and renewal routines.",
    footerNav: "Navigation",
    footerContact: "Contact",
  },
  zh: {
    skip: "跳到主要内容",
    cart: "购物车",
    cartAria: (count: number) => `购物车，${count} 件商品`,
    nav: [
      { href: "/", label: "首页" },
      { href: "/products", label: "产品" },
      { href: "/about", label: "关于" },
      { href: "/contact", label: "联系" },
    ],
    featuredProduct: "精选产品",
    contact: "联系",
    footerCopy: "专注清洁、补水、防晒与抗衰的个人护肤品牌，给日常护理留下更清晰的选择。",
    footerNav: "导航",
    footerContact: "联系",
  },
} as const;

const categoryMap: Record<string, Record<Locale, string>> = {
  清洁: { en: "Cleanse", zh: "清洁" },
  补水: { en: "Hydrate", zh: "补水" },
  防晒: { en: "Protect", zh: "防晒" },
  抗衰: { en: "Renew", zh: "抗衰" },
};

export function localizeCategory(value: string, locale: Locale): string {
  return categoryMap[value]?.[locale] ?? value;
}
