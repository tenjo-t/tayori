import "./worker-configuration.d.ts";

interface Env {
	WEBHOOK: string;
}

export default {
	async scheduled(_: ScheduledController, env: Env) {
		await fetch(env.WEBHOOK, { method: "POST" });
	},
} satisfies ExportedHandler<Env>;
