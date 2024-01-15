import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import Datepicker from "react-tailwindcss-datepicker";
import Spinner from "@/components/Spinner";
import gift_icon from '/public/static/images/gift_white.png';
import turtle_coin from '/public/static/images/turtle_coin.png';
import Swal from "sweetalert2"

const initDates = [
    { 
        startDate: null,
        endDate: null 
    },
    { 
        startDate: null,
        endDate: null 
    },
    { 
        startDate: null,
        endDate: null 
    },
    { 
        startDate: null,
        endDate: null 
    },
    { 
        startDate: null,
        endDate: null 
    },
]

const ClaimRewardModal = ({
    showModal,
    closeFunc,
    rewardData
}: {
    showModal: boolean,
    closeFunc: Function,
    rewardData: any
}) => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const [isSending, setIsSending] = useState(false);
    const [content, setContent] = useState<string>('');
    const [selectedDates, setSelectedDates] = useState(initDates);
    const [count, setCount] = useState(0);

    const onCloseBtnClicked = () => {
        setCount(0)
        closeFunc();
    };

    const handleDateSelected = (date: any, index: number) => {
        if (date.startDate != null) {
            setCount((count) => count + 1)
        } else {
            setCount((count) => count > 0 ? count - 1 : 0)
        }
        const temp = [...selectedDates];
        temp[index] = date;
        setSelectedDates(temp);
    }

    const sendClaimRequest = async () => {
        if (count > 0) {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("rewardNo", rewardData?.no);
            formData.append("dates", JSON.stringify(selectedDates));
            let username = user.name;
            if (!user.isNewUser && user.basicProfile && user.basicProfile.firstName && user.basicProfile.lastName) {
                username = user.basicProfile?.firstName + ' ' + user.basicProfile?.lastName;
            }
            if (typeof user._id === 'string' && user._id !== '') {
                formData.append("uid", user._id.toString());
            }
            if (typeof username === 'string' && username !== '') {
                formData.append("username", username.toString());
            }

            setIsSending(true);
            const response = await fetch("/api/claimreward", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                setIsSending(false);
                const { err } = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err,
                })
                .then(() => {
                    setIsSending(false);
                })
                .catch((err) => console.log(err));
            } else {
                setIsSending(false);
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    allowOutsideClick: false,
                    text: `Claim Request was sent successfully!`,
                })
                .then(() => {
                    closeFunc();
                })
                .catch((err) => console.log(err));
            }
        }
    }

    useEffect(() => {
        setCount(0)
        setSelectedDates(initDates)
    }, []);

    return (
        <>
            <Transition
                show={showModal}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div
                    className={
                        `fixed top-0 left-0 right-0 w-full flex 
                        justify-center items-center p-4 
                        overflow-x-hidden overflow-y-auto 
                        md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`
                    }>
                    <div className="relative w-full max-w-3xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow">
                            <button
                                type="button"
                                className={
                                    `absolute top-3 right-2.5 
                                    text-gray-400 bg-transparent 
                                    hover:bg-gray-200 hover:text-gray-900 
                                    rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`
                                }
                                onClick={onCloseBtnClicked}>
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
                                Claiming Reward from Token Redemption
                                </h3>
                            </div>
                            <div className='max-h-[750px] overflow-y-scroll'>
                                <div className="px-6 py-3">
                                    <p>
                                        You are chosing to redeem your tokens for the following reward:
                                    </p>
                                    <div className='flex flex-col justify-between gap-x-2 shadow-md font-Inter rounded-lg my-4 mx-0'>
                                        <div className='gap-x-2 flex items-center text-[20px] bg-[#5884F6] rounded-t-lg font-bold text-white px-[40px] py-[10px] '>
                                            <Image src={gift_icon} alt={'Gift Icon'} width={25} height={25}/>
                                            <Link className="block truncate" href={``}>
                                            {rewardData?.name}
                                            </Link>
                                        </div>
                                        <div className='text-[14px] pt-[10px] text-black px-[40px] py-[12px]'>
                                            <p className='pt-1'>{rewardData?.description}</p>
                                        </div>
                                        <div className={`flex items-center px-[35px] py-[12px] justify-between`} >
                                            <div className={`flex items-center gap-x-2`}>
                                                <Image src={turtle_coin} alt={'Token Icon'} width={40} height={40}/>
                                                <label className={`font-Inter font-bold text-[#A57F20] text-[18px]`}>{rewardData?.cost} Tokens</label>
                                            </div>
                                        </div>
                                    </div>
                                    <p>
                                        If redeeming for a virtual meeting, please provide 5 dates you are available between the 4pm to 6pm EST time frame.
                                        Once the meeting has been scheduled, a calendar invite and link will be sent. If the dates do not sync up, we may contact you for additional date options.
                                    </p>
                                </div>
                                <div className="px-6 py-3">
                                    <div>
                                        <label htmlFor="content" className={`block font-semibold text-black mt-0`}>Add Your Dates</label>
                                    </div>
                                    {
                                        selectedDates.map((dateItem: any, index: number) => {
                                            return (
                                                <div key={`date_${index}`} className='py-1'>
                                                    <Datepicker 
                                                        useRange={false} 
                                                        asSingle={true} 
                                                        value={selectedDates[index]} 
                                                        onChange={(date) => handleDateSelected(date, index)}
                                                        minDate={new Date()} 
                                                        maxDate={new Date(new Date().getTime() + (6 * 7 * 24 * 60 * 60 * 1000))}
                                                    /> 
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        count == 0 && (
                                            <p className="mt-2 text-sm text-red-600">
                                                Please select at least a date
                                            </p>
                                        )
                                    }
                                </div>
                                <div className="px-6 py-3">
                                    <div>
                                        <label htmlFor="content" className={`block font-semibold text-black mt-0`}>Add Your Note</label>
                                        <textarea rows={4} className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                                            placeholder="Enter Text here..."
                                            id="content"
                                            onChange={(e) => {
                                                setContent(e.target.value)
                                            }}
                                            value={content}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                                <button
                                    type="button"
                                    className={
                                        `text-gray-500 bg-white hover:bg-gray-100 
                                        focus:ring-4 focus:outline-none focus:ring-gray-200 
                                        rounded-lg border border-gray-200 text-sm font-medium 
                                        px-5 py-2.5 hover:text-gray-900 focus:z-10`}
                                    onClick={onCloseBtnClicked}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={
                                        `text-white bg-[#E8B023] hover:bg-[#E8B023] 
                                        focus:ring-4 focus:outline-none focus:ring-[#E8B023] 
                                        font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                        `}
                                    onClick={sendClaimRequest}>
                                    { isSending ? <Spinner text='Sending...' /> : 'Claim This Reward'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </Transition>
            <div className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${!showModal ? "hidden" : ""}`}></div>
        </>
    );
}

export default ClaimRewardModal;