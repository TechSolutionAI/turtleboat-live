import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from "next/image";
import { useNotification } from "@/lib/useNotification";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';

import LemonadeIcon from "/public/static/images/tab_icons/lemonade.svg";
import LemonadeActiveIcon from "/public/static/images/tab_icons/lemonade_active.svg";

const NotificationTabs = ({
    selectedTab
}: {
    selectedTab: number
}) => {
    const { notifications, newMessagesCount } = useNotification({ type: 'all' });
    const [ hasNewMessages, setHasNewMessages ] = useState<boolean[]>([false, false]);
    const tablist = [
        {
            label: 'Notifications',
            link: '/dashboard/messages' 
        },
        {
            label: 'ERA',
            link: '/dashboard/messages/roadassistances' 
        },
        {
            label: 'Coffee Chat',
            link: '/dashboard/messages/lemonades' 
        }
    ];

    const tabIcons = [
        <HelpOutlineIcon key={0}/>,
        selectedTab == 1 ? <LemonadeActiveIcon alt="Lemonade Tab Selected Icon" key={1}/> : <LemonadeIcon alt="Lemonade Tab Selected Icon" key={1}/>,
        <ExtensionOutlinedIcon key={2}/>,
    ];

    useEffect(() => {
        let hasNormalUnreadMsg = false;
        let hasRoadsideUnreadMsg = false;
        let hasLemonadeUnreadMsg = false;
        notifications.map((notification: any) => {
            if (!notification.isRead) {
                console.log(notification.type)
                if (notification.type != undefined && notification.type == 'roadside') {
                    hasRoadsideUnreadMsg = true;
                } else if (notification.type != undefined && notification.type == 'lemonade') {
                    hasLemonadeUnreadMsg = true;
                } else {
                    hasNormalUnreadMsg = true;
                }
            }
        })
        setHasNewMessages([hasNormalUnreadMsg, hasRoadsideUnreadMsg, hasLemonadeUnreadMsg]);
    }, [newMessagesCount]);

    return (
        <>
            <div className='block lg:flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4'>
                <h1 className="font-Inter font-bold text-[20px] lg:text-[24px] text-primary-black ">Notification Logs</h1>
                <div className="flex justify-center sm-w-full">
                    <ul className="block md:flex text-gray-500">
                        {
                            tablist.map((item, index) => {
                                return (
                                    <li className="mr-2 flex items-center" key={`tab-${index}`}>
                                        <Link href={item.link}
                                            className={`relative w-full inline-flex p-4 border-b-2 text-[16px] font-Inter font-semibold ${selectedTab == index ? 'text-tertiary-red border-tertiary-red' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                                        >
                                            <div className="flex items-center">
                                                <span className="hidden sm:flex">{tabIcons[index]}</span>
                                                <span className="sm:ml-[10px] sm:max-w-fit md:max-w-[150px] lg:max-w-fit truncate">{item.label}</span>
                                                {
                                                    hasNewMessages[index] && (
                                                        <div className="absolute inline-flex items-center justify-center w-2 h-2 text-xs sm:w-3 sm:h-3 sm:text-sm font-bold text-white bg-[#FFB545] rounded-full top-3 sm:top-2 right-2"></div>
                                                    )
                                                }
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NotificationTabs;