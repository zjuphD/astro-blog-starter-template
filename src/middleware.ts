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
  if (pathname === "/" && context.url.searchParams.get("lang") === "en") {
    return context.redirect("/en", 302);
  }
  const isHomepage = pathname === "/";
  const isBrandAsset = ["/bioseeki-base.css", "/bioseeki-base.js", "/release-runtime.js", "/site.webmanifest", "/web-app-manifest-512x512.png"].includes(pathname)
    || ["/_nuxt/", "/product-assets/", "/images/", "/fonts/"].some(prefix => pathname.startsWith(prefix));
  if (isHomepage || isBrandAsset) {
    const assets = context.locals.runtime?.env?.ASSETS;
    if (assets) {
      const url = new URL(context.url);
      url.pathname = isHomepage ? "/bioseeki-release/" : `/bioseeki-release${pathname}`;
      const response = await assets.fetch(new Request(url, context.request));
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", isHomepage ? "no-cache, must-revalidate" : "public, max-age=3600");
      if (isHomepage) {
        headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self' https://api.bioseeki.com; worker-src 'self' blob:; frame-src 'self'; form-action 'none'; base-uri 'self'");
      }
      return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
    }
  }
  return next();
});
