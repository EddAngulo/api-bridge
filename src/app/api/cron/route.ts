import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

//export async function POST() {

// const apiBridgeCronJob = async () => {
async function apiBridgeCronJob(_req: NextRequest) {
	try {
		const { csv, timestamp } = await api.bridge.getReport.query();

		if ((csv ?? "").length < 1) {
			console.error("There is no data to report");
			return new Response(null, { status: 204 });
		}

		await api.bridge.sendCSV.mutate({ csv, timestamp: timestamp ?? "" });

		return NextResponse.json({ status: 201 });
	} catch (error) {
		console.error("Error sending data:", error);
		return NextResponse.json(
			{ error: "Failed to send data from Velocify to THEF" },
			{ status: 500 },
		);
	}
}

export const POST = apiBridgeCronJob;
