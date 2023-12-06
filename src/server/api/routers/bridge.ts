import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { fetchReports } from "@/server/shared/fetchReports";
import { postReports } from "@/server/shared/postReports";

export const bridgeRouter = createTRPCRouter({
	getReport: publicProcedure.query(fetchReports),

	sendCSV: publicProcedure
		.input(z.object({ csv: z.string(), timestamp: z.string() }))
		.mutation(async ({ input }) => {
			return await postReports(input);
		}),
});
