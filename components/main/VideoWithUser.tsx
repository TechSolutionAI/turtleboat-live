import { NinetyVideo } from "@/types/ninetyvideo.type";
import { Fragment } from "react";
import UserAvatar from "../UserAvatar";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import { emotionList } from "@/utils/constant";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

const VideoWithUser = ({
  item,
  isAdmin,
}: {
  item: NinetyVideo;
  isAdmin: boolean;
}) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const comments = item.comments;
  const usedEmojis = Array.from(
    new Set(comments.map((comment) => comment.emotion) as number[])
  );

  return (
    <Fragment>
      <Link
        href={`${
          item.type != 4
            ? isAdmin
              ? `/dashboard/admin/makeninety/${item._id}`
              : `/dashboard/core/makeninety/${item._id}`
            : isAdmin
            ? `/dashboard/admin/nanotalks/${item._id}`
            : `/dashboard/core/nanotalks/${item._id}`
        }`}
      >
        <video
          key={item.video.url}
          className="rounded-2xl min-h-[190px] max-h-[190px] w-[100%] object-cover"
          onClick={() => {
            console.log("video clicked");
          }}
        >
          <source src={item.video.url} />
        </video>
      </Link>

      {comments.length == 0 || item.type == 1 ? (
        <div className="flex -space-x-2 items-center h-10 px-[10px] py-[10px]"></div>
      ) : (
        <div className="flex -space-x-2 items-center h-10 px-[10px] py-[10px]">
          {usedEmojis.map((value, index) => {
            return (
              <Image
                key={index}
                src={emotionList[value].img}
                alt={emotionList[value].text}
                width={25}
                height={25}
              />
            );
          })}
          <p className="text-[16px] pl-3">{comments.length}</p>
        </div>
      )}
      <div className="w-full px-[10px] py-[10px] font-Inter flex gap-2">
        <UserAvatar
          user={item.author}
          size={33}
          classes={"w-[33px] h-[33px] rounded-full cursor-pointer"}
          isFullWidth={false}
        />
        <div className="inline-grid">
          <label className="break-words line-clamp-2 text-[18px] font-semibold">
            {item.title}
          </label>
          <label className="line-clamp-1 text-[14px] mt-[3px]">
            {item.author.name}
          </label>
          <label className="line-clamp-1 text-[14px] mt-[3px]">
            {formatDate(item.updatedAt)}
          </label>
        </div>
      </div>
    </Fragment>
  );
};

export default VideoWithUser;
