import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Image from 'next/image';
import { Transition } from '@headlessui/react'
import LockIcon from '@mui/icons-material/Lock';

import SettingSvg from '@/public/static/images/puzzle/setting.svg';
import CharacterSvg from '@/public/static/images/puzzle/character.svg';
import ProblemSvg from '@/public/static/images/puzzle/problem.svg';
import SolutionSvg from '@/public/static/images/puzzle/solution.svg';
import SettingHoverSvg from '@/public/static/images/puzzle/setting_hover.svg';
import CharacterHoverSvg from '@/public/static/images/puzzle/character_hover.svg';
import ProblemHoverSvg from '@/public/static/images/puzzle/problem_hover.svg';
import SolutionHoverSvg from '@/public/static/images/puzzle/solution_hover.svg';
import PillarSvg from "/public/static/images/pillar.svg";
import SettingDoc from "/public/static/images/puzzle/setting_document.png";
import CharacterDoc from "/public/static/images/puzzle/character_document.png";
import SolutionDoc from "/public/static/images/puzzle/solution_document.png";
import ProblemDoc from "/public/static/images/puzzle/problem_document.png";

import Piece01 from '@/public/static/images/puzzle/piece_0_1.svg';
import Piece02 from '@/public/static/images/puzzle/piece_0_2.svg';
import Piece10 from '@/public/static/images/puzzle/piece_1_0.svg';
import Piece11 from '@/public/static/images/puzzle/piece_1_1.svg';
import Piece12 from '@/public/static/images/puzzle/piece_1_2.svg';
import Piece13 from '@/public/static/images/puzzle/piece_1_3.svg';
import Piece20 from '@/public/static/images/puzzle/piece_2_0.svg';
import Piece21 from '@/public/static/images/puzzle/piece_2_1.svg';
import Piece22 from '@/public/static/images/puzzle/piece_2_2.svg';
import Piece23 from '@/public/static/images/puzzle/piece_2_3.svg';
import Piece30 from '@/public/static/images/puzzle/piece_3_0.svg';
import Piece31 from '@/public/static/images/puzzle/piece_3_1.svg';
import Piece32 from '@/public/static/images/puzzle/piece_3_2.svg';
import Piece33 from '@/public/static/images/puzzle/piece_3_3.svg';
import Piece34 from '@/public/static/images/puzzle/piece_3_4.svg';
import Piece40 from '@/public/static/images/puzzle/piece_4_0.svg';
import Piece41 from '@/public/static/images/puzzle/piece_4_1.svg';
import Piece42 from '@/public/static/images/puzzle/piece_4_2.svg';
import Piece43 from '@/public/static/images/puzzle/piece_4_3.svg';
import Piece50 from '@/public/static/images/puzzle/piece_5_0.svg';
import Piece51 from '@/public/static/images/puzzle/piece_5_1.svg';
import Piece52 from '@/public/static/images/puzzle/piece_5_2.svg';
import Piece53 from '@/public/static/images/puzzle/piece_5_3.svg';
import Piece61 from '@/public/static/images/puzzle/piece_6_1.svg';
import Piece62 from '@/public/static/images/puzzle/piece_6_2.svg';

import PieceActive01 from '@/public/static/images/puzzle/piece_0_1_active.svg';
import PieceActive02 from '@/public/static/images/puzzle/piece_0_2_active.svg';
import PieceActive10 from '@/public/static/images/puzzle/piece_1_0_active.svg';
import PieceActive11 from '@/public/static/images/puzzle/piece_1_1_active.svg';
import PieceActive12 from '@/public/static/images/puzzle/piece_1_2_active.svg';
import PieceActive13 from '@/public/static/images/puzzle/piece_1_3_active.svg';
import PieceActive20 from '@/public/static/images/puzzle/piece_2_0_active.svg';
import PieceActive21 from '@/public/static/images/puzzle/piece_2_1_active.svg';
import PieceActive22 from '@/public/static/images/puzzle/piece_2_2_active.svg';
import PieceActive23 from '@/public/static/images/puzzle/piece_2_3_active.svg';
import PieceActive30 from '@/public/static/images/puzzle/piece_3_0_active.svg';
import PieceActive31 from '@/public/static/images/puzzle/piece_3_1_active.svg';
import PieceActive32 from '@/public/static/images/puzzle/piece_3_2_active.svg';
import PieceActive33 from '@/public/static/images/puzzle/piece_3_3_active.svg';
import PieceActive34 from '@/public/static/images/puzzle/piece_3_4_active.svg';
import PieceActive40 from '@/public/static/images/puzzle/piece_4_0_active.svg';
import PieceActive41 from '@/public/static/images/puzzle/piece_4_1_active.svg';
import PieceActive42 from '@/public/static/images/puzzle/piece_4_2_active.svg';
import PieceActive43 from '@/public/static/images/puzzle/piece_4_3_active.svg';
import PieceActive50 from '@/public/static/images/puzzle/piece_5_0_active.svg';
import PieceActive51 from '@/public/static/images/puzzle/piece_5_1_active.svg';
import PieceActive52 from '@/public/static/images/puzzle/piece_5_2_active.svg';
import PieceActive53 from '@/public/static/images/puzzle/piece_5_3_active.svg';
import PieceActive61 from '@/public/static/images/puzzle/piece_6_1_active.svg';
import PieceActive62 from '@/public/static/images/puzzle/piece_6_2_active.svg';

