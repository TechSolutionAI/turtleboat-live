import { useRouter } from "next/router";
import Image from "next/image";
import { useNotification } from "@/lib/useNotification";
import assistance_img from "/public/static/images/assistance_black.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Flag from "./Flag";

const RoadAssistancesComponent = () => {
  const router = useRouter();

  const { notifications, setNotifications, setNewMessagesCount } =
    useNotification({ type: "roadside" });

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

  const handleFlag = async (notificationId: string, index: number) => {
    let temp = [...notifications];
    temp[index].isFlag = !temp[index].isFlag;
    setNotifications(temp);
    await fetch("/api/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nid: notificationId,
        isFlag: temp[index].isFlag,
      }),
    });
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
            onClick={() => handleRead(notification._id, idx)}
          >
            <div className="relative flex text-center text-primary-blue">
              <Image src={assistance_img} alt={"Lemonade Icon"} />
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
          <div className="flex text-center justify-center">
            <Flag
              notification={notification}
              idx={idx}
              handleFlag={handleFlag}
            />
            <a
              onClick={() => handleDelete(notification._id, idx)}
              className="cursor-pointer font-Inter text-[10px] text-tertiary-red px-[10px]"
            >
              <DeleteOutlineIcon />
            </a>
          </div>
        </div>
      ))}
      {notifications.length == 0 && (
        <div className="font-Inter text-md">No notifications</div>
      )}
    </div>
  );
};

export default RoadAssistancesComponent;
