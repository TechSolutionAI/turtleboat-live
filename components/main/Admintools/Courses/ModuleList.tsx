import React, { useState, useEffect, ReactNode, useContext } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';

import { Context } from './Modal';
import { Module } from '@/types/module.type';

import { Transition } from '@headlessui/react'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Spinner from "@/components/Spinner";
import ModuleEdit from "./ModuleEdit";

const ListRow = ({ children }: { children: ReactNode }) => {
    return (
        <div className='grid grid-cols-1 pt-[20px] pb-[20px]'>
            <div className='grid grid-cols-2'>
                {children}
            </div>
        </div>
    )
}

const ListRowItem = ({ index, rowItem, handleModuleClicked }: any) => {
    const { updateModule } = useContext(Context);

    const [checked, setChecked] = useState<boolean>(rowItem.isCheck);
    const [locked, setLocked] = useState<boolean>(rowItem.isLock);

    // useEffect(() => {
    //     updateModule(rowItem, locked);
    // }, [locked])

    return (
        <div className='flex items-center'>
            <input
                type='checkbox'
                id={rowItem.id}
                name={rowItem.id}
                value={rowItem.id}
                checked={checked}
                onChange={() => {
                    setChecked(!checked);
                    setLocked(checked)
                    updateModule(rowItem.module, checked, !checked);
                }}
                className='w-[20px] h-[20px]'
            />
            <div className='flex items-center px-[10px]' onClick={() => {
                if (checked) {
                    let temp = locked;
                    setLocked(!locked);
                    updateModule(rowItem.module, !temp, checked);
                }
            }}>
                {/* {rowItem.isLock ? <LockOpenIcon className='text-secondary-green' /> : <LockIcon className='text-[#6592D4]' />} */}
                {locked ? <LockIcon className='text-[#6592D4]' /> : <LockOpenIcon className='text-secondary-green' />}
            </div>

            <DescriptionIcon onClick={() => handleModuleClicked(index)} 
            className='cursor-pointer'
            />
            <label className='font-Inter text-[16px] font-semibold ml-[18px]'>{rowItem.module.title}</label>
            <div className='ml-[10px]'>
                <DragIndicatorOutlinedIcon className='text-secondary-gray-4 ml-[10px]' />
                <label className='font-Inter text-[10px] font-semibold text-secondary-gray-4'>{rowItem.module.item}</label>
            </div>
        </div>
    )
}

const ModuleList = () => {
    
    const { selectedModules, updateModule } = useContext(Context);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editableIndex, setEditableIndex] = useState(0);
    const [selectedData, setSelectedData] = useState(selectedModules[0]);

    const handleModuleClicked = (index: number) => {
        setEditableIndex(index);
        setSelectedData(selectedModules[index].module);
        setEditOpen(true);
    }

    const editData = (result: any, index: number) => {
        let tempModule = selectedModules[editableIndex];
        tempModule.module.title = result.title;
        tempModule.module.content = result.content;
        tempModule.module.item = result.item;
        tempModule.module.files = result.files;
        updateModule(tempModule.module, tempModule.isLock, tempModule.isCheck);
    }

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
                                                    <ListRowItem index={index} rowItem={item} handleModuleClicked={handleModuleClicked}/>
                                                    {
                                                        nextItem !== undefined &&
                                                        <ListRowItem index={index+1} rowItem={nextItem} handleModuleClicked={handleModuleClicked}/>
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
                                            <ListRowItem index={index} rowItem={item} handleModuleClicked={handleModuleClicked}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {editOpen && <ModuleEdit setEditOpen={setEditOpen} selectedData={selectedData} editData={editData} index={editableIndex} />}
                    </>
                }
            </div>
        </>
    )
};

export default ModuleList;