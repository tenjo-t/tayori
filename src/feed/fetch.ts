import RSSParser from "rss-parser";

export type Item = {
  creator?: string;
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  param: string;
};

export type ItemForAll = {
  site: string;
} & Item;

export type Feed = {
  link: string;
  title: string;
  description?: string;
  items: Item[];
};

const cache = new Map<string, Feed>();

const rssParser = new RSSParser();

export async function fetchFeed(
  url: string,
  siteName: string,
  siteLink: string,
  param: string,
): Promise<Feed | undefined> {
  if (cache.has(url)) return cache.get(url);

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`${siteName}のデータを取得できませんでした`);
    return;
  }

  const parsed = await rssParser.parseString(await res.text());
  const items = parsed.items.map((i) => {
    return {
      creator: i.creator,
      title: i.title!,
      link: i.link!,
      pubDate: i.isoDate ?? new Date(i.pubDate ? i.pubDate : Date.now()).toISOString(),
      contentSnippet: (i.contentSnippet ?? i.summary)?.slice(0, 120),
      param,
    };
  });

  const feed = {
    link: parsed.link ?? siteLink,
    title: parsed.title ?? siteName,
    description: parsed.description,
    items,
  };

  cache.set(url, feed);

  return feed;
}
