import { api } from "@/trpc/server";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { csv, timestamp } = await api.bridge.getReport.query();

		if ((csv ?? "").length < 1) {
			console.error("There is no data to report");
			return NextResponse.json(
				{ error: "There is no data to report" },
				{ status: 500 },
			);
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
