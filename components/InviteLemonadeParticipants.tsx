import 'react-tagsinput/react-tagsinput.css'

import { useState } from 'react'
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Transition } from '@headlessui/react'
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2"
import UserSelect from '@/components/UserSelect';

interface Option {
    value: string;
    label: string;
    image: string;
    email: string;
}

const InviteLemonadeParticipants = ({
    showModal,
    closeFunc,
    lemonadeId
}: {
    showModal: boolean,
    closeFunc: Function,
    lemonadeId: string
}) => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const [disableList, setDisableList] = useState<Option[]>([{
        email: user.email ?? '',
        label: user.isNewUser ? user.name ?? '' : user?.basicProfile?.firstName + " " + user?.basicProfile?.lastName ?? '',
        image: user.image ?? '',
        value: user._id ?? ''
    }]);

    const onCloseBtnClicked = () => {
        setParticipants([]);
        closeFunc();
    };

    const handleParticipantsSelected = (participantList: any[]) => {
        setParticipants(participantList);
    }

    const onSendClicked = () => {
        const sendInvite = async () => {
            setIsSending(true);
            const participantList = participants.map((participant) => {
                return {
                    _id: participant.value,
                    name: participant.label,
                    image: participant.image,
                    email: participant.email
                }
            })
            const response = await fetch(`/api/lemonades/${lemonadeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    participants: participantList,
                    from: user.name,
                    fromEmail: user.email,
                    image: user.image,
                    fromId: user._id
                })
            });

            if (!response.ok) {
                setIsSending(false);
                const { err } = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err,
                });
            } else {
                setIsSending(false);
                Swal.fire(
                    'Thanks!',
                    'You sent invite message successfully.',
                    'success'
                );
                onCloseBtnClicked();
            }
        }

        if (participants.length > 0) {
            if (!isValidEmail) {
                sendInvite();
            }
        } else {
            setIsValidEmail(true);
        }
    }
    
    const [participantError, setParticipantError] = useState<string>('');
    const [participants, setParticipants] = useState<any[]>([]);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isSending, setIsSending] = useState(false);

    return (
        <>
            <Transition
                show={showModal}
                enter="transition-opacity duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
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
                                    Invite to Coffee Chat
                                </h3>
                            </div>
                            <div className="p-6">
                                <div>
                                    <UserSelect
                                        setData={handleParticipantsSelected}
                                        multiple={true}
                                        disabled={false}
                                        type={"mentee"}
                                        selectedList={[]}
                                        disabledList={disableList}
                                        limit={-1}
                                    />
                                    {
                                        participantError != "" && (
                                            <div className='p-1'>
                                                <span className="text-secondary-red text-sm">
                                                    {
                                                        participantError
                                                    }
                                                </span>
                                            </div>
                                        )
                                    }
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
                                        `text-white bg-primary-blue hover:bg-primary-blue 
                                        focus:ring-4 focus:outline-none focus:ring-primary-blue 
                                        font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                        `}
                                    onClick={onSendClicked}>
                                    {isSending ? <Spinner text='Sending...' /> : 'Send Invite'}
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

export default InviteLemonadeParticipants;