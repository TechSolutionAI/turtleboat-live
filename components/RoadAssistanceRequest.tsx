import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Select from "react-select";
import shortid from "shortid";
import Swal from "sweetalert2";

import UserSelect from "@/components/UserSelect";
import Spinner from "@/components/Spinner";
import { Venture } from "@/types/venture.type";
import AudioPlayer from "@/components/AudioPlayer";
import RoadAssistanceUpload from "@/components/RoadAssistanceUpload";

const requiredErrMsg = "This field is required!";

const assistanceOptions = [
  {
    label: "Specific CORE Members",
    value: 0,
  },
  {
    label: "All CORE Members",
    value: 1,
  },
];

const elevatorOptions = [
  {
    label: "Pull elevator pitch sound bite from my Dashboard",
    value: 0,
  },
  {
    label: "Pull Story Train from my Dashboard",
    value: 1,
  },
  {
    label: "Enter elevator pitch manually",
    value: 2,
  },
  {
    label: "I don't know my elevator pitch yet",
    value: 3,
  },
];

const eraOptions = [
  {
    label: "Industry-specific (processes, KPIs)",
    value: 1,
  },
  {
    label: "Prototyping - quick sketches or mockups",
    value: 5,
  },
  {
    label: "Crafting discovery tests",
    value: 2,
  },
  {
    label: "Physical prototyping",
    value: 6,
  },
  {
    label: "Brainstorming and fleshing out ideas",
    value: 3,
  },
  {
    label: "Electronics prototyping",
    value: 7,
  },
  {
    label: "Storytelling: refining value proposition and/or pitch deck",
    value: 4,
  },
  {
    label: "Other",
    value: 8,
  },
];

