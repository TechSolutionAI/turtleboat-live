import React, { useState, useEffect } from 'react';
import { Venture } from '@/types/venture.type';
import UserSelect from '@/components/UserSelect';

const View = ({
    setViewModal,
    editableData,
}: {
    setViewModal: any,
    editableData: Venture,
}) => {
    const [title, setTitle] = useState<string>('');
    const [course, setCourse] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [selectedMentees, setSelectedMentees] = useState<any[]>(convertList4Options([editableData.mentee]));
    const [selectedMentors, setSelectedMentors] = useState<any[]>(convertList4Options(editableData.mentors));

    useEffect(() => {
        setTitle(editableData.title);
        setCourse(editableData.course._id);
        setDescription(editableData.description);
        setSelectedMentees(convertList4Options([editableData.mentee]))
        setSelectedMentors(convertList4Options(editableData.mentors))
    }, [])

    function convertList4Options(list: any[]) {
        let options: any[] = [];
        if (list != null) {
            list.map((item: any, index: number) => {
                if (item != null) {
                    const option = {
                        value: item.email,
                        label: item.name,
                        image: item.image
                    }
                    options.push(option);
                }
            });
            return options;
        } else {
            return options;
        }
    }

    return (
        <>
            <div className={`justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none`}>
                <div className="relative w-11/12 sm:w-11/12 my-0">
                    <div className="border-0 rounded-lg relative flex flex-col w-full sm:px-[20px]">
                        <div className="relative p-6 flex-auto">
                            <div>
                                <label className='font-Inter font-semibold tracking-widest text-primary-black'>TITLE</label>
                                <p className='py-3 font-Inter tracking-widest text-[#333333]'>{title}</p>
                            </div>
                        </div>
                        <div className="relative px-6 py-3 flex-auto overflow-y-auto">
                            <label className="font-Inter font-semibold tracking-widest text-primary-black">COURSE</label>
                            <p className='py-3 font-Inter tracking-widest text-[#333333]'>{editableData.course.title}</p>
                        </div>

                        <div className="relative px-6 py-3 flex-auto">
                            <label className='font-Inter font-semibold tracking-widest text-primary-black'>MENTEE</label>
                        </div>
                        <div className="relative px-6 pb-3">
                            <UserSelect
                                setData={() => {}}
                                multiple={true}
                                selectedList={selectedMentees}
                                disabled={true}
                                type={"mentee"}
                                disabledList={selectedMentors}
                                limit={1}
                            />
                        </div>

                        <div className="relative px-6 py-3 flex-auto">
                            <label className='font-Inter font-semibold tracking-widest text-primary-black'>MENTORS</label>
                        </div>
                        <div className="relative px-6 pb-3">
                            <UserSelect
                                setData={() => {}}
                                multiple={true}
                                disabled={true}
                                selectedList={selectedMentors}
                                type={"mentor"}
                                disabledList={editableData.mentee != null ? convertList4Options([editableData.mentee]) : selectedMentees}
                                limit={-1}
                            />
                        </div>

                        <div className="relative p-6 flex-auto">
                            <label className='font-Inter font-semibold tracking-widest text-primary-black'>DESCRIPTION</label>
                            <p className='py-3 font-Inter tracking-widest text-[#333333]'>{description}</p>
                        </div>

                        <div className="flex items-center justify-end font-Inter font-bold p-6">
                            <button
                                className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setViewModal(false)}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default View;