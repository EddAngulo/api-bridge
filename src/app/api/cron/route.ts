import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { fetchReports } from "@/server/shared/fetchReports";
import { postReports } from "@/server/shared/postReports";

const apiBridgeCronJob = async () => {
	try {
		const { csv, timestamp } = await fetchReports();

		if ((csv ?? "").length < 1) {
			console.error("There is no data to report");
			return new Response(null, { status: 204 });
		}

		await postReports({ csv, timestamp: timestamp ?? "" });

		return NextResponse.json({ message: "Success" }, { status: 201 });
	} catch (error) {
		console.error("Error sending data:", error);
		return NextResponse.json(
			{ error: "Failed to send data from Velocify to THEF" },
			{ status: 500 },
		);
	}
};

export const POST = apiBridgeCronJob;
