import React, { useState, useEffect } from "react";
import * as Yup from "yup";

import { Venture } from "@/types/venture.type";
import UserSelect from "@/components/UserSelect";
import Spinner from "@/components/Spinner";

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

const EditAccess = ({
  setAccessModal,
  editableData,
  editableIndex,
}: {
  setAccessModal: any;
  editableData: Venture;
  editableIndex: number;
}) => {
  const [isSavong, setIsSaving] = useState(false);
  const [mentees, setMentees] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);

  const handleMenteeSelected = (value: any) => {
    setMentees(value);
  };

  const handleMentorsSelected = (value: any) => {
    setMentors(value);
  };

  return (
    <>
      <div
        className={`justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none`}
      >
        <div className="relative w-11/12 sm:w-11/12 my-6">
          <div className="border-0 rounded-lg relative flex flex-col w-full sm:px-[20px]">
            <div className="relative p-6 flex-auto">
              <div>
                <label className="font-Inter font-semibold tracking-widest text-primary-black">
                  VENTURE TITLE
                </label>
                <input
                  type="text"
                  className="w-full mt-[15px] border-secondary-gray border rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
                  placeholder="Enter Text Here..."
                  id="title"
                  value={editableData.title}
                  disabled={true}
                />
              </div>
            </div>

            <div className="relative px-6 py-3 flex-auto">
              <label className="font-Inter font-semibold tracking-widest text-primary-black">
                ASSIGN MENTEE
              </label>
            </div>
            <div className="relative px-6 pb-3">
              <UserSelect
                setData={handleMenteeSelected}
                multiple={true}
                disabled={false}
                disabledList={[]}
                limit={10}
                type={"mentee"}
                selectedList={[]}
              />
            </div>

            <div className="relative px-6 py-3 flex-auto">
              <label className="font-Inter font-semibold tracking-widest text-primary-black">
                ASSIGN MENTORS
              </label>
            </div>
            <div className="relative px-6 pb-3">
              <UserSelect
                setData={handleMentorsSelected}
                multiple={true}
                disabled={!(mentees.length > 0)}
                disabledList={[]}
                limit={-1}
                type={"mentor"}
                selectedList={[]}
              />
            </div>

            <div className="relative px-6 py-3 flex-auto overflow-y-auto">
              <label className="font-Inter font-semibold tracking-widest text-primary-black">
                COURSE
              </label>
              <input
                type="text"
                className="w-full mt-[15px] border-secondary-gray border rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
                placeholder="Enter Text Here..."
                id="course"
                value={editableData.course.title}
                disabled={true}
              />
            </div>

            <div className="relative p-6 flex-auto">
              <label className="font-Inter font-semibold tracking-widest text-primary-black">
                DESCRIPTION
              </label>
              <textarea
                rows={4}
                className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                placeholder="Write your thoughts here..."
                value={editableData.description}
                disabled={true}
              ></textarea>
            </div>

            <div className="flex items-center justify-end font-Inter font-bold p-6">
              <button
                className="text-primary-black background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setAccessModal(false)}
                disabled={isSavong ? true : false}
              >
                Cancel
              </button>
              <button
                className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                {isSavong ? <Spinner text={`Saving...`} /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAccess;
