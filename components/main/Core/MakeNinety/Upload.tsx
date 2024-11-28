import React, { useState } from 'react';

import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const Upload = ({
    setFormFiles,
    type,
    existFiles,
    updateExistFiles
}: any) => {
    const [files, setFiles] = useState<Blob[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [prevFiles, setPrevFiles] = useState<any[]>(existFiles);
    const [message, setMessage] = useState<string>();

    const handleFile = (e: any) => {
        setMessage("");
        if (e.target.files) {
            setSelectedFiles(e.target.files);
            let _files: Blob[] = Object.values(e.target.files);
            setFiles(_files)
            setFormFiles(e.target.files)
        }
    };

    const removeFile = (i: number) => {
        let _files = files;
        let newFiles = _files.slice(0, i).concat(_files.slice(i + 1));
        if (selectedFiles != null) {
            let newFormFiles = Array.from(selectedFiles).filter((file, index) => index != i);
            setFiles(newFiles);
            setFormFiles(newFormFiles)
        }
    }

    const removeExistFile = (i: number) => {
        let _files = prevFiles;
        let newFiles = prevFiles.slice(0, i).concat(prevFiles.slice(i + 1));
        setPrevFiles(newFiles)
        updateExistFiles(newFiles)
    }

    return (
        <div className='sm:mt-[35px] mt-[10px]'>
            <label className='font-Inter font-semibold text-primary-black tracking-[0.1em] '>VIDEO FILE <span className="text-secondary-red">*</span></label>
            <span className="text-[12px] text-red-500 ml-[100px]">{message}</span>

            {
                <div className='bg-white sm:h-[130px] h-[90px] mt-[10px] border-dashed border-2 border-secondary-gray flex flex-col items-center justify-evenly relative'>
                    <input type="file" onChange={handleFile} className="sm:h-[130px] h-[90px] w-full opacity-0 z-10 absolute" multiple={false} name="files" accept="video/*"/>
                    <div className='sm:h-[130px] h-[90px] w-full absolute z-1 flex flex-col items-center justify-evenly'>
                        <UploadFileOutlinedIcon />
                        <label className='font-Inter font-semibold text-[14px]'><span className='text-primary-blue'>Upload a file </span><span className='text-[#6F727A]'>or Drag and drop</span></label>
                        <label className='font-Inter font-normal text-[14px] text-[#6F727A]'>MPG, MP4, AVI (Max duration: { type == 4 ? '3 min' : '90 seconds'})</label>
                    </div>
                </div>
            }

            {
                prevFiles && prevFiles.length > 0 && <div className='mt-[10px] flex flex-col items-center justify-evenly'>
                    {prevFiles.map((file: any, index: number) => {
                        return (
                            <div key={`"exist_file_"${index}`} className='w-full flex items-center justify-between rounded p-3'>
                                <div className="flex flex-row items-center gap-2">
                                    <InsertDriveFileOutlinedIcon className='text-primary-blue' />
                                    <a href={file.url} target="_blank" className="truncate w-44 text-primary-blue">{file.name}</a>
                                </div>
                                <div onClick={() => { removeExistFile(index) }} >
                                    <DeleteOutlineOutlinedIcon className='text-tertiary-red' />
                                </div>
                            </div>

                        )
                    })}
                </div>
            }

            {
                files.length > 0 && <div className='mt-[10px] flex flex-col items-center justify-evenly'>
                    {files.map((file: any, index: number) => {
                        return (
                            <div key={`"uploading_file_"${index}`} className='w-full flex items-center justify-between rounded p-3'>
                                <div className="flex flex-row items-center gap-2">
                                    <InsertDriveFileOutlinedIcon className='text-primary-blue' />
                                    <a href={URL.createObjectURL(file)} target="_blank" className="truncate w-44 text-primary-blue">{file.name}</a>
                                </div>
                                <div onClick={() => { removeFile(index) }} >
                                    <DeleteOutlineOutlinedIcon className='text-tertiary-red' />
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default Upload;