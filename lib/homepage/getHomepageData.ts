import fs from "node:fs/promises";
import path from "node:path";
import type {
  FAQData,
  HomepageData,
  RecommendedGame,
  SiteConfig,
  TocItem
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "homepage-optimization");

async function loadJson<T>(file: string): Promise<T> {
  const filePath = path.join(DATA_DIR, file);
  const raw = await fs.readFile(filePath, "utf8");
  const sanitized = raw.replace(/^\uFEFF/, "").trim();
  return JSON.parse(sanitized) as T;
}

function extractToc(markdown: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingPattern = /<h2 id="([^"]+)">([^<]+)<\/h2>/g;
  let match: RegExpExecArray | null = headingPattern.exec(markdown);
  while (match) {
    toc.push({
      id: match[1],
      label: match[2]
    });
    match = headingPattern.exec(markdown);
  }
  return toc;
}

export async function getHomepageData(): Promise<HomepageData> {
  const [{ hero, stats }, recommended, faq, site, content] = await Promise.all([
    loadJson<{ hero: HomepageData["hero"]; stats: HomepageData["stats"] }>("stats.json"),
    loadJson<RecommendedGame[]>("recommended.json"),
    loadJson<FAQData>("faq.json"),
    (async () => {
      const raw = await fs.readFile(path.join(process.cwd(), "data", "site-config.json"), "utf8");
      return JSON.parse(raw.replace(/^\uFEFF/, "").trim()) as SiteConfig;
    })(),
    fs.readFile(path.join(DATA_DIR, "content.mdx"), "utf8")
  ]);

  return {
    hero,
    stats,
    recommended,
    faq,
    site,
    content,
    toc: extractToc(content)
  };
}
