import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import OutsideClickHandler from "react-outside-click-handler";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SidebarItem from "./SidebarItem";
import InviteModal from "./InviteModal";
import { useNotification } from "@/lib/useNotification";
import redeem_icon from "/public/static/images/gift.png";
import redeem_active_icon from "/public/static/images/gift_active.png";

const LeftSidebar = ({ noSelNav }: { noSelNav?: boolean }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(-1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUserDropMenu, setShowUserDropMenu] = useState(false);
  const { notifications, newMessagesCount } = useNotification({ type: "all" });

  const user = session?.user as User;

  const urlBtnClicked = (idx: number) => {
    setActiveMenu(idx);
    if (session != undefined) {
      router.push(menuUrls[idx]);
    }
  };

  const inviteBtnClicked = () => {
    setShowInviteModal(true);
    setShowUserDropMenu(!showUserDropMenu);
  };

  const onUserIconClicked = () => {
    setShowUserDropMenu(!showUserDropMenu);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
  };

  const onSignOutBtnClicked = async () => {
    signOut();
  };

  const menu = [
    "CORE",
    "MY VENTURES",
    "TOOL BOX",
    "NOTIFICATION LOGS",
    "ABOUT",
    "REDEEM",
    "FEATURES",
    // user?.role == "admin" ? "INVITE" : "REFERRAL",
  ];

  const menuUrls = [
    "/dashboard/core/makeninety",
    "/dashboard/myventures",
    "/dashboard/toolbox",
    "/dashboard/messages",
    "/dashboard/about",
    "/dashboard/redeem",
    "/dashboard/quickstart",
  ];

  const menuIcons = [
    <GroupsOutlinedIcon key={0} className="m-auto" fontSize="medium" />,
    <EmojiObjectsOutlinedIcon key={1} className="m-auto" fontSize="medium" />,
    <WorkOutlineOutlinedIcon key={2} className="m-auto" fontSize="medium" />,
    <MarkunreadOutlinedIcon key={3} className="m-auto" fontSize="medium" />,
    <InfoOutlinedIcon key={5} className="m-auto" fontSize="medium" />,
    // <RedeemOutlinedIcon key={7} className="m-auto" fontSize="medium" />,
    activeMenu == 5 ? (
      <Image
        key={7}
        src={redeem_active_icon}
        alt="Redeem Icon"
        width={24}
        height={24}
        className="m-auto"
      />
    ) : (
      <Image
        key={7}
        src={redeem_icon}
        alt="Redeem Icon"
        width={24}
        height={24}
        className="m-auto"
      />
    ),
    <RocketLaunchOutlinedIcon key={6} className="m-auto" fontSize="medium" />,
    // <PersonAddOutlinedIcon key={4} className="m-auto" fontSize="medium" />,
  ];

  const menuClickFuncs = [
    () => urlBtnClicked(0),
    () => urlBtnClicked(1),
    () => urlBtnClicked(2),
    () => urlBtnClicked(3),
    () => urlBtnClicked(4),
    () => urlBtnClicked(5),
    () => urlBtnClicked(6),
    // inviteBtnClicked,
  ];

  useEffect(() => {
    if (session != undefined) {
      menuUrls.map((menuUrl: string, index: number) => {
        if (router.pathname.includes(menuUrl)) {
          setActiveMenu(index);
        }
      });
    }
  }, []);

  return (
    <div className="">
      {session != undefined && (
        <>
          <InviteModal
            showModal={showInviteModal}
            closeFunc={closeInviteModal}
          />
          <div
            style={visible ? { display: "flex" } : {}}
            className={`sm:flex hidden flex-col overflow-visible
                        items-center justify-between fixed z-30
                        sm:w-28 w-20 h-screen text-gray-700 bg-gray-100 rounded`}
          >
            <a className="flex w-full px-3 sm:mt-6 mt-3 mb-3 justify-center">
              <Image alt="logo" src="/betalogo.svg" width={80} height={128} />
            </a>
            <div className="w-full">
              <div className="flex flex-col items-center w-full">
                {menu.map((item: string, idx: number) => {
                  return (
                    <SidebarItem
                      key={idx}
                      label={item}
                      badge={
                        menu[idx] == "NOTIFICATION LOGS" ? newMessagesCount : 0
                      }
                      icon={menuIcons[idx]}
                      active={
                        noSelNav ? false : idx == activeMenu ? true : false
                      }
                      clickFunc={menuClickFuncs[idx]}
                    />
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <a
                onClick={onUserIconClicked}
                className="flex items-center justify-center w-full h-16 mb-6"
              >
                <Image
                  alt="user"
                  src={user?.image ?? "/user.png"}
                  width={40}
                  height={40}
                  className="rounded-full cursor-pointer"
                />
                {user.isNewUser && (
                  <div className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-tertiary-red border-2 border-white rounded-full top-2 -right-1"></div>
                )}
              </a>
              {showUserDropMenu && (
                <OutsideClickHandler
                  onOutsideClick={() => setShowUserDropMenu(false)}
                >
                  <ul
                    className={`absolute left-10 bottom-16 z-[1000] 
                                float-left m-0 min-w-max list-none overflow-hidden 
                                rounded-lg border-none bg-white bg-clip-padding 
                                text-left text-base shadow-lg`}
                  >
                    <li>
                      <Link
                        href={"/dashboard/user/profile"}
                        className={`block w-full whitespace-nowrap bg-transparent 
                                    px-4 py-2 text-sm font-normal text-neutral-700 
                                    hover:bg-neutral-100 active:text-neutral-800 
                                    active:no-underline disabled:pointer-events-none 
                                    disabled:bg-transparent disabled:text-neutral-400 
                                    cursor-pointer`}
                      >
                        Profile
                        {user.isNewUser && (
                          <div className="absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-tertiary-red border-2 border-white rounded-full top-2 right-2 dark:border-gray-900"></div>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"#"}
                        onClick={inviteBtnClicked}
                        className={`block w-full whitespace-nowrap bg-transparent 
                                  px-4 py-2 text-sm font-normal text-neutral-700 
                                  hover:bg-neutral-100 active:text-neutral-800 
                                  active:no-underline disabled:pointer-events-none 
                                  disabled:bg-transparent disabled:text-neutral-400 
                                  cursor-pointer`}
                      >
                        {user?.role == "admin" ? "Invite" : "Referral"}
                      </Link>
                    </li>
                    {user?.role == "admin" && (
                      <>
                        <li>
                          <Link
                            href={"/dashboard/admin/usermanage"}
                            className={`block w-full whitespace-nowrap bg-transparent 
                                      px-4 py-2 text-sm font-normal text-neutral-700 
                                      hover:bg-neutral-100 active:text-neutral-800 
                                      active:no-underline disabled:pointer-events-none 
                                      disabled:bg-transparent disabled:text-neutral-400 
                                      cursor-pointer`}
                          >
                            Members
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={"/dashboard/admin/reports"}
                            className={`block w-full whitespace-nowrap bg-transparent 
                                      px-4 py-2 text-sm font-normal text-neutral-700 
                                      hover:bg-neutral-100 active:text-neutral-800 
                                      active:no-underline disabled:pointer-events-none 
                                      disabled:bg-transparent disabled:text-neutral-400 
                                      cursor-pointer`}
                          >
                            Reports
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={"/dashboard/admin/makeninety"}
                            className={`block w-full whitespace-nowrap bg-transparent 
                                      px-4 py-2 text-sm font-normal text-neutral-700 
                                      hover:bg-neutral-100 active:text-neutral-800 
                                      active:no-underline disabled:pointer-events-none 
                                      disabled:bg-transparent disabled:text-neutral-400 
                                      cursor-pointer`}
                          >
                            Core Videos
                          </Link>
                        </li>
                        <li>
                          <a
                            href={"/dashboard/admin/tokensettings"}
                            className={`block w-full whitespace-nowrap  cursor-pointer
                                        bg-transparent px-4 py-2 text-sm font-normal 
                                        text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 
                                        active:no-underline disabled:pointer-events-none disabled:bg-transparent 
                                        disabled:text-neutral-400 `}
                          >
                            Token Settings
                          </a>
                        </li>
                        <li>
                          <a
                            href={"/dashboard/admin/tools"}
                            className={`block w-full whitespace-nowrap  cursor-pointer
                                        bg-transparent px-4 py-2 text-sm font-normal 
                                        text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 
                                        active:no-underline disabled:pointer-events-none disabled:bg-transparent 
                                        disabled:text-neutral-400 `}
                          >
                            Curriculum
                          </a>
                        </li>
                      </>
                    )}
                    <hr
                      className={`my-2 h-0 border border-t-0 border-solid 
                                border-neutral-700 opacity-25`}
                    />
                    <li>
                      <a
                        className={`block w-full whitespace-nowrap bg-transparent cursor-pointer
                                    px-4 py-2 text-sm font-normal text-neutral-700 
                                    hover:bg-neutral-100 active:text-neutral-800 
                                    active:no-underline disabled:pointer-events-none 
                                    disabled:bg-transparent disabled:text-neutral-400 
                                    `}
                        onClick={onSignOutBtnClicked}
                      >
                        Sign Out
                      </a>
                    </li>
                  </ul>
                </OutsideClickHandler>
              )}
            </div>
          </div>
          <div>
            <button
              className={`z-30 inline-flex items-center p-2 text-sm font-medium text-center sm:hidden
                text-gray-900 bg-blue-300 rounded-lg fixed top-1 ${
                  visible ? "left-20" : "left-1"
                }`}
              onClick={() => setVisible(!visible)}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSidebar;
