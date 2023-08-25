import React, { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import LoadingDots from "@/components/LoadingDots";
import { SwitchField } from "@/components/SwitchField";

interface EditPostFormValues {
  title: string;
  isPublic: boolean;
}

const EditPostTitle: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const idParam = id?.toString() || "";

  const { data: post, isLoading, isFetching } = api.post.getPost.useQuery(
    {
      id: idParam,
    },
    { enabled: !!idParam }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
    control,
    reset,
  } = useForm<EditPostFormValues>({
    defaultValues: {
      title: post?.title || "",
      isPublic: post?.isPublic || false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    reset({
      title: post?.title || "",
      isPublic: post?.isPublic || false,
    });
  }, [post]);

  const { mutate: editPostTitleMutation, isLoading: isEditing } =
    api.post.editPostTitle.useMutation({
      onSuccess: async () => {
        router.push(`/`);
      },
    });

  const onSubmit: SubmitHandler<EditPostFormValues> = (data) => {
    editPostTitleMutation({
      id: idParam,
      title: data.title,
      isPublic: data.isPublic,
    });
  };

  const isButtonDisabled = (!isValid && isSubmitted) || isEditing;

  if (isLoading) return <LoadingDots />;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="text-md mb-2 block font-medium text-[#52596d] dark:text-gray-300"
            >
              Post Title
            </label>
            <input
              type="text"
              id="newTitle"
              {...register("title", { required: "Title is required" })}
              className="mt-1 p-2 border rounded-lg w-full"
            />

            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="isPublic"
              className="text-md mb-2 block font-medium text-[#52596d] dark:text-gray-300"
            >
              Public
            </label>
            <SwitchField
              id="isPublic"
              control={control}
              name="isPublic"
              isChecked={post?.isPublic || false}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`${
                isButtonDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-800 bg-[#161616] text-white"
              } p-2 px-4 rounded-lg font-medium transition duration-200`}
            >
              {isEditing ? <LoadingDots /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostTitle;
