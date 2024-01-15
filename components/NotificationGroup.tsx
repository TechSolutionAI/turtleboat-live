import { useNotification } from "@/lib/useNotification";
import { formatDate1, formatDate2 } from "@/utils/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Notification } from "@/types/notification.type";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Flag from "./Flag";
import { collaTablist } from "@/utils/constant";

const NotificationGroup = () => {
  const router = useRouter();

  const { notifications, setNotifications, setNewMessagesCount } =
    useNotification({ type: "" });
  const [groupedNotifications, setGroupedNotifications] = useState<{
    [key: string]: Notification[];
  }>({});
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({});

  const groupNotification = () => {
    setGroupedNotifications(
      notifications.reduce(
        (acc: { [key: string]: Notification[] }, notification) => {
          let key;
          if (notification.ventureId != null && notification.moduleId != null) {
            key = `${notification.ventureId}-${
              notification.moduleId
            }-${formatDate1(notification.createdAt)}`;
          } else if (
            notification.ventureId != null &&
            notification.collaborationId != null &&
            notification.tabId != null
          ) {
            key = `${notification.ventureId}-${notification.collaborationId}-${
              notification.tabId
            }-${formatDate1(notification.createdAt)}`;
          } else if (notification.videoId != null) {
            key = `${notification.videoId}-${formatDate1(
              notification.createdAt
            )}`;
          } else {
            key = notification._id;
          }
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(notification);
          return acc;
        },
        {}
      )
    );
  };

  useEffect(() => {
    groupNotification();
  }, [notifications]);

  const handleRead = async (notificationId: string, index: number) => {
    const notification = notifications.find(
      (obj) => obj._id === notificationId
    );
    if (notification && !notification.isRead) {
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
          setNotifications((prevNotifications) => {
            const newNotifications = prevNotifications.map((notification) => {
              if (notification._id == notificationId) {
                return { ...notification, isRead: true };
              }
              return notification;
            });
            return newNotifications;
          });
          setNewMessagesCount((count) => count - 1);
          router.push(notification.link);
        }
      }
    } else if (notification && notification.isRead) {
      router.push(notification.link);
    }
  };

  const handleDelete = async (notificationId: string, index: number) => {
    const notification = notifications.find(
      (obj) => obj._id === notificationId
    );
    if (notification) {
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
          if (!notification.isRead) {
            setNewMessagesCount((count) => count - 1);
          }

          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification._id != notificationId
            )
          );
        }
      }
    }
  };

  const handleFlag = async (notificationId: string, index: number) => {
    const notification = notifications.find(
      (obj) => obj._id === notificationId
    );
    if (notification) {
      setNotifications((prevNotifications) => {
        const newNotifications = prevNotifications.map((notification) => {
          if (notification._id == notificationId) {
            return { ...notification, isFlag: !notification.isFlag };
          }
          return notification;
        });
        return newNotifications;
      });

      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nid: notificationId,
          isFlag: !notification.isFlag,
        }),
      });
    }
  };

  const NotificationComponent = ({
    notification,
    key,
    idx,
  }: {
    notification: Notification;
    key: string;
    idx: number;
  }) => {
    return (
      <div
        key={notification._id}
        className="flex mt-4 justify-between px-[10px] py-[15px] font-Inter text-[16px] border border-primary-blue bg-white rounded-lg hover:bg-tertiary-blue"
      >
        <div className="flex" onClick={() => handleRead(notification._id, idx)}>
          <div className="relative flex text-center text-primary-blue">
            <ChatBubbleOutlineIcon />
            {!notification.isRead && (
              <div className="absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-tertiary-red border-2 border-white rounded-full top-0 -right-1"></div>
            )}
          </div>
          <p
            className={`cursor-pointer ml-[10px] ${
              notification.isRead ? `` : `font-semibold`
            }`}
          >
            {notification.message}
          </p>
        </div>
        <div className="flex text-center justify-center">
          <Flag notification={notification} idx={idx} handleFlag={handleFlag} />
          <p
            onClick={() => handleDelete(notification._id, idx)}
            className="cursor-pointer font-Inter text-[10px] text-tertiary-red px-[10px]"
          >
            <DeleteOutlineIcon />
          </p>
        </div>
      </div>
    );
  };

  const GroupHeaderComponent = ({
    key,
    notifications,
    isOpen,
    toggle,
  }: {
    key: string;
    notifications: Notification[];
    isOpen: boolean;
    toggle: Function;
  }) => {
    const notification = notifications[0];
    let title = "";
    if (
      notification.ventureTitle != null &&
      notification.ventureId != null &&
      notification.moduleId != null
    ) {
      title = `"${notification.ventureTitle}" on ${formatDate2(
        notification.createdAt
      )}`;
    } else if (
      notification.ventureTitle != null &&
      notification.collaborationId != null &&
      notification.tabId != null
    ) {
      title = `"${notification.ventureTitle}" "${
        collaTablist[parseInt(notification.tabId)]
      }" on ${formatDate2(notification.createdAt)}`;
    } else if (
      notification.videoTitle != null &&
      notification.videoId != null
    ) {
      title = `"${notification.videoTitle}" on ${formatDate2(
        notification.createdAt
      )}`;
    }
    let isAllRead = false;
    if (notifications.every((notification) => notification.isRead === true)) {
      isAllRead = true;
    }

    return (
      <div
        key={key}
        className="cursor-pointer flex mt-4 justify-between px-[10px] py-[15px] font-Inter text-[16px] border border-primary-blue bg-white rounded-lg hover:bg-tertiary-blue"
        onClick={() => {
          toggle();
        }}
      >
        <div className="flex">
          <div className="relative flex text-center text-primary-blue">
            <ChatBubbleOutlineIcon />
            {!isAllRead && (
              <div className="absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-tertiary-red border-2 border-white rounded-full top-0 -right-1"></div>
            )}
          </div>
          <p className={`ml-[10px] ${isAllRead ? `` : `font-semibold`}`}>
            {title}
          </p>
        </div>
        <div className="flex text-center justify-center px-[10px]">
          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
      </div>
    );
  };

  const GroupedComponent = ({
    groupKey,
    notifications,
  }: {
    groupKey: string;
    notifications: Notification[];
  }) => {
    const isOpen = groupKey in openState ? openState[groupKey] : false;
    const toggle = () => {
      setOpenState((prevState) => ({
        ...prevState,
        [groupKey]: !isOpen,
      }));
    };

    return (
      <div>
        <GroupHeaderComponent
          key={groupKey}
          notifications={notifications}
          isOpen={isOpen}
          toggle={toggle}
        />
        {isOpen && (
          <div className="ml-10">
            {notifications.map((notification, idx: number) => (
              <NotificationComponent
                notification={notification}
                key={`${groupKey}-${idx}`}
                idx={idx}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {notifications.length == 0 && (
        <div className="font-Inter text-md">No notifications</div>
      )}
      {notifications.length != 0 &&
        Object.entries(groupedNotifications).map(
          ([groupKey, notifications]) => (
            <div key={groupKey}>
              {notifications.length == 1 ? (
                <NotificationComponent
                  notification={notifications[0]}
                  key={groupKey}
                  idx={0}
                />
              ) : (
                <GroupedComponent
                  key={groupKey}
                  groupKey={groupKey}
                  notifications={notifications}
                />
              )}
            </div>
          )
        )}
    </div>
  );
};

export default NotificationGroup;
