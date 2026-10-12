import type { Lang } from "./bioseeki";

export type CapabilityDiagramKind = "literature" | "analysis" | "writing" | "cloning" | "materials";

export interface ShowcaseView {
  id: string;
  label: string;
  kind: "diagram";
  diagram: CapabilityDiagramKind;
  variant: string;
  alt: string;
  caption: string;
}

export interface ShowcaseCapability {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  outputs: string[];
  input: string;
  views: ShowcaseView[];
}

interface ShowcaseCopy {
  eyebrow: string;
  heading: string;
  intro: string;
  tablist: string;
  inputLabel: string;
  outputLabel: string;
  enlarge: string;
  close: string;
  imageDialog: string;
  previewLabel: string;
  capabilities: ShowcaseCapability[];
}

const zh: ShowcaseCopy = {
  eyebrow: "科研能力",
  heading: "BioSeeki 能帮你做什么？",
  intro: "选一个场景，看看材料怎样变成可以继续使用的成果。",
  tablist: "选择科研场景",
  inputLabel: "试着这样说",
  outputLabel: "交付形式",
  enlarge: "查看大图",
  close: "关闭大图",
  imageDialog: "预览大图",
  previewLabel: "切换成果预览",
  capabilities: [
    {
      id: "literature", label: "文献与精读", icon: "i-book",
      title: "读懂论文，回到证据。",
      description: "检索、双语精读，保留原文位置与引用来源。",
      outputs: ["文献清单", "对照译文", "来源定位"],
      input: "找出这篇论文中支持核心结论的实验，解释图表并标出原文位置。",
      views: [{ id: "reading", label: "对照精读", kind: "diagram", diagram: "literature", variant: "reading", alt: "论文段落对应原文和译文，并保留引用来源的能力示意", caption: "能力示意 · 从论文段落回到原文与引用来源" }],
    },
    {
      id: "analysis", label: "数据与绘图", icon: "i-chart",
      title: "数据进来，图表出来。",
      description: "结合分组做分析，交付图表、结果表与可复核的脚本。",
      outputs: ["结果表与脚本", "统计图表", "可重绘文件"],
      input: "按这个分组分析数据，画火山图、热图和 PCA，并说明分析条件。",
      views: [
        { id: "volcano", label: "火山图", kind: "diagram", diagram: "analysis", variant: "volcano", alt: "数据表与样本分组转为火山图的矢量能力示意", caption: "能力示意 · 点位与颜色仅用于展示图表形式" },
        { id: "heatmap", label: "热图", kind: "diagram", diagram: "analysis", variant: "heatmap", alt: "数据表与样本分组转为热图的矢量能力示意", caption: "能力示意 · 色块仅用于展示图表形式" },
        { id: "pca", label: "PCA", kind: "diagram", diagram: "analysis", variant: "pca", alt: "数据表与样本分组转为 PCA 图的矢量能力示意", caption: "能力示意 · 点位仅用于展示图表形式" },
      ],
    },
    {
      id: "writing", label: "论文与 PPT", icon: "i-doc",
      title: "从研究大纲，到稿件与汇报。",
      description: "依据已有材料，起草论文段落、PPT 与逐页讲稿。",
      outputs: ["论文与报告草稿", "可编辑 PPT", "讲稿与图源"],
      input: "把这份分析结果做成 10 分钟组会汇报，再起草一段 Results。",
      views: [
        { id: "slides", label: "汇报 PPT", kind: "diagram", diagram: "writing", variant: "slides", alt: "研究大纲转为 PPT 页面与讲稿的能力示意", caption: "能力示意 · 展示大纲、幻灯片与讲稿的对应关系" },
        { id: "report", label: "论文段落", kind: "diagram", diagram: "writing", variant: "report", alt: "研究大纲转为论文段落与引用标记的能力示意", caption: "能力示意 · 展示稿件结构，不代表研究结论" },
      ],
    },
    {
      id: "cloning", label: "分子克隆", icon: "i-figure",
      title: "看清序列与克隆设计。",
      description: "查看质粒、序列与翻译，核对酶切、连接位置和阅读框。",
      outputs: ["候选引物", "克隆设计", "可编辑序列"],
      input: "用这个载体和插入序列设计克隆方案，检查连接位置与阅读框。",
      views: [
        { id: "map", label: "质粒图谱", kind: "diagram", diagram: "cloning", variant: "map", alt: "质粒环图、示例特征与酶切位点的能力示意", caption: "能力示意 · 通用载体与特征，不对应具体质粒" },
        { id: "sequence", label: "序列与翻译", kind: "diagram", diagram: "cloning", variant: "sequence", alt: "短 DNA 序列、对应氨基酸与 EcoRI 识别位点的能力示意", caption: "能力示意 · 短序列仅展示阅读框与识别位点" },
      ],
    },
    {
      id: "materials", label: "资料与跟进", icon: "i-memory",
      title: "资料归档，研究接着走。",
      description: "导入与检索课题资料，整理待办，跟进新文献。",
      outputs: ["课题知识库", "待办与研究背景", "文献更新"],
      input: "导入这些课题资料，整理未解决的问题，每周跟进相关新文献。",
      views: [{ id: "materials", label: "资料与更新", kind: "diagram", diagram: "materials", variant: "archive", alt: "论文与记录归档为课题知识库，并连接待办与文献更新的能力示意", caption: "能力示意 · 课题资料、待办与文献更新保持关联" }],
    },
  ],
};

