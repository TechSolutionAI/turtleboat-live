import React, { useState } from 'react';

import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const RoadAssistanceUpload = ({
    setFormFiles,
}: any) => {
    const [files, setFiles] = useState<Blob[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
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

    return (
        <div className='sm:mt-[35px] mt-[10px]'>
            <label className='font-Inter font-semibold text-[#6B7280]'>Comic Strip will automatically be sent with Help Request.  Attach additional file if needs.</label>
            {/* <span className="text-[12px] text-red-500 ml-[100px]">{message}</span> */}

            {
                <div className='relative bg-white sm:h-[130px] h-[90px] mt-[10px] border-dashed border-2 border-secondary-gray flex flex-col items-center justify-evenly'>
                    <input type="file" onChange={handleFile} className="sm:h-[130px] h-[90px] opacity-0 z-10 absolute" multiple={true} name="files[]" />
                    <div className='sm:h-[130px] h-[90px] absolute flex flex-col items-center justify-evenly'>
                        <UploadFileOutlinedIcon />
                        <label className='font-Inter font-semibold text-[14px]'><span className='text-primary-blue'>Upload a file </span><span className='text-[#6F727A]'>or Drag and drop</span></label>
                    </div>
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

export default RoadAssistanceUpload;