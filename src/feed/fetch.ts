import type { SiteInfo } from "./list";

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
		i;
		return {
			creator: i.creator,
			// biome-ignore lint/style/noNonNullAssertion: 無いと困る
			title: i.title!,
			// biome-ignore lint/style/noNonNullAssertion: 無いと困る
			link: i.link!,
			pubDate:
				i.isoDate ?? new Date(i.pubDate ? i.pubDate : Date.now()).toISOString(),
			contentSnippet: i.contentSnippet ?? i.summary,
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

export async function collectFeeds(
	list: SiteInfo[],
): Promise<Record<string, Feed>> {
	const feeds = await Promise.all(
		list.map((site) => fetchFeed(site.rss, site.title, site.url, site.param)),
	);

	const result: Record<string, Feed> = {};
	for (let i = 0; i < list.length; i++) {
		const site = list[i];
		const feed = feeds[i];

		if (feed === undefined) continue;

		result[site.param] = feed;
	}

	return result;
}

export async function collectAllItems(list: SiteInfo[]): Promise<ItemForAll[]> {
	const feeds = await collectFeeds(list);
	return Object.values(feeds)
		.reduce<ItemForAll[]>(
			(pre, cur) =>
				pre.concat(
					cur.items.map<ItemForAll>((i) => ({ site: cur.title, ...i })),
				),
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
