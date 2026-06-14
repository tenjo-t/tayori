import "./worker-configuration.d.ts";

interface Env {
  GITHUB_TOKEN: string;
}

export default {
  async scheduled(_: ScheduledController, env: Env) {
    const res = await fetch(
      "https://api.github.com/repos/tenjo-t/tayori/actions/workflows/update-feed.yml/dispatches",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "tayori-cron",
        },
        body: JSON.stringify({ ref: "main" }),
      },
    );
    console.log(`workflow dispatch: ${res.status}`);
  },
} satisfies ExportedHandler<Env>;