import PieceTrans01 from '@/public/static/images/puzzle/piece_0_1_trans.svg';
import PieceTrans02 from '@/public/static/images/puzzle/piece_0_2_trans.svg';
import PieceTrans10 from '@/public/static/images/puzzle/piece_1_0_trans.svg';
import PieceTrans11 from '@/public/static/images/puzzle/piece_1_1_trans.svg';
import PieceTrans12 from '@/public/static/images/puzzle/piece_1_2_trans.svg';
import PieceTrans13 from '@/public/static/images/puzzle/piece_1_3_trans.svg';
import PieceTrans20 from '@/public/static/images/puzzle/piece_2_0_trans.svg';
import PieceTrans21 from '@/public/static/images/puzzle/piece_2_1_trans.svg';
import PieceTrans22 from '@/public/static/images/puzzle/piece_2_2_trans.svg';
import PieceTrans23 from '@/public/static/images/puzzle/piece_2_3_trans.svg';
import PieceTrans30 from '@/public/static/images/puzzle/piece_3_0_trans.svg';
import PieceTrans31 from '@/public/static/images/puzzle/piece_3_1_trans.svg';
import PieceTrans32 from '@/public/static/images/puzzle/piece_3_2_trans.svg';
import PieceTrans33 from '@/public/static/images/puzzle/piece_3_3_trans.svg';
import PieceTrans34 from '@/public/static/images/puzzle/piece_3_4_trans.svg';
import PieceTrans40 from '@/public/static/images/puzzle/piece_4_0_trans.svg';
import PieceTrans41 from '@/public/static/images/puzzle/piece_4_1_trans.svg';
import PieceTrans42 from '@/public/static/images/puzzle/piece_4_2_trans.svg';
import PieceTrans43 from '@/public/static/images/puzzle/piece_4_3_trans.svg';
import PieceTrans50 from '@/public/static/images/puzzle/piece_5_0_trans.svg';
import PieceTrans51 from '@/public/static/images/puzzle/piece_5_1_trans.svg';
import PieceTrans52 from '@/public/static/images/puzzle/piece_5_2_trans.svg';
import PieceTrans53 from '@/public/static/images/puzzle/piece_5_3_trans.svg';
import PieceTrans61 from '@/public/static/images/puzzle/piece_6_1_trans.svg';
import PieceTrans62 from '@/public/static/images/puzzle/piece_6_2_trans.svg';
import WonderSquareBackground from '@/public/static/images/puzzle/wonder4_bg.png';
import Spinner from '../Spinner';
import Swal from 'sweetalert2';

const defaultPieces = [
    {
        _id: '',
        isCheck: false,
        isCheckedOff: false,
        isLock: true,
        title: '',
        ventureId: ''
    },
    {
        _id: '',
        isCheck: false,
        isCheckedOff: false,
        isLock: true,
        title: '',
        ventureId: ''
    },
    {
        _id: '',
        isCheck: false,
        isCheckedOff: false,
        isLock: true,
        title: '',
        ventureId: ''
    },
    {
        _id: '',
        isCheck: false,
        isCheckedOff: false,
        isLock: true,
        title: '',
        ventureId: ''
    },
    {
        _id: '',
        isCheck: false,
        isCheckedOff: false,
        isLock: true,
        title: '',
        ventureId: ''
    },
    {
        _id: '',
        isCheck: false,
        isCheckedOff: false,
        isLock: true,
        title: '',
        ventureId: ''
    }
]

