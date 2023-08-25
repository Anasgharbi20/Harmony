import React from "react";
import { useRouter } from "next/router";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import AudioPlayerElement from "@/components/AudioPlayer/_partials/AudioPlayerElement";
import LoadingDots from "@/components/LoadingDots";

const Post: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const idParam = id?.toString() || "";

  const { data: post, isLoading } = api.post.getPost.useQuery(
    {
      id: idParam,
    },
    {
      enabled: !!idParam,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );


  if (isLoading) return                   <LoadingDots />   
  ;
  if (!post)
    return (
      <>
        <Head>
          <title>Read post</title>
        </Head>
        <main className="flex h-screen flex-col items-center justify-center dark:bg-gray-900">
          <div className="flex h-full w-full items-center items-center justify-center bg-gray-100">
            <div className="flex flex-col  px-5 text-gray-700 md:flex-row">
              <div className="">
                <div className="font-dark text-5xl font-bold">
                  Uppsss...
                  <strong> 404 </strong>
                </div>
                <p className="text-2xl font-light leading-normal md:text-3xl">
                  <strong>Page introuvable</strong>
                </p>
              </div>
            </div>
          </div>
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title>Read post</title>
      </Head>
      <main className="flex flex-col items-center  justify-center dark:bg-white-900">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8 ">
          <h3 className="text-gray-900 text-2xl font-extrabold tracking-tight sm:text-[2rem]">
           "{post.title}"
          </h3>
          <div className="w-full max-w-md">
            <AudioPlayerElement post={post} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Post;