const en: ShowcaseCopy = {
  eyebrow: "RESEARCH CAPABILITIES",
  heading: "What can BioSeeki help you do?",
  intro: "Choose a research task. See how your materials become usable work.",
  tablist: "Choose a research task",
  inputLabel: "Try asking",
  outputLabel: "Deliverables",
  enlarge: "View full size",
  close: "Close preview",
  imageDialog: "Full-size preview",
  previewLabel: "Choose a deliverable preview",
  capabilities: [
    {
      id: "literature", label: "Literature & reading", icon: "i-book",
      title: "Read the paper. Return to the evidence.",
      description: "Search, read in two languages, and keep the original passages and sources.",
      outputs: ["Literature lists", "Bilingual reading", "Source locations"],
      input: "Find the experiments behind this paper’s main claim, explain the figures, and locate the evidence in the original.",
      views: [{ id: "reading", label: "Bilingual reading", kind: "diagram", diagram: "literature", variant: "reading", alt: "Capability illustration connecting paper passages, original text, translation, and citation sources", caption: "Capability illustration · Paper passages stay connected to their sources" }],
    },
    {
      id: "analysis", label: "Data & figures", icon: "i-chart",
      title: "Data in. Figures out.",
      description: "Analyze by sample group. Keep the figures, result tables, and scripts together.",
      outputs: ["Results & scripts", "Statistical figures", "Replotting files"],
      input: "Analyze this dataset by sample group. Create a volcano plot, heatmap, and PCA, and explain the analysis conditions.",
      views: [
        { id: "volcano", label: "Volcano plot", kind: "diagram", diagram: "analysis", variant: "volcano", alt: "Vector capability illustration of a data table and sample groups becoming a volcano plot", caption: "Capability illustration · Points and colors show the figure format only" },
        { id: "heatmap", label: "Heatmap", kind: "diagram", diagram: "analysis", variant: "heatmap", alt: "Vector capability illustration of a data table and sample groups becoming a heatmap", caption: "Capability illustration · Color blocks show the figure format only" },
        { id: "pca", label: "PCA", kind: "diagram", diagram: "analysis", variant: "pca", alt: "Vector capability illustration of a data table and sample groups becoming a PCA plot", caption: "Capability illustration · Points show the figure format only" },
      ],
    },
    {
      id: "writing", label: "Papers & slides", icon: "i-doc",
      title: "From research outline to papers and slides.",
      description: "Draft manuscript passages, presentation slides, and speaker notes from your materials.",
      outputs: ["Manuscript drafts", "Editable slides", "Notes & sources"],
      input: "Turn these results into a 10-minute lab-meeting presentation, then draft a Results paragraph.",
      views: [
        { id: "slides", label: "Presentation", kind: "diagram", diagram: "writing", variant: "slides", alt: "Capability illustration of a research outline becoming slides and speaker notes", caption: "Capability illustration · An outline connects to slides and speaker notes" },
        { id: "report", label: "Manuscript", kind: "diagram", diagram: "writing", variant: "report", alt: "Capability illustration of a research outline becoming manuscript passages with citation markers", caption: "Capability illustration · Manuscript structure, not research findings" },
      ],
    },
    {
      id: "cloning", label: "Molecular cloning", icon: "i-figure",
      title: "See the sequence and the cloning design.",
      description: "Explore plasmids and translation. Check restriction sites, junctions, and reading frames.",
      outputs: ["Candidate primers", "Cloning designs", "Editable sequences"],
      input: "Design a cloning strategy with this vector and insert. Check the junctions and reading frame.",
      views: [
        { id: "map", label: "Plasmid map", kind: "diagram", diagram: "cloning", variant: "map", alt: "Capability illustration of a circular plasmid map, generic features, and restriction sites", caption: "Capability illustration · A generic vector, not a specific plasmid" },
        { id: "sequence", label: "Sequence & translation", kind: "diagram", diagram: "cloning", variant: "sequence", alt: "Capability illustration of a short DNA sequence, amino-acid translation, and EcoRI recognition site", caption: "Capability illustration · A short sequence shows the reading frame and recognition site" },
      ],
    },
    {
      id: "materials", label: "Materials & updates", icon: "i-memory",
      title: "Keep the materials. Keep moving.",
      description: "Import and search project materials, organize tasks, and follow new literature.",
      outputs: ["Project knowledge", "Context & tasks", "Literature updates"],
      input: "Import these project materials, organize the open questions, and follow relevant new papers each week.",
      views: [{ id: "materials", label: "Materials & updates", kind: "diagram", diagram: "materials", variant: "archive", alt: "Capability illustration connecting archived papers and records to project knowledge, tasks, and literature updates", caption: "Capability illustration · Project materials, tasks, and literature updates stay connected" }],
    },
  ],
};

