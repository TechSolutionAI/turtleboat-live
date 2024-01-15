import dynamic from "next/dynamic";
import Image from "next/image";
import ico_document from "/public/static/images/document.svg";
import { dateDiff } from "@/utils/utils";
import { Comment } from "@/types/module.type";
import UserAvatar from "@/components/UserAvatar";

const EditorView = dynamic(() => import("@/components/EditorView"), {
  ssr: false,
});

const CommentItem = ({
  comment,
  serverTime,
}: {
  comment: Comment;
  serverTime: string;
}) => {
  return (
    <div className="border-b border-[#6F727A] py-[15px]">
      {/* <div className='flex items-baseline gap-x-3'> */}
      <div className="items-baseline gap-x-3">
        <div className="flex items-center">
          <UserAvatar
            user={comment.user}
            size={33}
            classes={"w-[33px] h-[33px] rounded-full cursor-pointer"}
          />
          <label className="font-bold ml-2 text-sm">{comment.user.name}</label>
        </div>
        {/* <div className='comment-view -ml-[30px]'> */}
        <div className="comment-view">
          <EditorView value={comment.content} />
        </div>
      </div>
      {comment.files &&
        comment.files.length > 0 &&
        comment.files.map((fileItem: any, index: number) => {
          return (
            <div
              key={`${comment.user?.name}-${fileItem.name}-${index}`}
              className="flex items-center text-[#2E65F3] pl-[28px] mt-[10px] gap-x-3"
            >
              <Image src={ico_document} alt="ico_doc" />
              <a
                href={fileItem.url}
                className="text-[14px] font-semibold"
                target="_blank"
              >
                {fileItem.name}
              </a>
            </div>
          );
        })}
      <div className="flex justify-end text-xs text-gray">
        {/* {comment.user?.name} replied&nbsp;{dateDiff(serverTime, comment.createdAt)} */}
        Replied&nbsp;{dateDiff(serverTime, comment.createdAt)}
      </div>
    </div>
  );
};
export default CommentItem;
