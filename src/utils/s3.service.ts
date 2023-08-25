import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { PresignedPost } from "aws-sdk/clients/s3";

type UploadOptions = {
  files: FileList;
} & PresignedPost;

export const useUploadAwsS3 = (
  setCompleted: Dispatch<SetStateAction<number>>,
  config: UseMutationOptions<PresignedPost, AxiosError, UploadOptions> = {}
) => {
  return useMutation(
    ["uploadClouadinary"],
    async ({ files, url, fields }): Promise<PresignedPost> => {
      const file = files?.[0];

      if (!file) {
        return {} as PresignedPost;
      }

      const data = {
        ...fields,
        "Content-Type": file.type,
        file,
      };
      const formData: FormData = new FormData();

      for (const name in data) {
        formData.append(
          name as keyof typeof data,
          data[name as keyof typeof data]
        );
      }

      return axios.post(url, formData, {
        onUploadProgress: function (progressEvent) {
          const progress = Math.round(
            (progressEvent.loaded * 100.0) / (progressEvent.total || 1)
          );
          setCompleted(progress);
        },
      });
    },
    config
  );
};
