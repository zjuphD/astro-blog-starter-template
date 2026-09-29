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

const SIGN_UP = "https://api.bioseeki.com/sign-up";
const SIGN_IN = "https://api.bioseeki.com/sign-in";
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
    signIn: "登录", signUp: "注册 ↗", download: "下载",
  },
  hero: {
    eyebrow: "BIOSEEKI · 有据，而非猜测",
    h1a: "读文献、跑数据、写论文，", h1b: "每一步都有据可查",
    sub: "BioSeeki 是为研究者个人打造的 AI 科研协作者。引用能回到<strong>原文的页与段</strong>，分析留下<strong>可复算的记录</strong>，写作时缺证据的地方如实留空——结论始终由你把关。",
    download: "下载 Mac 版", cta: "注册账号 ↗", demo: "观看 45 秒演示 ↓",
    meta: "Mac Beta · macOS 11+ · Apple 芯片",
    tags: ["引用回到原文段落", "分析可复算", "缺证据不编造", "GeneCode 分子克隆"],
    panelAria: "示意：BioSeeki 如何处理一个科研问题",
    panelTitle: "研究会话 · 示意", panelBadge: "深度研究", ask: "问",
    question: "ZEB1 会不会影响肿瘤细胞对铁死亡的敏感性？帮我梳理现有证据。",
    rows: [
      ["检索 · PubMed / Europe PMC", "期刊论文与预印本分开列出", "完成", "ok"],
      ["回读 · 知识库", "关键结论定位到原文第 4 页第 12 段", "已定位", "ok"],
      ["核验 · 引用检验", "1 篇预印本已正式发表，建议改引", "待确认", "warn"],
      ["成稿 · 证据台账", "3 条论断有出处，1 条缺证据，留作待补", "可审阅", "ok"],
    ],
    panelFootL: "每条结论附来源定位", panelFootR: "论断 <b>3 / 4</b> 已绑定证据",
    scroll: "向下探索",
  },
  ticker: ["深度研究", "数据分析", "论文写作", "科研绘图", "分子克隆", "公共数据库", "引用检验", "文献雷达", "知识库与记忆"],
  tools: {
    eyebrow: "科研能力", title: "一个入口，接住研究的日常。",
    lede: "从检索文献到设计克隆，常用任务都在同一个项目里完成。三十余项专业技能和公共数据库连接器收在能力目录里，按需调用。",
    gc: {
      h: "GeneCode · 分子克隆", status: "● 已接入",
      p: "在同一个工作区查看序列、质粒图谱与注释，围绕引物、片段和克隆方案继续设计。AI 提出的修改先以补丁呈现，你确认后才写入。",
      chips: ["序列视图", "质粒图谱", "引物与酶切位点", "修改需确认"],
      link: "打开 GeneCode 网页工作台 ↗",
      caption: "GeneCode：序列视图与质粒图谱 · Mac Beta 真机画面", alt: "GeneCode Mac Beta 真实序列与质粒双视图",
    },
    inLabel: "输入", outLabel: "产出",
    modes: [
      { icon: "i-search", h: "深度研究", p: "检索、比对证据后写成综述；期刊与预印本分开标注。", in: "一个研究问题", out: "带原文定位的证据综述", chips: ["PubMed", "Europe PMC", "知识库", "文献雷达"] },
      { icon: "i-chart", h: "数据分析", p: "统计检验与组学分析；每次运行都留下代码、环境和产物记录。", in: "计数矩阵 / 实验数据表", out: "统计结果 + 可复算的运行记录", chips: ["PyDESeq2", "Scanpy", "GO / KEGG", "运行记录"] },
      { icon: "i-doc", h: "论文写作", p: "起草、润色与审稿回复，统计写法一并审校。", in: "证据台账与分析结果", out: "可审阅的草稿，缺口标为待补", chips: ["引用检验", "统计审校", "审稿回复", "语言润色"] },
      { icon: "i-figure", h: "科研绘图", p: "多面板排版、配色与字号按投稿规范处理。", in: "数据与作图要求", out: "投稿规范的 SVG / PDF / TIFF", chips: ["多面板", "期刊配色", "字号规范"] },
    ],
    catalogTitle: "能力目录 · 节选", catalogNote: "每项能力都标明是否就绪、依赖什么；在客户端「浏览科研能力」里查看完整清单。",
    catalog: [
      { key: "OMICS", name: "组学与统计", items: ["批量 RNA-seq", "PyDESeq2 差异表达", "单细胞分析", "DIA 蛋白组", "CUT&Tag 下游", "deepTools", "GO / KEGG 富集", "统计报告审校"] },
      { key: "LIT", name: "文献与写作", items: ["文献综述", "引用管理", "论文写作", "语言润色", "审稿回复信", "投稿级绘图"] },
      { key: "DATA", name: "数据库与坐标", items: ["UniProt", "Ensembl", "GEO", "PubMed", "Europe PMC", "gget", "基因组坐标换算", "pysam", "Biopython"] },
      { key: "BENCH", name: "序列与实验", items: ["克隆引物设计", "qPCR 引物质检", "实验方案设计", "eLabFTW 实验记录", "GeneCode 分子克隆"] },
      { key: "CORE", name: "研究底座", items: ["知识库", "项目记忆", "文献雷达", "引用检验", "运行记录"] },
    ],
  },
  verify: {
    eyebrow: "可复核", title: "每个结论，都能追到来处。",
    lede: "科研里最危险的错误，往往看起来很对。BioSeeki 把「查得到、算得回、不编造」做成默认流程，而不是提示词里的一句叮嘱。",
    cards: [
      { icon: "i-quote", h: "回到原文", p: "引用带着文件、页码和段落定位，还有一个稳定引用 ID，点开就能核对上下文。", eg: "attention.pdf · 第 4 页 · 第 12 段" },
      { icon: "i-shield", h: "引用体检", p: "投稿前逐条核查：DOI 查不查得到、指向的是不是这篇、有没有撤稿或更正、预印本是否已正式发表。", eg: "Crossref · DataCite · Europe PMC" },
      { icon: "i-redo", h: "分析可复算", p: "每次运行记下代码、命令、环境和产物哈希。数字可以重算，环境版本锁定、可以重建。", eg: "代码 · 执行 · 环境 · 复核" },
      { icon: "i-gap", h: "缺证据就留空", p: "没有证据支撑的论断不写进正文，而是留下「待补」标记，写明缺什么、该由谁补。", eg: "⟦待补：独立重复实验数据⟧" },
    ],
    reportAria: "示意：引用检验报告", illustrative: "示意",
    report: [
      ["v-pass", "✓ 通过", "DOI 可查，题目、作者与年份一致。"],
      ["v-warn", "! 待确认", "该文发布过更正声明，请确认引用的是更正后的说法。"],
      ["v-fail", "✗ 有问题", "这个 DOI 指向另一篇文章，多半是抄串了。"],
      ["v-warn", "! 待确认", "预印本已有正式发表版本，建议改引正式版。"],
      ["v-unk", "? 无法核验", "上游暂时连不上。查不到不等于引用是假的，稍后重试。"],
    ],
    reportFootL: "每条结论注明来源与核验时间", reportFootR: "有 ✗ 时可作投稿前门禁",
  },
  principles: {
    eyebrow: "知识与记忆", title: "资料有来处，研究有记忆。",
    lede: "把论文和课题资料放进知识库，BioSeeki 记住研究背景，也保留证据的来源。记什么、留什么，由你决定。",
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
      foot: "每条论断连回一个可打开的原文位置；连不上的，就不写进正文。",
    },
    cards: [
      { num: "P·01 / EVIDENCE", icon: "i-book", h: "回到原文页段", p: "PDF 与扫描件解析入库，检索结果带文件、页码、段落和修订信息，便于核对引用依据。" },
      { num: "P·02 / READING", icon: "i-lang", h: "双语对照精读", p: "外文论文的译文放在原文 PDF 旁边，一边读一边对照；引用依旧指回原文。" },
      { num: "P·03 / MEMORY", icon: "i-memory", h: "记忆由你管理", p: "长期偏好放全局记忆，课题进展放项目记忆；跨项目检索需要授权，随时查看、修改或撤回。" },
    ],
    screen: {
      bar: "KNOWLEDGE BASE / MAC BETA", badge: "真实界面",
      caption: "知识库检索：原文片段、页码与稳定引用 · Mac Beta 真机画面",
      alt: "BioSeeki Mac Beta 真实知识库检索界面，显示原文片段、页码和稳定引用",
      foot: "真实检索画面：公开论文片段、页码与修订。私人内容和本地路径已隐藏。", link: "了解数据处理方式 ↗",
    },
  },
  workflow: {
    eyebrow: "一个课题", title: "从一个问题，到一份经得起追问的草稿。",
    lede: "下面是一个课题在 BioSeeki 里走过的六步。每一步用到什么、产出什么、哪里需要你拍板，都写在研究日志里。",
    case: {
      label: "课题卡片 · 示意", question: "ZEB1 敲低后，肿瘤细胞对铁死亡是否更敏感？梳理证据，并设计 qPCR 验证。",
      meta: [["项目目录", "~/lab/zeb1-ferroptosis"], ["模式", "深度研究 → 数据分析 → 论文写作"]],
      stats: [["6", "步骤"], ["4", "条论断"], ["3", "条有据"], ["1", "条待补"]],
      note: "示意流程，用来说明各项能力如何衔接；不是某次真实任务的记录。",
    },
    usedLabel: "用到", outLabel: "产出", basisLabel: "依据", confirmLabel: "你来确认",
    steps: [
      { h: "检索文献", used: ["PubMed", "Europe PMC", "文献雷达"], out: "相关文献按期刊与预印本分列，摘要只取开头一段，方便判断要不要细读。" },
      { h: "回到原文", used: ["知识库", "双语精读"], out: "关键结论逐条绑定到原文段落。", basis: "zeb1-ferroptosis.pdf · 第 4 页 · 第 12 段" },
      { h: "核验引用", used: ["引用检验"], out: "1 篇预印本已有正式发表版本；其余 DOI 与题目一致。", confirm: "是否改引正式版" },
      { h: "设计引物", used: ["克隆引物设计", "qPCR 引物质检"], out: "3 对候选引物，Tm、GC 与二聚体风险用 primer3 复算，标为「候选」而非「已验证」。", confirm: "选用哪一对下单" },
      { h: "分析数据", used: ["数据分析", "运行记录"], out: "ΔΔCt 结果与图；代码、环境和产物哈希一并记录，数字可以重算。" },
      { h: "起草成文", used: ["论文写作", "证据台账"], out: "3 条论断有出处；缺独立重复实验的那一条不进正文，留下待补标记。", basis: "⟦待补：独立重复实验⟧" },
    ],
    screen: {
      bar: "BIOSEEKI / MAC BETA", badge: "真实界面",
      caption: "科研工作台首页：从一个问题开始 · Mac Beta 真机画面", alt: "BioSeeki Mac Beta 实际科研工作台首页和科研能力入口",
      footL: "真实界面：从一个科研问题开始，常用能力集中在同一个入口。", footR: "深度研究 · 数据分析 · 论文写作 · 分子克隆",
    },
    bounds: [
      { icon: "i-hand", h: "高影响操作先确认", p: "写入实验记录、修改序列这类操作，要你批准才会执行。" },
      { icon: "i-lock", h: "项目之间相互隔离", p: "检索与记忆以项目为界，跨项目调用需要授权。" },
      { icon: "i-globe", h: "文献只走公开渠道", p: "PubMed、Europe PMC、Crossref 与机构通道，不绕过付费墙。" },
      { icon: "i-nodata", h: "不拿你的数据训练", p: "私有科研内容不用于训练 BioSeeki 的模型。" },
    ],
  },
  demo: {
    eyebrow: "真机演示", title: "看看它实际怎么工作。",
    lede: "45 秒 Mac Beta 真机画面，包含科研能力、知识库检索、记忆设置和 GeneCode 序列视图。",
    aria: "BioSeeki 45 秒 Mac Beta 真机演示", badge: "45 SEC · MAC BETA",
    captionsLabel: "中文字幕", fallback: "你的浏览器不支持视频播放。", download: "下载视频 ↓",
    foot: "画面经过剪辑并隐藏私人信息。操作展示不代表完整研究任务的验收结果。",
  },
  pricing: {
    eyebrow: "定价", title: "选一个档位，开始你的研究。",
    lede: "月付，以人民币结算，按 credits 计费。注册即送 2,000 credits 试用；额度一次性到账、不按月重置，用完随时续订。",
    per: "/ 月",
    plans: [
      { name: "Plus", price: "69", credits: "2,000", sub: "日常问答与轻量检索", tag: "" },
      { name: "Pro", price: "149", credits: "5,000", sub: "常规科研分析与长文写作", tag: "多数人选择" },
      { name: "Heavy", price: "299", credits: "12,500", sub: "高强度长任务与深度推理", tag: "" },
    ],
    cta: "立即订阅 ↗",
  },
  download: {
    eyebrow: "下载与开始使用", title: "下载客户端，从下一个科研问题开始。",
    lede: "账号开放自助注册，不需要邀请码。装好就能用：不需要自己准备模型 API，填入注册后在后台创建的密钥即可开始。",
    app: "BioSeeki for macOS", badge: "Mac Beta",
    specs: [["芯片", "Apple 芯片（M1 / M2 / M3 / M4）"], ["系统", "macOS 11 及以上"], ["Windows", "开发中"]],
    note: "暂不支持 Intel 芯片的 Mac。",
    cta: "下载 Mac 版",
    soon: "安装包正在签名与公证，很快开放下载。",
    mailCta: "邮件获取安装包 ✉",
    legal: `下载并使用即表示同意<a href="/terms">服务条款</a>与<a href="/privacy">隐私政策</a>；使用中遇到问题，写信到 <a href="mailto:${MAIL}">${MAIL}</a>。`,
    stepsLabel: "三步上手",
    steps: [
      ["01", "注册账号", "自助注册，无需邀请码。用邮箱注册后进入自己的后台。"],
      ["02", "创建密钥", "在后台一键生成 API 密钥，客户端靠它连接模型与账户额度。"],
      ["03", "安装客户端", "装好后填入密钥、选一个项目目录，就可以开始了。"],
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
      { q: "需要自己准备模型 API 吗？", a: "不需要。注册后在后台创建一条密钥，填进客户端即可开始使用；用量以 credits 计，余额与套餐都在账户后台查看。" },
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
  zoom: { aria: "放大查看截图", close: "关闭", hint: "⤢ 点击放大", fine: "按 Esc 或点击空白处关闭", touch: "左右滑动查看细节，点右上角 ✕ 关闭" },
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
    signIn: "Sign in", signUp: "Sign up ↗", download: "Download",
  },
  hero: {
    eyebrow: "BIOSEEKI · EVIDENCE, NOT GUESSWORK",
    h1a: "Read, analyze, write.", h1b: "Every step backed by evidence",
    sub: "BioSeeki is an AI research partner built for individual scientists. Citations lead back to <strong>the exact page and paragraph</strong>, analyses leave <strong>a record you can recompute</strong>, and where evidence is missing, the draft says so — you always make the call.",
    download: "Download for Mac", cta: "Create account ↗", demo: "Watch the 45-second demo ↓",
    meta: "Mac Beta · macOS 11+ · Apple silicon",
    tags: ["Citations to the paragraph", "Recomputable analyses", "No invented evidence", "GeneCode cloning"],
    panelAria: "Illustration: how BioSeeki works through a research question",
    panelTitle: "Research session · illustrative", panelBadge: "Deep research", ask: "Q",
    question: "Does ZEB1 change how sensitive tumour cells are to ferroptosis? Pull together the evidence.",
    rows: [
      ["Search · PubMed / Europe PMC", "Journal papers and preprints listed separately", "Done", "ok"],
      ["Read back · Knowledge base", "Key finding located at page 4, paragraph 12", "Located", "ok"],
      ["Verify · Citation check", "One preprint has since been published — cite that", "Review", "warn"],
      ["Draft · Evidence ledger", "3 claims sourced, 1 unsupported and left as a gap", "Ready", "ok"],
    ],
    panelFootL: "Every conclusion carries its source", panelFootR: "Claims backed <b>3 / 4</b>",
    scroll: "Scroll to explore",
  },
  ticker: ["Deep research", "Data analysis", "Writing", "Figures", "Molecular cloning", "Public databases", "Citation check", "Literature radar", "Knowledge & memory"],
  tools: {
    eyebrow: "Capabilities", title: "One place for the everyday work of research.",
    lede: "From searching the literature to designing a clone, the common tasks happen inside one project. Thirty-plus research skills and public-database connectors sit in the capability catalog, ready when you need them.",
    gc: {
      h: "GeneCode · Molecular cloning", status: "● Integrated",
      p: "View sequences, plasmid maps and annotations in the same workspace, and keep designing primers, fragments and cloning plans. Edits the AI proposes arrive as patches and are written only after you approve them.",
      chips: ["Sequence view", "Plasmid map", "Primers & restriction sites", "Edits need approval"],
      link: "Open GeneCode on the web ↗",
      caption: "GeneCode: sequence view and plasmid map · Mac Beta, real screen", alt: "GeneCode Mac Beta showing a real sequence and plasmid map side by side",
    },
    inLabel: "In", outLabel: "Out",
    modes: [
      { icon: "i-search", h: "Deep research", p: "Search, compare the evidence, write it up; journals and preprints labelled separately.", in: "A research question", out: "An evidence review with source locations", chips: ["PubMed", "Europe PMC", "Knowledge base", "Literature radar"] },
      { icon: "i-chart", h: "Data analysis", p: "Statistics and omics analyses; every run keeps its code, environment and outputs.", in: "Count matrix / lab data table", out: "Results plus a recomputable run record", chips: ["PyDESeq2", "Scanpy", "GO / KEGG", "Run record"] },
      { icon: "i-doc", h: "Writing", p: "Drafting, polishing and reviewer responses, with the statistics checked too.", in: "Evidence ledger and results", out: "A draft to review, gaps marked as gaps", chips: ["Citation check", "Stats review", "Rebuttals", "Language polish"] },
      { icon: "i-figure", h: "Figures", p: "Multi-panel layout, colour and type sized to journal requirements.", in: "Data and figure requirements", out: "Journal-ready SVG / PDF / TIFF", chips: ["Multi-panel", "Journal palettes", "Type specs"] },
    ],
    catalogTitle: "Capability catalog · excerpt", catalogNote: "Each capability shows whether it's ready and what it depends on. Browse the full list in the app.",
    catalog: [
      { key: "OMICS", name: "Omics & statistics", items: ["Bulk RNA-seq", "PyDESeq2", "Single-cell", "DIA proteomics", "CUT&Tag downstream", "deepTools", "GO / KEGG enrichment", "Stats review"] },
      { key: "LIT", name: "Literature & writing", items: ["Literature review", "Citation management", "Paper writing", "Language polish", "Reviewer response", "Publication figures"] },
      { key: "DATA", name: "Databases & coordinates", items: ["UniProt", "Ensembl", "GEO", "PubMed", "Europe PMC", "gget", "Genomic coordinates", "pysam", "Biopython"] },
      { key: "BENCH", name: "Sequences & bench", items: ["Cloning primer design", "qPCR primer QC", "Protocol design", "eLabFTW notebook", "GeneCode cloning"] },
      { key: "CORE", name: "Research foundation", items: ["Knowledge base", "Project memory", "Literature radar", "Citation check", "Run records"] },
    ],
  },
  verify: {
    eyebrow: "Verifiable", title: "Every conclusion, traceable to its source.",
    lede: "The most dangerous mistakes in research are the ones that look right. BioSeeki makes “findable, recomputable, never invented” the default workflow — not a line in a prompt.",
    cards: [
      { icon: "i-quote", h: "Back to the source", p: "Citations carry the file, page and paragraph, plus a stable reference ID — one click to check the context.", eg: "attention.pdf · p. 4 · para. 12" },
      { icon: "i-shield", h: "Citation check-up", p: "Before you submit, each reference is checked: does the DOI resolve, is it the paper you meant, has it been retracted or corrected, is there a published version of the preprint?", eg: "Crossref · DataCite · Europe PMC" },
      { icon: "i-redo", h: "Recomputable analyses", p: "Every run records its code, command, environment and output hashes. Numbers can be recomputed; environments are locked and rebuildable.", eg: "Code · Execution · Environment · Review" },
      { icon: "i-gap", h: "Gaps stay gaps", p: "Claims without evidence don't make it into the text. They become marked gaps that say what's missing and who should supply it.", eg: "⟦Gap: independent replicate data⟧" },
    ],
    reportAria: "Illustration: a citation check report", illustrative: "Illustrative",
    report: [
      ["v-pass", "✓ Pass", "DOI resolves; title, authors and year match."],
      ["v-warn", "! Review", "A correction was issued — make sure you cite the corrected statement."],
      ["v-fail", "✗ Problem", "This DOI points to a different article — probably copied from the wrong line."],
      ["v-warn", "! Review", "The preprint has a published version — cite that instead."],
      ["v-unk", "? Unverifiable", "The source is unreachable right now. Not found is not the same as fake — try again later."],
    ],
    reportFootL: "Each verdict notes its source and time", reportFootR: "Any ✗ can block submission",
  },
  principles: {
    eyebrow: "Knowledge & memory", title: "Sources you can find. A project that remembers.",
    lede: "Put your papers and project files into the knowledge base: BioSeeki remembers the background and keeps every piece of evidence tied to where it came from. What it remembers is up to you.",
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
      foot: "Every claim links to a source location you can open. If it can't be linked, it doesn't go in the text.",
    },
    cards: [
      { num: "P·01 / EVIDENCE", icon: "i-book", h: "Page and paragraph", p: "PDFs and scans are parsed into the knowledge base; results carry file, page, paragraph and revision, so every citation can be checked." },
      { num: "P·02 / READING", icon: "i-lang", h: "Side-by-side reading", p: "A translation sits next to the original PDF so you can read both at once — citations still point to the original." },
      { num: "P·03 / MEMORY", icon: "i-memory", h: "Memory you control", p: "Long-term preferences live in global memory, project progress in project memory. Cross-project search needs your permission; view, edit or revoke at any time." },
    ],
    screen: {
      bar: "KNOWLEDGE BASE / MAC BETA", badge: "Real screen",
      caption: "Knowledge-base search: source fragments, pages and stable references · Mac Beta",
      alt: "BioSeeki Mac Beta knowledge-base search showing source fragments, page numbers and stable references",
      foot: "A real search: public paper fragments with page and revision. Private content and local paths are hidden.", link: "How we handle data ↗",
    },
  },
  workflow: {
    eyebrow: "A project", title: "From one question to a draft that holds up.",
    lede: "Here are the six steps one project takes in BioSeeki. What each step uses, what it produces and where you decide are all written into the research log.",
    case: {
      label: "Project card · illustrative", question: "After ZEB1 knockdown, are tumour cells more sensitive to ferroptosis? Gather the evidence and design a qPCR validation.",
      meta: [["Project folder", "~/lab/zeb1-ferroptosis"], ["Modes", "Deep research → Analysis → Writing"]],
      stats: [["6", "steps"], ["4", "claims"], ["3", "sourced"], ["1", "gap"]],
      note: "An illustrative walk-through of how the capabilities fit together — not a log of a real task.",
    },
    usedLabel: "Uses", outLabel: "Produces", basisLabel: "Source", confirmLabel: "You decide",
    steps: [
      { h: "Search the literature", used: ["PubMed", "Europe PMC", "Literature radar"], out: "Relevant papers split into journals and preprints, each with just the opening of its abstract so you can decide what to read." },
      { h: "Back to the source", used: ["Knowledge base", "Side-by-side reading"], out: "Each key finding is bound to the paragraph it came from.", basis: "zeb1-ferroptosis.pdf · p. 4 · para. 12" },
      { h: "Check the citations", used: ["Citation check"], out: "One preprint has a published version; every other DOI matches its title.", confirm: "Whether to cite the published version" },
      { h: "Design primers", used: ["Cloning primer design", "qPCR primer QC"], out: "Three candidate pairs with Tm, GC and dimer risk recomputed in primer3, labelled “candidate”, not “validated”.", confirm: "Which pair to order" },
      { h: "Analyze the data", used: ["Data analysis", "Run record"], out: "ΔΔCt results and plots, with code, environment and output hashes recorded so the numbers can be recomputed." },
      { h: "Draft the text", used: ["Writing", "Evidence ledger"], out: "Three claims are sourced; the one lacking independent replicates stays out of the text as a marked gap.", basis: "⟦Gap: independent replicates⟧" },
    ],
    screen: {
      bar: "BIOSEEKI / MAC BETA", badge: "Real screen",
      caption: "Workspace home: start from a question · Mac Beta", alt: "BioSeeki Mac Beta workspace home with research capability shortcuts",
      footL: "Real screen: start from a research question; the common capabilities sit in one entry point.", footR: "Deep research · Analysis · Writing · Cloning",
    },
    bounds: [
      { icon: "i-hand", h: "High-impact actions need approval", p: "Writing to a lab notebook or editing a sequence only happens after you approve it." },
      { icon: "i-lock", h: "Projects stay separate", p: "Search and memory are scoped to a project; crossing projects needs your permission." },
      { icon: "i-globe", h: "Only open channels for papers", p: "PubMed, Europe PMC, Crossref and your institution's access. No paywall workarounds." },
      { icon: "i-nodata", h: "Your data doesn't train models", p: "Private research content is not used to train BioSeeki's models." },
    ],
  },
  demo: {
    eyebrow: "Real demo", title: "See how it actually works.",
    lede: "45 seconds of the Mac Beta on a real machine: capabilities, knowledge-base search, memory settings and the GeneCode sequence view. The interface in the recording is in Chinese.",
    aria: "BioSeeki 45-second Mac Beta demo", badge: "45 SEC · MAC BETA",
    captionsLabel: "中文字幕 (Chinese captions)", fallback: "Your browser can't play this video.", download: "Download video ↓",
    foot: "Edited, with private information hidden. What's shown is not an acceptance test of a complete research task.",
  },
  pricing: {
    eyebrow: "Pricing", title: "Pick a plan and start your research.",
    lede: "Monthly, billed in CNY, metered in credits. New accounts get 2,000 credits to try; credits land in one go and don't reset each month - top up whenever you run out.",
    per: "/ month",
    plans: [
      { name: "Plus", price: "69", credits: "2,000", sub: "Everyday Q&A and light literature search", tag: "" },
      { name: "Pro", price: "149", credits: "5,000", sub: "Regular analysis and long-form writing", tag: "Most popular" },
      { name: "Heavy", price: "299", credits: "12,500", sub: "Heavy long-running tasks and deep reasoning", tag: "" },
    ],
    cta: "Subscribe ↗",
  },
  download: {
    eyebrow: "Download & get started", title: "Download the app and start with your next research question.",
    lede: "Sign-up is open — no invitation needed. Install and go: no model API required — paste the key you create in your dashboard and start.",
    app: "BioSeeki for macOS", badge: "Mac Beta",
    specs: [["Chip", "Apple silicon (M1 / M2 / M3 / M4)"], ["System", "macOS 11 or later"], ["Windows", "In progress"]],
    note: "Intel Macs are not supported yet.",
    cta: "Download for Mac",
    soon: "The installer is being signed and notarized; the download opens shortly.",
    mailCta: "Get the installer by email ✉",
    legal: `Downloading and using it means you accept the <a href="/terms#english">Terms</a> and <a href="/privacy">Privacy Policy</a>. Questions: <a href="mailto:${MAIL}">${MAIL}</a>.`,
    stepsLabel: "Three steps",
    steps: [
      ["01", "Create an account", "Self sign-up, no invite code. Register with your email and sign in to your dashboard."],
      ["02", "Create a key", "One click in the dashboard. The app uses the key to reach the models and your balance."],
      ["03", "Install the app", "Paste your key, pick a project folder, and you're ready."],
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
      { q: "Do I need my own model API?", a: "No. After signing up, create a key in the dashboard and paste it into the app. Usage is counted in credits; balance and plans are in your dashboard." },
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
  zoom: { aria: "Enlarged screenshot", close: "Close", hint: "⤢ Click to enlarge", fine: "Press Esc or click outside to close", touch: "Swipe to see details · tap ✕ to close" },
  heroVideo: "Background animation",
  jsonLdDescription: "An AI research workspace for individual scientists: deep research, data analysis, writing, figures and GeneCode molecular cloning, with citations traceable to the source and recomputable analyses.",
};

export const COPY: Record<Lang, Copy> = { zh, en };
