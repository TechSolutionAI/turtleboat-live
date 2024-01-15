import Image from "next/image";
import { User } from "@/types/user.type";
import { useRouter } from "next/router";
import React from "react";

const UserAvatar = ({
  user,
  size,
  classes,
  isFullWidth,
}: {
  user: User | undefined;
  size: number;
  classes: string;
  isFullWidth?: boolean;
}) => {
  const router = useRouter();

  const onClick = (e: any) => {
    e.stopPropagation();

    router.push(`/users/${user?._id}`);
  };

  return (
    <>
      <div className={classes} onClick={onClick}>
        <Image
          alt={user?.name ? user?.name : "user"}
          src={user?.image ?? "/user.png"}
          width={size}
          height={size}
          className={`rounded-full cursor-pointer ${
            isFullWidth != undefined && !isFullWidth ? "max-w-none" : ""
          }`}
        />
      </div>
    </>
  );
};
export default UserAvatar;
