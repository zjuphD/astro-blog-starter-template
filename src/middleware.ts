import { defineMiddleware } from "astro:middleware";

// 后台（控制台）在 api.bioseeki.com 上，官网在 bioseeki.com 上。用户很容易把后台地址
// 直接打在官网域名后面（例如 bioseeki.com/login-ok 或 bioseeki.com/sign-in），
// 官网上没有这些页面，浏览器就只给一个 404。这里统一 302 到后台域名，不再让人看到 404。
//
// 只在"确实是后台路径"时跳：官网自己的页面（/、/en、/terms、/privacy、/briefing 等）不受影响。
const CONSOLE_PATHS = [
  "/login-ok",
  "/me",
  "/sign-in",
  "/sign-up",
  "/dashboard",
  "/console",
  "/wallet",
  "/subscriptions",
  "/user",
  "/forgot-password",
  "/user/reset",
  "/reset-password",
  "/desktop-login",
  "/otp",
];

const CONSOLE_ORIGIN = "https://api.bioseeki.com";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;
  const isConsolePath = CONSOLE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isConsolePath) {
    return context.redirect(`${CONSOLE_ORIGIN}${pathname}${search}`, 302);
  }
  const isAiseeki = ["aiseeki.com", "www.aiseeki.com"].includes(context.url.hostname);
  if (isAiseeki) return next();
  if (pathname === "/en/" || (pathname === "/" && context.url.searchParams.get("lang") === "en")) {
    const canonical = new URL(context.url);
    canonical.searchParams.delete("lang");
    return context.redirect("/en" + canonical.search, 302);
  }
  const isHomepage = pathname === "/";
  if (isHomepage && context.cookies.get("lang")?.value === "en") {
    context.cookies.set("lang", "zh", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  const isBrandAsset = ["/bioseeki-base.css", "/bioseeki-base.js", "/release-runtime.js", "/site.webmanifest", "/web-app-manifest-512x512.png"].includes(pathname)
    || ["/_nuxt/", "/product-assets/", "/images/", "/fonts/"].some(prefix => pathname.startsWith(prefix));
  if (isBrandAsset) {
    const assets = context.locals.runtime?.env?.ASSETS;
    if (assets) {
      const url = new URL(context.url);
      url.pathname = `/bioseeki-release${pathname}`;
      // Pass a URL across the binding boundary: the local proxy and Astro can
      // use different Request constructors, even though production shares one.
      const response = await assets.fetch(url.href, {
        method: context.request.method,
        headers: context.request.headers,
      });
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=3600");
      return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
    }
  }
  return next();
});
