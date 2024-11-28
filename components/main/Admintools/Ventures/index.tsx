import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Select from "react-select";

import List from "./List";
import Add from "./Add";
import Edit from "./Edit";
import EditAccess from "./EditAccess";
import View from "./View";
import Spinner from "@/components/Spinner";
import { Venture } from "@/types/venture.type";
import { Course } from "@/types/course.type";

interface Option {
  value: string;
  label: string;
}

const Ventures = () => {
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [accessModal, setAccessModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editableIndex, setEditableIndex] = useState<number>(0);
  const [editableData, setEditableData] = useState<any>({});
  const [venturesData, setVenturesData] = useState<Venture[]>([]);
  const [filteredVenturesData, setFilteredVenturesData] = useState<Venture[]>(
    []
  );
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Option>({
    value: "",
    label: "All courses",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCoursesLoading, setIsCoursesLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Option[]>([]);

  const getCourses = async () => {
    let courseList: Option[] = [];
    const allCoursesItem = {
      value: "",
      label: "All courses",
    };
    setIsCoursesLoading(true);
    const response = await fetch("/api/courses", {
      method: "GET",
    });

    if (!response.ok) {
      setIsCoursesLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      setIsCoursesLoading(false);
      const { courses } = await response.json();
      courseList = courses.map((course: Course, index: number) => {
        let courseItem = {
          value: course._id,
          label: course.title,
        };
        return courseItem;
      });
    }
    setCourses([allCoursesItem, ...courseList]);
  };

  const getVentures = async () => {
    setIsLoading(true);
    const response = await fetch("/api/ventures", {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      setIsLoading(false);
      const { ventures } = await response.json();
      setVenturesData(ventures);
      setFilteredVenturesData(ventures);
      setEditableData(ventures[0]);
    }
  };

  useEffect(() => {
    document.title = "Curriculum - Turtle Boat Admin";
    getVentures();
    getCourses();
  }, []);

  const addVentures = (ventures: Venture[]) => {
    setFilteredVenturesData((prev) => [...prev, ...ventures]);
  };

  const duplicateData = (venture: Venture, index: number) => {
    let temp = [...venturesData];
    temp.splice(index, 0, venture);
    setFilteredVenturesData(temp);
  };

  const updateData = (venture: Venture) => {
    let temp = [...venturesData];
    temp[editableIndex] = venture;
    setFilteredVenturesData(temp);
  };

  const archiveData = (index: number) => {
    setVenturesData((prevData) => prevData.filter((_, i) => i != index));
    setFilteredVenturesData((prevData) =>
      prevData.filter((_, i) => i != index)
    );
  };

  const handleSearchChanged = (value: string) => {
    setSearchText(value.toLowerCase());
    let temp = [...venturesData];
    setFilteredVenturesData(
      temp.filter(
        (ventureItem) =>
          (ventureItem.course._id == selectedCourse.value ||
            selectedCourse.value == "") &&
          ventureItem.title.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSortData = (field: string, sort: number) => {
    let temp = [...venturesData];
    if (field == "title") {
      temp.sort((a: Venture, b: Venture) =>
        sort == 1
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
    } else if (field == "createdAt") {
      temp.sort(function (a: Venture, b: Venture) {
        return sort == 1
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    setFilteredVenturesData(
      temp.filter(
        (ventureItem) =>
          (ventureItem.course._id == selectedCourse.value ||
            selectedCourse.value == "") &&
          ventureItem.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  return (
    <>
      {!(addModal || editModal || accessModal || viewModal) && (
        <div
          className={`px-4 pt-[60px] pb-[20px] bg-white justify-between fixed venture-filter-bar z-10 ${
            addModal ? "hidden" : "flex"
          }`}
        >
          <button
            className="flex items-center justify-center bg-[#2E65F3] text-[white] w-[133px] h-[50px] text-[12px] font-Inter rounded-[50px]"
            onClick={() => setAddModal(true)}
          >
            <AddIcon />
            {" Add Venture"}
          </button>
          <div className={`flex`}>
            <input
              type="text"
              className="border-secondary-gray border-[1px] rounded-[8px] h-[48px] mx-[20px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
              placeholder="Search ..."
              id="search"
              onChange={(e) => {
                handleSearchChanged(e.target.value);
              }}
            />
            <div className={`w-48`}>
              {isCoursesLoading ? (
                <Spinner />
              ) : (
                <Select
                  options={courses}
                  value={selectedCourse}
                  placeholder={`Select Course ...`}
                  isSearchable={true}
                  onChange={(course: any) => {
                    if (course != null) {
                      setSelectedCourse(course);
                      let temp = [...venturesData];
                      setFilteredVenturesData(
                        temp.filter(
                          (ventureItem) =>
                            (ventureItem.course._id == course.value ||
                              course.value == "") &&
                            ventureItem.title.toLowerCase().includes(searchText)
                        )
                      );
                    }
                  }}
                  onInputChange={(text: string) => setSearchText(text)}
                  filterOption={(course: any, inputValue: string) => {
                    const label = course.label.toLowerCase();
                    const value = course.value.toLowerCase();
                    const search = inputValue.toLowerCase();
                    return label.includes(search) || value.includes(search);
                  }}
                  styles={{
                    control: (provided: any, state: any) => ({
                      ...provided,
                      borderRadius: "5px",
                      padding: "3px",
                      border: state.isFocused
                        ? "1px solid #2E65F3"
                        : "1px solid #2E65F3",
                    }),
                    option: (provided: any, state: any) => ({
                      ...provided,
                      backgroundColor: state.isSelected
                        ? "#2E65F3"
                        : "transparent",
                      color: state.isSelected ? "white" : "#4a5568",
                      ":hover": {
                        backgroundColor: state.isSelected
                          ? "#2E65F3"
                          : "#e2e8f0",
                        color: state.isSelected ? "white" : "#4a5568",
                      },
                    }),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="pt-[60px]">
        {!(addModal || editModal || accessModal || viewModal) && isLoading ? (
          <div className="pt-[100px] grid grid-cols-1 gap-x-[100px]">
            <Spinner text="Loading ventures..." />
          </div>
        ) : (
          !(addModal || editModal || accessModal || viewModal) && (
            <List
              setAccessModal={setAccessModal}
              setEditModal={setEditModal}
              setViewModal={setViewModal}
              setEditableData={setEditableData}
              setEditableIndex={setEditableIndex}
              sortData={handleSortData}
              ventures={filteredVenturesData}
              archiveData={archiveData}
            />
          )
        )}

        {addModal && (
          <Add setAddModal={setAddModal} addVentures={addVentures} />
        )}

        {editModal && (
          <Edit
            setEditModal={setEditModal}
            editableData={editableData}
            updateData={updateData}
            editableIndex={editableIndex}
          />
        )}
        {accessModal && (
          <EditAccess
            setAccessModal={setAccessModal}
            editableData={editableData}
            editableIndex={editableIndex}
          />
        )}
        {viewModal && (
          <View setViewModal={setViewModal} editableData={editableData} />
        )}
      </div>
    </>
  );
};

export default Ventures;
