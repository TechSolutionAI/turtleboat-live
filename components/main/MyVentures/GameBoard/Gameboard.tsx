import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Download from "@mui/icons-material/Download";
import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";
import html2canvas from 'html2canvas';
import { Tab } from "@headlessui/react";
import jsPDF from 'jspdf';
import { Venture } from "@/types/venture.type";
import { ModuleItem, VentureAssessment } from "@/types/module.type";
import { categories } from "@/database/modules";
import { Category } from "@/database/modules";
import Spinner from "@/components/Spinner";
// import Pillar from "./Pillar";
import Pillar from "@/components/main/MyVentures/GameBoard/Pillar";
import { Tooltip } from "react-tooltip";
import RecordAudio from "@/components/RecordAudio";
import RoadAssistanceRequest from "@/components/RoadAssistanceRequest";
import StoryTrainPanel from "@/components/main/ToolBox/StoryTrainPanel";
import ComicStripPanel from "@/components/main/ToolBox/ComicStripPanel";
import MenteeTokenItem from "@/components/layouts/MenteeTokenItem";
import TokenItem from "@/components/layouts/TokenItem";
const RiskMeter = dynamic(() => import("@/components/RiskMeter"), {
  ssr: false,
});
import assistance_img from "/public/static/images/assistance.png";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CorIcon from "/public/static/images/toolbox/circleofresource_icon.png";
import LemonadeIcon from "/public/static/images/toolbox/lemodade_icon.png";
import CoffeeChatIcon from "/public/static/images/toolbox/coffee_chat.jpg";
import OppIdIcon from "/public/static/images/toolbox/opportunity.png";
import CharacterstakeIcon from "/public/static/images/toolbox/character_stake_icon.png";
import UserAvatar from "@/components/UserAvatar";
import WonderSquarePuzzle from "@/components/main/WonderSquarePuzzle";
import EvaluatorAssessmentModal from "./EvaluatorAssessmentModal";
import RiskAssessmentDoc from "./RiskAssessmentDoc";
import { getLastUpdatedTimeString } from "@/utils/utils";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const ToolBoxes = [
  {
    name: "Circle of Resources",
    icon: CorIcon,
    link: "/dashboard/toolbox/circleofresource/",
    id: 0,
  },
  {
    name: "Who Should Care & Why? Brainstorm",
    icon: CharacterstakeIcon,
    link: "/dashboard/toolbox/characterbrainstorm/",
    id: 1,
  },
  // { name: 'Comic Strip Generator', icon: ComicIcon , link: '/dashboard/toolbox/comicstrip/', id: 2},
  { name: "Opportunity Identification", icon: OppIdIcon, link: "", id: 3 },
  // { name: 'Story Train', icon: StorytrainIcon , link: '/dashboard/toolbox/storytrain/', id: 4},
  {
    name: "Coffee Chat",
    icon: CoffeeChatIcon,
    link: "/dashboard/toolbox/lemonade/add",
    id: 5,
  },
];

const PILLARS = [
  { name: "Solution", color: "#ff00ff" },
  { name: "Setting", color: "#00BEBE" },
  { name: "Character", color: "#5A2391" },
  { name: "Problem", color: "#4169e1" },
];

const PILLAR_STYLES = [
  { left: "50%", transform: "translateX(-50%)" },
  {
    right: "0%",
    top: "50%",
    transform: "translate(0%, -50%)",
  },
  { bottom: "0%", left: "50%", transform: "translate(-50%, 0%)" },
  { top: "50%", transform: "translateY(-50%)" },
];

const GROUP_STYLES = [
  { left: "13%", top: "7%" },
  { right: "25%", top: "7%" },
  { right: "32%", bottom: "38%" },
  { left: "20%", bottom: "38%" },
];

const leftToRight = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
  [2, 0],
  [2, 1],
];
const rightToLeft = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
  [0, 2],
  [1, 2],
];

