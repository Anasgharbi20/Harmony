import React, { useState } from "react";
import { AwesomeQR } from "awesome-qr";
import { PostType } from "@/server/api/routers/post";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { ModalDeleteConfirmation } from "../Modal";

type PostCardProps = {
  post: PostType;
};

function PostCard({ post }: PostCardProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const downloadQrcode = async () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || ""}/posts/${post.id}`;
    const qrcode = await new AwesomeQR({
      text: url,
      size: 800,
    }).draw();
    const downloadLink = document.createElement("a");
    downloadLink.href = qrcode as string;
    downloadLink.download = `${post.title}.png`;
    downloadLink.click();
  };

  return (
    <div className="mt-5 w-full border-black  py-2 shadow-md sm:mt-10 sm:rounded-lg sm:border sm:border-gray-50">
      <div className="flex justify-between space-x-4 px-2 sm:px-10">
        <div className="flex flex-col space-y-2">
          <Link href={`/posts/${post.id}`} legacyBehavior>
            <a className="flex items-center text-left text-xl font-semibold">
              {post?.title}
            </a>
          </Link>
          <div>
            {post.isPublic ? (
              <div className="inline gap-x-2 rounded-full bg-emerald-100  px-3 py-1 text-sm font-normal text-emerald-500">
                Online
              </div>
            ) : (
              <div className="inline gap-x-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-500">
                Offline
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-row  justify-between  space-x-3">
            <button
              onClick={() => downloadQrcode()}
              className={`w-24 
               rounded-md border border-solid  border-gray-800 bg-white py-1.5 text-sm text-black transition-all duration-150 ease-in-out hover:border-black hover:text-black focus:outline-none`}
            >
              <div className="flex justify-center align-middle">
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Qrcode</span>
              </div>
            </button>
           
<Link href={`/Edit/${post.id}`} passHref>
<button
  className={`w-24
   rounded-md border border-solid  border-gray-800 bg-white py-1.5 text-sm text-black transition-all duration-150 ease-in-out hover:border-black hover:text-black focus:outline-none`}
>
  <div className="flex justify-center align-middle">
    <svg
      className="mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
    <span>Edit</span>
  </div>
</button>
</Link>
<button
              onClick={() => setIsOpen(true)}
              className={`w-8 justify-center  rounded-md border border-solid border-red-500 bg-white py-1.5 text-sm text-red-700 transition-all duration-150 ease-in-out hover:bg-white hover:text-red-500 focus:outline-none`}
            >
              <div className="flex justify-center">
                <FiTrash2 />
              </div>
              {/* <LoadingDots /> */}
            </button>
          </div>
          <ModalDeleteConfirmation
            post={post}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default PostCard;
