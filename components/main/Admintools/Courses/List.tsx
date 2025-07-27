import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Course } from '@/types/course.type';
import Swal from "sweetalert2"
import Spinner from "@/components/Spinner"

import Modal from './Modal';
import View from './View';

const List = ({ initialCourses, updateData, duplicateData, deleteData, setSelectedTitle }: any) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [viewModal, setViewModal] = useState<boolean>(false);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownIndex, setDropdownIndex] = useState(-1);

    const [editableIndex, setEditableIndex] = useState(0);
    const [editableData, setEditableData] = useState(initialCourses[0]);
    const [deletingIndex, setDeletingIndex] = useState(-1);
    const [duplicatingIndex, setDuplicatingIndex] = useState(-1);

    useEffect(() => {
        if (dropdownIndex !== -1) {
            setDropdownOpen(true);
        }
        if (showModal || viewModal) {
            setDropdownIndex(-1)
        }
        if (!showModal && !viewModal) {
            setSelectedTitle('');
        }
    }, [dropdownIndex, showModal, viewModal]);

    const deleteCourse = async (id: string) => {
        const response = await fetch(`/api/courses/${id}`, {
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

    const duplicateCourse = async (id: string) => {
        const response = await fetch(`/api/courses/${id}`, {
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
            const { course } = await response.json();
            return { success: true, course: course };
        }
    };

    const handleDelete = (index: number) => {
        Swal.fire({
            title: 'Delete course',
            text: `Are you sure you want to delete this course?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeletingIndex(index);
                const result = await deleteCourse(initialCourses[index]._id);
                if (result.success) {
                    deleteData(index);
                    setDeletingIndex(-1)
                    Swal.fire(
                        'Course was deleted',
                        `Course was deleted`,
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

    const handleDuplicate = async (item: Course, index: number) => {
        setDuplicatingIndex(index)
        const result = await duplicateCourse(initialCourses[index]._id);
        if (result.success) {
            setDuplicatingIndex(-1)
            duplicateData(result.course, index);
            Swal.fire(
                'Course was duplicated',
                `Course was duplicated`,
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

    const handleViewClicked = (item: Course, index: number) => {
        // console.log('view clicked')
        // setEditableData(item);
        // setViewModal(!viewModal);
        setEditableData(item);
        setSelectedTitle(item.title);
        setEditableIndex(index);
        setShowModal(!showModal);
    }

    return (
        <>
            <div className={`grid grid-cols-1 pt-[60px] ${(showModal || viewModal) && 'hidden'}`}>
                {
                    initialCourses.map((item: Course, index: number) => {
                        return (
                            deletingIndex === index
                            ?
                            <div className='flex flex-row w-full border-b-2 pt-[20px] pb-[20px] justify-between border-secondary-gray-4' key={`deleting_` + index}>
                                <Spinner text="Deleting..." />
                            </div>
                            :
                            duplicatingIndex === index ?
                                <div className='flex flex-row w-full border-b-2 pt-[20px] pb-[20px] justify-between border-secondary-gray-4' key={`duplicating` + index}>
                                    <Spinner text="Duplicating..." />
                                </div>
                                : 
                            <div className='flex flex-row w-full border-b-2 pt-[20px] pb-[20px] justify-between border-secondary-gray-4 hover:bg-gray-100' key={'col-1' + index}>
                                <div className='w-[60%] truncate'>
                                    <a className='cursor-pointer' onClick={() => handleViewClicked(item, index)}>
                                        <FileCopyOutlinedIcon />
                                    </a>
                                    <a className='cursor-pointer' onClick={() => handleViewClicked(item, index)}>
                                        <label className='font-Inter font-semibold text-[16px] ml-[18px]'>{item.title}</label>
                                    </a>
                                </div>
                                <div className='font-Inter text-[12px] flex items-center text-secondary-gray-4 w-[35%]'>
                                    <TipsAndUpdatesOutlinedIcon />
                                    <label className='font-Inter font-semibold pl-[10px] '>{item.ventures} ventures</label>
                                </div>
                                <div className="relative w-[10%]">
                                    <button className={`rounded-[50px] border-2 border-transparent hover:border-secondary-gray-4 text-secondary-gray-4  float-right ${dropdownOpen === true && index === dropdownIndex && 'bg-tertiary-blue'}`} onClick={() => {
                                        setDropdownOpen(!dropdownOpen);
                                        setDropdownIndex(index);
                                    }}>
                                        <MoreHorizIcon />
                                    </button>
                                    {(dropdownOpen && dropdownIndex === index) && (
                                        <OutsideClickHandler onOutsideClick={() => setDropdownOpen(false)}>
                                            <div className='absolute left-[-200px] z-0 top-0 mt-[10px] z-10 border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white'>
                                                <ul className='font-Inter font-semibold text-[16px] px-[20px]'>
                                                    <li 
                                                        className='py-[18px] cursor-default' 
                                                        onClick={() => {
                                                            handleDuplicate(item, index)
                                                        }}
                                                    >
                                                        Duplicate course
                                                    </li>
                                                    <li 
                                                        className='py-[18px] cursor-default' 
                                                        onClick={() => {
                                                            setEditableData(item);
                                                            setSelectedTitle(item.title);
                                                            setEditableIndex(index);
                                                            setShowModal(!showModal);
                                                        }}
                                                    >
                                                        Edit course
                                                    </li>
                                                    <hr />
                                                    <li 
                                                        className='py-[18px] cursor-default text-secondary-red' 
                                                        onClick={() => {
                                                            handleDelete(index)
                                                        }
                                                    }>
                                                        Delete course
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
            {
                showModal && 
                <Modal 
                    showModal={showModal} 
                    setShowModal={setShowModal} 
                    editable={true} 
                    initialData={editableData} 
                    updateData={updateData} 
                    index={editableIndex} 
                />
            }
            {
                viewModal && 
                <View 
                    viewModal={viewModal} 
                    setViewModal={setViewModal}
                    initialData={editableData}
                />
            }

        </>
    )
}

export default List;