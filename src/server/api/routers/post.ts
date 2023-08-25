import { z } from "zod";
import { S3 } from "aws-sdk";
import { env } from "@/env.mjs";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const postInputSchema = z.object({
  filename: z.string(),
  title: z.string(),
  isPublic: z.boolean(),
});

export type PostInputType = z.infer<typeof postInputSchema>;

export type PostType = {
  createdAt: Date;
  id: string;
  updatedAt: Date;
  userId: string;
} & PostInputType;

export type PostWithUrlType = PostType & { url: string };

const s3 = new S3();

export const postRouter = createTRPCRouter({
  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
          ...(!ctx.session?.user.id ? { isPublic: true } : {}),
        },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...post,
        url: await s3.getSignedUrlPromise("getObject", {
          Bucket: env.AWS_PUBLIC_BUCKET_NAME,
          Key: `${post.userId ?? ""}/${post.filename ?? ""}`,
        }),
      };
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.findFirst({
        select: {
          id: true,
          filename: true,
          userId: true,
        },
        where: {
          userId: ctx.session?.user.id,
          id: input.id,
        },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      try {
        await s3
          .deleteObject({
            Bucket: env.AWS_PUBLIC_BUCKET_NAME,
            Key: `${post.userId ?? ""}/${post.filename ?? ""}`,
          })
          .promise();

        await ctx.prisma.post.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });

    const postsWithUrl = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        url: await s3.getSignedUrlPromise("getObject", {
          Bucket: env.AWS_PUBLIC_BUCKET_NAME,
          Key: `${post.userId ?? ""}/${post.filename ?? ""}`,
        }),
      } as PostWithUrlType))
    );

    return postsWithUrl;
  }),


  createPost: protectedProcedure
    .input(postInputSchema)
    .mutation(({ input, ctx }) => {
      console.log("Creating a new post ...");
      return ctx.prisma.post.create({
        data: {
          filename: input.filename,
          isPublic: input.isPublic,
          title: input.title,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

    editPostTitle: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      isPublic: z.boolean(), // Add isPublic field to the input schema
    }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.findFirst({
        select: {
          id: true,
          userId: true,
        },
        where: {
          userId: ctx.session?.user.id,
          id: input.id,
        },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          isPublic: input.isPublic, // Update the isPublic field as well
        },
      });
    }),

});