const RoadAssistanceRequest = ({
  showModal,
  closeFunc,
  audioData,
  storyTrain,
  ventureId,
}: {
  showModal: boolean;
  closeFunc: Function;
  audioData: string | null;
  storyTrain: any[] | null | undefined;
  ventureId: string | undefined;
}) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [isCreating, setIsCreating] = useState(false);
  const [files, setFormFiles] = useState<FileList | null>(null);
  const [assistanceTo, setAssistanceTo] = useState<any | null>();
  const [elevatorType, setElevatorType] = useState<any | null>();
  const [specificHelpRequest, setSpecificHelpRequest] = useState<string>("");
  const [whatYouDid, setWhatYouDid] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [typeLabel, setTypeLabel] = useState<string>("");
  const [opening, setOpening] = useState<string>("");
  const [character, setCharcter] = useState<string>("");
  const [problem, setProblem] = useState<string>("");
  const [setting, setSetting] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [closing, setClosing] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

  const [typeError, setTypeError] = useState<boolean>(false);
  const [specificHelpRequestError, setSpecificHelpRequestError] =
    useState<boolean>(false);
  const [assistanceToError, setAssistanceToError] = useState<boolean>(false);
  const [whatYouDidError, setWhatYouDidError] = useState<boolean>(false);
  const [elevatorTypeError, setElevatorTypeError] = useState<boolean>(false);
  const [membersError, setMembersError] = useState<boolean>(false);
  const [openingError, setOpeningError] = useState<boolean>(false);
  const [problemError, setProblemError] = useState<boolean>(false);
  const [characterError, setCharacterError] = useState<boolean>(false);
  const [settingError, setSettingError] = useState<boolean>(false);
  const [solutionError, setSolutionError] = useState<boolean>(false);
  const [closingError, setClosingError] = useState<boolean>(false);

  const handleCloseClicked = () => {
    closeFunc();
  };

  const handleTypeChange = (value: string, label: string) => {
    setType(value);
    setTypeLabel(label);
    setTypeError(false);
  };

  const handleSpecificHelpRequestChange = (value: string) => {
    setSpecificHelpRequest(value);
    setSpecificHelpRequestError(false);
  };

  const handleWhatYouDidChange = (value: string) => {
    setWhatYouDid(value);
    setWhatYouDidError(false);
  };

  const handleOpeningHookChange = (value: string) => {
    setOpening(value);
    setOpeningError(value == "");
  };

  const handleProblemChange = (value: string) => {
    setProblem(value);
    setProblemError(value == "");
  };

  const handleCharacterChange = (value: string) => {
    setCharcter(value);
    setCharacterError(value == "");
  };

  const handleSolutionChange = (value: string) => {
    setSolution(value);
    setSolutionError(value == "");
  };

  const handleClosingHookChange = (value: string) => {
    setClosing(value);
    setClosingError(value == "");
  };

  const handleSettingChange = (value: string) => {
    setSetting(value);
    setSettingError(value == "");
  };

  const handleAssistanceToChange = (selected: any) => {
    setAssistanceTo(selected);
    setAssistanceToError(false);
  };

  const handleElevatorTypeChange = (selected: any) => {
    setElevatorType(selected);
    if (selected.value == 1) {
      fillStoryTrainData();
    } else if (selected.value == 2) {
      setOpening("");
      setCharcter("");
      setProblem("");
      setSetting("");
      setSolution("");
      setClosing("");
    }
    setElevatorTypeError(false);
  };

  const fillStoryTrainData = () => {
    storyTrain?.map((trainItem) => {
      switch (trainItem.id) {
        case "opening":
          setOpening(trainItem.value);
          break;
        case "character":
          setCharcter(trainItem.value);
          break;
        case "setting":
          setSetting(trainItem.value);
          break;
        case "problem":
          setProblem(trainItem.value);
          break;
        case "solution":
          setSolution(trainItem.value);
          break;
        case "closing":
          setClosing(trainItem.value);
          break;
      }
    });
  };

  const handleMemberSelected = (memberList: any) => {
    setSelectedMembers(memberList);
    setMembersError(memberList.length == 0);
  };

  const requestERA = async () => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("typeLabel", typeLabel);
    formData.append("specificHelpRequest", specificHelpRequest);
    formData.append("assistanceType", assistanceTo.value);
    formData.append("vid", ventureId == undefined ? "" : ventureId);
    const memberList = selectedMembers.map((member) => {
      return {
        _id: member.value,
        name: member.label,
        image: member.image,
        email: member.email,
      };
    });
    if (typeof user._id === "string" && user._id !== "") {
      formData.append("uid", user._id.toString());
    }
    formData.append("memberList", JSON.stringify(memberList));
    formData.append("whatYouDid", whatYouDid);
    formData.append("elevatorType", elevatorType.value);
    formData.append("opening", opening);
    formData.append("problem", problem);
    formData.append("setting", setting);
    formData.append("character", character);
    formData.append("solution", solution);
    formData.append("closing", closing);
    if (files != null) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`file${i}`, files[i]);
      }
    }

    setIsCreating(true);
    const response = await fetch("/api/roadassist", {
      method: "POST",
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
        })
        .catch((err) => console.log(err));
    } else {
      const { result } = await response.json();
      setIsCreating(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        text: `Request ERA created successfully!`,
      })
        .then(() => {
          closeFunc();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleRequestClick = () => {
    var errorCounts = 0;
    if (type == "") {
      setTypeError(true);
      errorCounts++;
    }

    if (specificHelpRequest == "") {
      setSpecificHelpRequestError(true);
      errorCounts++;
    }

    if (assistanceTo == undefined) {
      setAssistanceToError(true);
      errorCounts++;
    } else if (assistanceTo.value == 0 && selectedMembers.length == 0) {
      setMembersError(true);
      errorCounts++;
      setAssistanceToError(false);
    } else {
      setMembersError(false);
      setAssistanceToError(false);
    }

    if (whatYouDid == "") {
      setWhatYouDidError(true);
      errorCounts++;
    }

    if (elevatorType == undefined) {
      setElevatorTypeError(true);
      errorCounts++;
    } else if (elevatorType.value == 0) {
      if (audioData != null) {
        setElevatorTypeError(false);
        setOpeningError(false);
        setProblemError(false);
        setCharacterError(false);
        setSolutionError(false);
        setSettingError(false);
        setClosingError(false);
      } else {
        setElevatorTypeError(true);
        errorCounts++;
      }
    } else if (elevatorType.value == 3) {
      setElevatorTypeError(false);
      setOpeningError(false);
      setProblemError(false);
      setCharacterError(false);
      setSolutionError(false);
      setSettingError(false);
      setClosingError(false);
    } else {
      setElevatorTypeError(false);
      setOpeningError(opening == "");
      setProblemError(problem == "");
      setCharacterError(character == "");
      setSolutionError(solution == "");
      setSettingError(setting == "");
      setClosingError(closing == "");
      errorCounts += opening == "" ? 1 : 0;
      errorCounts += problem == "" ? 1 : 0;
      errorCounts += character == "" ? 1 : 0;
      errorCounts += solution == "" ? 1 : 0;
      errorCounts += setting == "" ? 1 : 0;
      errorCounts += closing == "" ? 1 : 0;
    }

    if (errorCounts == 0) {
      requestERA();
    }
  };

  const init = () => {
    setFormFiles(null);
    setAssistanceTo(undefined);
    setElevatorType(undefined);
    setSpecificHelpRequest("");
    setWhatYouDid("");
    setType("");
    setTypeLabel("");
    setOpening("");
    setCharcter("");
    setProblem("");
    setSetting("");
    setSolution("");
    setClosing("");
    setSelectedMembers([]);

    setAssistanceToError(false);
    setTypeError(false);
    setSpecificHelpRequestError(false);
    setWhatYouDidError(false);
    setElevatorTypeError(false);
    setOpeningError(false);
    setProblemError(false);
    setCharacterError(false);
    setSolutionError(false);
    setSettingError(false);
    setClosingError(false);
    setMembersError(false);
    setAssistanceTo(assistanceOptions[0]);
  };

  useEffect(() => {
    init();
  }, [showModal]);

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
                        overflow-x-hidden overflow-y-scroll 
                        md:inset-0 h-[calc(100%-1rem)] max-h-full`}
          style={{
            zIndex: 51,
          }}
        >
          <div className="relative w-full max-w-3xl max-h-full font-Inter">
            <div className="relative bg-white rounded-lg shadow">
              <button
                type="button"
                className={`absolute top-3 right-2.5 
                            text-gray-400 bg-transparent 
                            hover:bg-gray-200 hover:text-gray-900 
                            rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`}
                onClick={handleCloseClicked}
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
                <h1 className="text-base font-semibold font-Inter text-gray-900 lg:text-xl">
                  Request Entrepreneurial Roadside Assistance (ERA)
                </h1>
              </div>
              <div className="px-6 py-4 max-h-[750px] overflow-y-scroll">
                <p className="block mb-2 text-[#6F727A]">
                  Need some quick advice or pointers to help you get unstuck?
                  Your mentors and members of the CORE community will see your
                  question and be able to respond. They will also receive your
                  elevator pitch soundbite. Remember, no question is ever a
                  “dumb” question!
                </p>

                <h2 className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]">
                  Type of ERA <span className="text-secondary-red">*</span>
                </h2>
                <div className="grid grid-cols-2">
                  {eraOptions.map((option: any) => {
                    return (
                      <div
                        key={shortid()}
                        className="flex items-center px-1 py-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          value={option.value}
                          id={option.value}
                          onChange={() =>
                            handleTypeChange(option.value, option.label)
                          }
                          name="typeofera"
                          checked={type == option.value}
                          className={`w-5 h-5 text-primary-blue bg-gray-100`}
                        />
                        <label
                          className="ml-2 text-md font-Inter font-bold text-black cursor-pointer"
                          htmlFor={option.value}
                          onClick={() =>
                            handleTypeChange(option.value, option.label)
                          }
                        >
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                  {typeError && (
                    <div className="p-1">
                      <span className="text-secondary-red text-sm">
                        {requiredErrMsg}
                      </span>
                    </div>
                  )}
                </div>

                <label
                  htmlFor={`specificHelpRequest`}
                  className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                >
                  Specific Help Request{" "}
                  <span className="text-secondary-red">*</span>
                </label>
                <p className="block mb-2 text-[#6F727A]">
                  Request must be distilled into a specific task to get to your
                  immediate next step. Imagine your car is stuck on the side of
                  the highway, not being brought into the auto body shop. Be
                  clear on what tools they need to bring!
                </p>
                <div className="relative">
                  <span className="absolute right-[10px] bottom-[10px]">
                    {specificHelpRequest.length}/500
                  </span>
                  <textarea
                    rows={8}
                    value={specificHelpRequest}
                    onChange={(e) =>
                      handleSpecificHelpRequestChange(e.target.value)
                    }
                    maxLength={500}
                    className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                    focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                    placeholder="Enter Text Here..."
                  ></textarea>
                </div>
                {specificHelpRequestError && (
                  <div className="p-1">
                    <span className="text-secondary-red text-sm">
                      {requiredErrMsg}
                    </span>
                  </div>
                )}

                <label
                  htmlFor={`assistanceTo`}
                  className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                >
                  Request Assistance to{" "}
                  <span className="text-secondary-red">*</span>
                </label>
                <Select
                  options={assistanceOptions}
                  value={assistanceTo}
                  defaultValue={assistanceOptions[0]}
                  onChange={handleAssistanceToChange}
                  isSearchable={false}
                  styles={{
                    control: (provided: any, state: any) => ({
                      ...provided,
                      borderRadius: "5px",
                      marginTop: "16px",
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
                {assistanceToError && (
                  <div className="p-1">
                    <span className="text-secondary-red text-sm">
                      {requiredErrMsg}
                    </span>
                  </div>
                )}

                {assistanceTo != null && assistanceTo.value == 0 && (
                  <>
                    <label
                      htmlFor={`members`}
                      className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                    >
                      CORE Member to Request from{" "}
                      <span className="text-secondary-red">*</span>
                    </label>
                    <UserSelect
                      setData={handleMemberSelected}
                      multiple={true}
                      disabled={false}
                      selectedList={selectedMembers}
                      type={"mentee"}
                      disabledList={[]}
                      limit={-1}
                    />
                    {membersError && (
                      <div className="p-1">
                        <span className="text-secondary-red text-sm">
                          {requiredErrMsg}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <label
                  htmlFor={`whatYouDid`}
                  className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                >
                  What did you do to address this question or problem on your
                  own? <span className="text-secondary-red">*</span>
                </label>
                <p className="block mb-2 text-[#6F727A]">
                  What was the prior task you did leading up to this request?
                  This entry shows you are at the right stage of your
                  entrepreneurial journey and are ready to receive the help you
                  are requesting.
                </p>
                <div className="relative">
                  <span className="absolute right-[10px] bottom-[10px]">
                    {whatYouDid.length}/500
                  </span>
                  <textarea
                    rows={8}
                    value={whatYouDid}
                    onChange={(e) => handleWhatYouDidChange(e.target.value)}
                    maxLength={500}
                    className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                    focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                    placeholder="Enter Text Here..."
                  ></textarea>
                </div>
                {whatYouDidError && (
                  <div className="p-1">
                    <span className="text-secondary-red text-sm">
                      {requiredErrMsg}
                    </span>
                  </div>
                )}

                <label
                  htmlFor={`elevatorType`}
                  className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                >
                  Include your Elevator Pitch{" "}
                  <span className="text-secondary-red">*</span>
                </label>
                <Select
                  options={elevatorOptions}
                  className="z-50"
                  value={elevatorType}
                  onChange={handleElevatorTypeChange}
                  isSearchable={false}
                  styles={{
                    control: (provided: any, state: any) => ({
                      ...provided,
                      borderRadius: "5px",
                      marginTop: "16px",
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
                {elevatorTypeError && (
                  <div className="p-1">
                    <span className="text-secondary-red text-sm">
                      {requiredErrMsg}
                    </span>
                  </div>
                )}

                {elevatorType != null &&
                  elevatorType.value == 0 &&
                  (audioData != null ? (
                    <AudioPlayer audioData={audioData} />
                  ) : (
                    <div className="rounded-lg px-5 py-4 bg-secondary-red-1 mt-4">
                      <label className="text-secondary-red font-Inter font-semibold text-md">
                        A sound bite is not available. Record one from the
                        venture dashboard!
                      </label>
                    </div>
                  ))}

                {elevatorType != null &&
                  (elevatorType.value == 1 || elevatorType.value == 2) && (
                    <>
                      <label
                        htmlFor={`opening`}
                        className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                      >
                        Opening Hook{" "}
                        <span className="text-secondary-red">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute right-[10px] bottom-[10px]">
                          {opening.length}/500
                        </span>
                        <textarea
                          rows={4}
                          value={opening}
                          onChange={(e) =>
                            handleOpeningHookChange(e.target.value)
                          }
                          maxLength={500}
                          className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Enter Text Here..."
                        ></textarea>
                      </div>
                      {openingError && (
                        <div className="p-1">
                          <span className="text-secondary-red text-sm">
                            {requiredErrMsg}
                          </span>
                        </div>
                      )}

                      <label
                        htmlFor={`problem`}
                        className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                      >
                        Problem <span className="text-secondary-red">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute right-[10px] bottom-[10px]">
                          {problem.length}/500
                        </span>
                        <textarea
                          rows={4}
                          value={problem}
                          onChange={(e) => handleProblemChange(e.target.value)}
                          maxLength={500}
                          className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Enter Text Here..."
                        ></textarea>
                      </div>
                      {problemError && (
                        <div className="p-1">
                          <span className="text-secondary-red text-sm">
                            {requiredErrMsg}
                          </span>
                        </div>
                      )}

                      <label
                        htmlFor={`character`}
                        className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                      >
                        Character <span className="text-secondary-red">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute right-[10px] bottom-[10px]">
                          {character.length}/500
                        </span>
                        <textarea
                          rows={4}
                          value={character}
                          onChange={(e) =>
                            handleCharacterChange(e.target.value)
                          }
                          maxLength={500}
                          className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Enter Text Here..."
                        ></textarea>
                      </div>
                      {characterError && (
                        <div className="p-1">
                          <span className="text-secondary-red text-sm">
                            {requiredErrMsg}
                          </span>
                        </div>
                      )}

                      <label
                        htmlFor={`setting`}
                        className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                      >
                        Setting <span className="text-secondary-red">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute right-[10px] bottom-[10px]">
                          {setting.length}/500
                        </span>
                        <textarea
                          rows={4}
                          value={setting}
                          onChange={(e) => handleSettingChange(e.target.value)}
                          maxLength={500}
                          className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Enter Text Here..."
                        ></textarea>
                      </div>
                      {settingError && (
                        <div className="p-1">
                          <span className="text-secondary-red text-sm">
                            {requiredErrMsg}
                          </span>
                        </div>
                      )}

                      <label
                        htmlFor={`solution`}
                        className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                      >
                        Solution <span className="text-secondary-red">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute right-[10px] bottom-[10px]">
                          {solution.length}/500
                        </span>
                        <textarea
                          rows={4}
                          value={solution}
                          onChange={(e) => handleSolutionChange(e.target.value)}
                          maxLength={500}
                          className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Enter Text Here..."
                        ></textarea>
                      </div>
                      {solutionError && (
                        <div className="p-1">
                          <span className="text-secondary-red text-sm">
                            {requiredErrMsg}
                          </span>
                        </div>
                      )}

                      <label
                        htmlFor={`closing`}
                        className="block mt-4 mb-2 font-semibold font-Inter text-[#6B7280]"
                      >
                        Closing Hook{" "}
                        <span className="text-secondary-red">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute right-[10px] bottom-[10px]">
                          {closing.length}/500
                        </span>
                        <textarea
                          rows={4}
                          value={closing}
                          onChange={(e) =>
                            handleClosingHookChange(e.target.value)
                          }
                          maxLength={500}
                          className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Enter Text Here..."
                        ></textarea>
                      </div>
                      {closingError && (
                        <div className="p-1">
                          <span className="text-secondary-red text-sm">
                            {requiredErrMsg}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                <RoadAssistanceUpload setFormFiles={setFormFiles} />
              </div>
              <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                  type="button"
                  className={`text-gray-500 bg-white hover:bg-gray-100 
                                focus:ring-4 focus:outline-none focus:ring-gray-200 
                                rounded-lg border border-gray-200 text-sm font-medium 
                                px-5 py-2.5 hover:text-gray-900 focus:z-10`}
                  onClick={handleCloseClicked}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`text-white bg-[#FFB545] hover:bg-[#FFB545] 
                                    focus:ring-4 focus:outline-none focus:ring-[#FFB545] 
                                    font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                `}
                  onClick={handleRequestClick}
                >
                  {isCreating ? (
                    <Spinner size={"5"} text="Requesting..." />
                  ) : (
                    "Request Assistance"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <div
        className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-50 ${
          !showModal ? "hidden" : ""
        }`}
      ></div>
    </>
  );
};

export default RoadAssistanceRequest;
