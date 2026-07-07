const supportedLocales = new Set(["en", "zh"]);
const localizedPrefixes = ["/en", "/zh", "/admin", "/_astro", "/favicon", "/robots.txt"];
const legacyRoutes = new Set(["/products", "/about", "/contact", "/cart", "/catalog"]);

function cookieLocale(cookieHeader) {
  const match = cookieHeader?.match(/(?:^|; )atelier-ko-locale=(en|zh)(?:;|$)/);
  return match?.[1];
}

function languageLocale(acceptLanguage) {
  if (!acceptLanguage) return undefined;
  return /^zh\b/i.test(acceptLanguage) || /,\s*zh\b/i.test(acceptLanguage) ? "zh" : "en";
}

function countryLocale(country) {
  return ["CN", "HK", "MO", "TW", "SG"].includes(country || "") ? "zh" : "en";
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname.replace(/\/$/, "") || "/";

  if (localizedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return context.next();
  }

  const saved = cookieLocale(context.request.headers.get("Cookie"));
  const locale =
    (saved && supportedLocales.has(saved) && saved) ||
    languageLocale(context.request.headers.get("Accept-Language")) ||
    countryLocale(context.request.cf?.country) ||
    "en";

  if (pathname === "/") {
    return Response.redirect(new URL(`/${locale}${url.search}`, url), 302);
  }

  if (legacyRoutes.has(pathname) || pathname.startsWith("/products/")) {
    return Response.redirect(new URL(`/${locale}${pathname}${url.search}`, url), 302);
  }

  return context.next();
}
