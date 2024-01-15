import { useEffect } from "react";
import NotificationTabs from "@/components/main/NotificationTabs";
import NotificationGroup from "@/components/NotificationGroup";

const Messages = () => {
  useEffect(() => {
    document.title = "Notification Logs - Turtle Boat";
  }, []);

  return (
    <>
      <NotificationTabs selectedTab={0} />
      <NotificationGroup />
    </>
  );
};

export default Messages;
