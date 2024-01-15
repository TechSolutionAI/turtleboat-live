import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import CourseSelect from '@/components/CourseSelect';
import Spinner from "@/components/Spinner";
import UserSelect from '@/components/UserSelect';

const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
});

const defaultValues = {
    title: "",
    course: "",
    description: "",
}

const Add = ({ 
    setAddModal, 
    addVentures 
}: { 
    setAddModal: any, 
    addVentures: any 
}) => {
    const formOptions = { resolver: yupResolver(schema), defaultValues: { ...(defaultValues as any) } };
    const { register, handleSubmit } = useForm(formOptions);
    const [errors, setErrors] = useState<any>({});
    const [title, setTitle] = useState<string>('');
    const [course, setCourse] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isCreating, setIsCreating] = useState(false);
    const [isTeam, setIsTeam] = useState(false);
    const [selectedMentees, setSelectedMentees] = useState<any[]>([]);
    const [selectedMentors, setSelectedMentors] = useState<any[]>([]);

    function onSubmit(data: any) {
        setErrors({})
        if (title != "" && course != "") {
            const menteeList = selectedMentees.map((mentee) => {
                return {
                    _id: mentee.value,
                    name: mentee.label,
                    image: mentee.image,
                    email: mentee.email
                }
            })
            const mentorList = selectedMentors.map((mentee) => {
                return {
                    _id: mentee.value,
                    name: mentee.label,
                    image: mentee.image,
                    email: mentee.email
                }
            })
            saveVenture({
                title: title,
                course: course,
                description: description,
                mentees: menteeList,
                mentors: mentorList,
                isTeam: isTeam
            })
        }
        return false;
    }

    const handleMenteesSelected = (menteeList: any[]) => {
        if (menteeList.length == 0) {
            setSelectedMentors([]);
        }
        setSelectedMentees(menteeList);
    }

    const handleMentorsSelected = (mentorList: any) => {
        setSelectedMentors(mentorList);
    }

    const handleErrors = (errors: any) => {
        if (course == "") {
            errors.course = {
                message: "Please select course"
            }
        }
        setErrors(errors);
    };

    const handleCourseSelected = (value: string) => {
        setCourse(value);
    }

    const saveVenture = async (data: any) => {
        setIsCreating(true);
        const response = await fetch('/api/ventures', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: data
            })
        });

        if (!response.ok) {
            setIsCreating(false);
            const { err } = await response.json();
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
            const { ventures } = await response.json();
            setIsCreating(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                allowOutsideClick: false,
                text: `Venture was created successfully!`,
            })
                .then(() => {
                    addVentures(ventures)
                    setAddModal(false);
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
            <div className={`justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none`}>
                <div className="relative w-11/12 sm:w-11/12 my-0">
                    <div className="border-0 rounded-lg relative flex flex-col w-full sm:px-[20px]">
                        <div className="relative p-6 flex-auto">
                            <div>
                                <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>TITLE <span className="text-secondary-red">*</span></label>
                                <input type='text' className='w-full mt-[15px] border-secondary-gray border-[1px] rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue'
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
                            <label className="font-Inter font-semibold tracking-[0.1em] text-[#232325]">SELECT COURSE <span className="text-secondary-red">*</span></label>
                        </div>
                        <div className="relative px-6 pb-3">
                            <CourseSelect setCourse={handleCourseSelected} />
                            {
                                errors.course && errors.course.message != "" && (
                                    <div className='p-1'>
                                        <span className="text-secondary-red text-sm">
                                            {
                                                errors.course.message
                                            }
                                        </span>
                                    </div>
                                )
                            }
                        </div>

                        <div className="relative px-6 py-3 flex-auto">
                            <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>ASSIGN MENTEE(S)</label>
                        </div>
                        <div className="relative px-6 pb-3">
                            <UserSelect 
                                setData={handleMenteesSelected} 
                                multiple={true} 
                                disabled={false}
                                type={"mentee"}
                                selectedList={[]}
                                disabledList={selectedMentors}
                                limit={10}
                            />
                        </div>

                        <div className="relative px-6 py-3 flex-auto flex gap-x-4">
                            <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>ASSIGN MENTORS</label>
                            <div className="flex items-center gap-x-1 cursor-pointer" onClick={() => {
                                setIsTeam(!isTeam);
                            }}>
                            {
                                isTeam ? 
                                <ThumbUpAltIcon style={{ color: '#0fa958'}}/> : 
                                <ThumbUpOffAltIcon style={{ color: '#0fa958'}}/>
                            }
                            Create as team
                            </div>
                        </div>
                        <div className="relative px-6 pb-3">
                            <UserSelect
                                setData={handleMentorsSelected}
                                multiple={true}
                                disabled={!(selectedMentees.length > 0)}
                                type={"mentor"}
                                selectedList={[]}
                                disabledList={selectedMentees}
                                limit={-1}
                            />
                        </div>

                        <div className="relative p-6 flex-auto">
                            <label className='font-Inter font-semibold tracking-[0.1em] text-[#232325]'>DESCRIPTION</label>
                            <textarea rows={4} className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 min-h-[200px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                                placeholder="Write your thoughts here..."
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-end font-Inter font-bold p-6">
                            <button
                                className="text-[#232325] background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => {
                                    setAddModal(false);
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
                                    isCreating ? <Spinner text={`Creating...`} /> : "Save Changes"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </form>
    )
}

export default Add;