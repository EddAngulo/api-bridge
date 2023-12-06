import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";
import { Redis } from "@upstash/redis";
import { env } from "@/env.mjs";
import type { Report, ReportRow } from "@/server/api/types/bridge";

export async function fetchReports() {
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
	const rows = data.ReportResults.Result.map((row) => row);

	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN,
	});
	const dateStr = await redis.get("timestamp");

	let toSort: ReportRow[] = rows;
	if (dateStr) toSort = rows.filter(({ DateAdded }) => DateAdded > dateStr);

	const sorted = toSort.sort((a, b) => {
		if (a.DateAdded === b.DateAdded) return 0;
		return a.DateAdded > b.DateAdded ? 1 : -1;
	});

	const first = sorted[0];
	if (!first) {
		return { csv: "" };
	}
	const keys = Object.keys(first).join(",");
	const body = sorted.map((row) => Object.values(row).join(",")).join("\n");
	const csv = `${keys}\n${body}`;

	const timestamp = sorted.at(-1)?.DateAdded;

	return {
		csv,
		timestamp,
	};
}
