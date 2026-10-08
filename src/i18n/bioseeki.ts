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
  description: "BioSeeki 是生命科学 AI 科研工作台，支持文献检索、双语对照阅读、生信与实验数据分析、科研绘图、论文写作、组会 PPT、文献雷达、课题资料导入和 GeneCode 分子克隆。",
  ogTitle: "BioSeeki｜读文献、做分析，交付图表、报告和 PPT",
  ogDescription: "把论文、数据表和实验记录交给 BioSeeki，完成检索、对照精读、分析、绘图和科研汇报。成果和来源留在你的课题里。",
  twitterDescription: "从论文、数据和实验记录，到图表、报告和组会 PPT。",
  links: { signUp: SIGN_UP, signIn: SIGN_IN, mail: MAIL, plans: SIGN_PLANS },
  switchTo: { label: "EN", href: "/en", title: "Switch to English" },
  nav: {
    aria: "主导航", home: "BioSeeki 首页",
    items: [["#tools", "科研能力"], ["#verify", "结果核对"], ["#principles", "课题资料"], ["#workflow", "任务示例"], ["#pricing", "定价"], ["/briefing", "前沿快讯"], ["#faq", "常见问题"]],
    signIn: "登录", signUp: "注册 ↗", download: "下载", personal: "个人中心",
  },
  hero: {
    eyebrow: "BIOSEEKI · 生命科学 AI 科研工作台",
    h1a: "读文献、做分析，", h1b: "交付图表、报告和 PPT",
    sub: "交给它<strong>论文、数据表或实验记录</strong>，帮你检索文献、对照翻译、分析绘图、起草论文和制作组会 PPT。<strong>结果文件与来源</strong>保存在你的课题里，下次接着做。",
    download: "下载 Mac 版", cta: "注册账号 ↗", demo: "观看 45 秒演示 ↓",
    explore: "看看能做什么 ↓",
    meta: "Mac Beta · macOS 11+ · Apple 芯片",
  },
  ticker: ["文献检索", "对照翻译", "生信分析", "科研绘图", "论文写作", "组会 PPT", "GeneCode", "文献雷达", "课题资料导入"],
  tools: {
    eyebrow: "科研能力", title: "BioSeeki 能帮你做什么？",
    lede: "从读一篇论文，到分析一份数据、准备一次组会。告诉它任务，提供材料，成果留在你的课题目录里。",
    inputLabel: "你提供", outputLabel: "你会得到", exampleLabel: "试着这样说",
    note: "以上是任务示例。数据分析需要样本分组与实验设计；所需软件环境会在执行时检查。",
    gc: {
      h: "GeneCode · 分子克隆", status: "● 已接入",
      p: "在 BioSeeki 里打开序列与质粒图谱，查看特征、引物、酶切位点与比对结果，协作设计克隆方案。",
      input: "目标序列、载体文件，以及你想完成的克隆或验证。",
      output: "候选引物、克隆方案和可继续编辑的序列文件。",
      example: "用这个载体和插入序列设计克隆方案，检查连接位置与阅读框。",
      link: "打开 GeneCode 网页工作台 ↗",
    },
    modes: [
      { id: "literature", icon: "i-search", h: "文献检索与证据整理", input: "研究问题、关键词，或一组想比较的论文。", output: "文献清单、研究脉络和证据对照，附 DOI 或原文来源。", example: "查找近两年关于 R-loop 与 DNA 损伤的研究，比较实验方法与结论。" },
      { id: "reading", icon: "i-lang", h: "双语对照精读", input: "英文论文 PDF，以及想弄懂的方法、图表或结论。", output: "按页对应的原文与译文，结合图表讲解研究思路与证据。", example: "打开这篇论文的中英对照阅读，解释 Figure 3 支持了什么结论。" },
      { id: "analysis", icon: "i-chart", h: "生信与实验数据分析", input: "RNA-seq 计数、蛋白组结果、qPCR 或其他数据表，连同样本分组。", output: "整理后的结果表、统计方法、分析脚本与图表，说明适用条件。", example: "按这个样本分组分析 RNA-seq 数据，给出差异结果和富集图。" },
      { id: "figures", icon: "i-figure", h: "科研绘图与图版整理", input: "数据、已有分析结果或图片，以及目标版式与尺寸。", output: "散点图、火山图、热图或组合图版，保存图片和重绘文件。", example: "用这份结果画火山图和热图，统一字体、图例与配色。" },
      { id: "writing", icon: "i-doc", h: "论文与研究报告", input: "研究背景、方法、结果和引用材料，或一份已有草稿。", output: "论文段落、课题总结或审稿回复草稿，附依据与待补内容。", example: "根据这些结果起草 Results，区分数据支持的结论与尚待验证的解释。" },
      { id: "presentation", icon: "i-doc", h: "组会 PPT 与讲稿", input: "论文、实验记录或阶段结果，以及听众与汇报时长。", output: "可编辑 PPT、逐页讲稿和图源清单，可继续修改内容与版式。", example: "把这篇论文做成 10 分钟中文组会 PPT，保留原图来源和逐页讲稿。" },
      { id: "radar", icon: "i-globe", h: "文献雷达", input: "关注方向、检索关键词和每日或每周的跟进安排。", output: "去重后的新增文献与周报，分开标注期刊、预印本和检索状态。", example: "持续跟进 R-loop 方向的新文献，每周整理一份更新。" },
      { id: "materials", icon: "i-memory", h: "课题资料导入与记忆", input: "实验记录、课题总结、论文，或其他 Agent 导出的工作记录。", output: "可检索的课题知识库；重要背景与待办先预览，再由你选入记忆。", example: "把这些实验记录导入当前课题，整理已知结果、未解决问题和下一步。" },
    ],
  },
  verify: {
    eyebrow: "结果核对", title: "拿到结果，也能核对它怎么来的。",
    lede: "打开引用来源，查看分析方法与脚本，分清已支持的结果和仍需验证的解释。",
    cards: [
      { icon: "i-quote", h: "回到原文", p: "知识库命中带文件、页码或段落定位，便于回读核对。" },
      { icon: "i-shield", h: "引用体检", p: "投稿前逐条查 DOI、撤稿与版本。" },
      { icon: "i-redo", h: "查看分析过程", p: "结果与分析脚本一起保存，可以核对参数并重新运行。" },
      { icon: "i-gap", h: "说明证据边界", p: "标出缺失材料、样本限制和待验证内容，科研判断由你复核。" },
    ],
    reportAria: "示意：引用检验报告", illustrative: "示意", checking: "核验中", reportTitle: "引用检验报告",
    report: [
      ["v-pass", "✓ 通过", "DOI 可查，题目、作者与年份一致。"],
      ["v-warn", "! 待确认", "该文发布过更正声明，请确认引用的是更正后的说法。"],
      ["v-fail", "✗ 有问题", "这个 DOI 指向另一篇文章，多半是抄串了。"],
      ["v-warn", "! 待确认", "预印本已有正式发表版本，建议改引正式版。"],
    ],
    reportFootL: "注明查询来源与核验时间", reportFootR: "异常条目需回读核对",
  },
  principles: {
    eyebrow: "课题资料与记忆", title: "已有的研究，直接接着做。",
    lede: "导入论文、Word 实验记录、课题总结或 Agent 导出的文本与对话记录。资料归入对应课题；想让它长期记住的背景与进展，由你确认。",
    chain: {
      aria: "示意：从来源到稿件的证据链", title: "证据链 · 示意",
      cols: ["来源", "知识库片段", "你的稿件"],
      sources: ["PubMed", "Europe PMC", "UniProt", "Ensembl", "GEO", "你的 PDF 与笔记"],
      fragments: [
        ["zeb1-ferroptosis.pdf", "第 4 页 · 第 12 段"],
        ["emt-review.pdf", "第 9 页 · 第 3 段"],
        ["UniProt · P37275", "ZEB1 · 人"],
      ],
      fragNote: "保留来源 · 原始资料不改写 · 索引可重建",
      claims: [
        ["间质状态的肿瘤细胞对铁死亡诱导剂更敏感。", "[1] 第 4 页 · 第 12 段"],
        ["ZEB1 通过抑制 E-cadherin 转录维持间质表型。", "[2] 第 9 页 · 第 3 段"],
        ["ZEB1 是含锌指结构的转录因子。", "[3] UniProt P37275"],
      ],
      gap: "⟦待补：ZEB1 敲低后的独立重复实验⟧",
      foot: "从资料找到依据，再写进草稿。这里展示的是来源定位方式，不是真实课题结果。",
    },
    cards: [
      { num: "P·01 / MATERIALS", icon: "i-book", h: "不用从头交代", p: "已有实验记录与总结可以导入，之后在当前课题中检索、提问和继续工作。" },
      { num: "P·02 / SOURCE", icon: "i-quote", h: "知识库保留原始依据", p: "记忆帮助理解课题背景，知识库保留论文与记录；回到来源核对具体表述。" },
      { num: "P·03 / MEMORY", icon: "i-memory", h: "重要记忆由你选", p: "导入时先看候选记忆；全局与课题记忆分开，可查看、修改和撤回。" },
    ],
  },
  workflow: {
    eyebrow: "任务示例", title: "一次任务，交付哪些东西？",
    lede: "以一份 qPCR 数据的组会汇报为例：你提供数据与背景，它把分析、图表、报告和 PPT 连起来。",
    case: {
      label: "任务要求 · 示例", question: "这是这周的 qPCR 数据和实验记录。检查数据，绘图，并做一份 10 分钟组会汇报，说明结果与局限。",
      meta: [["输入材料", "Ct 表格 · 样本分组 · 实验记录"], ["结果保存在", "你选定的课题目录"]],
      stats: [["6", "工作步骤"], ["1", "结果表"], ["1", "分析报告"], ["1", "组会 PPT"]],
      note: "以上数量只用于说明交付类型，不是某次真实任务的记录或固定交付承诺。",
    },
    confirmLabel: "你来确认",
    steps: [
      { h: "检查输入", out: "核对分组、内参、重复设计与缺失值；关键材料不足时明确指出。" },
      { h: "计算结果", out: "按适用条件计算 ΔCt、ΔΔCt 与表达变化，保留计算表和脚本。" },
      { h: "生成图表", out: "展示单个样本、组间变化与图例，不把缺失值填成零。" },
      { h: "整理解释", out: "写清分析方法、结果与限制；不把单重复的描述性差异说成显著差异。" },
      { h: "制作汇报", out: "将实验问题、方法、结果图与下一步整理成可编辑 PPT 和讲稿。" },
      { h: "交付成果", out: "在回答中打开结果表、图、报告与 PPT，之后可继续要求调整。" },
    ],
    bounds: [
      { icon: "i-hand", h: "一句话继续修改", p: "告诉它要补哪张图、改哪段解释，沿用当前课题的资料与成果。" },
      { icon: "i-lock", h: "资料按课题管理", p: "在当前课题查资料、存成果；跨课题材料需要明确选择。" },
      { icon: "i-redo", h: "看板跟踪研究任务", p: "任务可手动拖动；移动只更新状态，点击开始执行才启动工作。" },
      { icon: "i-gap", h: "任务进度与结果分开", p: "卡片完成便于管理，统计结论和最终图表仍需要核对。" },
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
    lede: "安装后先登录 BioSeeki 账号，选好课题目录，就能开始。无需邀请码，也不用自备模型 API。",
    app: "BioSeeki for macOS", badge: "Mac Beta",
    specs: [["芯片", "Apple 芯片（M1 / M2 / M3 / M4）"], ["系统", "macOS 11 及以上"], ["Windows", "开发中"]],
    note: "暂不支持 Intel 芯片的 Mac。",
    cta: "下载 Mac 版",
    soon: "安装包正在签名与公证，很快开放下载。",
    mailCta: "邮件获取安装包 ✉",
    legal: `下载并使用即表示同意<a href="/terms">服务条款</a>与<a href="/privacy">隐私政策</a>；使用中遇到问题，写信到 <a href="mailto:${MAIL}">${MAIL}</a>。`,
    stepsLabel: "三步上手",
    steps: [
      ["01", "注册账号", "自助注册，无需邀请码；已有账号可直接登录。"],
      ["02", "安装并登录", "首次打开进入登录页，登录后即可使用内置模型。"],
      ["03", "选课题，交任务", "选择资料所在的课题目录，附上文件，告诉它想得到什么成果。"],
    ],
    signUp: "注册账号 ↗",
    mailSubject: "BioSeeki 安装包申请",
    mailBody: "你好，我想试用 BioSeeki。\n\n注册邮箱：\n研究方向：\nMac 芯片（M1/M2/M3/M4）：\n希望解决的问题：",
  },
  faq: {
    eyebrow: "常见问题", title: "你可能想知道的事。",
    lede: `没找到答案？<a href="mailto:${MAIL}" style="color:var(--sage-deep);font-weight:600">写信给我们 ✉</a>`,
    items: [
      { q: "我可以先用 BioSeeki 做什么？", a: "从一个具体任务开始：读懂一篇论文、把英文文献做成对照阅读、分析一份 RNA-seq 或蛋白组结果、整理 qPCR 数据、重绘一组图，或用论文和实验记录制作组会 PPT。给出材料与目标，比只问一个宽泛问题更容易得到可用成果。" },
      { q: "BioSeeki 和通用聊天 AI 有什么不同？", a: "它可以围绕本地课题实际读取材料、检索文献、运行分析、生成图表和可编辑 PPT，结果文件保存在课题目录，并能继续修改。知识库、记忆、文献雷达和任务看板帮助你接着推进同一个课题。" },
      { q: "已有实验记录和其他 Agent 的工作怎么导入？", a: "在课题资料中选择目标课题，导入文件或资料文件夹，预览后收录。支持 PDF、Word、Markdown、文本、表格及常见 JSON/JSONL 对话导出；重要摘录可由你选入课题记忆。不是所有 Agent 的专有格式都能直接解析，必要时先导出为文本。" },
      { q: "文献雷达会在我关机后继续跑吗？", a: "目前定时跟进依赖客户端与本地服务运行。关机、休眠或退出可能漏跑，可在恢复后补查。日报与周报会标明检索失败或不完整；它不能代替穷尽的系统综述检索。" },
      { q: "我的文件会被上传吗？", a: "项目文件保存在你的电脑上。发给模型的只有你输入的内容、你主动引用的文件，以及完成当前任务实际读取的片段，按需读取，不会整目录打包。私有科研内容不会用于训练 BioSeeki 的模型。" },
      { q: "支持哪些系统？", a: "目前提供 Mac Beta，需要 macOS 11 及以上、Apple 芯片（M 系列）。Intel Mac 暂不支持；Windows 版本正在测试中。" },
      { q: "需要自己准备模型 API 吗？", a: "不需要。安装后登录 BioSeeki 账号即可使用内置模型，不用自己创建或填入 API 密钥。用量以 credits 计，额度与订阅可在个人中心查看。" },
      { q: "结果还需要我检查吗？", a: "需要。你可以回读引用来源，检查分析方法、样本设计和最终图表；引用检验辅助核对 DOI、撤稿与版本。AI 仍可能误读图表或给出不合适的方法，不能代替你的科研判断。" },
      { q: "GeneCode 是什么？", a: "GeneCode 是 BioSeeki 内的分子生物学序列工作台，可以查看质粒图谱、特征注释、引物、酶切位点和序列比对，协作设计克隆方案；也可单独打开网页版使用。" },
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
  jsonLdDescription: "生命科学 AI 科研工作台，支持文献检索、对照阅读、生信与实验数据分析、科研绘图、论文写作、组会 PPT、文献雷达、资料导入与 GeneCode 分子克隆。",
};

export type Copy = typeof zh;

const en: Copy = {
  htmlLang: "en",
  ogLocale: "en_US",
  canonical: "https://bioseeki.com/en",
  title: "BioSeeki · Your AI research partner",
  description: "BioSeeki is an AI workspace for life-science research: literature search, bilingual reading, bioinformatics and experimental data analysis, figures, writing, presentations, literature updates, project imports and GeneCode molecular cloning.",
  ogTitle: "BioSeeki · From papers and data to figures, reports and slides",
  ogDescription: "Work with your papers, data tables and lab records. Search, read, analyze, plot and prepare a research presentation, with outputs and sources saved in your project.",
  twitterDescription: "From papers, data and lab records to figures, reports and research slides.",
  links: { signUp: SIGN_UP, signIn: SIGN_IN, mail: MAIL, plans: SIGN_PLANS },
  switchTo: { label: "中文", href: "/?lang=zh", title: "切换到中文" },
  nav: {
    aria: "Main", home: "BioSeeki home",
    items: [["#tools", "Capabilities"], ["#verify", "Check results"], ["#principles", "Project materials"], ["#workflow", "Example task"], ["#pricing", "Pricing"], ["/briefing", "Briefing (中文)"], ["#faq", "FAQ"]],
    signIn: "Sign in", signUp: "Sign up ↗", download: "Download", personal: "Account",
  },
  hero: {
    eyebrow: "BIOSEEKI · AI FOR LIFE-SCIENCE RESEARCH",
    h1a: "Read papers. Analyze data.", h1b: "Make figures, reports and slides",
    sub: "Bring your <strong>papers, data tables or lab records</strong>. Search literature, read translations beside the original, run analyses, make figures and prepare a research presentation. <strong>Outputs and sources</strong> stay in your project, ready to continue.",
    download: "Download for Mac", cta: "Create account ↗", demo: "Watch the 45-second demo ↓",
    explore: "Explore the capabilities ↓",
    meta: "Mac Beta · macOS 11+ · Apple silicon",
  },
  ticker: ["Literature search", "Bilingual reading", "Bioinformatics", "Research figures", "Paper writing", "Research slides", "GeneCode", "Literature radar", "Project imports"],
  tools: {
    eyebrow: "Capabilities", title: "What can you do with BioSeeki?",
    lede: "Read a paper, analyze a dataset or prepare a lab meeting. Describe the task, provide the materials and keep the outputs in your project folder.",
    inputLabel: "You provide", outputLabel: "You get", exampleLabel: "Try asking",
    note: "These are example tasks. Data analysis needs sample groups and an experimental design; required software is checked when the task runs.",
    gc: {
      h: "GeneCode · Molecular cloning", status: "● Integrated",
      p: "Open sequences and plasmid maps inside BioSeeki. Inspect features, primers, restriction sites and alignments, and work through a cloning plan.",
      input: "Your target sequence, vector file and cloning or validation goal.",
      output: "Candidate primers, a cloning plan and sequence files you can keep editing.",
      example: "Plan cloning for this vector and insert. Check the junctions and reading frame.",
      link: "Open GeneCode on the web ↗",
    },
    modes: [
      { id: "literature", icon: "i-search", h: "Literature search and evidence", input: "A research question, keywords or a set of papers to compare.", output: "A reading list, research overview and evidence comparison, with DOIs or original sources.", example: "Find recent work on R-loops and DNA damage. Compare the methods and conclusions." },
      { id: "reading", icon: "i-lang", h: "Bilingual paper reading", input: "An English paper PDF and the methods, figures or conclusions you want to understand.", output: "Original and translated pages side by side, with explanations of the figures and evidence.", example: "Open this paper in Chinese–English reading view. Explain what Figure 3 supports." },
      { id: "analysis", icon: "i-chart", h: "Bioinformatics and data analysis", input: "RNA-seq counts, proteomics results, qPCR or other tables, with sample groups.", output: "Result tables, statistical methods, analysis scripts and figures, with their conditions of use.", example: "Analyze these RNA-seq counts using the sample groups. Produce differential results and enrichment plots." },
      { id: "figures", icon: "i-figure", h: "Research figures and panels", input: "Data, analysis results or images, plus the layout and dimensions you need.", output: "Scatter plots, volcano plots, heatmaps or combined panels, with images and files for redrawing.", example: "Make a volcano plot and heatmap from these results. Use consistent fonts, legends and colours." },
      { id: "writing", icon: "i-doc", h: "Papers and research reports", input: "Background, methods, results and references, or an existing draft.", output: "Paper sections, project summaries or reviewer-response drafts, with sources and gaps to address.", example: "Draft the Results from these data. Separate supported findings from explanations that still need testing." },
      { id: "presentation", icon: "i-doc", h: "Lab-meeting slides and notes", input: "Papers, lab records or project results, plus your audience and time limit.", output: "An editable presentation, speaker notes and a figure-source list you can continue revising.", example: "Turn this paper into a 10-minute lab-meeting presentation in Chinese, with figure sources and speaker notes." },
      { id: "radar", icon: "i-globe", h: "Literature radar", input: "Research topics, search terms and a daily or weekly schedule.", output: "Deduplicated new papers and weekly digests, marking journal articles, preprints and search status.", example: "Follow new papers on R-loops and prepare a weekly update." },
      { id: "materials", icon: "i-memory", h: "Project imports and memory", input: "Lab records, project summaries, papers or exported work logs from another Agent.", output: "Searchable project materials; preview important context and next steps before choosing what to remember.", example: "Import these lab records into this project. Organize the findings, open questions and next steps." },
    ],
  },
  verify: {
    eyebrow: "Check results", title: "Get the result. Check how it was made.",
    lede: "Open the sources, inspect methods and scripts, and distinguish supported findings from interpretations that need testing.",
    cards: [
      { icon: "i-quote", h: "Back to the source", p: "Knowledge-base hits include file, page or paragraph locations for checking the original." },
      { icon: "i-shield", h: "Citation check-up", p: "Before you submit: DOIs, retractions, versions." },
      { icon: "i-redo", h: "Inspect the analysis", p: "Results and scripts are saved together, so you can check parameters and rerun the work." },
      { icon: "i-gap", h: "See the evidence limits", p: "Missing materials, sample limitations and open questions stay visible for your review." },
    ],
    reportAria: "Illustration: a citation check report", illustrative: "Illustrative", checking: "Checking", reportTitle: "Citation check report",
    report: [
      ["v-pass", "✓ Pass", "DOI resolves; title, authors and year match."],
      ["v-warn", "! Review", "A correction was issued — make sure you cite the corrected statement."],
      ["v-fail", "✗ Problem", "This DOI points to a different article — probably copied from the wrong line."],
      ["v-warn", "! Review", "The preprint has a published version — cite that instead."],
    ],
    reportFootL: "Search sources and check times recorded", reportFootR: "Review flagged entries in the original",
  },
  principles: {
    eyebrow: "Project materials & memory", title: "Continue the research you already have.",
    lede: "Import papers, Word lab records, project summaries or exported Agent conversations. Materials belong to a project; you choose the context and progress to keep in memory.",
    chain: {
      aria: "Illustration: the evidence chain from sources to your draft", title: "Evidence chain · illustrative",
      cols: ["Sources", "Knowledge-base fragments", "Your draft"],
      sources: ["PubMed", "Europe PMC", "UniProt", "Ensembl", "GEO", "Your PDFs & notes"],
      fragments: [
        ["zeb1-ferroptosis.pdf", "p. 4 · para. 12"],
        ["emt-review.pdf", "p. 9 · para. 3"],
        ["UniProt · P37275", "ZEB1 · human"],
      ],
      fragNote: "Sources retained · originals unchanged · rebuildable index",
      claims: [
        ["Mesenchymal-state tumour cells are more sensitive to ferroptosis inducers.", "[1] p. 4 · para. 12"],
        ["ZEB1 maintains the mesenchymal phenotype by repressing E-cadherin transcription.", "[2] p. 9 · para. 3"],
        ["ZEB1 is a zinc-finger transcription factor.", "[3] UniProt P37275"],
      ],
      gap: "⟦Gap: independent replicates after ZEB1 knockdown⟧",
      foot: "Find the source before drafting a claim. This illustrates source locations, not results from a real project.",
    },
    cards: [
      { num: "P·01 / MATERIALS", icon: "i-book", h: "Skip the repeated background", p: "Import existing lab records and summaries, then search, ask questions and continue in the same project." },
      { num: "P·02 / SOURCE", icon: "i-quote", h: "Keep the original evidence", p: "Memory supplies context; the knowledge base retains papers and records so you can check the wording." },
      { num: "P·03 / MEMORY", icon: "i-memory", h: "Choose what it remembers", p: "Preview memory candidates before importing. View, edit or revoke global and project memories separately." },
    ],
  },
  workflow: {
    eyebrow: "Example task", title: "What does one task deliver?",
    lede: "Take a lab-meeting presentation from qPCR data: provide the data and context, and connect the analysis, figures, report and slides.",
    case: {
      label: "Task request · example", question: "Here are this week's qPCR data and lab records. Check the data, make figures and prepare a 10-minute lab meeting, explaining the results and limitations.",
      meta: [["Inputs", "Ct table · sample groups · lab records"], ["Outputs saved in", "Your chosen project folder"]],
      stats: [["6", "steps"], ["1", "result table"], ["1", "analysis report"], ["1", "presentation"]],
      note: "These counts illustrate output types, not a real task log or a fixed delivery promise.",
    },
    confirmLabel: "You decide",
    steps: [
      { h: "Check the inputs", out: "Check sample groups, reference genes, replicates and missing values. Flag essential information that is absent." },
      { h: "Calculate the results", out: "Calculate ΔCt, ΔΔCt and expression changes when applicable, retaining the calculation table and script." },
      { h: "Make the figures", out: "Show individual samples, group changes and legends without turning missing values into zeros." },
      { h: "Explain the findings", out: "State methods, results and limitations. Do not label single-replicate descriptive differences as statistically significant." },
      { h: "Prepare the presentation", out: "Organize the question, methods, results and next steps into editable slides and speaker notes." },
      { h: "Deliver the files", out: "Open the result table, figures, report and presentation from the answer, then ask for revisions." },
    ],
    bounds: [
      { icon: "i-hand", h: "Ask for the next revision", p: "Say which figure or explanation to change, using the project's existing materials and outputs." },
      { icon: "i-lock", h: "Organize by project", p: "Search and save within the current project. Explicitly select materials from another project." },
      { icon: "i-redo", h: "Track tasks on the board", p: "Drag cards to update their status. Work starts when you choose to execute the task." },
      { icon: "i-gap", h: "Progress and review are separate", p: "A completed card helps track work; statistical claims and final figures still need review." },
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
    lede: "Install, sign in to your BioSeeki account and choose a project folder. No invite code or model API of your own is needed.",
    app: "BioSeeki for macOS", badge: "Mac Beta",
    specs: [["Chip", "Apple silicon (M1 / M2 / M3 / M4)"], ["System", "macOS 11 or later"], ["Windows", "In progress"]],
    note: "Intel Macs are not supported yet.",
    cta: "Download for Mac",
    soon: "The installer is being signed and notarized; the download opens shortly.",
    mailCta: "Get the installer by email ✉",
    legal: `Downloading and using it means you accept the <a href="/terms#english">Terms</a> and <a href="/privacy">Privacy Policy</a>. Questions: <a href="mailto:${MAIL}">${MAIL}</a>.`,
    stepsLabel: "Three steps",
    steps: [
      ["01", "Create an account", "Sign up without an invite code, or use your existing account."],
      ["02", "Install and sign in", "The app opens at sign-in. Your account connects the included models."],
      ["03", "Choose a project and task", "Select the folder with your materials, attach files and describe the output you need."],
    ],
    signUp: "Create account ↗",
    mailSubject: "BioSeeki installer request",
    mailBody: "Hi, I'd like to try BioSeeki.\n\nSign-up email:\nResearch area:\nMac chip (M1/M2/M3/M4):\nWhat I'd like to use it for:",
  },
  faq: {
    eyebrow: "FAQ", title: "Things you might want to know.",
    lede: `Didn't find your answer? <a href="mailto:${MAIL}" style="color:var(--sage-deep);font-weight:600">Write to us ✉</a>`,
    items: [
      { q: "What should I try first?", a: "Start with one concrete task: understand a paper, read it in bilingual view, analyze RNA-seq or proteomics results, organize qPCR data, redraw figures or make lab-meeting slides from a paper and lab records. Providing materials and an output goal helps you get a useful deliverable." },
      { q: "How is BioSeeki different from a general AI chatbot?", a: "It can read local project materials, search literature, run analyses and make figures and editable presentations. Outputs are saved in the project and can be revised. The knowledge base, memory, literature radar and task board help continue the same research project." },
      { q: "Can I import lab records and work from another Agent?", a: "Select a target project in Project materials, import files or a folder and review the import. PDF, Word, Markdown, text, tables and common JSON/JSONL conversation exports are supported. Choose important excerpts for project memory. Proprietary Agent formats may need to be exported as text first." },
      { q: "Does literature radar run when my computer is off?", a: "Scheduled updates currently depend on the app and local service running. Shutdown, sleep or quitting can cause missed runs; check again after resuming. Digests mark failed or incomplete searches. Radar is not an exhaustive systematic-review search." },
      { q: "Are my files uploaded?", a: "Project files stay on your computer. What goes to the model is only what you type, files you explicitly reference, and the fragments actually read to complete the current task — read on demand, never a whole folder. Private research content is not used to train BioSeeki's models." },
      { q: "Which systems are supported?", a: "The Mac Beta needs macOS 11 or later on Apple silicon (M series). Intel Macs aren't supported yet; a Windows version is in testing." },
      { q: "Do I need my own model API?", a: "No. Sign in to your BioSeeki account in the app to use the included models, without creating or entering an API key. Usage is counted in credits; view your allowance and subscriptions in your account." },
      { q: "Do I still need to check the results?", a: "Yes. Read the cited sources, inspect the methods and sample design, and review the final figures. Citation checks help verify DOIs, retractions and versions. AI can misread figures or choose unsuitable methods; it does not replace your scientific judgement." },
      { q: "What is GeneCode?", a: "GeneCode is BioSeeki's molecular-biology sequence workspace. Inspect plasmid maps, feature annotations, primers, restriction sites and alignments, and work on cloning plans. It can also be opened separately in the browser." },
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
  jsonLdDescription: "An AI workspace for life-science research: literature search, bilingual reading, bioinformatics, experimental data analysis, figures, writing, presentations, literature updates, project imports and GeneCode molecular cloning.",
};

export const COPY: Record<Lang, Copy> = { zh, en };
