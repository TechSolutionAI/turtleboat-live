import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SidebarItem from "./SidebarItem";

const LeftSidebarForNonMembers = ({ noSelNav }: { noSelNav?: boolean }) => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [activeMenu, setActiveMenu] = useState(-1);
    
    const urlBtnClicked = (idx: number) => {
        setActiveMenu(idx);
        router.push(guestMenuUrls[idx]);
    };

    const guestMenu = [
        "MY VENTURES",
        "TOOL BOX",
        "ABOUT",
    ];

    const guestMenuUrls = [
        "/guest/myventures",
        "/guest/toolbox",
        "/guest/about",
    ];

    const guestMenuIcons = [
        <EmojiObjectsOutlinedIcon key={1} className="m-auto" fontSize="medium" />,
        <WorkOutlineOutlinedIcon key={2} className="m-auto" fontSize="medium" />,
        <InfoOutlinedIcon key={5} className="m-auto" fontSize="medium" />,
    ];

    const guestMenuClickFuncs = [
        () => urlBtnClicked(0),
        () => urlBtnClicked(1),
        () => urlBtnClicked(2),
    ];

    useEffect(() => {
        guestMenuUrls.map((menuUrl: string, index: number) => {
            if (router.pathname.includes(menuUrl)) {
                setActiveMenu(index);
            }
            if (router.pathname == '/') {
                setActiveMenu(0);
            }
        });
    }, []);

    return (
        <div className="">
        {
            <>
            <div
                style={visible ? { display: "flex" } : {}}
                className={`sm:flex hidden flex-col overflow-visible
                            items-center justify-between fixed z-30
                            sm:w-28 w-20 h-screen text-gray-700 bg-gray-100 rounded`}
            >
                <a className="flex w-full px-3 sm:mt-6 mt-3 mb-3 justify-center">
                    <Image alt="logo" src="/betalogo.svg" width={80} height={128} />
                </a>
                <div className="w-full m-auto">
                    <div className="flex flex-col items-center w-full">
                    {
                        guestMenu.map((item: string, idx: number) => {
                            return (
                                <SidebarItem
                                    key={idx}
                                    label={item}
                                    badge={0}
                                    icon={guestMenuIcons[idx]}
                                    active={noSelNav ? false : idx == activeMenu ? true : false}
                                    clickFunc={guestMenuClickFuncs[idx]}
                                />
                            );
                        })
                    }
                    </div>
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
        }
        </div>
    );
};

export default LeftSidebarForNonMembers;
