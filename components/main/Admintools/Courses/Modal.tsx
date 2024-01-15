'use client';
import React, { useState, useEffect, createContext } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Spinner from "@/components/Spinner"
import ModuleList from './ModuleList';
import { ModuleItem, Module } from '@/types/module.type';
import { categories } from '@/database/modules';

export const Context = createContext<any>(null);

const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
});

const defaultValues = {
    title: "",
}

const defaultErrors = {
    title: "",
}

const Modal = ({ showModal, setShowModal, addData, editable, initialData, updateData, index }: any) => {
    const formOptions = {
        resolver: yupResolver(schema),
        defaultValues: { ...(initialData != undefined ? initialData : defaultValues as any) }
    };
    const { register, handleSubmit } = useForm(formOptions);
    const [errors, setErrors] = useState<any>(defaultErrors);
    const [title, setTitle] = useState<string>('');
    const [moduleErrors, setModuleErrors] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');
    const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);
    const [isCreating, setIsCreating] = useState(false);
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
        if (editable) {
            setIsLoading(true);
            setTitle(initialData.title);
            setDescription(initialData.description);
            setSelectedModules(initialData.modules);
            setIsLoading(false);
        } else {
            getModules();
        }
    }, [])

    useEffect(() => {
        validateModules()
    }, [selectedModules])

    function onSubmit(data: any) {
        validateModules();
        if (title != "" && moduleErrors.length == 0 && selectedModules.length > 0) {
            if (editable) {
                setIsCreating(true);
                updateCourse({
                    title: title,
                    modules: selectedModules,
                    description: description,
                }, index)
            } else {
                setIsCreating(true);
                saveCourse({
                    title: title,
                    modules: selectedModules,
                    description: description,
                    ventures: 0,
                })
            }
            return false;
        }
    }

    const saveCourse = async (data: any) => {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: data
            })
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
            })
                .then(() => {
                    setIsCreating(false);
                    console.log("Creating failed");
                })
                .catch(err => console.log(err));
        } else {
            const { course } = await response.json();
            setIsCreating(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                allowOutsideClick: false,
                text: `Course was created successfully!`,
            }).then(() => {
                addData(course)
                setShowModal(false);
            }).catch(err => console.log(err));
        }
    };

    const updateCourse = async (data: any, index: number) => {
        const response = await fetch('/api/courses', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: initialData._id,
                data: data
            })
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
            })
                .then(() => {
                    setIsCreating(false);
                    console.log("Updating failed");
                })
                .catch(err => console.log(err));
        } else {
            const { course } = await response.json();
            setIsCreating(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                allowOutsideClick: false,
                text: `Course was updated successfully!`,
            }).then(() => {
                updateData(course, index);
                setShowModal(false);
            }).catch(err => console.log(err));
        }
    };

    const validateModules = () => {
        setErrors(defaultErrors)
        const modules4Validation = selectedModules.filter((moduleItem: ModuleItem) => moduleItem.isCheck)
        setModuleErrors([])
        if (modules4Validation.length < 26) {
            if (modules4Validation.length < 1) {
                setModuleErrors(["Please select at least one Starting Point"]);
            } else {
                var countsPerCategory: any = {};
                categories.map(category => {
                    countsPerCategory[category.value] = {
                        count: 0,
                        minCount: category.minCount,
                        maxCount: category.maxCount
                    };
                })
                modules4Validation.map((item) => {
                    categories.map(category => {
                        if (item.module.item == category.value) {
                            countsPerCategory[category.value].count += 1;
                        }
                    })
                })
                Object.entries(countsPerCategory).map(([key, value]: [string, any]) => {
                    if (value['count'] < value["minCount"]) {
                        var error = key + " module's min counts is " + value['minCount'];
                        setModuleErrors((prev) => [...prev, error]);
                        console.log(error)
                    } else if (value['count'] > value["maxCount"]) {
                        var error = key + " module's max counts is " + value['maxCount'];
                        console.log(error)
                        setModuleErrors((prev) => [...prev, error]);
                    }
                });
            }
        } else {
            setModuleErrors(["Module count error"]);
        }
    }

    const handleErrors = (errors: any) => {
        validateModules()
        setErrors(errors);
    };

    return (
        <>
            {showModal ? (
                <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-11/12 sm:w-11/12 xs:w-4/4 my-10">
                            <div className="border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none sm:px-[20px]">
                                <div className="relative p-6 flex-auto">
                                    <div>
                                        <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>TITLE <span className="text-secondary-red">*</span></label>
                                        <input type='text' className='w-full mt-[15px] border-secondary-gray border-[1px] rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue'
                                            placeholder='Enter Text Here...'
                                            {...register('title')}
                                            onChange={(e) => {
                                                setTitle(e.target.value);
                                            }}
                                            value={title}></input>
                                        {
                                            errors.title && errors.title.message != "" && (
                                                <div className='p-1'>
                                                    <span className="text-secondary-red text-sm">
                                                        {
                                                            errors.title.message
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <label className='p-6 font-Inter font-semibold tracking-[0.1em] text-[#232325]'>SELECT MODULES <span className="text-secondary-red">*</span></label>
                                <div className="relative px-6 flex-auto overflow-y-auto">
                                    <Context.Provider value={{
                                        updateModule: (module: Module, isLock: boolean, isCheck: boolean) => {
                                            let temp = {
                                                module: module,
                                                isLock: isLock,
                                                isCheck: isCheck
                                            }

                                            const index = selectedModules.findIndex((item) => item.module._id === temp.module._id);
                                            if (index > -1) {
                                                let tempModules = selectedModules;
                                                tempModules[index] = temp;
                                                setSelectedModules(tempModules);
                                                validateModules();
                                            }
                                        },
                                        selectedModules,
                                    }}>
                                        {
                                            isLoading ?
                                                <Spinner />
                                                :
                                                <ModuleList />
                                        }
                                    </Context.Provider>
                                </div>
                                {
                                    moduleErrors && moduleErrors.length > 0 &&
                                    moduleErrors.map((moduleError, index) => {
                                        return (
                                            <div className="relative p-3" key={`moduleError${index}`}>
                                                <div className='p-1'>
                                                    <span className="text-secondary-red text-sm">
                                                        {
                                                            moduleError
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        );

                                    })
                                }
                                <div className="relative p-6 flex-auto">
                                    <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>DESCRIPTION</label>
                                    <textarea rows={4} className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                                        placeholder="Write your thoughts here..."
                                        onChange={(e) => {
                                            setDescription(e.target.value)
                                        }}
                                        value={description}
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-end font-Inter font-bold p-6">
                                    <button
                                        className="text-[#232325] background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                        }}
                                        disabled={isCreating ? true : false}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="submit"
                                    >
                                        {
                                            isCreating ? <Spinner text={`${editable ? 'Saving...' : 'Creating...'}`} /> : "Save Changes"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : null}</>
    )
}

export default Modal;