export const SHOWCASE_COPY: Record<Lang, ShowcaseCopy> = { zh, en };

const diagramZh = {
  illustration: "能力示意",
  disclaimer: "结构与点位仅示意，不含真实课题结果",
  literature: {
    input: "论文与问题", output: "对照精读与来源", paper: "研究论文", section: "方法 / 图表 / 结论",
    original: "原文", translation: "译文", originalText: "The method compares the sample groups.", translatedText: "该方法比较不同的样本分组。",
    evidence: "回到引用来源", location: "原始文件 · 页码 · 段落", source: "paper.pdf", ask: "这段话依据什么？", quote: "原文段落", link: "来源定位",
  },
  analysis: {
    input: "数据与分组", output: "分析与绘图", table: "数据表", grouping: "样本分组", samples: ["A1", "A2", "B1", "B2"], rows: ["条目 A", "条目 B", "条目 C", "条目 D"],
    groups: ["分组 A", "分组 B"], volcano: "火山图", heatmap: "热图", pca: "PCA", axisX: "变化幅度", axisY: "统计证据", export: "图表 + 结果表 + 脚本", chartNote: "图表形式示意",
  },
  writing: {
    input: "材料与研究大纲", output: "稿件与汇报", outline: "研究大纲", sections: ["研究背景", "方法与设计", "结果与证据"], slides: "组会 PPT", report: "论文段落", title: "研究问题与证据", chart: "图表与图源", notes: "逐页讲稿", citations: "引用与来源", paragraph: "依据实验设计整理结果，区分已有观察与仍待验证的解释。", slidePoint: "方法 · 结果 · 下一步",
  },
  cloning: {
    input: "载体与目标序列", output: "图谱与设计核对", map: "质粒图谱", vector: "通用载体", featureA: "特征 A", featureB: "特征 B", sequence: "序列与翻译", dna: "DNA", amino: "氨基酸", motif: "酶切识别位点", frame: "短序列 · 阅读框示意", checks: ["连接位置", "阅读框", "候选引物"], insert: "插入序列",
  },
  materials: {
    input: "已有课题资料", output: "课题整理与跟进", files: ["论文 PDF", "实验记录", "课题总结"], archive: "课题知识库", source: "资料与来源一起保留", tasks: "研究待办", taskItems: ["核对已有结果", "整理待解决问题", "规划下一步"], updates: "文献更新", updateItems: ["关键词检索", "去重与来源", "更新摘要"],
  },
};

const diagramEn: typeof diagramZh = {
  illustration: "Capability illustration",
  disclaimer: "Shapes and points are illustrative, without real research findings",
  literature: {
    input: "Papers & questions", output: "Reading & sources", paper: "Research paper", section: "Methods / figures / conclusions",
    original: "Original", translation: "Translation", originalText: "The method compares the sample groups.", translatedText: "该方法比较不同的样本分组。",
    evidence: "Return to the source", location: "Original file · page · passage", source: "paper.pdf", ask: "What supports this passage?", quote: "Original passage", link: "Source location",
  },
  analysis: {
    input: "Data & sample groups", output: "Analysis & figures", table: "Data table", grouping: "Sample groups", samples: ["A1", "A2", "B1", "B2"], rows: ["Item A", "Item B", "Item C", "Item D"],
    groups: ["Group A", "Group B"], volcano: "Volcano plot", heatmap: "Heatmap", pca: "PCA", axisX: "Effect size", axisY: "Statistical evidence", export: "Figures + result tables + scripts", chartNote: "Illustrative figure format",
  },
  writing: {
    input: "Materials & outline", output: "Papers & presentations", outline: "Research outline", sections: ["Background", "Methods & design", "Results & evidence"], slides: "Lab-meeting slides", report: "Manuscript passage", title: "The question and its evidence", chart: "Figures & sources", notes: "Speaker notes", citations: "Citations & sources", paragraph: "Interpret results within the study design. Separate observations from explanations that still need validation.", slidePoint: "Methods · results · next steps",
  },
  cloning: {
    input: "Vector & target sequence", output: "Maps & design checks", map: "Plasmid map", vector: "Generic vector", featureA: "Feature A", featureB: "Feature B", sequence: "Sequence & translation", dna: "DNA", amino: "Amino acids", motif: "Restriction site", frame: "Short sequence · illustrative frame", checks: ["Junctions", "Reading frame", "Candidate primers"], insert: "Insert sequence",
  },
  materials: {
    input: "Project materials", output: "Organization & updates", files: ["Paper PDFs", "Experiment records", "Project summaries"], archive: "Project knowledge", source: "Materials stay with their sources", tasks: "Research tasks", taskItems: ["Review existing results", "Organize open questions", "Plan the next step"], updates: "Literature updates", updateItems: ["Keyword search", "Deduplication & sources", "Update summary"],
  },
};

export const CAPABILITY_DIAGRAM_COPY: Record<Lang, typeof diagramZh> = { zh: diagramZh, en: diagramEn };
