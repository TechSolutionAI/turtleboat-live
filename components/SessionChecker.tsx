import { useEffect } from "react";
import { getSession } from "next-auth/react";

const SessionChecker = () => {
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        // handle expired session scenario here
      }
    };

    const intervalId = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default SessionChecker;