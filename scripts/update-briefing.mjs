import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../src/data/briefings.json");
const existing = JSON.parse(await fs.readFile(outputPath, "utf8"));

const DAY = 24 * 60 * 60 * 1000;
const now = new Date();
const LOOKBACK_DAYS = 5;
const HISTORY_DAYS = 21;
const MAX_DAILY = 8;
const MIN_RULE_SCORE = 74;
const from = new Date(now.getTime() - LOOKBACK_DAYS * DAY);
const iso = (d) => d.toISOString().slice(0, 10);

const aiConfigured = Boolean(
  process.env.BRIEFING_AI_URL &&
  process.env.BRIEFING_AI_KEY &&
  process.env.BRIEFING_AI_MODEL,
);

const query = `FIRST_PDATE:[${iso(from)} TO ${iso(now)}] AND TITLE_ABS:(cancer OR tumor OR oncology OR immunotherapy OR precision medicine OR genomics OR transcriptomics OR single-cell OR spatial OR proteomics OR protein OR drug discovery OR therapeutic OR biomarker OR biomedical OR biology) AND TITLE_ABS:(artificial intelligence OR machine learning OR deep learning OR foundation model OR generative AI OR large language model OR transformer)`;
const endpoint = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
endpoint.searchParams.set("query", query);
endpoint.searchParams.set("format", "json");
endpoint.searchParams.set("resultType", "core");
endpoint.searchParams.set("pageSize", "100");
endpoint.searchParams.set("sort_date", "y");

const response = await fetch(endpoint, {
  headers: { "User-Agent": "Aiseeki-Briefing/2.0" },
});
if (!response.ok) throw new Error(`Europe PMC request failed: ${response.status}`);
const payload = await response.json();
const papers = payload?.resultList?.result ?? [];

const aiRx = /artificial intelligence|machine learning|deep learning|foundation model|generative ai|large language model|\bllm\b|transformer|neural network/i;
const lifeRx = /cancer|tumou?r|oncology|immunotherapy|precision medicine|genom|transcript|single[- ]cell|spatial|multi[- ]omics|proteom|protein|drug discovery|therapeutic|biomarker|biomedical|biology|gene|cell|disease|clinical|patient|pathology|pharmacology|antibody/i;
const translationalRx = /clinical|patient|trial|drug|therapy|therapeutic|response|biomarker|diagnos|prognos|target/i;
const noveltyRx = /foundation model|generative ai|agent|multimodal|single[- ]cell|spatial|protein design|digital twin|large language model|\bllm\b/i;
const primaryResearchRx = /we (develop|present|introduce|demonstrate|report|show)|randomized|prospective|retrospective|cohort|dataset|benchmark|validation|experiment|screening|assay/i;
const reviewRx = /review|systematic review|meta-analysis|perspective|overview/i;
const bibliometricRx = /bibliometric|scientometric|topic model(l)?ing analysis|mapping the evolution|publication trends/i;
const lowValueTypeRx = /editorial|commentary|letter to the editor|conference abstract|corrigendum|erratum/i;
const preprintRx = /bioRxiv|medRxiv|Research Square|Preprints|10\.21203\/rs\.|10\.20944\/preprints/i;

const categoryRules = [
  ["AI 药物发现", /drug discovery|molecule|compound|screening|binding|ligand|therapeutic design|degrader|induced proximity|virtual screening/i],
  ["精准医疗", /precision medicine|biomarker|patient stratification|clinical|therapy response|immunotherapy|prognostic|diagnostic/i],
  ["肿瘤生物学", /cancer|tumou?r|oncology|metast|ferropt|apopt|microenvironment/i],
  ["基因组与单细胞", /genom|transcript|single[- ]cell|spatial|multi[- ]omics|rna-seq|atac-seq/i],
  ["蛋白质与结构生物学", /protein|structure|proteom|fold|antibody|enzyme|protein design/i],
];

const eliteJournalRx = /Nature Medicine|Nature Biotechnology|Nature Cancer|Nature Methods|Nature Genetics|Nature Communications|Cell|Cancer Cell|Cancer Discovery|Science Translational Medicine|Science Advances|The Lancet|NEJM|JAMA/i;
const strongJournalRx = /Nature|Science|Cell Reports|Genome Biology|Nucleic Acids Research|PNAS|Clinical Cancer Research|Bioinformatics|Briefings in Bioinformatics|Drug Discovery Today/i;

