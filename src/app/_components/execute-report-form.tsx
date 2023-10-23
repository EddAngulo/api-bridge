"use client";

import { useEffect, useState } from "react";

import { api } from "@/trpc/react";

export function ExecuteReportForm() {
	const [shouldFetch, setShouldFetch] = useState(false);
	const { data, isLoading, isError } = api.bridge.getReport.useQuery(
		undefined,
		{ enabled: shouldFetch },
	);
	useEffect(() => {
		if (!isLoading && !isError) {
			setShouldFetch(false);
			console.log(data?.csv);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isError]);
	console.log({ isLoading, isError, data, shouldFetch });
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				setShouldFetch(true);
			}}
			className="flex flex-col gap-2"
		>
			<button
				type="submit"
				className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
				disabled={shouldFetch}
			>
				{shouldFetch ? "Executing Report..." : "Execute Report"}
			</button>
		</form>
	);
}
