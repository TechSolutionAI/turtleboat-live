import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';

import Earning from "./Earning";
import Rewards from './Rewards';
import Levels from './Levels';

const TokenSettings = () => {
    const router = useRouter();

    const { tab } = router.query;
    let tabIndex = 0;
    if (typeof tab === 'string' && tab !== '') {
        tabIndex = parseInt(tab.toString());
    }

    const tablist = ['Earning Tokens', 'Rewards', 'Levels'];
    const [selectedTab, setSelectedTab] = useState(0);

    const tabIcons = [
        <InsertDriveFileIcon key={0}/>,
        <FileCopyRoundedIcon key={1}/>
    ];

    const tabContents = [
        <Earning key={'earning_tab'}/>,
        <Rewards key={'rewards_tab'}/>,
        <Levels key={'levelss_tab'}/>
    ]


    const handleClick = (index: number) => {
        setSelectedTab(index);
    }

    useEffect(() => {
        document.title = "Token Setting - Turtle Boat Admin";
        setSelectedTab(tabIndex);
    }, []);

    return (
        <div className="relative">
            <div className="flex flex-row w-full bg-white fixed items-center mt-[-40px] pt-[20px] z-20">
                <div className="hidden items-center text-[24px] font-Inter font-bold md:flex">
                    <h1 className="ml-[15px]">Token Settings</h1>
                </div>
                <div className="flex justify-center lg:pl-[150px] xl:pl-[300px] sm-w-full">
                    <ul className="flex text-gray-500">
                        {
                            tablist.map((item: string, index: number) => {
                                return (
                                    <li className="mr-2" key={`tab-${index}`}>
                                        <a href="#"
                                            className={`inline-flex p-4 border-b-2 text-[16px] font-Inter font-semibold ${selectedTab == index ? 'text-tertiary-red border-tertiary-red' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                                            onClick={() => handleClick(index)}
                                        >
                                            <div className="flex items-center">
                                                {/* <span className="hidden sm:flex">{tabIcons[index]}</span> */}
                                                <span>{item}</span>
                                            </div>

                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            {
                selectedTab == 0 ?
                <Earning key={'earning_tab'}/> :
                selectedTab == 1 ? 
                <Rewards key={'rewards_tab'}/> :
                <Levels key={'levels_tab'}/>
            }
        </div>
    )
}

export default TokenSettings;