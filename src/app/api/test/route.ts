import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

async function handler(_req: NextRequest) {
	await new Promise((r) => setTimeout(r, 1000));

	console.log("Success");
	return NextResponse.json({ name: "John Doe " });
}

export const POST = verifySignatureAppRouter(handler);
