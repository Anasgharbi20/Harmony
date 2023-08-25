import { env } from "@/env.mjs";
import { S3 } from "aws-sdk";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PresignedPost } from "aws-sdk/clients/s3";

const preSigneSchema = z.object({
  url: z.string(),
  fields: z.object({}),
});

export type PreSigneType = z.infer<typeof preSigneSchema>;

export const uploadRouter = createTRPCRouter({
  getPresignUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Getting cloudinary signature.....");

      const s3 = new S3();

      const params = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        Key: `${ctx.session.user.id}/${input.filename}`,
      };

      return new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: params.Key,
            },
            Conditions: [
              ["starts-with", "$Content-Type", ""],
              ["content-length-range", 0, 40000000],
            ],
            Expires: 60,
            Bucket: env.AWS_PUBLIC_BUCKET_NAME,
          },
          (err, signed: PresignedPost) => {
            console.log({ signed });
            if (err) return reject(err);
            resolve(signed);
          }
        );
      });
    }),
});
