import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Feed, ItemForAll } from "./fetch";
import { siteList } from "./list";

const DATA_DIR = resolve(process.cwd(), "data");

function loadFeed(param: string): Feed | undefined {
  try {
    return JSON.parse(readFileSync(resolve(DATA_DIR, `${param}.json`), "utf-8"));
  } catch {
    return undefined;
  }
}

export function collectFeeds(): Record<string, Feed> {
  const result: Record<string, Feed> = {};
  for (const site of siteList) {
    const feed = loadFeed(site.param);
    if (feed) result[site.param] = feed;
  }
  return result;
}

export function collectAllItems(): ItemForAll[] {
  const feeds = collectFeeds();
  return Object.values(feeds)
    .reduce<ItemForAll[]>(
      (pre, feed) =>
        pre.concat(feed.items.map<ItemForAll>((i) => ({ site: feed.title, ...i }))),
      [],
    )
    .sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1))
    .reduce<ItemForAll[]>((pre, cur, i) => {
      if (i === 0 || pre[pre.length - 1].link !== cur.link) {
        pre.push(cur);
      }
      return pre;
    }, []);
}
