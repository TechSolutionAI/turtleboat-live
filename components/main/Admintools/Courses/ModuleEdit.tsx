import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Transition } from '@headlessui/react';
import Swal from "sweetalert2";

import Upload from "@/components/main/Admintools/Modules/Upload";
import CheckBoxList from "@/components/main/Admintools/Modules/CheckBoxList";
const Editor = dynamic(() => import("@/components/main/Admintools/Modules/Editor"), { ssr: false });
import Spinner from "@/components/Spinner";

const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    files: Yup.array(),
});

const defaultErrors = {
    title: "",
    content: "",
    item: "",
    files: "",
};

const ModuleEdit = ({ setEditOpen, selectedData, editData, index }: any) => {
    const formOptions = {
        resolver: yupResolver(schema),
        defaultValues: { ...(selectedData as any) },
    };
    const { register, handleSubmit } = useForm(formOptions);
    const [errors, setErrors] = useState<any>(defaultErrors);
    const [title, setTitle] = useState<string>(selectedData.title);
    const [content, setContent] = useState<string>(selectedData.content);
    const [item, setItem] = useState<string>(selectedData.item);
    const [files, setFormFiles] = useState<FileList | null>(null);
    const [existFiles, setExistFiles] = useState<any[]>(selectedData.files);
    const [contentError, setContentError] = useState<string>("");
    const [itemError, setItemError] = useState<string>("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        setTitle(selectedData.title);
        setContent(selectedData.content);
        setItem(selectedData.item);
    }, []);

    function onSubmit(data: any) {
        setErrors(defaultErrors);
        if (title != "" && content != "" && item != "") {
            updateModule();
            return false;
        } else {
            setItemError("This field is required");
            setContentError("Content is required");
        }
    }

  const updateModule = async () => {
        const formData = new FormData();
        formData.append("id", selectedData._id);
        if (files != null) {
            for (let i = 0; i < files.length; i++) {
                formData.append(`file${i}`, files[i]);
            }
        }

        for (let i = 0; i < existFiles.length; i++) {
            const obj = existFiles[i];
            formData.append(`prevFileIds[${i}]`, obj.assetId);
        }

        setIsCreating(true);
        const response = await fetch("/api/files", {
            method: "PUT",
            body: formData,
        });

        if (!response.ok) {
            setIsCreating(false);
            const { err } = await response.json();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err,
            })
            .then(() => {
                setIsCreating(false);
                console.log("Updating was failed");
            })
            .catch((err) => console.log(err));
        } else {
            const { result } = await response.json();
            setIsCreating(false);
            Swal.fire({
                icon: "success",
                title: "Success!",
                allowOutsideClick: false,
                text: `Module was updated successfully! But if you don't save this course, it won't be save.`,
            })
            .then(() => {
                editData({
                    title: title,
                    content: content,
                    item: item,
                    files: result
                }, index);
                setEditOpen(false);
            })
            .catch((err) => console.log(err));
        }
    };

    const handleErrors = (errors: any) => {
        setErrors(errors);

        if (item == "") {
            setItemError("This field is required");
        }

        if (content == "") {
            setContentError("Content is required");
        }
    };

    return (
        <>
            <Transition
                show={true}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
                    <div
                        className={
                        `fixed top-0 left-0 right-0 w-full flex 
                        justify-center items-center p-4 
                        overflow-x-hidden overflow-y-auto 
                        md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`
                    }>
                        <div className="relative w-full max-w-3xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <button
                                    type="button"
                                    className={
                                    `absolute top-3 right-2.5 
                                    text-gray-400 bg-transparent 
                                    hover:bg-gray-200 hover:text-gray-900 
                                    rounded-lg text-sm p-1.5 
                                    ml-auto inline-flex items-center`
                                    }
                                    onClick={() => {
                                        setEditOpen(false);
                                    }}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd">
                                        </path>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="px-6 py-4 border-b rounded-t ">
                                    <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
                                    Edit Module
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
                                        <div className="relative sm:w-11/12 w-11/12 max-w-3xl">
                                            <div className="border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                <div className="relative p-6 flex-auto">
                                                    <div>
                                                        <label className="font-Inter font-semibold tracking-[0.1em] text-[#232325]">
                                                        TITLE <span className="text-secondary-red">*</span>
                                                        </label>
                                                        <input
                                                        type="text"
                                                        className="w-full mt-[15px] border-secondary-gray border-[1px] rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
                                                        placeholder="Enter Text Here..."
                                                        id="title"
                                                        {...register("title")}
                                                        onChange={(e) => {
                                                            setTitle(e.target.value);
                                                        }}
                                                        value={title}
                                                        ></input>
                                                        {
                                                            errors.title && errors.title.message != "" && (
                                                            <div className="p-1">
                                                                <span className="text-secondary-red text-sm">
                                                                {errors.title.message}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Upload
                                                        setFormFiles={setFormFiles}
                                                        existFiles={selectedData.files}
                                                        updateExistFiles={setExistFiles}
                                                    />
                                                    <div className="sm:mt-[35px] mt-[10px]">
                                                        <label className="font-Inter font-semibold tracking-[0.1em] text-[#232325]">
                                                        DESCRIPTION <span className="text-secondary-red">*</span>
                                                        </label>
                                                    </div>
                                                    <Editor
                                                        value={content}
                                                        onChange={(data) => {
                                                        if (data == "") {
                                                            setContentError("Content is required");
                                                        }
                                                        setContent(data);
                                                        }}
                                                        register={register}
                                                    />
                                                    {content == "" && contentError != "" && (
                                                        <div className="p-1">
                                                        <span className="text-secondary-red text-sm">
                                                            {contentError}
                                                        </span>
                                                        </div>
                                                    )}
                                                    <div className="sm:mt-[35px] mt-[10px]">
                                                        <label className="font-Inter font-semibold tracking-[0.1em] text-[#232325]">
                                                        VENTURE PILLARS <span className="text-secondary-red">*</span>
                                                        </label>
                                                    </div>
                                                    <CheckBoxList
                                                        item={selectedData.item}
                                                        setItemError={setItemError}
                                                        setItem={setItem}
                                                        register={register}
                                                    />
                                                    {item == "" && itemError != "" && (
                                                        <div className="p-1">
                                                        <span className="text-secondary-red text-sm">
                                                            {itemError}
                                                        </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                                    <button
                                        type="button"
                                        className={
                                            `text-gray-500 bg-white hover:bg-gray-100 
                                            focus:ring-4 focus:outline-none focus:ring-gray-200 
                                            rounded-lg border border-gray-200 text-sm font-medium 
                                            px-5 py-2.5 hover:text-gray-900 focus:z-10`}
                                        onClick={() => {
                                            setEditOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit(onSubmit, handleErrors)}
                                        className={
                                            `text-white bg-primary-blue hover:bg-primary-blue 
                                            focus:ring-4 focus:outline-none focus:ring-primary-blue 
                                            font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                        `}
                                    >
                                        {isCreating ? <Spinner text="Saving..." /> : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </form>
            </Transition>
            <div className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40`}></div>
        </>
    );
};

export default ModuleEdit;
