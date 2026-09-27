// Search-console ownership tokens. Paste the value of the content="…" attribute each
// console gives you (HTML-tag method); empty strings render nothing.
export const VERIFY = {
  google: "",   // Google Search Console  → <meta name="google-site-verification">
  bing: "",     // Bing Webmaster Tools    → <meta name="msvalidate.01">
  baidu: "",    // 百度搜索资源平台           → <meta name="baidu-site-verification">
};

// Profiles that are the same entity as BioSeeki (official accounts only). Feeds
// Organization.sameAs, which helps search and AI engines tie mentions to the brand.
export const SAME_AS: string[] = [];
