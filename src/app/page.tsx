// import Link from "next/link";

import { ExecuteReportForm } from "@/app/_components/execute-report-form";
// import { api } from "@/trpc/server";

export default function Home() {
	// const hello = await api.post.hello.query({ text: "from tRPC" });
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
					API Bridge
				</h1>
				<div className="w-full max-w-xs">
					<ExecuteReportForm />
				</div>
			</div>
		</main>
	);
}
