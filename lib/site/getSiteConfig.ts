import fs from "node:fs/promises";
import path from "node:path";
import type { SiteConfig } from "@/lib/homepage/types";

const SITE_CONFIG_PATH = path.join(process.cwd(), "data", "site-config.json");

export async function getSiteConfig(): Promise<SiteConfig> {
  const raw = await fs.readFile(SITE_CONFIG_PATH, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "").trim()) as SiteConfig;
}
