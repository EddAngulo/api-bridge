import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";
import { Redis } from "@upstash/redis";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import type {
	Report,
	ReportRow,
	THEFResponse,
} from "@/server/api/types/bridge";
import { z } from "zod";
import {
	ErrorResponse,
	type ErrorResponseProps,
} from "@/server/api/types/error";
import { Readable } from "node:stream";

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
		const rows = data.ReportResults.Result.map((row) => row);

		const redis = new Redis({
			url: env.UPSTASH_REDIS_REST_URL,
			token: env.UPSTASH_REDIS_REST_TOKEN,
		});
		const dateStr = await redis.get("timestamp");

		let toSort: ReportRow[] = rows;
		if (dateStr)
			toSort = rows.filter(({ DateAdded }) => DateAdded > dateStr);

		const sorted = toSort.sort((a, b) => {
			if (a.DateAdded === b.DateAdded) return 0;
			return a.DateAdded > b.DateAdded ? 1 : -1;
		});

		const first = sorted[0];
		if (!first) {
			return { csv: "" };
		}
		const keys = Object.keys(first).join(",");
		const body = sorted
			.map((row) => Object.values(row).join(","))
			.join("\n");
		const csv = `${keys}\n${body}`;

		const timestamp = sorted.at(-1)?.DateAdded;
		await redis.set("timestamp", timestamp);

		return {
			csv,
		};
	}),

	sendCSV: publicProcedure
		.input(z.object({ csv: z.string() }))
		.mutation(async ({ input: { csv } }) => {
			const blob = Readable.from([csv]);

			const url = `${env.THEF_SERVER_URL}`;
			const response = await fetch(url, {
				method: "POST",
				body: blob,
				headers: {
					Authorization: `Bearer ${env.THEF_TOKEN}`,
					"Content-Type": "text/csv",
				},
			});

			const json = await response.json();
			if (!response.ok) {
				const errorPayload = json as ErrorResponseProps;
				throw new ErrorResponse(errorPayload);
			}

			return json as THEFResponse;
		}),
});