function clean(value = "") {
  return String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function classify(text) {
  return categoryRules.find(([, rx]) => rx.test(text))?.[0] ?? "AI for Science";
}

function detectSourceType(paper, text) {
  const source = `${paper.journalTitle ?? ""} ${paper.publisher ?? ""} ${paper.doi ?? ""}`;
  if (preprintRx.test(source)) return "预印本";
  if (/phase\s*[1-4iIvV]+|randomized|clinical trial/i.test(text)) return "临床研究";
  if (reviewRx.test(text)) return "综述";
  if (/method|framework|model|benchmark|pipeline|algorithm|platform/i.test(text)) return "方法/模型";
  return "研究论文";
}

function scorePaper(paper, title, abstract, text, sourceType) {
  let score = 45;

  if (aiRx.test(title)) score += 14;
  else if (aiRx.test(abstract)) score += 8;

  if (lifeRx.test(title)) score += 10;
  else if (lifeRx.test(abstract)) score += 5;

  if (eliteJournalRx.test(paper.journalTitle ?? "")) score += 14;
  else if (strongJournalRx.test(paper.journalTitle ?? "")) score += 8;

  if (noveltyRx.test(text)) score += 8;
  if (translationalRx.test(text)) score += 6;
  if (primaryResearchRx.test(text)) score += 5;
  if (paper.isOpenAccess === "Y") score += 1;

  if (sourceType === "综述") score -= 7;
  if (sourceType === "预印本") score -= 4;
  if (!abstract || abstract.length < 120) score -= 6;

  return Math.max(0, Math.min(98, score));
}

function hardReject(title, abstract, text) {
  if (!title) return true;
  if (!aiRx.test(text) || !lifeRx.test(text)) return true;
  if (bibliometricRx.test(title)) return true;
  if (lowValueTypeRx.test(title)) return true;
  if (/marine antimicrobial peptides|seaweed/i.test(title) && !aiRx.test(title)) return true;
  if (abstract && abstract.length < 80 && !eliteJournalRx.test(text)) return true;
  return false;
}

async function editWithAI(item) {
  if (!aiConfigured) return null;

  const prompt = `你是 Aiseeki Daily 的生命科学科研编辑。你只能依据给定标题、摘要、期刊与证据类型判断，不得补充未提供的结果。\n\n请输出严格 JSON：\n{\n  "publish": true/false,\n  "editorialScore": 0-100,\n  "titleZh": "准确自然的中文标题",\n  "summary": "80-140 字中文摘要",\n  "whyItMatters": "50-100 字，说明为什么值得生命科学研究者关注",\n  "reason": "一句话说明入选或淘汰理由"\n}\n\n筛选标准：\n1. 必须同时与生命科学和 AI/计算方法强相关；\n2. 优先原创研究、临床转化、重要方法或模型；\n3. 泛综述、bibliometric、仅把 AI 当背景词、弱相关内容应淘汰；\n4. 不把动物/体外结果写成人体疗效，不把相关性写成因果；\n5. preprint 可以入选，但应更谨慎。\n\n标题：${item.titleOriginal}\n期刊：${item.source}\n证据类型：${item.sourceType}\n规则评分：${item.ruleScore}\n摘要：${item.abstract}`;

  try {
    const r = await fetch(process.env.BRIEFING_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BRIEFING_AI_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.BRIEFING_AI_MODEL,
        messages: [
          {
            role: "system",
            content: "你负责严谨、保守、可追溯的生命科学科研快讯编辑。宁可少选，不要为了凑数保留弱相关内容。",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    return {
      publish: parsed.publish !== false,
      editorialScore: Number.isFinite(Number(parsed.editorialScore))
        ? Math.max(0, Math.min(100, Number(parsed.editorialScore)))
        : item.ruleScore,
      titleZh: clean(parsed.titleZh) || item.titleOriginal,
      summary: clean(parsed.summary),
      whyItMatters: clean(parsed.whyItMatters),
      reason: clean(parsed.reason),
    };
  } catch {
    return null;
  }
}

const seen = new Set();
const pool = papers
  .map((paper) => {
    const title = clean(paper.title);
    const abstract = clean(paper.abstractText);
    const text = `${title} ${abstract}`;
    const doi = clean(paper.doi);
    const pmid = clean(paper.pmid);
    const key = doi || pmid || title.toLowerCase();
    if (!title || seen.has(key)) return null;
    seen.add(key);
    if (hardReject(title, abstract, text)) return null;

    const sourceType = detectSourceType(paper, text);
    const ruleScore = scorePaper(paper, title, abstract, text, sourceType);
    if (ruleScore < MIN_RULE_SCORE) return null;

    return {
      key,
      titleOriginal: title,
      abstract,
      source: clean(paper.journalTitle) || "Europe PMC",
      publishedAt: clean(
        paper.firstPublicationDate || paper.firstIndexDate || iso(now),
      ).slice(0, 10),
      category: classify(text),
      sourceType,
      ruleScore,
      originalUrl: doi
        ? `https://doi.org/${doi}`
        : pmid
          ? `https://europepmc.org/article/MED/${pmid}`
          : "https://europepmc.org/",
      tags: [
        aiRx.test(text) ? "AI" : null,
        /immunotherapy/i.test(text) ? "免疫治疗" : null,
        /single[- ]cell|spatial/i.test(text) ? "单细胞/空间组学" : null,
        /protein|structure/i.test(text) ? "蛋白/结构" : null,
        /drug|molecule|compound|therapeutic/i.test(text) ? "药物发现" : null,
      ].filter(Boolean),
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.ruleScore - a.ruleScore)
  .slice(0, 18);

const edited = [];
for (const item of pool) {
  const ai = await editWithAI(item);
  if (ai && !ai.publish) continue;

  const finalScore = ai
    ? Math.round(item.ruleScore * 0.7 + ai.editorialScore * 0.3)
    : item.ruleScore;

  const fallbackSummary = item.abstract
    ? `${item.abstract.slice(0, 240)}${item.abstract.length > 240 ? "…" : ""}`
    : "该研究近日被 Europe PMC 收录，涉及 AI 与生命科学的交叉应用；建议结合原文方法、数据规模与验证方式判断证据强度。";

  edited.push({
    id: `${item.publishedAt}-${item.key.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 48)}`,
    manual: false,
    publishedAt: item.publishedAt,
    category: item.category,
    source: item.source,
    sourceType: item.sourceType,
    titleZh: ai?.titleZh || item.titleOriginal,
    titleOriginal: item.titleOriginal,
    summary: ai?.summary || fallbackSummary,
    whyItMatters:
      ai?.whyItMatters ||
      `这是一项与${item.category}直接相关的新近研究。当前未启用 AI 编辑，因此保留原始摘要片段；正式引用或据此设计实验前请核对原文。`,
    score: finalScore,
    tags: [...new Set(item.tags.length ? item.tags : [item.category])].slice(0, 4),
    originalUrl: item.originalUrl,
    editorialMode: ai ? "ai" : "rules",
    editorialReason: ai?.reason || "通过 V2 规则筛选与多维评分。",
  });
}

function selectDiverse(items) {
  const selected = [];
  const categoryCount = new Map();
  const sourceTypeCount = new Map();
  const sourceCount = new Map();

  for (const item of items.sort((a, b) => b.score - a.score)) {
    if (selected.length >= MAX_DAILY) break;

    const categoryN = categoryCount.get(item.category) ?? 0;
    const typeN = sourceTypeCount.get(item.sourceType) ?? 0;
    const sourceN = sourceCount.get(item.source) ?? 0;

    if (categoryN >= 2) continue;
    if (item.sourceType === "综述" && typeN >= 1) continue;
    if (item.sourceType === "预印本" && typeN >= 2) continue;
    if (sourceN >= 2) continue;

    selected.push(item);
    categoryCount.set(item.category, categoryN + 1);
    sourceTypeCount.set(item.sourceType, typeN + 1);
    sourceCount.set(item.source, sourceN + 1);
  }

  return selected;
}

const generated = selectDiverse(edited);

const keepManualAfter = new Date(now.getTime() - 120 * DAY).toISOString().slice(0, 10);
const keepAutoAfter = new Date(now.getTime() - HISTORY_DAYS * DAY).toISOString().slice(0, 10);
const preservedManual = existing.filter(
  (item) => item.manual && item.publishedAt >= keepManualAfter,
);
const preservedAuto = existing.filter(
  (item) => !item.manual && item.publishedAt >= keepAutoAfter,
);

const merged = [...generated, ...preservedAuto, ...preservedManual];
const deduped = [];
const ids = new Set();
const urls = new Set();
for (const item of merged.sort(
  (a, b) =>
    b.publishedAt.localeCompare(a.publishedAt) ||
    Number(b.score ?? 0) - Number(a.score ?? 0),
)) {
  if (ids.has(item.id) || urls.has(item.originalUrl)) continue;
  ids.add(item.id);
  urls.add(item.originalUrl);
  deduped.push(item);
}

await fs.writeFile(
  outputPath,
  `${JSON.stringify(deduped.slice(0, 60), null, 2)}\n`,
  "utf8",
);

console.log(
  `Aiseeki Daily V2: ${papers.length} fetched -> ${pool.length} rule-qualified -> ${generated.length} selected; AI editor ${aiConfigured ? "enabled" : "disabled"}.`,
);
