import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		// DATABASE_URL: z
		//   .string()
		//   .url()
		//   .refine(
		//     (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
		//     "You forgot to change the default URL"
		//   ),
		UPSTASH_REDIS_REST_URL: z.string().url(),
		UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
		VELOCIFY_SERVER_URL: z.string().url(),
		VELOCIFY_USER: z.string().email().includes("nuc.edu"),
		VELOCIFY_PWD: z.string().min(1),
		VELOCIFY_REPORT_ID: z.string().regex(/\d+/),
		THEF_SERVER_URL: z.string().url(),
		THEF_TOKEN: z.string().min(1),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		// DATABASE_URL: process.env.DATABASE_URL,
		UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
		UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
		VELOCIFY_SERVER_URL: process.env.VELOCIFY_SERVER_URL,
		VELOCIFY_USER: process.env.VELOCIFY_USER,
		VELOCIFY_PWD: process.env.VELOCIFY_PWD,
		VELOCIFY_REPORT_ID: process.env.VELOCIFY_REPORT_ID,
		THEF_SERVER_URL: process.env.THEF_SERVER_URL,
		THEF_TOKEN: process.env.THEF_TOKEN,
		NODE_ENV: process.env.NODE_ENV,
		// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
