import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Spinner from "@/components//Spinner"
import Add from './Add';
import List from './List';
import { Module } from '@/types/module.type';

const Modules = () => {
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [modules, setModules] = useState<Module[]>([]);

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
            setModules(result)
        }
    };

    useEffect(() => {
        document.title = "Curriculum - Turtle Boat Admin";
        getModules();
    }, []);

    const addData = (module: Module) => {
        setModules((prev) => [...prev, module]);
    }
    const editData = (module: Module, index: number) => {
        let temp = [...modules];
        temp[index] = module;
        setModules(temp);
    }
    const deleteData = (index: number) => {
        let temp = [...modules];
        temp.splice(index, 1);
        setModules(temp);
    }

    const duplicateData = (module: Module, index: number) => {
        let temp = [...modules];
        temp.splice(index, 0, module);
        setModules(temp);
    }

    return (
        <>
            <div className='px-[20px] pt-[60px] pb-[20px] bg-white fixed w-full z-10 sm:flex items-center'>
                {!addOpen && <button
                    className="flex items-center justify-center bg-[#2E65F3] text-[white] w-[133px] h-[50px] text-[12px] font-Inter rounded-[50px]"
                    onClick={() => setAddOpen(true)}
                >
                    <AddIcon />{' New Module'}
                </button>}
                <label className='font-Inter text-xl sm:ml-[50px]'>
                    {title}
                </label>
            </div>

            <div className='pt-[60px]'>
                {
                    addOpen && <Add setAddOpen={setAddOpen} addData={addData} />
                }
                {
                    isLoading ?
                        <div className='pt-[100px] grid grid-cols-1 gap-x-[100px]'>
                            <Spinner text="Loading modules..."/> 
                        </div>:
                        !(addOpen) && 
                        <List 
                            data={modules} 
                            editData={editData} 
                            deleteData={deleteData} 
                            duplicateData={duplicateData}
                            setSelectedTitle={setTitle}
                        />
                }
            </div>

        </>
    );
}

export default Modules;