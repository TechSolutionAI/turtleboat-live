import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const EditorView = dynamic(() => import("@/components/EditorView"), { ssr: false });

const View = ({
    setViewOpen,
    selectedData,
}: any) => {
    const [title, setTitle] = useState<string>(selectedData.title);
    const [content, setContent] = useState<string>(selectedData.content);
    const [existFiles, setExistFiles] = useState<any[]>(selectedData.files);

    useEffect(() => {
        setTitle(selectedData.title)
        setContent(selectedData.content);
    }, [])

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
                <div className="relative sm:w-11/12 w-11/12 my-10 mx-3 max-w-3xl">
                    <div className="border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="relative px-6 pt-6 pb-2 flex-auto">
                            <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>TITLE</label>
                            <p className='py-3 font-Inter tracking-[0.1em] text-[#333333]'>{title}</p>
                        </div>
                        <div className="relative px-6 py-2 flex-auto">
                            <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>DESCRIPTION</label>
                        </div>
                        <EditorView value={content} />
                        {
                            existFiles && existFiles.length > 0 && <div className="relative px-6 py-6 flex-auto">
                                <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>Attachments</label>
                                <div className='mt-[10px] flex flex-col items-center justify-evenly'>
                                    {
                                        existFiles.map((file: any, index: number) => {
                                            return (
                                                <div key={`"exist_file_"${index}`} className='w-full flex items-center justify-between rounded py-3 px-2'>
                                                    <div className="flex flex-row items-center gap-2">
                                                        <InsertDriveFileOutlinedIcon className='text-primary-blue' />
                                                        <a href={file.url} target="_blank" className="truncate w-44 text-primary-blue">{file.name}</a>
                                                    </div>
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }
                        <div className="flex items-center justify-end font-Inter font-bold p-6">
                            <button
                                className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => {
                                    setViewOpen(false);
                                }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default View;