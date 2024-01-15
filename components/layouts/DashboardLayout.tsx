import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import LeftSidebar from "../LeftSidebar";
import { useRouter } from "next/router";
import useUserStore from "@/stores/useUserStore";
import Header from "@/components/layouts/Header";
import { User } from "next-auth"
import Spinner from "../Spinner";

const DashboardLayout = ({ noHeader, noSelNav, children, noVerticalPadding }: { noHeader?: boolean, noSelNav?: boolean, children: ReactNode, noVerticalPadding?: boolean }) => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { data: session, status } = useSession();
  const [isUser, setIsUser] = useState(false);
  const user = session?.user as User;

  useEffect(() => {
    if (user !== undefined) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
    if (status == "authenticated" && isUser) {
      setUser(user ?? {});
    }
    else if (status == "unauthenticated") {
      router.push("/");
    }
  }, [status])

  if (status == "authenticated" && isUser) {
    return (
      <>
        <LeftSidebar noSelNav={noSelNav} />
        {/* <main className={`sm:ml-28 md:px-12 sm:px-6 px-4 ${noVerticalPadding ? 'pt-[40px]' : 'py-[40px]'}`}> */}
        <main className={`sm:ml-28`}>
          {
            !noHeader && (
              <Header />
            )
          }
          <div className={`md:px-12 sm:px-6 px-4 ${noVerticalPadding ? 'pt-[40px]' : !noHeader ? 'pb-[40px]': 'py-[40px]'}`}>
            {children}
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="grid place-items-center h-screen">
      <Spinner />
    </div>
  );
};

export default DashboardLayout;
