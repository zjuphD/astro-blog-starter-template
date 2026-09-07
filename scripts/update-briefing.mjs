import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../src/data/briefings.json");
const existing = JSON.parse(await fs.readFile(outputPath, "utf8"));

const DAY = 24 * 60 * 60 * 1000;
const now = new Date();
const from = new Date(now.getTime() - 3 * DAY);
const iso = (d) => d.toISOString().slice(0, 10);

const query = `FIRST_PDATE:[${iso(from)} TO ${iso(now)}] AND (TITLE_ABS:(cancer OR tumor OR oncology OR precision medicine OR immunotherapy OR genomics OR single-cell OR proteomics OR protein design OR drug discovery) AND TITLE_ABS:(artificial intelligence OR machine learning OR deep learning OR foundation model OR generative OR computational))`;
const endpoint = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
endpoint.searchParams.set("query", query);
endpoint.searchParams.set("format", "json");
endpoint.searchParams.set("resultType", "core");
endpoint.searchParams.set("pageSize", "60");
endpoint.searchParams.set("sort_date", "y");

const response = await fetch(endpoint, { headers: { "User-Agent": "Aiseeki-Briefing/1.0" } });
if (!response.ok) throw new Error(`Europe PMC request failed: ${response.status}`);
const payload = await response.json();
const papers = payload?.resultList?.result ?? [];

const categoryRules = [
  ["AI 药物发现", /drug discovery|molecule|compound|screening|binding|ligand|therapeutic design/i],
  ["精准医疗", /precision medicine|biomarker|patient stratification|clinical|therapy response|immunotherapy|prognostic/i],
  ["肿瘤生物学", /cancer|tumou?r|oncology|metast|ferropt|apopt|microenvironment/i],
  ["基因组与单细胞", /genom|transcript|single[- ]cell|spatial|multi[- ]omics|rna-seq/i],
  ["蛋白质与结构生物学", /protein|structure|proteom|fold|antibody|enzyme/i],
];
const classify = (text) => categoryRules.find(([, rx]) => rx.test(text))?.[0] ?? "AI for Science";

const journalBoost = /Nature|Science|Cell|Cancer|Lancet|NEJM|JAMA/i;
const aiRx = /artificial intelligence|machine learning|deep learning|foundation model|generative|transformer|large language model/i;
const translationalRx = /clinical|patient|trial|drug|therapy|response|biomarker|target/i;
const noveltyRx = /foundation model|generative|agent|multimodal|single-cell|spatial|protein design/i;

function scorePaper(paper, text) {
  let score = 68;
  if (journalBoost.test(paper.journalTitle ?? "")) score += 8;
  if (aiRx.test(text)) score += 7;
  if (translationalRx.test(text)) score += 7;
  if (noveltyRx.test(text)) score += 5;
  if (paper.isOpenAccess === "Y") score += 2;
  return Math.min(98, score);
}

function clean(value = "") {
  return String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function summarizeWithAI(item) {
  const url = process.env.BRIEFING_AI_URL;
  const key = process.env.BRIEFING_AI_KEY;
  const model = process.env.BRIEFING_AI_MODEL;
  if (!url || !key || !model) return null;

  const prompt = `你是 Aiseeki AI for Science 快讯编辑。只能根据给定标题与摘要，不得添加摘要中不存在的结果。输出严格 JSON，字段为 titleZh、summary、whyItMatters。titleZh 是准确自然的中文标题；summary 80-140 字；whyItMatters 50-100 字，强调科研意义并避免夸大。\n\n标题：${item.titleOriginal}\n来源：${item.source}\n摘要：${item.abstract}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "你负责严谨、可追溯的生物医学科研快讯，不把相关性写成因果，不把动物或体外结果写成人体疗效。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;
  try { return JSON.parse(content); } catch { return null; }
}

const seen = new Set();
const candidates = papers
  .map((paper) => {
    const title = clean(paper.title);
    const abstract = clean(paper.abstractText);
    const text = `${title} ${abstract}`;
    const doi = clean(paper.doi);
    const pmid = clean(paper.pmid);
    const key = doi || pmid || title.toLowerCase();
    if (!title || seen.has(key)) return null;
    seen.add(key);
    return {
      key,
      titleOriginal: title,
      abstract,
      source: clean(paper.journalTitle) || "Europe PMC",
      publishedAt: clean(paper.firstPublicationDate || paper.firstIndexDate || iso(now)).slice(0, 10),
      category: classify(text),
      sourceType: "新近论文",
      score: scorePaper(paper, text),
      originalUrl: doi ? `https://doi.org/${doi}` : pmid ? `https://europepmc.org/article/MED/${pmid}` : "https://europepmc.org/",
      tags: [...new Set([
        aiRx.test(text) ? "AI" : null,
        /immunotherapy/i.test(text) ? "免疫治疗" : null,
        /single[- ]cell|spatial/i.test(text) ? "单细胞/空间组学" : null,
        /protein|structure/i.test(text) ? "蛋白/结构" : null,
        /drug|molecule|compound/i.test(text) ? "药物发现" : null,
      ].filter(Boolean))].slice(0, 4),
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.score - a.score)
  .slice(0, 12);

const generated = [];
for (const item of candidates) {
  const ai = await summarizeWithAI(item);
  const fallbackSummary = item.abstract
    ? `${item.abstract.slice(0, 260)}${item.abstract.length > 260 ? "…" : ""}`
    : "该研究近日被 Europe PMC 收录，涉及 AI 与生物医学研究的交叉应用；建议结合原文方法、数据规模和验证方式判断证据强度。";
  generated.push({
    id: `${item.publishedAt}-${item.key.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 48)}`,
    manual: false,
    publishedAt: item.publishedAt,
    category: item.category,
    source: item.source,
    sourceType: item.sourceType,
    titleZh: ai?.titleZh || item.titleOriginal,
    titleOriginal: item.titleOriginal,
    summary: ai?.summary || fallbackSummary,
    whyItMatters: ai?.whyItMatters || `这是一项与${item.category}高度相关的新近研究。自动摘要未启用时，Aiseeki 保留原始摘要片段，建议在引用或据此设计实验前核对全文。`,
    score: item.score,
    tags: item.tags.length ? item.tags : [item.category],
    originalUrl: item.originalUrl,
  });
}

const keepManualAfter = new Date(now.getTime() - 120 * DAY).toISOString().slice(0, 10);
const preserved = existing.filter((item) => item.manual && item.publishedAt >= keepManualAfter);
const merged = [...generated, ...preserved];
const deduped = [];
const ids = new Set();
const urls = new Set();
for (const item of merged.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.score - a.score)) {
  if (ids.has(item.id) || urls.has(item.originalUrl)) continue;
  ids.add(item.id); urls.add(item.originalUrl); deduped.push(item);
}

await fs.writeFile(outputPath, `${JSON.stringify(deduped.slice(0, 40), null, 2)}\n`, "utf8");
console.log(`Aiseeki briefing updated: ${generated.length} generated + ${preserved.length} curated items.`);
