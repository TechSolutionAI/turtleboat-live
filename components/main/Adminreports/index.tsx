import React, { useState } from "react";

import Redemption from "./Redemption";

const Adminreports = () => {
    const tablist = ['Redemption'];
    const [selectedTab, setSelectedTab] = useState(0);

    const tabContents = [
        <Redemption key={'redemption_tab'}/>,
    ]

    const handleClick = (index: number) => {
        setSelectedTab(index);
    }

    return (
        <div className="relative">
            <div className="flex flex-row w-full bg-white fixed items-center mt-[-40px] pt-[20px] z-20">
                <div className="hidden items-center text-[20px] font-Inter font-bold lg:flex">
                    <h1>Admin Reports</h1>
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
            {/* <div className="h-[100px] fixed bg-black w-full z-10"></div> */}

            {
                selectedTab == 0 ?
                <Redemption key={'redemption_tab'}/> : 
                <></>
            }
        </div>
    )
}

export default Adminreports;