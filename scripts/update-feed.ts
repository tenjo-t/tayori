import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchFeed } from "../src/feed/fetch.js";
import { siteList } from "../src/feed/list.js";
import type { Feed } from "../src/feed/fetch.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DATA_DIR = resolve(__dirname, "../data");

function loadFeed(param: string): Feed | undefined {
  try {
    return JSON.parse(readFileSync(resolve(DATA_DIR, `${param}.json`), "utf-8"));
  } catch {
    return undefined;
  }
}

function saveFeed(param: string, feed: Feed) {
  writeFileSync(resolve(DATA_DIR, `${param}.json`), JSON.stringify(feed, null, 2));
}

function mergeFeeds(existing: Feed, incoming: Feed): Feed {
  const incomingLinks = new Set(incoming.items.map((i) => i.link));
  const oldItems = existing.items
    .filter((i) => !incomingLinks.has(i.link))
    .map((i) => ({ ...i, contentSnippet: i.contentSnippet }));
  return {
    ...incoming,
    items: [...incoming.items, ...oldItems].sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1)),
  };
}

async function main() {
  for (const site of siteList) {
    console.log(`取得中: ${site.title}`);
    const incoming = await fetchFeed(site.rss, site.title, site.url, site.param);
    if (!incoming) continue;

    const existing = loadFeed(site.param);
    saveFeed(site.param, existing ? mergeFeeds(existing, incoming) : incoming);
  }

  console.log("data/ を更新しました");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
