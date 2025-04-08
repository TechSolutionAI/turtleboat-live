import Image from "next/image";
import { User } from "@/types/user.type";
import { useRouter } from "next/router";
import React, { useState } from "react";

// Different from UserAvatar.tsx : Not clickable

const UserAvatar1 = ({
  user,
  size,
  classes,
}: {
  user: User | undefined;
  size: number;
  classes: string;
}) => {
  const [imgSrc, setImgSrc] = useState(user?.image);


  const handleError = () => {
    setImgSrc('/user.png');
  }

  return (
    <>
      <div className={classes}>
        <Image
          alt={user?.name ?? "user"}
          src={imgSrc || '/user.png'}
          width={size}
          height={size}
          className={classes}
          onError={handleError}
        />
      </div>
    </>
  );
};
export default UserAvatar1;
