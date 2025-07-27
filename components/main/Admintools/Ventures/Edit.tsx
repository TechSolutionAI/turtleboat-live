import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { courses } from '@/database/courses';
import { Venture } from '@/types/venture.type';
import Spinner from "@/components/Spinner";
import UserSelect from '@/components/UserSelect';

const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
});

const Edit = ({
    setEditModal,
    editableData,
    updateData,
    editableIndex
}: {
    setEditModal: any,
    editableData: Venture,
    updateData: any,
    editableIndex: number
}) => {
    const formOptions = {
        resolver: yupResolver(schema), defaultValues: {
            ...({
                title: editableData.title,
                course: editableData.course._id,
                description: editableData.description
            } as any)
        }
    };

    const { register, handleSubmit } = useForm(formOptions);
    const [errors, setErrors] = useState<any>({});
    const [title, setTitle] = useState<string>('');
    const [course, setCourse] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [isCreating, setIsCreating] = useState(false);
    const [selectedMentees, setSelectedMentees] = useState<any[]>(convertList4Options([editableData.mentee]));
    const [selectedMentors, setSelectedMentors] = useState<any[]>(convertList4Options(editableData.mentors));

    useEffect(() => {
        setTitle(editableData.title);
        setCourse(editableData.course._id);
        setDescription(editableData.description);
        setSelectedMentees(convertList4Options([editableData.mentee]))
        setSelectedMentors(convertList4Options(editableData.mentors))
    }, [])

    const handleMenteesSelected = (menteeList: any[]) => {
        setSelectedMentees(menteeList);
    }

    const handleMentorsSelected = (mentorList: any) => {
        setSelectedMentors(mentorList);
    }

    function convertList4Options(list: any[]) {
        let options: any[] = [];
        if (list != null) {
            list.map((item: any, index: number) => {
                if (item != null) {
                    const option = {
                        value: item._id,
                        label: item.name,
                        image: item.image,
                        email: item.email
                    }
                    options.push(option);
                }
            });
            return options;
        } else {
            return options;
        }
    }

    function onSubmit(data: any) {
        setErrors({})
        if (title != "" && course != "") {
            const { removedMentors, addedMentors } = getMentorChanges(convertList4Options(editableData.mentors), selectedMentors);
            let mentee = editableData.mentee;
            if (selectedMentees.length > 0) {
                if (editableData.mentee != null) {
                    if (editableData.mentee.email != selectedMentees[0].value) {
                        mentee = {
                            email: selectedMentees[0].email,
                            name: selectedMentees[0].label,
                            image: selectedMentees[0].image,
                            _id: selectedMentees[0].value
                        }
                    }
                } else {
                    mentee = {
                        email: selectedMentees[0].email,
                        name: selectedMentees[0].label,
                        image: selectedMentees[0].image,
                        _id: selectedMentees[0].value
                    }
                }
            }

            const addedList = addedMentors.map((mentor) => {
                return {
                    _id: mentor.value,
                    name: mentor.label,
                    image: mentor.image,
                    email: mentor.email
                }
            });

            const removedList = removedMentors.map((mentor) => {
                return {
                    _id: mentor.value,
                    name: mentor.label,
                    image: mentor.image,
                    email: mentor.email
                }
            });

            const mentors = selectedMentors.map((mentor) => {
                return {
                    _id: mentor.value,
                    name: mentor.label,
                    image: mentor.image,
                    email: mentor.email
                }
            });
            updateVenture({
                title: title,
                course: course,
                description: description,
                mentee: mentee,
                mentors: mentors,
                removedMentors: removedList,
                addedMentors: addedList
            }, editableIndex)
        }
        return false;
    }

    function getMentorChanges(oldMentors: any[], newMentors: any[]) {
        let removedMentors: any[] = [];
        let addedMentors: any[] = [];
        removedMentors = oldMentors.filter(
            item => !newMentors.find(newItem => newItem.value === item.value)
        );
        addedMentors = newMentors.filter(
            newItem => !oldMentors.find(item => item.value === newItem.value)
        );

        return { removedMentors, addedMentors };
    }

    const updateVenture = async (data: any, index: number) => {
        setIsCreating(true);
        const response = await fetch('/api/ventures', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: editableData._id,
                prevCourseId: editableData.course._id,
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
            const { venture } = await response.json();
            setIsCreating(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                allowOutsideClick: false,
                text: `Venture was updated successfully!`,
            }).then(() => {
                updateData(venture, index);
                setEditModal(false);
            }).catch(err => console.log(err));
        }
    };

    const handleErrors = (errors: any) => {
        if (course == "") {
            errors.course = {
                message: "Please select course"
            }
        }
        console.log(errors);
        setErrors(errors);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
            <div className={`justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none`}>
                <div className="relative w-11/12 sm:w-11/12 my-0">
                    <div className="border-0 rounded-lg relative flex flex-col w-full sm:px-[20px]">
                        <div className="relative p-6 flex-auto">
                            <div>
                                <label className='font-Inter font-semibold tracking-widest text-primary-black'>TITLE <span className="text-secondary-red">*</span></label>
                                <input type='text' className='w-full mt-[15px] border-secondary-gray border rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue'
                                    placeholder='Enter Text Here...'
                                    id="title"
                                    {...register('title')}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                    value={title}
                                />
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
                        <div className="relative px-6 py-3 flex-auto overflow-y-auto">
                            <label className="font-Inter font-semibold tracking-widest text-primary-black">COURSE <span className="text-secondary-red">*</span></label>
                        </div>
                        <div className="relative px-6 pb-3">
                            <input type='text' className='w-full mt-[15px] border-secondary-gray border rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue'
                                placeholder='Enter Text Here...'
                                id="course"
                                value={editableData.course.title}
                                disabled={true}
                            />
                        </div>

                        <div className="relative px-6 py-3 flex-auto">
                            <label className='font-Inter font-semibold tracking-widest text-primary-black'>ASSIGN MENTEE</label>
                        </div>
                        <div className="relative px-6 pb-3">
                            <UserSelect
                                setData={handleMenteesSelected}
                                multiple={true}
                                selectedList={selectedMentees}
                                disabled={editableData.mentee != null ? true : false}
                                type={"mentee"}
                                disabledList={selectedMentors}
                                limit={1}
                            />
                        </div>

                        <div className="relative px-6 py-3 flex-auto">
                            <label className='font-Inter font-semibold tracking-widest text-primary-black'>ASSIGN MENTORS</label>
                        </div>
                        <div className="relative px-6 pb-3">
                            <UserSelect
                                setData={handleMentorsSelected}
                                multiple={true}
                                disabled={!(selectedMentees.length > 0)}
                                selectedList={selectedMentors}
                                type={"mentor"}
                                disabledList={editableData.mentee != null ? convertList4Options([editableData.mentee]) : selectedMentees}
                                limit={-1}
                            />
                        </div>

                        <div className="relative p-6 flex-auto">
                            <label className='font-Inter font-semibold tracking-widest text-primary-black'>DESCRIPTION</label>
                            <textarea rows={4} className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 min-h-[200px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                                placeholder="Write your thoughts here..."
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-end font-Inter font-bold p-6">
                            <button
                                className="text-primary-black background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setEditModal(false)}
                                disabled={isCreating ? true : false}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="submit"
                            >
                                {
                                    isCreating ? <Spinner text={`Saving...`} /> : "Save Changes"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </form>
    )
}

export default Edit;