import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";

import List from "./List";
import Modal from "./Modal";
import Spinner from "@/components/Spinner";
import { Course } from "@/types/course.type";

const Courses = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  const getCourses = async () => {
    setIsLoading(true);
    const response = await fetch("/api/courses", {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      setIsLoading(false);
      const { courses } = await response.json();
      setCourses(courses);
    }
  };

  useEffect(() => {
    document.title = "Curriculum - Turtle Boat Admin";
    getCourses();
  }, []);

  const addData = (course: Course) => {
    setCourses((prev) => [...prev, course]);
  };

  const updateData = (course: Course, index: number) => {
    let temp = [...courses];
    temp[index] = course;
    setCourses(temp);
  };

  const duplicateData = (course: Course, index: number) => {
    let temp = [...courses];
    temp.splice(index, 0, course);
    setCourses(temp);
  };

  const deleteData = (index: number) => {
    let temp = [...courses];
    temp.splice(index, 1);
    setCourses(temp);
  };

  return (
    <>
      {!showModal && (
        <div className="px-4 pt-[60px] pb-[20px] fixed bg-white w-full z-10 block sm:flex items-center">
          <button
            className="flex items-center justify-center bg-[#2E65F3] text-[white] w-[133px] h-[50px] text-[12px] font-Inter rounded-[50px]"
            onClick={() => setShowModal(true)}
          >
            <AddIcon />
            {" New Course"}
          </button>
          <label className="font-Inter text-xl sm:ml-[50px]">{title}</label>
        </div>
      )}
      <div className="pt-[60px]">
        {showModal && (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            addData={addData}
          />
        )}
        {isLoading ? (
          <div className="pt-[100px] grid grid-cols-1 gap-x-[100px]">
            <Spinner text="Loading courses..." />
          </div>
        ) : (
          !showModal && (
            <List
              initialCourses={courses}
              updateData={updateData}
              duplicateData={duplicateData}
              deleteData={deleteData}
              setSelectedTitle={setTitle}
            />
          )
        )}
      </div>
    </>
  );
};

export default Courses;
