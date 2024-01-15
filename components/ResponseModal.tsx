import styles from './ResponseModal.module.css'
import 'react-tagsinput/react-tagsinput.css'

import { useState } from 'react'
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import TagsInput from 'react-tagsinput'
import { Transition } from '@headlessui/react'
import validator from "validator";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2"

const ResponseModal = ({
    showModal,
    closeFunc,
    addResponse,
    isTextResponse,
    ventureId,
    mentee
}: {
    showModal: boolean,
    closeFunc: Function,
    addResponse: Function,
    isTextResponse: boolean,
    ventureId: string,
    mentee: any
}) => {
    const { data: session } = useSession();
    const user = session?.user as User;

    const onHelpersListChanged = (newHelpersList: Array<string>) => {
        if (newHelpersList.length > helpers.length) {
            let newHelper: string = newHelpersList[newHelpersList.length - 1];
            if (!validator.isEmail(newHelper)) {
                setIsValidEmail(true);
                return;
            }
        }
        setHelpers(newHelpersList);
        setIsValidEmail(false);
    };

    const onCloseBtnClicked = () => {
        setHelpers([]);
        setResponseText('');
        closeFunc();
    };

    const onSaveSuccess = (data: any) => {
        setHelpers([]);
        setResponseText('');
        addResponse(data);
    }

    const handleKeyDown = (e: any) => {
        if (e.keyCode === 186) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // const handleCourseSelected = (value: string) => {
    //   setCourse(value);
    // }

    const onSendResponseBtnClicked = () => {
        const sendResponse = async () => {
            setIsSending(true);
            const response = await fetch('/api/roadassist', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    helpers: helpers,
                    responseContent: responseText,
                    isTextResponse: isTextResponse,
                    vid: ventureId,
                    fromUid: user._id,
                    toUid: mentee._id,
                    email: mentee.email
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
                    'Your response has been sent',
                    'success'
                );
                if (isTextResponse) {
                    onSaveSuccess({
                        user: user,
                        text: responseText,
                        isForward: !isTextResponse
                    });
                } else {
                    onCloseBtnClicked();
                }
            }
        }

        if (isTextResponse) {
            setIsValidEmail(false);
            if (responseText == '') {
                setIsEmptyText(true);
            } else {
                setIsEmptyText(false);
                sendResponse();
            }
        } else {
            if (helpers.length > 0) {
                if (!isValidEmail) {
                    sendResponse();
                }
            } else {
                setIsValidEmail(true);
            }
        }


    }

    const [helpers, setHelpers] = useState<Array<string>>([]);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isEmptyText, setIsEmptyText] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [responseText, setResponseText] = useState<string>('');

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
                                    Response to Help Request
                                </h3>
                            </div>
                            <div className="p-6">
                                {
                                    !isTextResponse && (
                                        <div>
                                            <label htmlFor="email" className="block mb-2 font-semibold text-black">Email addresses <span className="text-secondary-red">*</span></label>
                                            <TagsInput
                                                value={helpers}
                                                onChange={onHelpersListChanged}
                                                className={styles.tagsinput}
                                                tagProps={{
                                                    'className': styles.tagsinputTag,
                                                    'classNameRemove': styles.tagsinputRemove
                                                }}
                                                inputProps={{
                                                    'className': styles.tagsinputInput,
                                                    'placeholder': 'Add an email address and press Enter'
                                                }} />
                                            {
                                                isValidEmail &&
                                                <p className="mt-2 text-sm text-red-600">
                                                    <span className="font-medium">Oops!</span> Please input a valid email and press enter
                                                </p>
                                            }
                                        </div>
                                    )
                                }
                                <div>
                                    <label htmlFor="responseText" className={`block font-semibold text-black ${isTextResponse ? 'mt-0' : 'mt-2'}`}>
                                        {
                                            isTextResponse ?
                                                'Provide advice, thoughts, or reference links you believe will be helpful.'
                                                :
                                                'Enter brief context to your contact before forwarding this help request.'
                                        }
                                        {isTextResponse ? <span className="text-secondary-red">*</span> : ''}
                                    </label>
                                    <textarea rows={4} className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                                        placeholder="Write your response here..."
                                        id="responseText"
                                        onChange={(e) => {
                                            setResponseText(e.target.value)
                                        }}
                                        value={responseText}
                                    ></textarea>
                                    {
                                        isEmptyText &&
                                        <p className="mt-2 text-sm text-red-600">
                                            Please input your response
                                        </p>
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
                                    onClick={onSendResponseBtnClicked}>
                                    {isSending ? <Spinner text='Sending...' /> : 'Send Response'}
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

export default ResponseModal;