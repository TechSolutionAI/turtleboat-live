import React, { useEffect, useRef, useState } from 'react';
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Image from 'next/image';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import OutsideClickHandler from 'react-outside-click-handler';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { ComicPanel, ComicStrip } from '@/types/comicstrip.type';
import ProblemComicGenerator from './ProblemComic';
import SolutionComicGenerator from './SolutionComic';
import comic_logo from '/public/static/images/comic_generator_logo.png';
import Spinner from '@/components/Spinner';

const ComicStripGenerator = () => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const router = useRouter();
    const { id, tab } = router.query;
    let ventureId = "";
    let tabIndex = 0;
    if (typeof id === 'string' && id !== '') {
        ventureId = id.toString();
    }
    if (typeof tab === 'string' && tab !== '') {
        tabIndex = parseInt(tab.toString());
    }
    const tablist = ['The Problem', 'The Solution'];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [saveDropdownOpen, setSaveDropdownOpen] = useState<boolean>(false);
    const [selectedVentureIndex, setSelectedVentureIndex] = useState<number>(-1);
    const [selectedTab, setSelectedTab] = useState(0);
    const [problemComicStrip, setProblemComicStrip] = useState<ComicStrip | null | undefined>();
    const [solutionComicStrip, setSolutionComicStrip] = useState<ComicStrip | null | undefined>();
    const [ventureList, setVentureList] = useState<any[]>([]);

    const tabIcons = [
        <HelpOutlineIcon key={0}/>,
        <ExtensionOutlinedIcon key={1}/>,
        <AutoAwesomeMosaicOutlinedIcon key={2}/>
    ];
    
    useEffect(() => {
        document.title = "Guest ToolBox - Comic Strip Generator - Turtle Boat";
        setIsEditable(true);
        setSelectedTab(tabIndex);
    }, []);

    const handleClick = (index: number) => {
        setSelectedTab(index);
    }

    const handleBack = () => {
        router.push(`/guest/toolbox`);
    }

    const updateData = (data: ComicStrip) => {
        if (selectedTab == 0) {
            setProblemComicStrip(data);
        } else if (selectedTab == 1) {
            setSolutionComicStrip(data);
        }
    }

    const saveComicStrip = async (index: number) => {
        Swal.fire({
            title: 'Alert',
            text: `In order to save, you need to sign in first.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sign In',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.push('/auth/signin');
            }
        })
    }

    return (
        <div className="relative">
            <div className="flex flex-row comic-generator-header bg-white fixed items-center mt-[-40px] pt-[20px] pb-[20px] z-20 md:-ml-12 sm:-ml-6 -ml-4 border-b-4 border-b-[#424242] justify-center lg:justify-between pr-4">
                <div className="hidden items-center text-[20px] lg:flex absolute top-0">
                    <span className="ml-[30px]">
                        <Image src={comic_logo} alt={'Comic Strip Generator'} />
                    </span>
                </div>
                <div className="flex justify-center lg:pl-[250px] xl:pl-[300px] sm-w-full">
                    <ul className="flex text-gray-500">
                        {
                            tablist.map((item: string, index: number) => {
                                return (
                                    <li className="mr-2" key={`tab-${index}`}>
                                        <a href="#"
                                            className={`inline-flex p-4 border-b-2 text-[16px] font-Inter font-semibold ${selectedTab == index ? 'text-tertiary-red border-tertiary-red' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                                            onClick={() => handleClick(index)}
                                        >
                                            <div className="flex items-center truncate">
                                                <span className="hidden sm:flex">{tabIcons[index]}</span>
                                                <span className="sm:ml-[10px]">{item}</span>
                                            </div>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {
                    isEditable ? 
                    <div className='flex relative'>
                        {
                            ventureId != '' ? 
                                <button
                                    className="bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                                    type="button"
                                    onClick={() => saveComicStrip(-1)}
                                >
                                    {isSaving ? <Spinner text='Saving'/> : 'Save'}
                                </button>
                            :
                            <button
                                className="flex items-center justify-center bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                                type="button"
                                onClick={() => {
                                    if (session != undefined) {
                                        setSaveDropdownOpen(!saveDropdownOpen);
                                    } else {
                                        // Alert Part for Non-members
                                        saveComicStrip(-1);
                                    }
                                }}
                            >
                                {isSaving ? <Spinner text='Saving'/> : 'Save to Venture'}
                                <span className="flex"><KeyboardArrowDownRoundedIcon /></span>
                            </button>
                        }
                        {
                            saveDropdownOpen && (
                                <OutsideClickHandler onOutsideClick={() => setSaveDropdownOpen(false)}>
                                    <div className={`absolute left-0 z-0 top-10 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}>
                                        <ul className='font-Inter font-semibold text-sm px-0'>
                                            {
                                                ventureList.map((option: any, index: number) => {
                                                    return (
                                                        <li
                                                            key={`venture_item_${index}`}
                                                            className='flex items-center justify-between px-[20px] py-[10px] cursor-default border-b-2 border-secondary-gray'
                                                            onClick={() => {
                                                                setSaveDropdownOpen(!saveDropdownOpen);
                                                                setSelectedVentureIndex(index);
                                                                saveComicStrip(index);
                                                            }}
                                                        >
                                                            {option.label}
                                                            {
                                                                index == selectedVentureIndex && <CheckCircleIcon fontSize="small" />
                                                            }
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </OutsideClickHandler>
                            )
                        }
                        <button
                            className="flex ml-[15px] bg-white text-primary-black active:bg-primary-black px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                            type="button"
                            onClick={handleBack}
                        >
                            <span className="flex"><KeyboardBackspaceIcon /></span>
                            <span className="ml-[15px]">Back</span>
                        </button>
                    </div> : 
                    <div className='flex'>
                        <button
                            className="flex ml-[15px] bg-white text-primary-black active:bg-white px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                            type="button"
                            onClick={handleBack}
                        >
                            <span className="flex"><KeyboardBackspaceIcon /></span>
                            <span className="ml-[15px]">Back to Venture</span>
                        </button>
                    </div>
                }
            </div>
            {/* <div className="h-[100px] fixed bg-black w-full z-10"></div> */}
            {   
                isLoading ? 
                <div className='pt-[60px] overflow-x-hidden overflow-y-auto md:-mx-12 sm:-mx-6 -mx-4 comicstrip-panel grid grid-cols-1 lg:grid-cols-12'>
                    <Spinner text={'Loading Comic Strip Panels...'} classStr='flex justify-center items-center lg:col-span-12 col-span-1'/>
                </div> :
                selectedTab == 0 ?
                <ProblemComicGenerator key={'problem_comic'} data={problemComicStrip} updateData={updateData} isEditable={isEditable}/> : 
                selectedTab == 1 ?
                <SolutionComicGenerator key={'solution_comic'} data={solutionComicStrip} updateData={updateData} isEditable={isEditable}/> :
                <SolutionComicGenerator key={'solution_comic'} data={solutionComicStrip} updateData={updateData} isEditable={isEditable}/>
            }
        </div>
    );
};

export default ComicStripGenerator;