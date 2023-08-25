import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { uploadRouter } from "./routers/upload";

import { config } from "aws-sdk";
import { env } from "@/env.mjs";
import { postRouter } from "./routers/post";

config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  upload: uploadRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
