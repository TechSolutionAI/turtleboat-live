import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import { ModuleItem } from '@/types/module.type';

import Image from 'next/image'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IcoDocument from '/public/static/images/document.svg'

import Spinner from '@/components/Spinner';
import CommentItem from './CommentItem';
import { Comment } from '@/types/module.type';
const EditorView = dynamic(() => import("@/components/EditorView"), { ssr: false });

const Index = () => {
    const { data: session } = useSession();
    const router = useRouter();
    let selectedVentureId = localStorage.getItem('selectedVentureId');
    let moduleId = "";
    const { id } = router.query;
    if (typeof id === 'string' && id !== '') {
        selectedVentureId = id.split("-")[0];
        moduleId = id.split("-")[1];
    }
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moduleItem, setModuleItem] = useState<ModuleItem>();
    const [serverTime, setServerTime] = useState<string>('');
    const [ventureTitle, setVentureTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);

    const getModule = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/ventures/${selectedVentureId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mid: moduleId
            })
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            const { venture, serverTime } = await response.json();
            setServerTime(serverTime);
            if (venture.length > 0) {
                if (venture[0].matchedModules.length > 0) {
                    setVentureTitle(venture[0].title);
                    setModuleItem(venture[0].matchedModules[0]);
                    setContent(venture[0].matchedModules[0].module.content);
                    if (venture[0].matchedModules[0].comments) {
                        setComments(venture[0].matchedModules[0].comments);
                    }
                }
            }
            setIsLoading(false);
        }
    };

    const handleCancelClicked = () => {
        router.push(`/dashboard/ventures/${selectedVentureId}`);
    }

    useEffect(() => {
        getModule();
    }, []);

    return (
        <>
            {
                isLoading ?
                    <div className="grid place-items-center h-screen">
                        <Spinner /> 
                    </div> :
                    <>
                        <div className="flex flex-row w-full bg-white fixed items-center mt-[-40px] p-[20px] z-20">
                            <a onClick={handleCancelClicked} className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex">
                                <span className="flex"><KeyboardBackspaceIcon /></span>
                                <span className="ml-[15px]">{ventureTitle}</span>
                            </a>
                        </div>
                        <div className="mt-[40px] rounded-xl bg-[#F7F7F9] lg:mx-[5%] xl:mx-[10%] 2xl:mx-[15%] px-[40px] py-[34px] flex flex-col justify-center font-Inter">
                            <EditorView value={content} />
                            {
                                moduleItem?.module?.files != undefined && moduleItem?.module?.files?.length > 0 && (
                                    <div className='pt-[30px]'>
                                        <label className='text-[14px] text-primary-black'>ATTACHMENTS</label>
                                        <div className='text-primary-blue font-semibold text-[14px] py-[15px]'>
                                            {
                                                moduleItem?.module.files.map((fileItem: any, index: number) => {
                                                    return <div className='flex items-center' key={`file_${index}`}>
                                                        {/* <Image src={ico_document} alt={fileItem.name} /> */}
                                                        <IcoDocument alt={fileItem.name} />
                                                        <a href={fileItem.url} target="_blank" className='pl-[5px]'>{fileItem.name}</a>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            <div className='border-b border-secondary-gray-4 py-[15px]'>
                            </div>
                            {
                                comments != null && comments.length > 0 && (
                                    comments.map((comment: Comment, index: number) => {
                                        return (
                                            <div key={`comment-${index}`}>
                                                <CommentItem comment={comment} serverTime={serverTime}/>
                                            </div>
                                        )
                                    })
                                )
                            }
                            <div className="flex items-center justify-end font-Inter font-bold pt-5">
                                <button
                                    className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={handleCancelClicked}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default Index;