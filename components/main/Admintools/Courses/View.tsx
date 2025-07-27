'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Spinner from "@/components/Spinner";

import { ModuleItem, Module } from '@/types/module.type';

const ListRow = ({ children }: { children: ReactNode }) => {
    return (
        <div className='grid grid-cols-1 pt-[20px] pb-[20px]'>
            <div className='grid grid-cols-2'>
                {children}
            </div>
        </div>
    )
}

const ListRowItem = ({ rowItem }: any) => {

    const [checked, setChecked] = useState<boolean>(rowItem.isCheck);
    const [locked, setLocked] = useState<boolean>(rowItem.isLock);

    return (
        <div className='flex items-center'>
            <input
                type='checkbox'
                id={rowItem.id}
                name={rowItem.id}
                value={rowItem.id}
                checked={checked}
                disabled={true}
                className='w-[20px] h-[20px]'
            />
            <div className='flex items-center px-[10px]'>
                {/* {rowItem.isLock ? <LockOpenIcon className='text-secondary-green' /> : <LockIcon className='text-[#6592D4]' />} */}
                {locked ? <LockIcon className='text-[#6592D4]' /> : <LockOpenIcon className='text-secondary-green' />}
            </div>

            <DescriptionIcon />
            <label className='font-Inter text-[16px] font-semibold ml-[18px]'>{rowItem.module.title}</label>
            <div className='ml-[10px]'>
                <DragIndicatorOutlinedIcon className='text-secondary-gray-4 ml-[10px]' />
                <label className='font-Inter text-[10px] font-semibold text-secondary-gray-4'>{rowItem.module.item}</label>
            </div>
        </div>
    )
}

const ModuleList = ({selectedModules}: {selectedModules: any}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <>
            <div className=''>

                {isLoading ?
                    <Spinner text={"Loading modules..."}/>
                    :
                    <>
                        <div className='hidden xl:block'>
                            {
                                selectedModules.map((item: any, index: number) => {
                                    const nextItem = selectedModules[index + 1];
                                    return (
                                        <div key={'row_' + index}>
                                            {
                                                index % 2 === 0 &&
                                                <ListRow>
                                                    <ListRowItem rowItem={item} />
                                                    {
                                                        nextItem !== undefined &&
                                                        <ListRowItem rowItem={nextItem}/>
                                                    }
                                                </ListRow>
                                            }
                                        </div>
                                    )

                                })
                            }
                        </div>
                        <div className='grid grid-cols-1 xl:hidden'>
                            {
                                selectedModules.map((item: any, index: number) => {
                                    return (
                                        <div className='flex mb-[20px] pb-[20px]' key={'col_1' + index}>
                                            <ListRowItem rowItem={item} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
                }
            </div>
        </>
    )
};

const View = ({ viewModal, setViewModal, initialData }: any) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getModules = async () => {
        setIsLoading(true);
        const response = await fetch('/api/modules', {
            method: 'GET'
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            setIsLoading(false);
            const { result } = await response.json();
            const moduleList = result.map((moduleItem: any) => {
                return {
                    module: moduleItem,
                    isLock: true,
                    isCheck: false
                }
            });
            setSelectedModules(moduleList)
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setTitle(initialData.title);
        setDescription(initialData.description);
        setSelectedModules(initialData.modules);
        setIsLoading(false);
    }, [])
    
    return (
        <>
            {
                viewModal ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-11/12 sm:w-11/12 xs:w-4/4 my-10">
                                <div className="border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none sm:px-[20px]">
                                    <div className="relative p-6 flex-auto">
                                        <div>
                                            <label className='font-Inter font-semibold tracking-widest text-primary-black'>TITLE</label>
                                            <p className='py-3 font-Inter tracking-widest text-[#333333]'>{title}</p>
                                        </div>
                                    </div>
                                    <label className='px-6 py-3 font-Inter font-semibold tracking-widest text-primary-black'>MODULES</label>
                                    <div className="relative px-6 flex-auto overflow-y-auto">
                                        {
                                            isLoading ?
                                                <Spinner />
                                                :
                                                <ModuleList selectedModules={selectedModules}/>
                                        }
                                    </div>
                                    <div className="relative p-6 flex-auto">
                                        <label className='font-Inter font-semibold tracking-widest text-primary-black'>DESCRIPTION</label>
                                        
                                        <p className='py-3 font-Inter tracking-widest text-[#333333]'>
                                            {description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end font-Inter font-bold p-6">
                                        <button
                                            className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => {
                                                setViewModal(false);
                                            }}
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null
            }
        </>
    )
}

export default View;