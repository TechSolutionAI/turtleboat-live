import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import DescriptionIcon from '@mui/icons-material/Description';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Module } from '@/types/module.type';
import Swal from "sweetalert2"
import Spinner from "@/components/Spinner"

import Edit from './Edit';
import View from './View';

const List = ({ data, editData, deleteData, duplicateData, setSelectedTitle }: { data: Module[], editData: any, deleteData: any, duplicateData: any, setSelectedTitle: any }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editableIndex, setEditableIndex] = useState(0);
    const [selectedData, setSelectedData] = useState(data[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownIndex, setDropdownIndex] = useState(-1);
    const [deletingIndex, setDeletingIndex] = useState(-1);
    const [duplicatingIndex, setDuplicatingIndex] = useState(-1);

    useEffect(() => {
        if (dropdownIndex !== -1) {
            setDropdownOpen(true);
        }
        if (editOpen) {
            setDropdownIndex(-1)
        } else {
            setSelectedTitle('');
        }
    }, [dropdownIndex, editOpen]);

    const deleteModule = async (id: string) => {
        const response = await fetch(`/api/modules/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err)
            return { success: false, err: err };
        } else {
            return { success: true };
        }
    };

    const duplicateModule = async (id: string) => {
        const response = await fetch(`/api/modules/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err)
            return { success: false, err: err };
        } else {
            const { result } = await response.json();
            return { success: true, module: result };
        }
    };

    const handleDelete = (index: number) => {
        Swal.fire({
            title: 'Delete module',
            text: `Are you sure you want to delete this module?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeletingIndex(index);
                const result = await deleteModule(data[index]._id);
                if (result.success) {
                    deleteData(index);
                    setDeletingIndex(-1)
                    Swal.fire(
                        'Module was deleted',
                        `Module was deleted`,
                        'success'
                    );
                } else {
                    setDeletingIndex(-1)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: result.err,
                    })
                }
            }
        })
    }

    const handleDuplicate = async (item: Module, index: number) => {
        setDuplicatingIndex(index)
        const result = await duplicateModule(data[index]._id);
        if (result.success) {
            setDuplicatingIndex(-1)
            duplicateData(result.module, index);
            Swal.fire(
                'Module was duplicated',
                `Module was duplicated`,
                'success'
            );
        } else {
            setDuplicatingIndex(-1)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.err,
            })
        }
    }

    const handleViewClicked = (item: Module, index: number) => {
        // setSelectedData(item);
        // setViewOpen(true);
        setSelectedData(item);
        setSelectedTitle(item.title);
        setEditableIndex(index);
        setEditOpen(true);
    }

    return (
        <>
            {
                !editOpen && !viewOpen &&
                <div className='pt-[75px] grid grid-cols-1 xl:grid-cols-2 gap-x-[100px]'>
                    {
                        data.map((item: Module, index: number) => {
                            return (
                                deletingIndex === index
                                    ?
                                    <div className='flex justify-between py-[20px] font-Inter text-[16px] font-semibold border-secondary-gray-4 border-b-2' key={'deleting_' + index}>
                                        <Spinner text="Deleting..." />
                                    </div>
                                    :
                                    duplicatingIndex === index ?
                                        <div className='flex justify-between py-[20px] font-Inter text-[16px] font-semibold border-secondary-gray-4 border-b-2' key={'duplicating' + index}>
                                            <Spinner text="Duplicating..." />
                                        </div> : 
                                        <div className='flex justify-between py-[20px] font-Inter text-[16px] font-semibold border-secondary-gray-4 border-b-2 hover:bg-gray-100' key={'ini_' + index}>
                                            <div className='w-[60%] truncate'>
                                                <a className='cursor-pointer' onClick={() => handleViewClicked(item, index)}>
                                                    <DescriptionIcon />
                                                </a>
                                                <a className='cursor-pointer' onClick={() => handleViewClicked(item, index)}>
                                                    <label className='cursor-pointer font-Inter text-[16px] pl-[18px]'>{item.title}</label>
                                                </a>
                                            </div>
                                            <div className='w-[30%]'>
                                                <DragIndicatorOutlinedIcon className='text-secondary-gray-4 ml-[10px]' />
                                                <label className='font-Inter text-[10px] font-semibold text-secondary-gray-4 ml-[10px]'>{item.item}</label>
                                            </div>
                                            <div className='relative w-[10%]'>
                                                <button className={`rounded-[50px] text-secondary-gray-4 border-2 border-transparent hover:border-secondary-gray-4 float-right ${dropdownOpen === true && index === dropdownIndex && 'bg-tertiary-blue'}`} onClick={() => {
                                                    setDropdownOpen(!dropdownOpen);
                                                    setDropdownIndex(index);
                                                }}>
                                                    <MoreHorizIcon />
                                                </button>

                                                {(dropdownOpen && dropdownIndex === index) && (

                                                    <OutsideClickHandler onOutsideClick={() => setDropdownOpen(false)}>
                                                        <div className={`absolute left-[-200px] z-0 ${index % 2 === 1 ? 'left-[-200px]' : 'xl:left-[110%]'} top-0 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}>
                                                            <ul className='font-Inter font-semibold text-[16px] px-[20px]'>
                                                                <li
                                                                    className='py-[18px] cursor-default'
                                                                    onClick={() => {
                                                                        handleDuplicate(item, index)
                                                                    }}
                                                                >
                                                                    Duplicate module
                                                                </li>
                                                                <li
                                                                    className='py-[18px] cursor-default'
                                                                    onClick={() => {
                                                                        setSelectedData(item);
                                                                        setSelectedTitle(item.title);
                                                                        setEditableIndex(index);
                                                                        setEditOpen(true);
                                                                    }}
                                                                >
                                                                    Edit module
                                                                </li>
                                                                <hr />
                                                                <li
                                                                    className='py-[18px] text-secondary-red cursor-default'
                                                                    onClick={() => {
                                                                        handleDelete(index)
                                                                    }}
                                                                >
                                                                    Delete module
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </OutsideClickHandler>
                                                )}
                                            </div>
                                        </div>
                            )
                        })
                    }
                </div>
            }

            {editOpen && <Edit setEditOpen={setEditOpen} selectedData={selectedData} editData={editData} index={editableIndex} />}
            {viewOpen && <View setViewOpen={setViewOpen} selectedData={selectedData}/>}
        </>
    )
};

export default List;