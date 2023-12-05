"use client";

import { useEffect, useState } from "react";

import { api } from "@/trpc/react";

export function ExecuteReportForm() {
	const [shouldFetch, setShouldFetch] = useState(false);
	const [posted, setPosted] = useState(false);
	const { isError, isFetching, isSuccess, data } =
		api.bridge.getReport.useQuery(undefined, {
			enabled: shouldFetch,
			retry: false,
		});

	const { isLoading, mutateAsync } = api.bridge.sendCSV.useMutation();
	const csv = data?.csv ?? "";
	const timestamp = data?.timestamp ?? "";

	useEffect(() => {
		if (!isFetching && (isError || isSuccess)) {
			setShouldFetch(false);
			setPosted(false);
		}
	}, [isError, isFetching, isSuccess, data]);

	useEffect(() => {
		const sendCSV = async (csv: string) => {
			try {
				const response = await mutateAsync({ csv, timestamp });
				alert(response.message);
				setPosted(true);
			} catch (error) {
				console.log(error);
			}
		};
		if (csv.length > 0 && !posted) {
			void sendCSV(csv);
		} else if (csv.length === 0 && !posted && isSuccess) {
			alert("No new data to send");
		}
	}, [csv, timestamp, isSuccess, posted, mutateAsync]);

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
				disabled={shouldFetch || isLoading}
			>
				{shouldFetch || isLoading
					? "Executing Report..."
					: "Execute Report"}
			</button>
		</form>
	);
}
