// All copy for the BioSeeki homepage, in both languages. The template
// (src/components/bioseeki/Home.astro) contains no user-facing text of its own.
// Strings rendered with set:html may contain <strong>/<em>/<a>; they are authored here, never user input.
import type { AstroGlobal } from "astro";

export type Lang = "zh" | "en";
export const LANGS: Lang[] = ["zh", "en"];

/** Language for `/`: explicit ?lang= wins (and is remembered), then the cookie, then Accept-Language. */
export function detectLang(Astro: AstroGlobal): Lang {
  const q = Astro.url.searchParams.get("lang");
  if (q === "zh" || q === "en") {
    Astro.cookies.set("lang", q, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return q;
  }
  const c = Astro.cookies.get("lang")?.value;
  if (c === "zh" || c === "en") return c;
  const al = (Astro.request.headers.get("accept-language") || "").toLowerCase();
  if (!al) return "zh";
  const first = al.split(",")[0].trim();
  return first.startsWith("zh") ? "zh" : "en";
}

const SIGN_UP = "https://api.bioseeki.com/sign-up?redirect=/login-ok";
const SIGN_IN = "https://api.bioseeki.com/sign-in?redirect=/login-ok";
const MAIL = "support@bioseeki.com";
const SIGN_PLANS = "https://api.bioseeki.com/subscriptions";

const zh = {
  htmlLang: "zh-CN",
  ogLocale: "zh_CN",
  canonical: "https://bioseeki.com/",
  title: "BioSeeki｜你的 AI 科研协作者",
  description: "BioSeeki 是面向研究者个人的 AI 科研工作台：深度研究、数据分析、论文写作、科研绘图与 GeneCode 分子克隆在同一个项目里完成。引用回到原文页段，分析留下可复算记录，缺证据不编造。",
  ogTitle: "BioSeeki｜读文献、跑数据、写论文，每一步都有据可查",
  ogDescription: "面向研究者个人的 AI 科研工作台。引用回到原文，分析可以复算，结论由你把关。",
  twitterDescription: "读文献、跑数据、写论文，每一步都有据可查。",
  links: { signUp: SIGN_UP, signIn: SIGN_IN, mail: MAIL, plans: SIGN_PLANS },
  switchTo: { label: "EN", href: "/en", title: "Switch to English" },
  nav: {
    aria: "主导航", home: "BioSeeki 首页",
    items: [["#tools", "科研能力"], ["#verify", "可复核"], ["#principles", "知识与记忆"], ["#workflow", "一个课题"], ["#pricing", "定价"], ["/briefing", "前沿快讯"], ["#faq", "常见问题"]],
    signIn: "登录", signUp: "注册 ↗", download: "下载", personal: "个人中心",
  },
  hero: {
    eyebrow: "BIOSEEKI · 有据，而非猜测",
    h1a: "读文献、跑数据、写论文，", h1b: "每一步都有据可查",
    sub: "为研究者个人打造的 AI 科研协作者。引用能回到<strong>原文的页与段</strong>，分析留下<strong>可复算的记录</strong>，结论始终由你把关。",
    download: "下载 Mac 版", cta: "注册账号 ↗", demo: "观看 45 秒演示 ↓",
    meta: "Mac Beta · macOS 11+ · Apple 芯片",
  },
  ticker: ["深度研究", "数据分析", "论文写作", "科研绘图", "分子克隆", "公共数据库", "引用检验", "文献雷达", "知识库与记忆"],
  tools: {
    eyebrow: "科研能力", title: "一个入口，接住研究的日常。",
    lede: "常用的研究任务，都在同一个项目里完成。",
    gc: {
      h: "GeneCode · 分子克隆", status: "● 已接入",
      p: "查看序列与质粒图谱，设计引物和克隆方案。AI 的修改先给你确认，再写入。",
      link: "打开 GeneCode 网页工作台 ↗",
    },
    modes: [
      { icon: "i-search", h: "深度研究", p: "检索、比对证据，写成综述。" },
      { icon: "i-chart", h: "数据分析", p: "统计与组学分析，每次运行可复算。" },
      { icon: "i-doc", h: "论文写作", p: "起草、润色与审稿回复。" },
      { icon: "i-figure", h: "科研绘图", p: "按投稿规范排版、配色。" },
    ],
  },
  verify: {
    eyebrow: "可复核", title: "每个结论，都能追到来处。",
    lede: "科研里最危险的错误，往往看起来很对。",
    cards: [
      { icon: "i-quote", h: "回到原文", p: "引用带页码和段落，点开就能核对。" },
      { icon: "i-shield", h: "引用体检", p: "投稿前逐条查 DOI、撤稿与版本。" },
      { icon: "i-redo", h: "分析可复算", p: "代码、环境与产物哈希都有记录。" },
      { icon: "i-gap", h: "缺证据就留空", p: "没有证据，就标「待补」，不写进正文。" },
    ],
    reportAria: "示意：引用检验报告", illustrative: "示意",
    report: [
      ["v-pass", "✓ 通过", "DOI 可查，题目、作者与年份一致。"],
      ["v-warn", "! 待确认", "该文发布过更正声明，请确认引用的是更正后的说法。"],
      ["v-fail", "✗ 有问题", "这个 DOI 指向另一篇文章，多半是抄串了。"],
      ["v-warn", "! 待确认", "预印本已有正式发表版本，建议改引正式版。"],
    ],
    reportFootL: "每条结论注明来源与核验时间", reportFootR: "有 ✗ 时可作投稿前门禁",
  },
  principles: {
    eyebrow: "知识与记忆", title: "资料有来处，研究有记忆。",
    lede: "把论文放进知识库，记住研究背景，也保留证据来源。",
    chain: {
      aria: "示意：从来源到稿件的证据链", title: "证据链 · 示意",
      cols: ["来源", "知识库片段", "你的稿件"],
      sources: ["PubMed", "Europe PMC", "UniProt", "Ensembl", "GEO", "你的 PDF 与笔记"],
      fragments: [
        ["zeb1-ferroptosis.pdf", "第 4 页 · 第 12 段"],
        ["emt-review.pdf", "第 9 页 · 第 3 段"],
        ["UniProt · P37275", "ZEB1 · 人"],
      ],
      fragNote: "索引可删可重建 · 原件只读 · 带 sha256",
      claims: [
        ["间质状态的肿瘤细胞对铁死亡诱导剂更敏感。", "[1] 第 4 页 · 第 12 段"],
        ["ZEB1 通过抑制 E-cadherin 转录维持间质表型。", "[2] 第 9 页 · 第 3 段"],
        ["ZEB1 是含锌指结构的转录因子。", "[3] UniProt P37275"],
      ],
      gap: "⟦待补：ZEB1 敲低后的独立重复实验⟧",
      foot: "每条论断都连回原文；连不上的，不写进正文。",
    },
    cards: [
      { num: "P·01 / EVIDENCE", icon: "i-book", h: "回到原文页段", p: "检索结果带文件、页码与段落。" },
      { num: "P·02 / READING", icon: "i-lang", h: "双语对照精读", p: "译文放在原文旁，引用仍指回原文。" },
      { num: "P·03 / MEMORY", icon: "i-memory", h: "记忆由你管理", p: "全局与项目记忆分开，随时查看、修改、撤回。" },
    ],
  },
  workflow: {
    eyebrow: "一个课题", title: "从一个问题，到一份经得起追问的草稿。",
    lede: "一个课题，在 BioSeeki 里走过的六步。",
    case: {
      label: "课题卡片 · 示意", question: "ZEB1 敲低后，肿瘤细胞对铁死亡是否更敏感？梳理证据，并设计 qPCR 验证。",
      meta: [["项目目录", "~/lab/zeb1-ferroptosis"], ["模式", "深度研究 → 数据分析 → 论文写作"]],
      stats: [["6", "步骤"], ["4", "条论断"], ["3", "条有据"], ["1", "条待补"]],
      note: "示意流程，不是某次真实任务的记录。",
    },
    confirmLabel: "你来确认",
    steps: [
      { h: "检索文献", out: "期刊与预印本分开列出。" },
      { h: "回到原文", out: "关键结论绑定到原文段落。" },
      { h: "核验引用", out: "预印本已正式发表，建议改引。", confirm: "是否改引正式版" },
      { h: "设计引物", out: "3 对候选引物，用 primer3 复算。", confirm: "选用哪一对下单" },
      { h: "分析数据", out: "结果与图，运行记录可复算。" },
      { h: "起草成文", out: "3 条有出处，缺证据的留作待补。" },
    ],
    bounds: [
      { icon: "i-hand", h: "高影响操作先确认", p: "写入或修改之前，先问你。" },
      { icon: "i-lock", h: "项目之间相互隔离", p: "检索与记忆以项目为界。" },
      { icon: "i-globe", h: "文献只走公开渠道", p: "只走公开与机构通道，不绕付费墙。" },
      { icon: "i-nodata", h: "不拿你的数据训练", p: "私有内容不用于训练模型。" },
    ],
  },
  demo: {
    eyebrow: "真机演示", title: "看看它实际怎么工作。",
    lede: "45 秒 Mac Beta 真机画面。",
    aria: "BioSeeki 45 秒 Mac Beta 真机演示", badge: "45 SEC · MAC BETA",
    captionsLabel: "中文字幕", fallback: "你的浏览器不支持视频播放。", download: "下载视频 ↓",
    play: "播放演示",
    foot: "画面经过剪辑并隐藏私人信息。操作展示不代表完整研究任务的验收结果。",
  },
  pricing: {
    eyebrow: "定价", title: "选一个档位，开始你的研究。",
    lede: "月付订阅，人民币结算。每份套餐包含固定 credits，套餐额度到期失效；注册即送 1,000 credits。",
    per: "/ 月",
    plans: [
      { name: "Plus", price: "69", credits: "2,000", sub: "日常问答与轻量检索", tag: "" },
      { name: "Pro", price: "149", credits: "5,000", sub: "常规科研分析与长文写作", tag: "多数人选择" },
      { name: "Heavy", price: "299", credits: "12,000", sub: "高强度长任务与深度推理", tag: "" },
    ],
    cta: "立即订阅 ↗",
  },
  download: {
    eyebrow: "下载与开始使用", title: "下载客户端，从下一个科研问题开始。",
    lede: "自助注册，无需邀请码，也不用自备模型 API。",
    app: "BioSeeki for macOS", badge: "Mac Beta",
    specs: [["芯片", "Apple 芯片（M1 / M2 / M3 / M4）"], ["系统", "macOS 11 及以上"], ["Windows", "开发中"]],
    note: "暂不支持 Intel 芯片的 Mac。",
    cta: "下载 Mac 版",
    soon: "安装包正在签名与公证，很快开放下载。",
    mailCta: "邮件获取安装包 ✉",
    legal: `下载并使用即表示同意<a href="/terms">服务条款</a>与<a href="/privacy">隐私政策</a>；使用中遇到问题，写信到 <a href="mailto:${MAIL}">${MAIL}</a>。`,
    stepsLabel: "三步上手",
    steps: [
      ["01", "注册账号", "自助注册，无需邀请码。"],
      ["02", "创建密钥", "在后台生成密钥，客户端靠它连接。"],
      ["03", "安装客户端", "填入密钥，选个项目目录，开始。"],
    ],
    signUp: "注册账号 ↗",
    mailSubject: "BioSeeki 安装包申请",
    mailBody: "你好，我想试用 BioSeeki。\n\n注册邮箱：\n研究方向：\nMac 芯片（M1/M2/M3/M4）：\n希望解决的问题：",
  },
  faq: {
    eyebrow: "常见问题", title: "你可能想知道的事。",
    lede: `没找到答案？<a href="mailto:${MAIL}" style="color:var(--sage-deep);font-weight:600">写信给我们 ✉</a>`,
    items: [
      { q: "BioSeeki 和通用聊天 AI 有什么不同？", a: "BioSeeki 围绕你的项目目录工作：读你的文献与数据，调用科研技能和公共数据库，并把依据、运行记录和产物留在项目里。引用可以回到原文，数字可以复算，缺证据的地方会如实标出。" },
      { q: "我的文件会被上传吗？", a: "项目文件保存在你的电脑上。发给模型的只有你输入的内容、你主动引用的文件，以及完成当前任务实际读取的片段，按需读取，不会整目录打包。私有科研内容不会用于训练 BioSeeki 的模型。" },
      { q: "支持哪些系统？", a: "目前提供 Mac Beta，需要 macOS 11 及以上、Apple 芯片（M 系列）。Intel Mac 暂不支持；Windows 版本正在测试中。" },
      { q: "需要自己准备模型 API 吗？", a: "不需要。注册后在后台创建一条密钥，填进客户端即可开始使用；用量以 credits 计，额度与订阅可在个人中心查看。" },
      { q: "它会编造引用或数据吗？", a: "流程上尽量杜绝：引用要能回读到原文页段；投稿前可以用引用检验核对 DOI、撤稿与版本；写作时没有证据支撑的论断不会写进正文，而是留下「待补」标记。AI 仍可能出错，科学判断请由你复核。" },
      { q: "GeneCode 是什么？", a: "GeneCode 是分子生物学序列编辑工作台，支持特征注释、引物与酶切位点。它在 BioSeeki 里以「分子克隆」面板出现，AI 提出的序列修改需要你确认后才写入；也可以单独打开网页版使用。" },
    ],
  },
  footer: {
    tagA: "把时间，", tagB: "留给发现。", slogan: "有据，而非猜测",
    aria: "页脚导航",
    groups: [
      { title: "产品", links: [["#download", "下载 Mac 版"], ["#pricing", "定价"], ["/briefing", "前沿快讯 ↗"], ["https://genecode-agent.pages.dev", "GeneCode ↗", "ext"], ["#faq", "常见问题"]] },
      { title: "账号", links: [[SIGN_IN, "登录 ↗"], [SIGN_UP, "注册 ↗"]] },
      { title: "支持与条款", links: [[`mailto:${MAIL}`, MAIL], ["/terms", "服务条款 ↗"], ["/privacy", "隐私政策 ↗"]] },
    ],
    top: "返回顶部 ↑", copy: "© 2026 BIOSEEKI · AI FOR RESEARCH",
  },
  heroVideo: "背景动画",
  jsonLdDescription: "面向研究者个人的 AI 科研工作台：深度研究、数据分析、论文写作、科研绘图与 GeneCode 分子克隆，引用可回到原文，分析可复算。",
};

export type Copy = typeof zh;

const en: Copy = {
  htmlLang: "en",
  ogLocale: "en_US",
  canonical: "https://bioseeki.com/en",
  title: "BioSeeki · Your AI research partner",
  description: "BioSeeki is an AI research workspace for individual scientists: deep research, data analysis, writing, figures and GeneCode molecular cloning in one project. Citations trace back to the exact page and paragraph, analyses can be recomputed, and missing evidence is never papered over.",
  ogTitle: "BioSeeki · Read, analyze, write — every step backed by evidence",
  ogDescription: "An AI research workspace for individual scientists. Citations trace to the source, analyses can be recomputed, and you make the call.",
  twitterDescription: "Read, analyze, write — every step backed by evidence.",
  links: { signUp: SIGN_UP, signIn: SIGN_IN, mail: MAIL, plans: SIGN_PLANS },
  switchTo: { label: "中文", href: "/?lang=zh", title: "切换到中文" },
  nav: {
    aria: "Main", home: "BioSeeki home",
    items: [["#tools", "Capabilities"], ["#verify", "Verifiable"], ["#principles", "Knowledge"], ["#workflow", "A project"], ["#pricing", "Pricing"], ["/briefing", "Briefing (中文)"], ["#faq", "FAQ"]],
    signIn: "Sign in", signUp: "Sign up ↗", download: "Download", personal: "Account",
  },
  hero: {
    eyebrow: "BIOSEEKI · EVIDENCE, NOT GUESSWORK",
    h1a: "Read, analyze, write.", h1b: "Every step backed by evidence",
    sub: "An AI research partner built for individual scientists. Citations lead back to <strong>the exact page and paragraph</strong>, analyses leave <strong>a record you can recompute</strong>, and you always make the call.",
    download: "Download for Mac", cta: "Create account ↗", demo: "Watch the 45-second demo ↓",
    meta: "Mac Beta · macOS 11+ · Apple silicon",
  },
  ticker: ["Deep research", "Data analysis", "Writing", "Figures", "Molecular cloning", "Public databases", "Citation check", "Literature radar", "Knowledge & memory"],
  tools: {
    eyebrow: "Capabilities", title: "One place for the everyday work of research.",
    lede: "The everyday research tasks, all inside one project.",
    gc: {
      h: "GeneCode · Molecular cloning", status: "● Integrated",
      p: "View sequences and plasmid maps, design primers and cloning plans. Edits the AI proposes wait for your approval.",
      link: "Open GeneCode on the web ↗",
    },
    modes: [
      { icon: "i-search", h: "Deep research", p: "Search, compare the evidence, write it up." },
      { icon: "i-chart", h: "Data analysis", p: "Stats and omics, every run recomputable." },
      { icon: "i-doc", h: "Writing", p: "Drafting, polishing and reviewer replies." },
      { icon: "i-figure", h: "Figures", p: "Laid out and coloured to journal specs." },
    ],
  },
  verify: {
    eyebrow: "Verifiable", title: "Every conclusion, traceable to its source.",
    lede: "The most dangerous mistakes in research are the ones that look right.",
    cards: [
      { icon: "i-quote", h: "Back to the source", p: "Citations carry page and paragraph — one click to check." },
      { icon: "i-shield", h: "Citation check-up", p: "Before you submit: DOIs, retractions, versions." },
      { icon: "i-redo", h: "Recomputable analyses", p: "Code, environment and output hashes, all recorded." },
      { icon: "i-gap", h: "Gaps stay gaps", p: "No evidence, no claim: it stays a marked gap." },
    ],
    reportAria: "Illustration: a citation check report", illustrative: "Illustrative",
    report: [
      ["v-pass", "✓ Pass", "DOI resolves; title, authors and year match."],
      ["v-warn", "! Review", "A correction was issued — make sure you cite the corrected statement."],
      ["v-fail", "✗ Problem", "This DOI points to a different article — probably copied from the wrong line."],
      ["v-warn", "! Review", "The preprint has a published version — cite that instead."],
    ],
    reportFootL: "Each verdict notes its source and time", reportFootR: "Any ✗ can block submission",
  },
  principles: {
    eyebrow: "Knowledge & memory", title: "Sources you can find. A project that remembers.",
    lede: "Put your papers in the knowledge base: it remembers the background and keeps the sources.",
    chain: {
      aria: "Illustration: the evidence chain from sources to your draft", title: "Evidence chain · illustrative",
      cols: ["Sources", "Knowledge-base fragments", "Your draft"],
      sources: ["PubMed", "Europe PMC", "UniProt", "Ensembl", "GEO", "Your PDFs & notes"],
      fragments: [
        ["zeb1-ferroptosis.pdf", "p. 4 · para. 12"],
        ["emt-review.pdf", "p. 9 · para. 3"],
        ["UniProt · P37275", "ZEB1 · human"],
      ],
      fragNote: "Rebuildable index · originals read-only · sha256",
      claims: [
        ["Mesenchymal-state tumour cells are more sensitive to ferroptosis inducers.", "[1] p. 4 · para. 12"],
        ["ZEB1 maintains the mesenchymal phenotype by repressing E-cadherin transcription.", "[2] p. 9 · para. 3"],
        ["ZEB1 is a zinc-finger transcription factor.", "[3] UniProt P37275"],
      ],
      gap: "⟦Gap: independent replicates after ZEB1 knockdown⟧",
      foot: "Every claim links back to the source. If it can't, it stays out.",
    },
    cards: [
      { num: "P·01 / EVIDENCE", icon: "i-book", h: "Page and paragraph", p: "Results carry file, page and paragraph." },
      { num: "P·02 / READING", icon: "i-lang", h: "Side-by-side reading", p: "Translation beside the original; citations still point to it." },
      { num: "P·03 / MEMORY", icon: "i-memory", h: "Memory you control", p: "Global and project memory kept apart; view, edit or revoke any time." },
    ],
  },
  workflow: {
    eyebrow: "A project", title: "From one question to a draft that holds up.",
    lede: "Six steps one project takes in BioSeeki.",
    case: {
      label: "Project card · illustrative", question: "After ZEB1 knockdown, are tumour cells more sensitive to ferroptosis? Gather the evidence and design a qPCR validation.",
      meta: [["Project folder", "~/lab/zeb1-ferroptosis"], ["Modes", "Deep research → Analysis → Writing"]],
      stats: [["6", "steps"], ["4", "claims"], ["3", "sourced"], ["1", "gap"]],
      note: "An illustrative walk-through, not a log of a real task.",
    },
    confirmLabel: "You decide",
    steps: [
      { h: "Search the literature", out: "Journals and preprints listed separately." },
      { h: "Back to the source", out: "Key findings bound to their paragraphs." },
      { h: "Check the citations", out: "A preprint is now published — cite that.", confirm: "Whether to cite the published version" },
      { h: "Design primers", out: "Three candidate pairs, rechecked in primer3.", confirm: "Which pair to order" },
      { h: "Analyze the data", out: "Results and plots, with a recomputable run record." },
      { h: "Draft the text", out: "Three claims sourced; the unsupported one stays a gap." },
    ],
    bounds: [
      { icon: "i-hand", h: "High-impact actions need approval", p: "Nothing is written or edited until you approve." },
      { icon: "i-lock", h: "Projects stay separate", p: "Search and memory stay inside a project." },
      { icon: "i-globe", h: "Only open channels for papers", p: "Open and institutional access only. No paywall workarounds." },
      { icon: "i-nodata", h: "Your data doesn't train models", p: "Private content is not used to train models." },
    ],
  },
  demo: {
    eyebrow: "Real demo", title: "See how it actually works.",
    lede: "45 seconds of the Mac Beta on a real machine. The interface is in Chinese.",
    aria: "BioSeeki 45-second Mac Beta demo", badge: "45 SEC · MAC BETA",
    captionsLabel: "中文字幕 (Chinese captions)", fallback: "Your browser can't play this video.", download: "Download video ↓",
    play: "Play the demo",
    foot: "Edited, with private information hidden. What's shown is not an acceptance test of a complete research task.",
  },
  pricing: {
    eyebrow: "Pricing", title: "Pick a plan and start your research.",
    lede: "Monthly subscriptions, billed in CNY. Each plan includes a fixed credit allowance that expires with the plan. New accounts get 1,000 credits.",
    per: "/ month",
    plans: [
      { name: "Plus", price: "69", credits: "2,000", sub: "Everyday Q&A and light literature search", tag: "" },
      { name: "Pro", price: "149", credits: "5,000", sub: "Regular analysis and long-form writing", tag: "Most popular" },
      { name: "Heavy", price: "299", credits: "12,000", sub: "Heavy long-running tasks and deep reasoning", tag: "" },
    ],
    cta: "Subscribe ↗",
  },
  download: {
    eyebrow: "Download & get started", title: "Download the app and start with your next research question.",
    lede: "Self sign-up, no invite code, and no model API of your own to set up.",
    app: "BioSeeki for macOS", badge: "Mac Beta",
    specs: [["Chip", "Apple silicon (M1 / M2 / M3 / M4)"], ["System", "macOS 11 or later"], ["Windows", "In progress"]],
    note: "Intel Macs are not supported yet.",
    cta: "Download for Mac",
    soon: "The installer is being signed and notarized; the download opens shortly.",
    mailCta: "Get the installer by email ✉",
    legal: `Downloading and using it means you accept the <a href="/terms#english">Terms</a> and <a href="/privacy">Privacy Policy</a>. Questions: <a href="mailto:${MAIL}">${MAIL}</a>.`,
    stepsLabel: "Three steps",
    steps: [
      ["01", "Create an account", "Self sign-up, no invite code."],
      ["02", "Create a key", "One click in the dashboard; the app connects with it."],
      ["03", "Install the app", "Paste the key, pick a folder, go."],
    ],
    signUp: "Create account ↗",
    mailSubject: "BioSeeki installer request",
    mailBody: "Hi, I'd like to try BioSeeki.\n\nSign-up email:\nResearch area:\nMac chip (M1/M2/M3/M4):\nWhat I'd like to use it for:",
  },
  faq: {
    eyebrow: "FAQ", title: "Things you might want to know.",
    lede: `Didn't find your answer? <a href="mailto:${MAIL}" style="color:var(--sage-deep);font-weight:600">Write to us ✉</a>`,
    items: [
      { q: "How is BioSeeki different from a general AI chatbot?", a: "BioSeeki works around your project folder: it reads your papers and data, calls research skills and public databases, and keeps sources, run records and outputs in the project. Citations trace back to the original, numbers can be recomputed, and missing evidence is flagged rather than filled in." },
      { q: "Are my files uploaded?", a: "Project files stay on your computer. What goes to the model is only what you type, files you explicitly reference, and the fragments actually read to complete the current task — read on demand, never a whole folder. Private research content is not used to train BioSeeki's models." },
      { q: "Which systems are supported?", a: "The Mac Beta needs macOS 11 or later on Apple silicon (M series). Intel Macs aren't supported yet; a Windows version is in testing." },
      { q: "Do I need my own model API?", a: "No. After signing up, create a key in the dashboard and paste it into the app. Usage is counted in credits; view your allowance and subscriptions in your account." },
      { q: "Will it make up citations or data?", a: "The workflow is built to prevent it: citations must read back to a page and paragraph; before submission you can check DOIs, retractions and versions; and claims without evidence stay out of the text as marked gaps. AI can still make mistakes, so scientific judgement stays with you." },
      { q: "What is GeneCode?", a: "GeneCode is a molecular-biology sequence workbench with feature annotation, primers and restriction sites. Inside BioSeeki it appears as the cloning panel, and sequence edits proposed by the AI are written only after you approve them. It also works on its own in the browser." },
    ],
  },
  footer: {
    tagA: "Leave the time ", tagB: "for discovery.", slogan: "Evidence, not guesswork",
    aria: "Footer",
    groups: [
      { title: "Product", links: [["#download", "Download for Mac"], ["#pricing", "Pricing"], ["/briefing", "Briefing (中文) ↗"], ["https://genecode-agent.pages.dev", "GeneCode ↗", "ext"], ["#faq", "FAQ"]] },
      { title: "Account", links: [[SIGN_IN, "Sign in ↗"], [SIGN_UP, "Sign up ↗"]] },
      { title: "Support & legal", links: [[`mailto:${MAIL}`, MAIL], ["/terms#english", "Terms ↗"], ["/privacy", "Privacy (中文) ↗"]] },
    ],
    top: "Back to top ↑", copy: "© 2026 BIOSEEKI · AI FOR RESEARCH",
  },
  heroVideo: "Background animation",
  jsonLdDescription: "An AI research workspace for individual scientists: deep research, data analysis, writing, figures and GeneCode molecular cloning, with citations traceable to the source and recomputable analyses.",
};

export const COPY: Record<Lang, Copy> = { zh, en };
