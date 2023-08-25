import React, { ChangeEvent, FC, useEffect, useState } from "react";

import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import { SwitchField } from "@/components/SwitchField";
import { api } from "@/utils/api";
import { FileCard } from "@/components/FileCard";
import { useUploadAwsS3 } from "@/utils/s3.service";
import { PresignedPost } from "aws-sdk/clients/s3";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingDots from "@/components/LoadingDots";

const Label: FC<
  {
    children: React.ReactNode;
  } & React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
> = ({ children, ...rest }) => (
  <label
    {...rest}
    className="text-md mb-2 block font-medium text-[#52596d] dark:text-gray-300"
  >
    {children}
  </label>
);

type FormValues = {
  title: string;
  files: FileList;
  isPublic: boolean;
};

const NewPost: NextPage<{ protectedProp: boolean }> = ({ protectedProp }) => {
  const {
    register,
    control,
    watch,
    resetField,
    setValue,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      isPublic: true, // Set the "isPublic" field to true by default
      files: {} as FileList,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });


  const { data: sessionData } = useSession();
  const router = useRouter();

  if (!sessionData && typeof window !== "undefined") {
    router.push("/").catch((error) => console.log(error));
  }

  const files = watch("files");
  const file = files[0] || null;

  const [complete, setComplete] = useState<number>(0);

  const { mutateAsync: upload, isLoading: isUploading } =
    useUploadAwsS3(setComplete);

  const { mutate: getPresignMutation, isLoading: isGettingPresign } =
    api.upload.getPresignUrl.useMutation({
      onSuccess: (data) => {
        upload({ files, ...(data as PresignedPost) })
          .then((data) => {
            console.log(data);
          })
          .catch((err) => console.log(err));
      },
    });

  const { mutate: createPost, isLoading: isCreatingPost } =
    api.post.createPost.useMutation({
      onSuccess: (data) => {
        router.push("/").catch((error) => console.log(error));
        toast("Publication créé avec succès");
      },
    });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    if (!data || !data.files) return;

    const fileData = files[0] as File;

    createPost({
      filename: fileData.name,
      isPublic: data.isPublic,
      title: data.title,
    });
  };

  const resetFile = () => {
    console.log("Reset clicked");
    setValue("files", {} as FileList);
  };

  const isLoading = isUploading || isGettingPresign || isCreatingPost;

  const isButtonDisabled = (!isValid && isSubmitted) || isLoading;
  
  return (
    <>
      <Head>
        <title>Create new post</title>
      </Head>
     
        <div className="h-screen md:flex">
	<div
		className="relative overflow-hidden md:flex w-1/2 bg-white i justify-around items-center hidden">
		<div>
			<h1 className="text-dark font-bold text-4xl font-sans">Unlocking Sounds</h1>
			<p className="text-dark mt-1">Empowering Voices, Enriching Journeys</p>
      <a href="/" className="flex items-center">
			<button type="submit" className="block w-28 bg-[#4169e1] text-white mt-4 py-2 rounded-2xl font-bold mb-2">Posts</button>
		</a>
    </div>
		<div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
		<div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
		<div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
		<div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
	</div>
  <div className="flex md:w-1/2 justify-center items-center bg-white">
  <div className="flex  justify-center p-30 items-center bg-white rounded-lg p-10">
  <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <main className="flex w-full items-center justify-center font-sans">
                <div className="flex w-full flex-col space-y-12">
                  <div>
                    <>
                      <Label htmlFor="title">Post Title</Label>
                      <input
                        type="text"
                        {...register("title", {
                          required: "title is required",
                        })}
                        id="title"
                        className="text-md block w-full rounded-lg border border-gray-300 bg-white-50 p-2.5 text-dark-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-white-700 dark:text-dark dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Post Title"
                      />
                      {!!errors?.title && (
                        <span className="text-md mt-1 ml-1 flex items-center font-medium tracking-wide text-red-500">
                          {errors?.title?.message}
                        </span>
                      )}
                    </>
                  </div>

                  <div>
                    {!!file ? (
                      <FileCard
                        file={file}
                        complete={complete}
                        resetFile={resetFile}
                        isValid={!errors?.files}
                      />
                    ) : (
                      <div>
                        <Label htmlFor="dropzone-file">
                          Upload
                          <div className="mt-3 mx-auto flex w-full max-w-lg cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-blue-400  p-6 text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-white-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>

                            <h2 className="mt-4 text-xl font-medium tracking-wide text-gray-700">
                              Add Audio File
                            </h2>

                            <p className="mt-2 tracking-wide text-gray-500">
                              File Format must be .mp3 or .aac
                            </p>
                          </div>
                        </Label>
                      </div>
                    )}

                    <input
                      {...register("files", {
                        validate: {
                          required: (files) => {
                            return (
                              Object.keys(files).length > 0 ||
                              "file field is required"
                            );
                          },
                          lessThan10MB: (files) =>
                            (!!files[0] && files[0].size < 10000000) ||
                            "File is too big ( 10 mb)",
                          acceptedFormats: (files) => {
                            return (
                              ["audio/mpeg", "audio/aac"].includes(
                                files[0]?.type || ""
                              ) ||
                              "Format not supported : File Format must be .mp3 or .aac"
                            );
                          },
                        },
                        onChange: (event: ChangeEvent<HTMLInputElement>) => {
                          const file = (
                            (event?.target?.files || {}) as FileList
                          )?.[0];

                          if (
                            !!file &&
                            file.size < 10000000 &&
                            ["audio/mpeg", "audio/aac"].includes(file.type)
                          ) {
                            setComplete(0);

                            getPresignMutation({
                              filename:
                                ((event?.target?.files || {}) as FileList)?.[0]
                                  ?.name || "",
                            });
                          }
                        },
                      })}
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                    />
                    {!!errors?.files && (
                      <div className="max-w-md">
                        <span className="text-md mt-1 ml-1 flex items-center font-medium tracking-wide text-red-500">
                          {errors?.files?.message}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                
<Label htmlFor="isPublic">public</Label>
        <SwitchField
          id="isPublic"
          control={control}
          name="isPublic"
          isChecked={true}        />
                    
                  </div>
                  <div className="flex items-center justify-end">
                  <button
  type="submit"
  disabled={isButtonDisabled}
  className={`${
    isButtonDisabled
      ? "cursor-not-allowed rounded border-gray-500 py-2 px-4 font-bold text-gray-500 opacity-50"
      : "flex items-center justify-center gap-x-2 rounded-lg border-2  px-5 py-2 text-sm tracking-wide bg-[#161616] text-white transition-colors duration-200 hover:bg-gray-600 hover:text-white sm:w-auto"
  }`}
>
  {isLoading ? <LoadingDots /> : <span>Upload</span>}
</button>

                  </div>
                </div>
              </main>
            </form>
	</div>
  </div>
  </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      protectedProp: true,
    },
  };
};

export default NewPost;





