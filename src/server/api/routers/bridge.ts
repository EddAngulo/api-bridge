import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import type { Report } from "@/server/api/types/bridge";

export const bridgeRouter = createTRPCRouter({
	getReport: publicProcedure.query(async () => {
		const params = new URLSearchParams({
			username: env.VELOCIFY_USER,
			password: env.VELOCIFY_PWD,
			reportId: env.VELOCIFY_REPORT_ID,
		}).toString();

		const url = `${env.VELOCIFY_SERVER_URL}?${params}`;
		const response = await fetch(url);
		const xml = await response.text();

		const parser = new XMLParser();
		const data = parser.parse(xml) as Report;
		const parsed = data.ReportResults.Result.map((row) => {
			const date = new Date(row.DateAdded);
			return {
				...row,
				DateAdded: new Date(date.getTime() - 60 * 60 * 1000),
			};
		});

		const first = parsed[0];
		if (!first) {
			return undefined;
		}
		const keys = Object.keys(first).join(",");
		const rows = parsed
			.map((row) => Object.values(row).join(","))
			.join("\n");
		const csv = `${keys}\n${rows}`;

		return {
			csv,
		};
	}),
});
