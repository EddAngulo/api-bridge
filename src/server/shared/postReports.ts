import fetch from "node-fetch";
import { Redis } from "@upstash/redis";
import { env } from "@/env.mjs";
import type { THEFResponse } from "@/server/api/types/bridge";
import {
	ErrorResponse,
	type ErrorResponseProps,
} from "@/server/api/types/error";
import { Readable } from "node:stream";

type PostReportProps = {
	csv: string;
	timestamp: string;
};

export async function postReports({ csv, timestamp }: PostReportProps) {
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

	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN,
	});
	await redis.set("timestamp", timestamp);

	return json as THEFResponse;
}
