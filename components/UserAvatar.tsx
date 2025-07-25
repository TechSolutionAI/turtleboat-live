import Image from "next/image";
import { User } from "@/types/user.type";
import { useRouter } from "next/router";
import React, { useState } from "react";

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
  const [imgSrc, setImgSrc] = useState(user?.image);

  const onClick = (e: any) => {
    e.stopPropagation();
      
    router.push(`/users/${user?._id}`);
  };

  const handleError = () => {
    setImgSrc('/user.png');
  }

  return (
    <>
      <div className={classes} onClick={onClick}>
        <Image
          alt={user?.name ?? "user"}
          src={imgSrc || '/user.png'}
          width={size}
          height={size}
          className={`rounded-full cursor-pointer ${
            isFullWidth != undefined && !isFullWidth ? "max-w-none" : ""
          }`}
          onError={handleError}
        />
      </div>
    </>
  );
};
export default UserAvatar;