const Gameboard = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  let ventureId = "";
  if (typeof id === "string" && id !== "") {
    localStorage.setItem("selectedVentureId", id.toString());
    ventureId = id.toString();
  }
  const exportRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [venture, setVenture] = useState<Venture>();
  const [startingPoint, setStartingPoint] = useState<ModuleItem>();
  const [memberType, setMemberType] = useState<string>("");
  const [collabId, setCollabId] = useState<string>("");
  const [problems, setProblems] = useState<ModuleItem[]>([]);
  const [settings, setSettings] = useState<ModuleItem[]>([]);
  const [characters, setCharacters] = useState<ModuleItem[]>([]);
  const [solutions, setSolutions] = useState<ModuleItem[]>([]);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showEvaluatorAssessmentModal, setShowEvaluatorAssessmentModal] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<number[]>([]);
  const [assessmentCnt, setAssessmentCnt] = useState(0);
  const [articulate, setArticulate] = useState<number[]>([]);
  const [serverTime, setServerTime] = useState<string>("");

  const getVenture = async () => {
    setIsLoading(true);
    setIsAudioLoading(true);
    const response = await fetch(`/api/ventures/${ventureId}`, {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { venture, serverTime } = await response.json();
      setServerTime(serverTime);
      if (
        venture != null &&
        venture.audio != undefined &&
        venture.audio != null
      ) {
        setAudioUrl(venture.audio);
      }
      setIsAudioLoading(false);
      if (venture.mentee != null && venture.mentee != undefined) {
        if (venture.mentee.email == user.email) {
          setMemberType("mentee");
        } else {
          setMemberType("mentor");
        }
      }
      if (venture.collabId != null && venture.collabId != undefined) {
        setCollabId(venture.collabId);
      }
      if (venture.assessments != null && venture.assessments != undefined) {
        if (venture.assessments.length != 0) {
          setAssessmentCnt(venture.assessments.length);
          venture.assessments.map((item: VentureAssessment) => {
            if (item._id == user._id) {
              setAssessment(item.value);
              setArticulate(item.articulates);
            }
          });
        }
      }
      if (venture != null && venture.course && venture.course.modules) {
        categories.map((category: Category) => {
          const filteredModules = venture.course.modules.filter(
            (moduleItem: ModuleItem) =>
              moduleItem.module.item == category.value && moduleItem.isCheck
          );
          // Filter modules by item category
          if (filteredModules.length > 0) {
            switch (category.value) {
              case "Starting Point":
                const checkedStartingPoint = filteredModules.filter(
                  (item: ModuleItem) => item.isCheck
                );
                setStartingPoint(checkedStartingPoint[0]);
                break;
              case "Problem":
                console.log("problems", filteredModules);
                setProblems(filteredModules);
                break;
              case "Character":
                console.log("characters", filteredModules);
                setCharacters(filteredModules);
                break;
              case "Solution":
                console.log("solutions", filteredModules);
                setSolutions(filteredModules);
                break;
              case "Setting":
                console.log("settings", filteredModules);
                setSettings(filteredModules);
                break;
            }
          }
        });
      }
      setVenture(venture);
      setIsLoading(false);
    }
  };

  const handleShowModal = () => {
    getVenture();
    setShowEvaluatorAssessmentModal(true);
  }

  const closeEvaluatorAssessmentModal = () => {
    setShowEvaluatorAssessmentModal(false);
  }

  useEffect(() => {
    document.title = "Venture Dashboard - Turtle Boat";
    getVenture();
  }, []);

  const size = 71;

  // const pillars: any[] = [];
  // PILLARS.forEach((item, index) => {
  //   pillars.push(
  //     <Pillar
  //       style={{
  //         position: "absolute",
  //         ...PILLAR_STYLES[index],
  //       }}
  //       text={item.name}
  //       size={size * 2}
  //       color={item.color}
  //       key={`pilliars_${index}`}
  //     />
  //   );
  // });

  const riskMeters: any[] = [];
  PILLARS.forEach((item, index) => {
    let value = 0;
    let pillarValues: any[] = [];
    switch (index) {
      case 0:
        pillarValues = solutions;
        break;
      case 1:
        pillarValues = settings;
        break;
      case 2:
        pillarValues = characters;
        break;
      case 3:
        pillarValues = problems;
        break;
    }
    pillarValues.map((item: any) => {
      if (
        item.isCheckedOff != undefined &&
        item.isCheckedOff != undefined &&
        item.isCheckedOff
      ) {
        value += 1;
      }
    });
    riskMeters.push(
      <div
        key={`riskmeter_${index}`}
        className="flex items-center p-1 justify-center"
      >
        <Pillar text={"risk_meter"} size={size * 1.8} color={item.color} />
        <div>
          <RiskMeter
            id={`riskmeter_${index}`}
            title={item.name}
            value={value}
          />
        </div>
      </div>
    );
  });

  // const groups: any[] = [];
  // GROUP_STYLES.forEach((groupStyle, index) => {
  //   let squareData: ModuleItem[] = [];
  //   switch (index) {
  //     case 0:
  //       squareData = solutions;
  //       break;
  //     case 1:
  //       squareData = settings;
  //       break;
  //     case 2:
  //       squareData = characters;
  //       break;
  //     case 3:
  //       squareData = problems;
  //       break;
  //   }

  //   groups.push(
  //     <WonderSquareGroup
  //       squareSize={size}
  //       data={squareData}
  //       ventureId={ventureId}
  //       coords={index % 2 == 0 ? leftToRight : rightToLeft}
  //       style={{
  //         position: "absolute",
  //         color: PILLARS[index].color,
  //         ...groupStyle,
  //       }}
  //       key={`style_${index}`}
  //     />
  //   );
  // });

  const handleModuleClicked = () => {
    if (startingPoint?.module._id != "" && startingPoint?.isCheck) {
      router.push(
        `/dashboard/myventures/module/${id}-${startingPoint.module._id}`
      );
    }
  };

  const saveAudio = (audioData: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioData);
    setAudioData(audioData);
    reader.onloadend = async () => {
      if (reader.result != null && typeof reader.result === "string") {
        const base64data = reader.result?.split(",")[1];
        if (!base64data) {
          console.error("Failed to convert audio to base64");
          return;
        }
        // Now you can send the base64 encoded data to the server using fetch or any other library.
        const response = await fetch("/api/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: base64data, vid: ventureId }),
        });

        if (!response.ok) {
          const { err } = await response.json();
          console.log(err);
        } else {
        }
      }
    };
  };

  const updateStoryTrain = (data: any) => {
    if (venture != undefined) {
      let tempVenture: Venture = { ...venture };
      tempVenture.storyTrain = data;
      setVenture(tempVenture);
    }
  }

  const handleExport = async () => {
    if (!exportRef.current) return;

    const input = exportRef.current;

    // Temporarily make the element visible
    input.style.display = 'block';

    try {
      // Convert the element to a canvas
      const canvas = await html2canvas(exportRef.current);
      const imgData = canvas.toDataURL('image/png');

      // Create the PDF
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(venture?.title + '-' + user.name + '.pdf');
    } finally {
      input.style.display = 'none';
    }
  };

  const handleUpdates = async () => {
    getVenture();
  }

  return isLoading ? (
    <div className="grid place-items-center h-screen">
      <Spinner text={"Loading Venture ..."} />
    </div>
  ) : (
    <div>
      <div className="font-bold font-Inter text-[24px] text-center text-tertiary-red">
        Progress Over Perfection
      </div>
      <p className="font-Inter text-[12px] mt-0 py-2 text-center">
        Focused on the pre-idea to pre-recurring revenue stage, the purpose of the Turtleboat platform is to support early stage founders and increase the success rate of sustainable and scalable innovation. Recurring revenue is concrete data that a founder is on the right track, but in the earliest stages of a venture, there&#39;s usually no revenue yet. “Traction” becomes key, because it is demonstrable progress of feasibility and potential (and therefore lower risk).  Traction here  is assessed in terms of depth, breadth, and ability to articulate.
      </p>
      <div className="block sm:flex items-center font-Inter justify-between">
        <div className="flex items-center">
          <Link className="cursor-pointer" href="/dashboard/myventures">
            <KeyboardBackspaceIcon />
          </Link>
          <h1 className="font-bold text-[24px] py-0 ml-3">{venture?.title}</h1>
        </div>
        <div className="flex items-center gap-x-4 justify-between sm:justify-start">
          {venture?.mentee != null &&
            venture.mentee != undefined &&
            (memberType == "mentee" ? (
              <TokenItem />
            ) : (
              <MenteeTokenItem userId={venture?.mentee._id} />
            ))}
        </div>
      </div>
      <div className="flex items-center">
        <div className="font-Inter">
          <div className="flex items-center py-1">
            {/* <Image className="w-9 h-9 border-2 border-white rounded-full" src={venture?.mentee.image ?? "/user.png"} alt={venture?.mentee.name} width={40} height={40} /> */}
            <UserAvatar
              user={venture?.mentee}
              size={40}
              classes={"w-9 h-9 border-2 border-white rounded-full"}
            />
            <strong className="ml-2">{venture?.mentee.name}</strong>
          </div>
          <p className="text-[12px] py-1">
            ThinkSpace for capturing the messy, iterative, and non-linear
            journey of enrepreneurship
          </p>
        </div>
      </div>
      <hr className="my-3" />
      <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <Tab.Group>
            <Tab.List className={`bg-white dark:bg-gray-800 p-2 text-lg`}>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'rounded-tl-lg rounded-tr-lg px-4 py-2 border',
                    selected
                      ? 'border-2 border-black'
                      : 'border-gray-400'
                  )
                }
              >
                Puzzle pieces
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'rounded-tl-lg rounded-tr-lg px-4 py-2 border',
                    selected
                      ? 'border-2 border-black'
                      : 'border-gray-400'
                  )
                }
              >
                Activity
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div className="w-fit shadow-md rounded-lg px-5 py-0 pb-4 md:w-full justify-center pt-4">
                  <h2 className="font-Inter font-bold text-[20px] text-[#232325] py-2">
                    Thinkspace
                  </h2>
                  <p className="font-Inter text-[12px] mt-0 py-2">
                    The founder&#39;s Thinkspace is illustrated as a puzzle.  The number of puzzle pieces “flipped” over (how many puzzle pieces have thoughtful -- yet unproven -- hypotheses documented)  illustrate how much breadth has been uncovered.  Depth is measured by the amount of talking/prototyping/testing/validating documented in each puzzle piece, assessed within each puzzle piece, and is reflected by the risk meters on this dashboard.
                  </p>
                  <div className="relative flex justify-center">
                    <div className="bordering-circle absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[75%] rounded-[50%] border-2 border-[#9d9d9d66] box-border blur-[2px]"></div>
                    <WonderSquarePuzzle
                      type="user"
                      settings={settings}
                      characters={characters}
                      solutions={solutions}
                      problems={problems}
                      startingPoint={startingPoint}
                      ventureId={venture?._id}
                      memberType={memberType}
                      storyTrain={venture?.storyTrain}
                      updateStoryTrain={updateStoryTrain}
                    />
                  </div>
                  {/* 
                  <div id="Gameboard" className="relative w-[600px] h-[600px] m-auto">
                    <a
                      onClick={handleModuleClicked}
                      className="z-50 cursor-pointer center-circle absolute top-[50%] left-[50%] w-[130px] h-[130px] bg-[#f5f5f5] border-4 border-[#ffffff] box-border rounded-[88px] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-center text-[20px] font-bold text-[#595959] leading-7"
                      style={{
                        boxShadow:
                          "0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 10px rgba(0, 0, 0, 0.35)",
                      }}
                      data-tooltip-id={"module-tool-tip"}
                      data-tooltip-content={startingPoint?.module.title}
                      data-tooltip-place="top"
                    >
                      My<br></br>Starting<br></br>Point
                    </a>
                    <div className="bordering-circle absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-[50%] border-2 border-[#9d9d9d66] box-border blur-[2px]"></div>
                    {pillars}
                    {groups}
                  </div> 
                  */}
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="w-fit shadow-md rounded-lg px-5 py-0 pb-4 md:w-full justify-center pt-4">
                  <h2 className="font-Inter font-bold text-[20px] text-[#232325] py-2">
                    Module Activity
                  </h2>
                  <hr className="my-2 border-[1.5px]" />
                  <div className="min-h-[708px] overflow-y-auto font-Inter">
                    {
                      [...problems, ...settings, ...characters, ...solutions].map((item: any) => {
                        return (
                          <div
                            key={item._id}
                            className="flex flex-row justify-between items-center gap-x-2 border-b border-gray-200 dark:border-gray-800 py-2"
                          >
                            <div className="flex flex-col">
                              <div className="font-semibold text-black dark:text-white">{item.module.title}</div>
                              <div className="text-sm text-gray-500 dark:text-white-500 py-2">Modified {item.lastUpdated != null ? getLastUpdatedTimeString(item.lastUpdated, serverTime) : getLastUpdatedTimeString(venture?.updatedAt, serverTime)}</div>
                            </div>
                            <button
                              className="text-black dark:text-white"
                              onClick={() => {
                                router.push(`/dashboard/myventures/module/${ventureId}-${item.module._id}`);
                              }}>
                              <ArrowRightAlt sx={{ width: 40, height: 40 }} />
                            </button>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className="relative grid grid-cols-1 gap-x-8 gap-y-4">
          <div className="relative rounded-xl shadow-md py-4 px-8">
            <div className="font-Inter text-left">
              <h2 className="font-bold text-[20px] text-[#232325] py-2">
                Proof of Opportunity
              </h2>
              <p className="text-[12px] mt-0 py-2">
                Connected to the “enough proof” switch inside each puzzle piece, founders can self-assess their progress and get a 30,000 foot view of the current state of the journey.  If there are assigned mentor(s), their risk assessment can be downloaded below.  Compare/contrast your self-assessment, includes how well you have transformed an “I believe” into an “I now know this is true” through iterations of talking/building prototypes/testing.
              </p>
            </div>
            <div className="flex-col justify-between grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {riskMeters}
            </div>
            <div className="flex flex-row justify-center mt-[30px]">
              {memberType == "mentor" &&
                <>
                  {assessment.length == 0 &&
                    <button className="shadow-custom-md px-2 py-1 rounded-md font-semibold" onClick={handleShowModal}><TrendingUp /> Evaluator Assessment <span className="bg-eval-sel-yellow rounded-full p-[5px] text-xs">Not Started</span></button>
                  }
                  {assessment.length != 0 &&
                    <>
                      <button className="shadow-custom-md px-2 py-1 rounded-md font-semibold" onClick={handleShowModal}><TrendingUp /> Edit Evaluator Assessment <span className="bg-eval-sel-green rounded-full p-[5px] text-xs">Done</span></button>
                      <button className="shadow-custom-md px-2 py-1 rounded-md font-semibold ml-5" onClick={handleExport}><Download /> Download Risk Assessment </button>
                    </>
                  }
                  <EvaluatorAssessmentModal closeModal={closeEvaluatorAssessmentModal} showModal={showEvaluatorAssessmentModal} vid={ventureId} user={user} assessment={assessment} articulate={articulate} handleUpdates={handleUpdates} />
                </>
              }

              {(memberType == "mentee" && assessmentCnt != 0) &&
                <button className="shadow-custom-md px-2 py-1 rounded-md font-semibold ml-5" onClick={handleExport}><Download /> Download Risk Assessment </button>
              }

            </div>
          </div>
          <div className="relative grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-4">
            <div className="col-span-1 flex-col justify-between grid grid-cols-1 gap-x-4 gap-y-4 py-2">
              <RecordAudio
                isRecordable={memberType == "mentee"}
                audioData={audioUrl}
                saveAudio={saveAudio}
                isAudioLoading={isAudioLoading}
              />
            </div>
            <div className="col-span-1 flex-col justify-between grid grid-cols-1 gap-x-4 gap-y-4 py-2">
              <div className="w-full h-full min-h-[220px] rounded-xl mt-[10px] flex flex-col justify-between py-5 shadow-md">
                <div className="font-Inter text-center">
                  <h2 className="font-bold text-[20px] text-[#232325]">
                    Need Help?
                  </h2>
                  <p className="text-[12px] px-2">
                    launch a help ticket to leverage your Circle of Resources
                  </p>
                </div>
                <div className="px-2 flex justify-center">
                  {(memberType == "mentee" || memberType == "mentor") && (
                    <button
                      className="text-sm h-fit flex items-center justify-center gap-x-1 font-Inter font-bold bg-[#FFB545] text-white active:bg-[#FFB545] px-2 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      <Image
                        src={assistance_img}
                        alt={"Lemonade Icon"}
                        width={25}
                        height={25}
                      />
                      Roadside Assist
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1 flex-col justify-between grid grid-cols-1 gap-x-4 gap-y-4 py-2">
              <div className="w-full h-full min-h-[220px] rounded-xl mt-[10px] flex flex-col justify-between py-5 shadow-md">
                <div className="font-Inter text-center">
                  <h2 className="font-bold text-[20px] text-[#232325]">
                    Collaborate
                  </h2>
                  <p className="text-[12px] px-2">
                    meeting minutes, to-do&#39;s, T-reports
                  </p>
                </div>
                <div className="px-2 flex justify-center">
                  <button
                    className="text-sm flex items-center justify-center bg-[#31c759] text-white active:bg-[#31c759] px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 font-Inter truncate gap-x-1"
                    type="button"
                    onClick={() => {
                      router.push(
                        `/dashboard/myventures/collaboration/${collabId}-${ventureId}`
                      );
                    }}
                  >
                    <span className="flex">
                      <SmsOutlinedIcon />
                    </span>
                    Team Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center justify-center sm:justify-end">
              <button
                className="text-sm flex items-center justify-center bg-[#31c759] text-white active:bg-[#31c759] px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 font-Inter truncate gap-x-1"
                type="button"
                onClick={() => {
                  router.push(`/dashboard/myventures/collaboration/${collabId}-${ventureId}`);
                }}
              >
                  <span className="flex"><SmsOutlinedIcon /></span>
                  Team Chat
              </button>
            </div>
            <div className='col-span-1 flex flex-col justify-between grid grid-cols-1 gap-x-4 gap-y-4 py-2'>
              <RecordAudio isRecordable={memberType == 'mentee'} audioData={audioData} saveAudio={saveAudio} isAudioLoading={isAudioLoading} />
            </div>
            <div className="relative rounded-xl shadow-md py-4 px-8">
              <div className='font-Inter text-left'>
                <label className='font-bold text-[20px] text-[#232325]'>Risk Meters</label>
                <p className="text-[12px] mt-2 py-2">The more your assumptions of <q>I wonder If this is true</q> becomes <q>I know this is true</q> from testing and iteration, the less risky your venture become. These meters are tied to your discovery in your Wonder Squares below.</p>
              </div>
              <div className='flex flex-col justify-between grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4'>
                {riskMeters}
              </div>
            </div> */}
        </div>
      </div>
      <div className="inline-flex items-center justify-center w-full mt-[80px]">
        <hr className="w-full h-1 my-8 bg-secondary-gray-3 border-0 rounded" />
        <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900 text-secondary-gray-4 flex items-center flex-col">
          <BusinessCenterOutlinedIcon />
          <h1 className="font-Inter font-bold">Venture Toolbox</h1>
        </div>
      </div>
      <div className="relative mt-5">
        {venture != undefined && (
          <StoryTrainPanel
            data={venture?.storyTrain}
            ventureId={venture?._id}
            memberType={memberType}
          />
        )}
      </div>
      <div className="relative mt-5 font-Inter">
        <label className="font-bold text-[20px] text-[#232325]">
          Brainstorming & Iteration Tools
        </label>
        <p className="text-[12px]">
          constantly reflect and tweak as you progress along in your journey
        </p>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-[30px] gap-x-8">
        {
          ToolBoxes.map((item: any) => {
            return item.link != "" ? (
              item.id != 5 ? (
                <a
                  key={`${item.name}`}
                  href={`${memberType == "mentee"
                    ? item.link + ventureId
                    : item.link + ventureId
                    }`}
                  className="cursor-pointer shadow-md rounded-lg flex flex-col items-center justify-center px-4 py-8"
                >
                  <div className="font-Inter font-bold text-black text-lg text-center">
                    {item.name}
                  </div>
                  <Image src={item.icon} alt={item.name} />
                </a>
              ) : (
                <a
                  key={`${item.name}`}
                  href={item.link}
                  className="cursor-pointer shadow-md rounded-lg flex flex-col items-center justify-center px-4 py-8"
                >
                  <div className="font-Inter font-bold text-black text-lg text-center">
                    {item.name}
                  </div>
                  <Image src={item.icon} alt={item.name} />
                </a>
              )
            ) : (
              <div
                key={`${item.name}`}
                onClick={() => {
                  Swal.fire("Coming Soon...", "", "info");
                }}
                className="cursor-pointer shadow-md rounded-lg flex flex-col items-center justify-center px-4 py-8"
              >
                <div className="font-Inter font-bold text-black text-lg text-center">
                  {item.name}
                </div>
                <Image src={item.icon} alt={item.name} />
              </div>
            );
          })}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-[30px] gap-x-8">
        <div className="relative mt-5">
          {venture != undefined && (
            <ComicStripPanel
              type={"Problem"}
              data={venture?.problemComicStrip}
              ventureId={venture?._id}
              memberType={memberType}
            />
          )}
        </div>
        <div className="relative mt-5">
          {venture != undefined && (
            <ComicStripPanel
              type={"Solution"}
              data={venture?.solutionComicStrip}
              ventureId={venture?._id}
              memberType={memberType}
            />
          )}
        </div>
      </div>
      <Tooltip id={"module-tool-tip"} />
      <RoadAssistanceRequest
        showModal={showModal}
        closeFunc={() => {
          setShowModal(false);
        }}
        storyTrain={venture?.storyTrain}
        audioData={audioUrl}
        ventureId={venture?._id}
      />
      <div ref={exportRef} className="w-[1100px]" style={{ display: 'none' }}>
        <RiskAssessmentDoc venture={venture} />
      </div>
    </div>
  );
};

export default Gameboard;