export default function WonderSquarePuzzle({
    type,
    settings,
    characters,
    solutions,
    problems,
    startingPoint,
    ventureId,
    memberType,
    storyTrain
}: {
    type: string
    settings: any[],
    characters: any[],
    solutions: any[],
    problems: any[],
    startingPoint: any,
    ventureId: string | undefined,
    memberType: string,
    storyTrain: any | undefined
}) {
    const router = useRouter();
    const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isStoryContentEmpty, setIsStoryContentEmpty] = useState<boolean>(false);
    const [settingPieces, setSettingPieces] = useState<any[]>(defaultPieces);
    const [characterPieces, setCharacterPieces] = useState<any[]>(defaultPieces);
    const [solutionPieces, setSolutionPieces] = useState<any[]>(defaultPieces);
    const [problemPieces, setProblemPieces] = useState<any[]>(defaultPieces);
    const [showStoryInputModal, setShowStoryInputModal] = useState<boolean>(false);
    const [storyContent, setStoryContent] = useState<string>('');
    const [pillarType, setPillarType] = useState<string>('');
    const [problem, setProblem] = useState<string>('');
    const [setting, setSetting] = useState<string>('');
    const [character, setCharacter] = useState<string>('');
    const [solution, setSolution] = useState<string>('');

    const closeStoryInputModal = () => {
        setShowStoryInputModal(false);
    };

    const handleModuleClicked = (data: any) => {
        if (type != 'guest' && data._id != '' && data.isCheck && !data.isLock) {
            router.push(`/dashboard/myventures/module/${data.ventureId}-${data._id}`);
        }
    }

    const handleStartModuleClicked = () => {
        if (startingPoint?.module._id != "" && startingPoint?.isCheck) {
            router.push(
                `/dashboard/myventures/module/${ventureId}-${startingPoint.module._id}`
            );
        }
    };

    const extractData = (data: any[]) => {
        return defaultPieces.map((item: any, index: number) => {
            if (index < data.length) {
                return {
                    _id: data[index].module._id,
                    isCheck: data[index].isCheck,
                    isCheckedOff: data[index].isCheckedOff,
                    isLock: data[index].isLock,
                    title: data[index].module.title,
                    ventureId: ventureId
                }
            } else {
                return {
                    _id: '',
                    isCheck: false,
                    isCheckedOff: false,
                    isLock: true,
                    title: '',
                    ventureId: ventureId
                }
            }
        })
    }

    const updateStoryData = (data: string) => {
        switch (pillarType) {
            case "problem":
                setProblem(data);
                break;
            case "solution":
                setSolution(data);
                break;
            case "setting":
                setSetting(data);
                break;
            case "character":
                setCharacter(data);
                break;
        }
    }

    const handleUpdateStoryTrain = async (type: string) => {
        if (storyContent != '') {
            if (type == 'draft') {
                setIsSavingDraft(true);
            } else {
                setIsPublishing(true);
            }
            const response = await fetch("/api/storytrain", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vid: ventureId,
                    isDraft: type == 'draft',
                    pillarType: pillarType,
                    content: storyContent
                }),
            });

            if (!response.ok) {
                const { err } = await response.json();
                console.log(err);
                if (type == 'draft') {
                    setIsSavingDraft(false);
                } else {
                    setIsPublishing(false);
                }
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${type == 'draft' ? 'Saving Draft' : 'Publishing'} was failed!`,
                })
                    .then(() => {
                        console.log("Saving failed");
                        setShowStoryInputModal(false);
                    })
                    .catch((err: any) => console.log(err));
            } else {
                if (type == 'draft') {
                    setIsSavingDraft(false);
                } else {
                    setIsPublishing(false);
                }
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    allowOutsideClick: false,
                    text: `${type == 'draft' ? 'Saving Draft' : 'Publishing'} was succeed!`,
                })
                    .then(() => {
                        updateStoryData(storyContent);
                        setShowStoryInputModal(false);
                    })
                    .catch((err: any) => console.log(err));
            }
        } else {
            setIsStoryContentEmpty(true);
        }
    }

    useEffect(() => {
        setSettingPieces(extractData(settings));
    }, [settings]);

    useEffect(() => {
        if (storyTrain != undefined) {
            storyTrain.map((item: any) => {
                switch (item.id) {
                    case "problem":
                        setProblem(item.draft != '' ? item.draft : item.value);
                        break;
                    case "solution":
                        setSolution(item.draft != '' ? item.draft : item.value);
                        break;
                    case "setting":
                        setSetting(item.draft != '' ? item.draft : item.value);
                        break;
                    case "character":
                        setCharacter(item.draft != '' ? item.draft : item.value);
                        break;
                }
            })
        }
    }, [storyTrain]);

    useEffect(() => {
        setCharacterPieces(extractData(characters));
    }, [characters]);

    useEffect(() => {
        setSolutionPieces(extractData(solutions));
    }, [solutions]);

    useEffect(() => {
        setProblemPieces(extractData(problems));
    }, [problems]);

    return (
        <>
            <div className='m-10 font-Inter w-[294px] h-[522px] shadow-lg bg-secondary-gray'>
                <Image src={WonderSquareBackground} className='absolute' alt={'Wonder Square Background'} />
                <div className='grid grid-cols-4 w-fit'>
                    <div
                        className='group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => {
                            if (type != 'guest' && memberType == 'mentee') {
                                setPillarType('setting');
                                setStoryContent(setting ?? '');
                                setShowStoryInputModal(true);
                            }
                        }}
                    >
                        <div className='absolute z-10 bottom-[7px] right-[18px] text-white font-bold flex flex-col items-center'>
                            <span className='text-lg'>Setting</span>
                            <PillarSvg className='group-hover:hidden block' />
                            <Image src={SettingDoc} className='group-hover:block hidden' alt={'Setting'} width={30} />
                            <span className='text-sm'>Summary</span>
                        </div>
                        <SettingSvg width={74} height={68} className='group-hover:hidden block absolute bottom-[25px] -left-[27px] overflow-visible' />
                        <SettingHoverSvg width={74} height={68} className='group-hover:block hidden absolute bottom-[25px] -left-[27px] overflow-visible' />
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(settingPieces[0])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={settingPieces[0]._id != '' && settingPieces[0].isCheck ? settingPieces[0].title : ''}
                    >
                        {
                            !settingPieces[0].isCheckedOff ?
                                <>
                                    <PieceActive01 width={74} height={68} className='group-hover:block hidden absolute -left-[15px] top-[1px] overflow-visible z-20' />
                                    <Piece01 width={74} height={68} className='group-hover:hidden block absolute -left-[15px] top-[1px] overflow-visible z-10' />
                                </> :
                                <PieceTrans01 width={74} height={68} className='absolute -left-[15px] top-[1px] overflow-visible z-10' />
                        }
                        {
                            settingPieces[0]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold ${settingPieces[0].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(characterPieces[0])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={characterPieces[0]._id != '' && characterPieces[0].isCheck ? characterPieces[0].title : ''}
                    >
                        {
                            !characterPieces[0].isCheckedOff ?
                                <>
                                    <PieceActive02 width={74} height={68} className='group-hover:block hidden absolute -left-[4px] top-[1px] overflow-visible z-20' />
                                    <Piece02 width={74} height={68} className='group-hover:hidden block absolute -left-[4px] top-[1px] overflow-visible z-10' />
                                </> :
                                <PieceTrans02 width={74} height={68} className='absolute -left-[4px] top-[1px] overflow-visible z-10' />
                        }
                        {
                            characterPieces[0]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold ${characterPieces[0].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 text-gray-500' />
                        }
                    </div>
                    <div
                        className='group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => {
                            if (type != 'guest' && memberType == 'mentee') {
                                setPillarType('character');
                                setStoryContent(character ?? '');
                                setShowStoryInputModal(true);
                            }
                        }}
                    >
                        <div className='absolute z-10 bottom-[7px] -right-[18px] text-white font-bold flex flex-col items-center'>
                            <span className='text-lg'>Character</span>
                            <PillarSvg className='group-hover:hidden block' />
                            <Image src={CharacterDoc} className='group-hover:block hidden' alt={'Character'} width={30} />
                            <span className='text-sm'>Summary</span>
                        </div>
                        <CharacterHoverSvg width={74} height={68} className='group-hover:block hidden absolute bottom-[25px] -left-[4px] overflow-visible' />
                        <CharacterSvg width={74} height={68} className='group-hover:hidden block absolute bottom-[25px] -left-[4px] overflow-visible' />
                    </div>
                </div>
                <div className='grid grid-cols-4 w-fit'>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(settingPieces[1])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={settingPieces[1]._id != '' && settingPieces[1].isCheck ? settingPieces[1].title : ''}
                    >
                        {
                            !settingPieces[1].isCheckedOff ?
                                <>
                                    <PieceActive10 width={74} height={68} className='group-hover:block hidden absolute -top-[4px] left-[0px] overflow-visible z-20' />
                                    <Piece10 width={74} height={68} className='group-hover:hidden block absolute -top-[4px] left-[0px] overflow-visible z-10' />
                                </> :
                                <PieceTrans10 width={74} height={68} className='absolute -top-[4px] left-[0px] overflow-visible z-10' />
                        }
                        {
                            settingPieces[1]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[4px] ${settingPieces[1].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[4px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(settingPieces[2])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={settingPieces[2]._id != '' && settingPieces[2].isCheck ? settingPieces[2].title : ''}
                    >
                        {
                            !settingPieces[2].isCheckedOff ?
                                <>
                                    <PieceActive11 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[17px] -left-[5px] overflow-visible' />
                                    <Piece11 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[17px] -left-[5px] overflow-visible' />
                                </> :
                                <PieceTrans11 width={74} height={68} className='z-10 absolute -top-[17px] -left-[5px] overflow-visible' />
                        }
                        {
                            settingPieces[2]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[4px] ${settingPieces[2].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[4px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(characterPieces[1])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={characterPieces[1]._id != '' && characterPieces[1].isCheck ? characterPieces[1].title : ''}
                    >
                        {
                            !characterPieces[1].isCheckedOff ?
                                <>
                                    <PieceActive12 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[20px] -left-[20px] overflow-visible' />
                                    <Piece12 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[20px] -left-[20px] overflow-visible' />
                                </> :
                                <PieceTrans12 width={74} height={68} className='z-10 absolute -top-[20px] -left-[20px] overflow-visible' />
                        }
                        {
                            characterPieces[1]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[4px] ${characterPieces[1].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[4px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(characterPieces[2])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={characterPieces[2]._id != '' && characterPieces[2].isCheck ? characterPieces[2].title : ''}
                    >
                        {
                            !characterPieces[2].isCheckedOff ?
                                <>
                                    <PieceActive13 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[7px] -left-[20px] overflow-visible' />
                                    <Piece13 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[7px] -left-[20px] overflow-visible' />
                                </> :
                                <PieceTrans13 width={74} height={68} className='z-10 absolute -top-[7px] -left-[20px] overflow-visible' />
                        }
                        {
                            characterPieces[2]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[4px] ${characterPieces[2].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[4px] text-gray-500' />
                        }
                    </div>
                </div>
                <div className='grid grid-cols-4 w-fit'>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(settingPieces[3])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={settingPieces[3]._id != '' && settingPieces[3].isCheck ? settingPieces[3].title : ''}
                    >
                        {
                            !settingPieces[3].isCheckedOff ?
                                <>
                                    <PieceActive20 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[8px] left-[0px] overflow-visible' />
                                    <Piece20 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[8px] left-[0px] overflow-visible' />
                                </> :
                                <PieceTrans20 width={74} height={68} className='z-10 absolute -top-[8px] left-[0px] overflow-visible' />
                        }
                        {
                            settingPieces[3]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[10px] ${settingPieces[3].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[5px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(settingPieces[4])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={settingPieces[4]._id != '' && settingPieces[4].isCheck ? settingPieces[4].title : ''}
                    >
                        {
                            !settingPieces[4].isCheckedOff ?
                                <>
                                    <PieceActive21 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[6px] -left-[21px] overflow-visible' />
                                    <Piece21 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[6px] -left-[21px] overflow-visible' />
                                </> :
                                <PieceTrans21 width={74} height={68} className='z-10 absolute -top-[6px] -left-[21px] overflow-visible' />
                        }
                        {
                            settingPieces[4]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[10px] ${settingPieces[4].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[5px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(characterPieces[3])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={characterPieces[3]._id != '' && characterPieces[3].isCheck ? characterPieces[3].title : ''}
                    >
                        {
                            !characterPieces[3].isCheckedOff ?
                                <>
                                    <PieceActive22 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[18px] -left-[5px] overflow-visible' />
                                    <Piece22 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[18px] -left-[5px] overflow-visible' />
                                </> :
                                <PieceTrans22 width={74} height={68} className='z-10 absolute -top-[18px] -left-[5px] overflow-visible' />
                        }
                        {
                            characterPieces[3]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[10px] ${characterPieces[3].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[10px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(characterPieces[4])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={characterPieces[4]._id != '' && characterPieces[4].isCheck ? characterPieces[4].title : ''}
                    >
                        {
                            !characterPieces[4].isCheckedOff ?
                                <>
                                    <PieceActive23 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[9px] -left-[21px] overflow-visible' />
                                    <Piece23 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[9px] -left-[21px] overflow-visible' />
                                </> :
                                <PieceTrans23 width={74} height={68} className='z-10 absolute -top-[9px] -left-[21px] overflow-visible' />
                        }
                        {
                            characterPieces[4]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[10px] ${characterPieces[4].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[10px] text-gray-500' />
                        }
                    </div>
                </div>
                <div className='grid grid-cols-4 w-[300px]'>
                    <div className='relative w-[74px] h-[136px] flex items-center justify-center'>
                        {
                            settingPieces[5]._id != '' ?
                                <span className={`overflow-visible z-30 font-bold absolute top-[15px] ${settingPieces[5].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-30 font-bold absolute top-[15px] text-gray-500' />
                        }
                        {
                            solutionPieces[5]._id != '' ?
                                <span className={`overflow-visible z-30 font-bold absolute bottom-[30px] ${solutionPieces[5].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-30 font-bold absolute bottom-[30px] text-gray-500' />
                        }
                        {/* <span className='overflow-visible z-30 font-bold absolute top-[15px]'>?</span>
                    <span className='overflow-visible z-30 font-bold absolute bottom-[30px]'>?</span> */}
                        <div
                            className='hover:cursor-default group'
                            onClick={() => handleModuleClicked(settingPieces[5])}
                            data-tooltip-id={"module-tool-tip"}
                            data-tooltip-content={settingPieces[5]._id != '' && settingPieces[5].isCheck ? settingPieces[5].title : ''}
                        >
                            {
                                !settingPieces[5].isCheckedOff ?
                                    <>
                                        <PieceActive30 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[9px] left-[0px] overflow-visible' />
                                        <Piece30 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[9px] left-[0px] overflow-visible' />
                                    </> :
                                    <PieceTrans30 width={74} height={68} className='z-10 absolute -top-[9px] left-[0px] overflow-visible' />
                            }
                        </div>
                        <div
                            className='hover:cursor-default group'
                            onClick={() => handleModuleClicked(solutionPieces[5])}
                            data-tooltip-id={"module-tool-tip"}
                            data-tooltip-content={solutionPieces[5]._id != '' && solutionPieces[5].isCheck ? solutionPieces[5].title : ''}
                        >
                            {
                                !solutionPieces[5].isCheckedOff ?
                                    <>
                                        <PieceActive31 width={74} height={68} className='group-hover:block hidden z-20 absolute bottom-[24px] left-[0px] overflow-visible' />
                                        <Piece31 width={74} height={68} className='group-hover:hidden block z-10 absolute bottom-[24px] left-[0px] overflow-visible' />
                                    </> :
                                    <PieceTrans31 width={74} height={68} className='z-10 absolute bottom-[24px] left-[0px] overflow-visible' />
                            }
                        </div>
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[148px] h-[136px] flex items-center justify-center col-span-2'
                        onClick={() => handleStartModuleClicked()}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={startingPoint?.module.title}
                        data-tooltip-place="top"
                    >
                        {
                            startingPoint && !startingPoint.isCheckedOff ?
                                <>
                                    <PieceActive32 width={148} height={68} className='group-hover:block hidden z-20 absolute -top-[22px] -left-[19px] overflow-visible' />
                                    <Piece32 width={148} height={68} className='group-hover:hidden block z-10 absolute -top-[22px] -left-[19px] overflow-visible' />
                                </> :
                                <></>
                        }
                        <span className={`overflow-visible z-20 font-bold text-lg -mt-[16px] text-center ${startingPoint?.isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>My Starting<br />Point</span>
                    </div>
                    <div className='relative w-[74px] h-[136x] flex items-center justify-center'>
                        {/* <span className='overflow-visible z-30 font-bold absolute top-[15px] -ml-[10px]'>?</span>
                    <span className='overflow-visible z-30 font-bold absolute bottom-[30px] -ml-[10px]'>?</span> */}
                        {
                            characterPieces[5]._id != '' ?
                                <span className={`overflow-visible z-30 font-bold absolute top-[15px] -ml-[10px] ${characterPieces[5].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-30 font-bold absolute top-[15px] -ml-[10px] text-gray-500' />
                        }
                        {
                            problemPieces[5]._id != '' ?
                                <span className={`overflow-visible z-30 font-bold absolute bottom-[30px] -ml-[10px] ${problemPieces[5].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-30 font-bold absolute bottom-[30px] -ml-[10px] text-gray-500' />
                        }
                        <div
                            className='hover:cursor-default group'
                            onClick={() => handleModuleClicked(characterPieces[5])}
                            data-tooltip-id={"module-tool-tip"}
                            data-tooltip-content={characterPieces[5]._id != '' && characterPieces[5].isCheck ? characterPieces[5].title : ''}
                        >
                            {
                                !characterPieces[5].isCheckedOff ?
                                    <>
                                        <PieceActive33 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[24px] -left-[8px] overflow-visible' />
                                        <Piece33 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[24px] -left-[8px] overflow-visible' />
                                    </> :
                                    <PieceTrans33 width={74} height={68} className='z-10 absolute -top-[24px] -left-[8px] overflow-visible' />
                            }
                        </div>
                        <div
                            className='hover:cursor-default group'
                            onClick={() => handleModuleClicked(problemPieces[5])}
                            data-tooltip-id={"module-tool-tip"}
                            data-tooltip-content={problemPieces[5]._id != '' && problemPieces[5].isCheck ? problemPieces[5].title : ''}
                        >
                            {
                                !problemPieces[5].isCheckedOff ?
                                    <>
                                        <PieceActive34 width={74} height={68} className='group-hover:block hidden z-20 absolute bottom-[11px] -left-[23px] overflow-visible' />
                                        <Piece34 width={74} height={68} className='group-hover:hidden block z-10 absolute bottom-[11px] -left-[23px] overflow-visible' />
                                    </> :
                                    <PieceTrans34 width={74} height={68} className='z-10 absolute bottom-[11px] -left-[23px] overflow-visible' />
                            }
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-4 w-fit'>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(solutionPieces[3])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={solutionPieces[3]._id != '' && solutionPieces[3].isCheck ? solutionPieces[3].title : ''}
                    >
                        {
                            !solutionPieces[3].isCheckedOff ?
                                <>
                                    <PieceActive40 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[18px] left-[0px] overflow-visible' />
                                    <Piece40 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[18px] left-[0px] overflow-visible' />
                                </> :
                                <PieceTrans40 width={74} height={68} className='z-10 absolute -top-[18px] left-[0px] overflow-visible' />
                        }
                        {
                            solutionPieces[3]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[32px] ${solutionPieces[3].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[32px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(solutionPieces[4])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={solutionPieces[4]._id != '' && solutionPieces[4].isCheck ? solutionPieces[4].title : ''}
                    >
                        {
                            !solutionPieces[4].isCheckedOff ?
                                <>
                                    <PieceActive41 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[15px] -left-[15px] overflow-visible' />
                                    <Piece41 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[15px] -left-[15px] overflow-visible' />
                                </> :
                                <PieceTrans41 width={74} height={68} className='z-10 absolute -top-[15px] -left-[15px] overflow-visible' />
                        }
                        {
                            solutionPieces[4]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[32px] ${solutionPieces[4].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[32px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(problemPieces[4])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={problemPieces[4]._id != '' && problemPieces[4].isCheck ? problemPieces[4].title : ''}
                    >
                        {
                            !problemPieces[4].isCheckedOff ?
                                <>
                                    <PieceActive42 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[16px] -left-[19px] overflow-visible' />
                                    <Piece42 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[16px] -left-[19px] overflow-visible' />
                                </> :
                                <PieceTrans42 width={74} height={68} className='z-10 absolute -top-[16px] -left-[19px] overflow-visible' />
                        }
                        {
                            problemPieces[4]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[32px] ${problemPieces[4].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[32px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(problemPieces[3])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={problemPieces[3]._id != '' && problemPieces[3].isCheck ? problemPieces[3].title : ''}
                    >
                        {
                            !problemPieces[3].isCheckedOff ?
                                <>
                                    <PieceActive43 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[17px] -left-[2px] overflow-visible' />
                                    <Piece43 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[17px] -left-[2px] overflow-visible' />
                                </> :
                                <PieceTrans43 width={74} height={68} className='z-10 absolute -top-[17px] -left-[2px] overflow-visible' />
                        }
                        {
                            problemPieces[3]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[32px] ${problemPieces[3].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[32px] text-gray-500' />
                        }
                    </div>
                </div>
                <div className='grid grid-cols-4 w-fit'>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(solutionPieces[1])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={solutionPieces[1]._id != '' && solutionPieces[1].isCheck ? solutionPieces[1].title : ''}
                    >
                        {
                            !solutionPieces[1].isCheckedOff ?
                                <>
                                    <PieceActive50 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[20px] left-[0px] overflow-visible' />
                                    <Piece50 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[20px] left-[0px] overflow-visible' />
                                </> :
                                <PieceTrans50 width={74} height={68} className='z-10 absolute -top-[20px] left-[0px] overflow-visible' />
                        }
                        {
                            solutionPieces[1]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[40px] ${solutionPieces[1].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[40px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(solutionPieces[2])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={solutionPieces[2]._id != '' && solutionPieces[2].isCheck ? solutionPieces[2].title : ''}
                    >
                        {
                            !solutionPieces[2].isCheckedOff ?
                                <>
                                    <PieceActive51 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[33px] -left-[17px] overflow-visible' />
                                    <Piece51 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[33px] -left-[17px] overflow-visible' />
                                </> :
                                <PieceTrans51 width={74} height={68} className='z-10 absolute -top-[33px] -left-[17px] overflow-visible' />
                        }
                        {
                            solutionPieces[2]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[40px] ${solutionPieces[2].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[40px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(problemPieces[2])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={problemPieces[2]._id != '' && problemPieces[2].isCheck ? problemPieces[2].title : ''}
                    >
                        {
                            !problemPieces[2].isCheckedOff ?
                                <>
                                    <PieceActive52 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[36px] -left-[23px] overflow-visible' />
                                    <Piece52 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[36px] -left-[23px] overflow-visible' />
                                </> :
                                <PieceTrans52 width={74} height={68} className='z-10 absolute -top-[36px] -left-[23px] overflow-visible' />
                        }
                        {
                            problemPieces[2]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[40px] ${problemPieces[2].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[40px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(problemPieces[1])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={problemPieces[1]._id != '' && problemPieces[1].isCheck ? problemPieces[1].title : ''}
                    >
                        {
                            !problemPieces[1].isCheckedOff ?
                                <>
                                    <PieceActive53 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[19px] -left-[5px] overflow-visible' />
                                    <Piece53 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[19px] -left-[5px] overflow-visible' />
                                </> :
                                <PieceTrans53 width={74} height={68} className='z-10 absolute -top-[19px] -left-[5px] overflow-visible' />
                        }
                        {
                            problemPieces[1]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[40px] ${problemPieces[1].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[40px] text-gray-500' />
                        }
                    </div>
                </div>
                <div className='grid grid-cols-4 w-fit '>
                    <div
                        className='group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => {
                            if (type != 'guest' && memberType == 'mentee') {
                                setPillarType('solution');
                                setStoryContent(solution ?? '');
                                setShowStoryInputModal(true);
                            }
                        }}
                    >
                        <div className='absolute z-10 -top-[18px] right-[15px] text-white font-bold flex flex-col items-center'>
                            <span className='text-lg'>Solution</span>
                            <PillarSvg className='group-hover:hidden block' />
                            <Image src={SolutionDoc} className='group-hover:block hidden' alt={'Solution'} width={30} />
                            <span className='text-sm'>Summary</span>
                        </div>
                        <SolutionHoverSvg width={74} height={68} className='group-hover:block hidden absolute -top-[37px] -left-[27px] overflow-visible' />
                        <SolutionSvg width={74} height={68} className='group-hover:hidden block absolute -top-[37px] -left-[27px] overflow-visible' />
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(solutionPieces[0])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={solutionPieces[0]._id != '' && solutionPieces[0].isCheck ? solutionPieces[0].title : ''}
                    >
                        {
                            !solutionPieces[0].isCheckedOff ?
                                <>
                                    <PieceActive61 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[35px] -left-[19px] overflow-visible' />
                                    <Piece61 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[35px] -left-[19px] overflow-visible' />
                                </> :
                                <PieceTrans61 width={74} height={68} className='z-10 absolute -top-[35px] -left-[19px] overflow-visible' />
                        }
                        {
                            solutionPieces[0]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[46px] ${solutionPieces[0].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[46px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='hover:cursor-default group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => handleModuleClicked(problemPieces[0])}
                        data-tooltip-id={"module-tool-tip"}
                        data-tooltip-content={problemPieces[0]._id != '' && problemPieces[0].isCheck ? problemPieces[0].title : ''}
                    >
                        {
                            !problemPieces[0].isCheckedOff ?
                                <>
                                    <PieceActive62 width={74} height={68} className='group-hover:block hidden z-20 absolute -top-[33px] -left-[18px] overflow-visible' />
                                    <Piece62 width={74} height={68} className='group-hover:hidden block z-10 absolute -top-[33px] -left-[18px] overflow-visible' />
                                </> :
                                <PieceTrans62 width={74} height={68} className='z-10 absolute -top-[33px] -left-[18px] overflow-visible' />
                        }
                        {
                            problemPieces[0]._id != '' ?
                                <span className={`overflow-visible z-20 font-bold -mt-[46px] ${problemPieces[0].isCheckedOff ? 'text-white' : 'text-[#3a3a3a]'}`}>?</span> :
                                <LockIcon className='overflow-visible z-20 -mt-[46px] text-gray-500' />
                        }
                    </div>
                    <div
                        className='group relative w-[74px] h-[68px] flex items-center justify-center'
                        onClick={() => {
                            if (type != 'guest' && memberType == 'mentee') {
                                setPillarType('problem');
                                setStoryContent(problem ?? '');
                                setShowStoryInputModal(true);
                            }
                        }}
                    >
                        <div className='absolute z-10 -top-[18px] -right-[10px] text-white font-bold flex flex-col items-center'>
                            <span className='text-lg'>Problem</span>
                            <PillarSvg className='group-hover:hidden block' />
                            <Image src={ProblemDoc} className='group-hover:block hidden' alt={'Problem'} width={30} />
                            <span className='text-sm'>Summary</span>
                        </div>
                        <ProblemHoverSvg width={74} height={68} className='group-hover:block hidden absolute -top-[36px] bottom-[25px] -left-[4px] overflow-visible' />
                        <ProblemSvg width={74} height={68} className='group-hover:hidden block absolute -top-[36px] bottom-[25px] -left-[4px] overflow-visible' />
                    </div>
                </div>
            </div>
            <>
                <Transition
                    show={showStoryInputModal}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div
                        className={`fixed top-0 left-0 right-0 w-full flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`}>
                        <div className="relative w-full max-w-3xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <button
                                    type="button"
                                    className={`absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`}
                                    onClick={closeStoryInputModal}>
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd">
                                        </path>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="px-6 py-4 border-b rounded-t ">
                                    <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
                                        Story Train Editor - {pillarType.toUpperCase()}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div>
                                        {/* <label htmlFor="story" className="block mt-0 font-semibold text-black">Story</label> */}
                                        <textarea rows={4} className="block p-3 w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                                            maxLength={600}
                                            placeholder="Write your story here..."
                                            id="story"
                                            onChange={(e) => {
                                                setStoryContent(e.target.value)
                                                if (e.target.value != '') {
                                                    setIsStoryContentEmpty(false);
                                                }
                                            }}
                                            value={storyContent}
                                        ></textarea>
                                        <div className='text-right'>
                                            <span className="font-Inter">
                                                {storyContent.length}/600
                                            </span>
                                        </div>
                                        {
                                            isStoryContentEmpty && (
                                                <div className="p-1">
                                                    <span className="text-secondary-red text-sm">
                                                        Please write your story.
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                                    <button
                                        type="button"
                                        className={`text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10`}
                                        onClick={() => handleUpdateStoryTrain("draft")}>
                                        {
                                            isSavingDraft ?
                                                <Spinner size={"5"} text={"Saving..."} /> :
                                                'Save draft'
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        className={`text-white bg-primary-blue hover:bg-primary-blue focus:ring-4 focus:outline-none focus:ring-primary-blue font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                                        onClick={() => handleUpdateStoryTrain("publish")}
                                    >
                                        {
                                            isPublishing ?
                                                <Spinner size={"5"} text={"Publishing..."} /> :
                                                'Publish to story train'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </Transition>
                <div className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${!showStoryInputModal ? "hidden" : ""}`}></div>
            </>
        </>
    )
}