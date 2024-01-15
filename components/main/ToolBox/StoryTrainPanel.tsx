
import { useRouter } from 'next/router';

import Image from 'next/image';
import { Tooltip } from 'react-tooltip';

import TrainImg from '/public/static/images/train.svg';
import OpeningImg from '/public/static/images/train_opening_cartoon.png';
import ProblemImg from '/public/static/images/train_problem_cartoon.png';
import SolutionImg from '/public/static/images/train_solution_cartoon.png';
import SettingImg from '/public/static/images/train_setting_cartoon.png';
import CharacterImg from '/public/static/images/train_character_cartoon.png';
import ClosingImg from '/public/static/images/train_closing_cartoon.png';

const trainAssets = [
    {
        color: '#000000',
        textColor: '#000000',
        img: OpeningImg,
        label: 'Opening Hook'
    },
    {
        color: '#4169e1',
        textColor: '#2a52cb',
        img: ProblemImg,
        label: 'Problem'
    },
    {
        color: '#5A2391',
        textColor: '#5A2391',
        img: CharacterImg,
        label: 'Character'
    },
    {
        color: '#00BEBE',
        textColor: '#027879',
        img: SettingImg,
        label: 'Setting'
    },
    {
        color: '#ff00ff',
        textColor: '#8b008a',
        img: SolutionImg,
        label: 'Solution'
    },
    {
        color: '#000000',
        textColor: '#000000',
        img: ClosingImg,
        label: 'Closing Hook'
    },
]

const StoryTrainPanel = ({
    ventureId,
    memberType,
    data
}: {
    ventureId?: String,
    memberType?: String,
    data?: any[] | null | undefined
}) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/toolbox/storytrain/${ventureId}`);
    }


    return (
        <div className="shadow-md rounded-lg px-6 py-5 flex flex-col justify-between">
            <div className='flex flex-col justify-center'>
                <h2 className='truncate text-lg font-bold font-Inter pt-2'>Story train</h2>
                <p className="font-Inter text-[12px]">With limited characters and re-arrangeable train carts, use this tool to iterate your compelling elevator pitch.  Test how it sounds when you say it out loud by recording it on your dashboard and playing it back. You should be constantly practicing and tweaking your story as you discover your venture&#39;s value proposition.</p>
                <div className='py-8 flex justify-center'>
                    {
                        ventureId == undefined || ventureId == null || data == null ?
                        // <Image src={TrainImg} alt={'Train'} /> 
                        <>
                            {
                                trainAssets.map((item, index) => { 
                                    return (
                                        <div className='relative' key={`train-${index}`}>
                                            <Image src={item.img} alt={`train image`}/>
                                            <p 
                                                className={`font-Inter font-bold pt-5 truncate text-center text-[${trainAssets[index].color}]`}
                                                style={{
                                                    color: `${trainAssets[index].color}`
                                                }}
                                            >
                                                {item.label}
                                            </p>
                                        </div>
                                    )
                                }) 
                            }
                        </>
                        :
                        data != undefined && data.map((item, index) => { 
                            return (
                                <div className='relative' key={`train-${index}`}>
                                    <Image src={trainAssets[item.order].img} alt={item.label}/>
                                    <p 
                                        className={`font-Inter font-bold pt-5 truncate text-center text-[${trainAssets[item.order].color}]`}
                                        style={{
                                            color: `${trainAssets[item.order].color}`
                                        }}
                                    >
                                        {item.label}
                                    </p>
                                    {
                                        index == 0 ? 
                                        <p 
                                            className={`hidden lg:visible absolute w-full top-[30%] pr-[8%] pl-[15%] font-Inter font-bold break-words lg:text-xs xl:line-clamp-3 xl:text-sm text-xs line-clamp-3 text-[${trainAssets[item.order].color}]`}
                                            style={{
                                                color: `${trainAssets[item.order].textColor}`
                                            }}
                                            data-tooltip-id={"train-tool-tip"}
                                            data-tooltip-content={item.value}
                                            data-tooltip-place="top"
                                        >
                                            {item.value}
                                        </p> :
                                        <p 
                                            className={`hidden lg:visible absolute w-full top-[20%] px-[8%] font-Inter font-bold break-words lg:text-xs xl:line-clamp-4 xl:text-sm text-xs line-clamp-3 text-[${trainAssets[item.order].color}]`}
                                            style={{
                                                color: `${trainAssets[item.order].textColor}`
                                            }}
                                            data-tooltip-id={"train-tool-tip"}
                                            data-tooltip-content={item.value}
                                            data-tooltip-place="top"
                                        >
                                            {item.value}
                                        </p>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <Tooltip id={"train-tool-tip"} className={`train-tooltip`}/>
            </div>
            <div className="pt-5 flex justify-end font-Inter">
                {
                    ventureId == undefined || ventureId == null ?
                    <button
                        className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                    >
                        Create
                    </button> :
                    memberType == 'mentee' ? 
                    <button
                        className="text-sm bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleClick}
                    >
                        { data != undefined && data != null ? 'Edit' : 'Create' }
                    </button> :
                    <button
                        className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleClick}
                    >
                        View
                    </button> 
                }
            </div>
        </div>
    )
}

export default StoryTrainPanel;
