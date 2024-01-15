import { Notification } from "@/types/notification.type";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/FlagOutlined";

const Flag = ({
  notification,
  idx,
  handleFlag,
}: {
  notification: Notification;
  idx: number;
  handleFlag: Function;
}) => {
  const onClickFlag = (notificationId: string, idx: number) => {
    handleFlag(notificationId, idx);
  };

  return (
    <a
      onClick={() => onClickFlag(notification._id, idx)}
      className="cursor-pointer font-Inter text-[10px]  pl-[10px]"
    >
      {notification.isFlag ? (
        <FlagIcon className="text-tertiary-red" />
      ) : (
        <OutlinedFlagIcon />
      )}
    </a>
  );
};

export default Flag;
