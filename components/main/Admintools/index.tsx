import React, { useState } from "react";

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

import Modules from "./Modules";
import Courses from './Courses';
import Ventures from "./Ventures";

const Admintools = () => {
    const tablist = ['Modules', 'Courses', 'Ventures'];
    const [selectedTab, setSelectedTab] = useState(0);

    const tabIcons = [
        <InsertDriveFileIcon key={0}/>,
        <FileCopyRoundedIcon key={1}/>,
        <TipsAndUpdatesOutlinedIcon key={2}/>
    ];
    const tabContents = [
        <Modules key={'module_tab'}/>,
        <Courses key={'course_tab'}/>,
        <Ventures key={'venture_tab'}/>,
    ]


    const handleClick = (index: number) => {
        setSelectedTab(index);
    }

    return (
        <div className="relative">
            <div className="flex flex-row w-full bg-white fixed items-center mt-[-40px] pt-[20px] z-20">
                <div className="hidden items-center text-[20px] font-Inter font-bold lg:flex">
                    <span className="flex"><SettingsOutlinedIcon /></span>
                    <span className="ml-[15px]">Admin Settings</span>
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
                                                <span className="hidden sm:flex">{tabIcons[index]}</span>
                                                <span className="sm:ml-[15px]">{item}</span>
                                            </div>

                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            {/* <div className="h-[100px] fixed bg-black w-full z-10"></div> */}

            {
                selectedTab == 0 ?
                <Modules key={'module_tab'}/> : 
                selectedTab == 1 ?
                <Courses key={'course_tab'}/> :
                <Ventures key={'venture_tab'}/>
            }
        </div>
    )
}

export default Admintools;