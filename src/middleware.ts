import { defineMiddleware } from "astro:middleware";

// 后台（控制台）在 api.bioseeki.com 上，官网在 bioseeki.com 上。用户很容易把后台地址
// 直接打在官网域名后面（例如 bioseeki.com/login-ok 或 bioseeki.com/sign-in），
// 官网上没有这些页面，浏览器就只给一个 404。这里统一 302 到后台域名，不再让人看到 404。
//
// 只在"确实是后台路径"时跳：官网自己的页面（/、/en、/terms、/privacy、/briefing 等）不受影响。
const CONSOLE_PATHS = [
  "/login-ok",
  "/sign-in",
  "/sign-up",
  "/dashboard",
  "/console",
  "/wallet",
  "/subscriptions",
  "/user",
];

const CONSOLE_ORIGIN = "https://api.bioseeki.com";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;
  const isConsolePath = CONSOLE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isConsolePath) {
    return context.redirect(`${CONSOLE_ORIGIN}${pathname}${search}`, 302);
  }
  return next();
});
