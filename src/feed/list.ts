export type SiteInfo = {
	rss: string;
	url: string;
	title: string;
	param: string;
	logo: string;
	creator?: string;
};

export const siteList = [
	{
		rss: "https://zenn.dev/feed",
		url: "https://zenn.dev/",
		title: "Zenn",
		param: "zenn",
		logo: "/logo/zenn.svg",
	},
	{
		rss: "https://jser.info/rss/",
		url: "https://jser.info/",
		title: "JSer.info",
		param: "jser_info",
		logo: "/logo/jser_info.png",
	},
	{
		rss: "https://gihyo.jp/feed/atom",
		url: "https://gihyo.jp/",
		title: "gihyo.jp",
		param: "gihyo_jp",
		logo: "/logo/gihyo.svg",
	},
	{
		rss: "https://zenn.dev/topics/rust/feed",
		url: "https://zenn.dev/topics/rust",
		title: "Zenn (Rust)",
		param: "zenn_rust",
		logo: "/logo/zenn.svg",
	},
	{
		rss: "https://blog.jxck.io/feeds/atom.xml",
		url: "https://blog.jxck.io/",
		title: "Jxck's blog",
		param: "blog_jxck",
		logo: "/logo/jxck.svg",
		creator: "Jxck",
	},
	{
		rss: "https://azukiazusa.dev/rss.xml",
		url: "https://azukiazusa.dev/",
		title: "azukiazusaのテックブログ2",
		param: "azukiazusa",
		logo: "/logo/azukiazusa.jpeg",
		creator: "azukiazusa1",
	},
	{
		rss: "https://blog.stin.ink/feed",
		url: "https://blog.stin.ink/",
		title: "stin's Blog",
		param: "stins_blog",
		logo: "/logo/stin.ico",
		creator: "すてぃん",
	},
	{
		rss: "https://blog.sakupi01.com/feed.xml",
		url: "https://blog.sakupi01.com/dev",
		title: "Saku's blog",
		param: "saku_blog",
		logo: "/logo/sakupi01.svg",
		creator: "saku",
	},
] satisfies SiteInfo[];

export const colors = [
	"oklch(50.5% 0.213 27.518)", // red
	"oklch(55.5% 0.163 48.998)", // amber
	"oklch(53.2% 0.157 131.589)", // lime
	"oklch(50.8% 0.118 165.612)", // emeald
	"oklch(52% 0.105 223.128)", // cyan
	"oklch(48.8% 0.243 264.376)", // blue
	"oklch(49.1% 0.27 292.581)", // violet
	"oklch(51.8% 0.253 323.949)", // fuchsia
	"oklch(51.4% 0.222 16.935)", // rose
	"oklch(55.3% 0.195 38.402)", // orange
	"oklch(55.4% 0.135 66.442)", // yellow
	"oklch(52.7% 0.154 150.069)", // green
	"oklch(51.1% 0.096 186.391)", // teal
	"oklch(50% 0.134 242.749)", // sky
	"oklch(45.7% 0.24 277.023)", // indigo
	"oklch(49.6% 0.265 301.924)", // purple
	"oklch(52.5% 0.223 3.958)", // pink
];

const paramIndex = Object.values(siteList.map((s) => s.param));

export const getColor = (index: number | string) => {
	const i =
		(typeof index === "string" ? paramIndex.indexOf(index) : index) %
		colors.length;
	return colors[i];
};
