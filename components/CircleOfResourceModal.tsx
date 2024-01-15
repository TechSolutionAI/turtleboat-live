import { useState } from "react";
import { Transition } from "@headlessui/react";
import Select from "react-select";
import { CircleOfResource } from "@/types/circleofresource.type";
import Spinner from "./Spinner";

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const CircleOfResourceModal = ({
  isNew,
  showModal,
  data,
  ventures,
  isSaving,
  setData,
  closeFunc,
  addCircleOfResource,
  chooseVenture,
}: {
  isNew: boolean;
  showModal: boolean;
  data: CircleOfResource;
  ventures?: any[];
  isSaving?: boolean;
  setData: Function;
  closeFunc: Function;
  addCircleOfResource: Function;
  chooseVenture?: Function;
}) => {
  const circleOfResources = [
    { label: "Best friends and family", value: 1, color: "#E59C59" },
    { label: "Teachers and colleagues", value: 2, color: "#EBCA62" },
    { label: "Network/Affiliation", value: 3, color: "#87CC9B" },
    { label: "Friends of friends", value: 4, color: "#76C9EE" },
    { label: "Strangers", value: 5, color: "#9058D8" },
  ];

  const typeOfAsset = [
    { label: "Hard Skill", value: "hardskill" },
    { label: "Knowledge", value: "knowledge" },
    { label: "Equipment/venue", value: "equipment/venue" },
  ];

  const [isValid, setIsValid] = useState<boolean>(true);
  const [ventureId, setVentureId] = useState<string>("");
  const [isVentureSelected, setVentureSelected] = useState<boolean>(true);

  const onAddCircleOfResourceClicked = () => {
    if (ventures && ventureId === "") {
      setVentureSelected(false);
    } else if (data.pointOfContact!.trim() === "") {
      setIsValid(false);
    } else {
      setVentureSelected(true);
      setIsValid(true);
      addCircleOfResource(data);
    }
  };

  const onCloseBtnClicked = () => {
    closeFunc();
  };

  return (
    <>
      <Transition
        show={showModal}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`fixed top-0 left-0 right-0 w-full flex 
              justify-center items-center p-4 
              overflow-x-hidden overflow-y-auto 
              md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`}
        >
          <div className="relative w-full max-w-3xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <button
                type="button"
                className={`absolute top-3 right-2.5 
                text-gray-400 bg-transparent 
                hover:bg-gray-200 hover:text-gray-900 
                  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`}
                onClick={onCloseBtnClicked}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-4 border-b rounded">
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
                  {isNew ? "Add" : "Change"} Circle Of Resources
                </h3>
                {ventures && chooseVenture && (
                  <div className="mt-10">
                    <label
                      htmlFor="circleofresource"
                      className="block mb-2 font-semibold text-black"
                    >
                      Ventures <span className="text-tertiary-red">*</span>
                    </label>
                    <Select
                      options={ventures}
                      value={ventures.filter(
                        (venture) => venture.value === ventureId
                      )}
                      placeholder={`Select Venture`}
                      isSearchable={false}
                      onChange={(venture) => {
                        setVentureSelected(true);
                        setVentureId(venture.value);
                        chooseVenture(venture.value);
                      }}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          borderRadius: "5px",
                          padding: "3px",
                          border: state.isFocused
                            ? "1px solid #2E65F3"
                            : "1px solid #2E65F3",
                        }),
                        option: (provided, state) => ({
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
                    {!isVentureSelected && (
                      <p className="mt-2 text-sm text-red-600">
                        <span className="font-medium">Oops!</span> Please select
                        a venture!
                      </p>
                    )}
                  </div>
                )}
                <div className={ventures ? "mt-5" : "mt-10"}>
                  <label
                    htmlFor="circleofresource"
                    className="block mb-2 font-semibold text-black"
                  >
                    Circle of Resource{" "}
                    <span className="text-tertiary-red">*</span>
                  </label>
                  <Select
                    options={circleOfResources}
                    defaultValue={circleOfResources[0]}
                    value={circleOfResources.filter(
                      (circle) => circle.value === data.circleDistance
                    )}
                    placeholder={`Select Circle of Resource..`}
                    isSearchable={false}
                    onChange={(circle) => {
                      let tempData: CircleOfResource = {
                        ...data,
                        circleDistance: circle!.value,
                      };
                      setData(tempData);
                    }}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderRadius: "5px",
                        padding: "3px",
                        border: state.isFocused
                          ? "1px solid #2E65F3"
                          : "1px solid #2E65F3",
                      }),
                      option: (provided, state) => {
                        return {
                          ...provided,
                          backgroundColor: state.isSelected
                            ? state.data.color
                            : "white",
                          color: state.isSelected ? "white" : state.data.color,
                          ":hover": {
                            backgroundColor: state.isSelected
                              ? state.data.color
                              : state.data.color + "20",
                          },
                        };
                      },
                      singleValue: (provided, state) => ({
                        ...provided,
                        ...dot(state.data.color),
                      }),
                    }}
                  />
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="pointofcontact"
                    className="block mb-2 font-semibold text-black"
                  >
                    Point of contact{" "}
                    <span className="text-tertiary-red">*</span>
                  </label>
                  <input
                    value={data.pointOfContact}
                    placeholder="Enter the point of contact"
                    onChange={(e) => {
                      setIsValid(true);
                      let tempData: CircleOfResource = {
                        ...data,
                        pointOfContact: e.target.value,
                      };
                      setData(tempData);
                    }}
                    className="bg-white border border-[#2E65F3] w-full rounded-md px-3 py-2.5 outline-[#2E65F3]"
                  />
                  {!isValid && (
                    <p className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Oops!</span> Please input
                      point of contact!
                    </p>
                  )}
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="typeofasset"
                    className="block mb-2 font-semibold text-black"
                  >
                    Type of asset <span className="text-tertiary-red">*</span>
                  </label>
                  <Select
                    options={typeOfAsset}
                    defaultValue={typeOfAsset[0]}
                    value={typeOfAsset.filter(
                      (item) => item.label === data.typeOfAsset
                    )}
                    placeholder={`Select type of asset..`}
                    isSearchable={false}
                    onChange={(type) => {
                      let tempData = { ...data, typeOfAsset: type!.label };
                      setData(tempData);
                    }}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderRadius: "5px",
                        padding: "3px",
                        border: state.isFocused
                          ? "1px solid #2E65F3"
                          : "1px solid #2E65F3",
                      }),
                      option: (provided, state) => ({
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
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="descriptionofasset"
                    className="block mb-2 font-semibold text-black"
                  >
                    Description of asset
                  </label>
                  <textarea
                    placeholder="Write description here..."
                    value={data.descriptionOfAsset}
                    onChange={(e) => {
                      let tempData = {
                        ...data,
                        descriptionOfAsset: e.target.value,
                      };
                      setData(tempData);
                    }}
                    className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                    rows={3}
                    maxLength={1500}
                  />
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="pointofcontact"
                    className="block mb-2 font-semibold text-black"
                  >
                    Notes
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    value={data.notes}
                    onChange={(e) => {
                      let tempData = { ...data, notes: e.target.value };
                      setData(tempData);
                    }}
                    className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                    rows={3}
                    maxLength={1500}
                  />
                </div>
              </div>
              <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                  type="button"
                  className={`text-gray-500 bg-white hover:bg-gray-100 
                    focus:ring-4 focus:outline-none focus:ring-gray-200 
                    rounded-lg border border-gray-200 text-sm font-medium 
                    px-5 py-2.5 hover:text-gray-900 focus:z-10`}
                  onClick={onCloseBtnClicked}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`text-white bg-primary-blue hover:bg-primary-blue 
                    focus:ring-4 focus:outline-none focus:ring-primary-blue 
                    font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    `}
                  onClick={onAddCircleOfResourceClicked}
                >
                  {isSaving && isSaving ? (
                    <Spinner size={"5"} text={"Saving..."} />
                  ) : isNew ? (
                    "Add"
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <div
        className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${
          !showModal ? "hidden" : ""
        }`}
      ></div>
    </>
  );
};

export default CircleOfResourceModal;
