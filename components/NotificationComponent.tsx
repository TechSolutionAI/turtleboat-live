import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNotification } from "@/lib/useNotification";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { dateDiff } from '@/utils/utils';
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import VisibilityIcon from "@mui/icons-material/Visibility";

const NotificationComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user as User;
  const { notifications, setNotifications, setNewMessagesCount } = useNotification({type: ''});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // console.log(serverTime);

  const handleRead = async (notificationId: string, index: number) => {
    if (!notifications[index].isRead) {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nid: notificationId,
        }),
      });

      if (!response.ok) {
        const { err } = await response.json();
        console.log(err);
      } else {
        const { success } = await response.json();
        if (success) {
          let temp = [...notifications];
          temp[index].isRead = true;
          setNotifications(temp);
          setNewMessagesCount((count) => count - 1);
          router.push(notifications[index].link);
        }
      }
    } else {
      router.push(notifications[index].link);
    }
  };

  const handleDelete = async (notificationId: string, index: number) => {
    const response = await fetch("/api/notifications", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nid: notificationId,
      }),
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
    } else {
      const { success } = await response.json();
      if (success) {
        let temp = [...notifications];
        if (!notifications[index].isRead) {
          setNewMessagesCount((count) => count - 1);
        }
        temp.splice(index, 1);
        setNotifications(temp);
      }
    }
  };

  return (
    <div>
      {notifications.map((notification, idx: number) => (
        <div
          key={notification._id}
          className="flex mt-4 justify-between px-[10px] py-[15px] font-Inter text-[16px] border border-primary-blue bg-white rounded-lg hover:bg-tertiary-blue"
        >
          <div 
            className="flex truncate" 
            onClick={() => handleRead(notification._id, idx)}>
            <div className="relative flex text-center text-primary-blue">
              <ChatBubbleOutlineIcon />
              {!notification.isRead && (
                <div className="absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-tertiary-red border-2 border-white rounded-full top-0 -right-1"></div>
              )}
            </div>
            <a
              className={`cursor-pointer truncate ml-[10px] ${
                notification.isRead ? `` : `font-semibold`
              }`}
            >
              {notification.message}
            </a>
          </div>
          <div className='flex text-center justify-center flex'>
            {/* {dateDiff(serverTime, notification.createdAt)} */}
            {/* <a className='cursor-pointer font-Inter text-[10px] text-secondary-green px-[10px]'><MarkEmailReadIcon /></a>
            <a className='cursor-pointer font-Inter text-[10px] text-secondary-green px-[10px]'><VisibilityIcon /></a> */}
            <a onClick={() => handleDelete(notification._id, idx)} className='cursor-pointer font-Inter text-[10px] text-tertiary-red px-[10px]'><DeleteOutlineIcon /></a>
          </div>
        </div>
      ))}
      
      {
        notifications.length == 0 && (
          <div className='font-Inter text-md'>
            No notifications
          </div>
        )
      }
    </div>
  );
};

export default NotificationComponent;
