import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import WonderSquareGroup from "./WonderSquareGroup";
import { Venture } from "@/types/venture.type";
import { ModuleItem } from "@/types/module.type";
import { categories } from "@/database/modules";
import { Category } from "@/database/modules";
import Spinner from "@/components/Spinner";
// import Pillar from "./Pillar";
import Pillar from "@/components/main/MyVentures/GameBoard/Pillar";
import { Tooltip } from "react-tooltip";
import RecordAudio from "@/components/RecordAudio";
import RoadAssistanceRequest from "@/components/RoadAssistanceRequest";
import StoryTrainPanel from "@/components/main/Guest/ToolBox/StoryTrainPanel";
import ComicStripPanel from "@/components/main/Guest/ToolBox/ComicStripPanel";
const RiskMeter = dynamic(() => import("@/components/RiskMeter"), {
  ssr: false,
});
import assistance_img from "/public/static/images/assistance.png";
import token_icon from "/public/static/images/token_icon.png";
import token_line from "/public/static/images/token_line.png";

import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

import CorIcon from "/public/static/images/toolbox/circleofresource_icon.png";
import MenteeImg from "/public/static/images/mentee.jpg";
import LemonadeIcon from "/public/static/images/toolbox/lemodade_icon.png";
import OppIdIcon from "/public/static/images/toolbox/opportunity.png";
import CharacterstakeIcon from "/public/static/images/toolbox/character_stake_icon.png";
import dashboard_description from "/public/static/images/4_PIllar_Transformation.png";
import { DUMMY_VENTURE } from "@/database/ventures";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const ToolBoxes = [
  {
    name: "Circle of Resources",
    icon: CorIcon,
    link: "/guest/toolbox/circleofresource/",
  },
  {
    name: "Who Should Care & Why? Brainstorm",
    icon: CharacterstakeIcon,
    link: "/guest/toolbox/characterbrainstorm/",
  },
  // { name: 'Comic Strip Generator', icon: ComicIcon , link: '/guest/toolbox/comicstrip/'},
  {
    name: "Opportunity Identification",
    icon: OppIdIcon,
    link: "/guest/toolbox/",
  },
  // { name: 'Story Train', icon: StorytrainIcon , link: '/guest/toolbox/storytrain/'},
  { name: "50 Ways to Lemonade", icon: LemonadeIcon, link: "/guest/toolbox/" },
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
  const [redirect, setRedirect] = useState<string>("");
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  let ventureId = "";
  if (typeof id === "string" && id !== "") {
    localStorage.setItem("selectedVentureId", id.toString());
    ventureId = id.toString();
  }
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

  const getVenture = async () => {
    setIsLoading(true);
    setIsAudioLoading(true);
    if (
      DUMMY_VENTURE != null &&
      DUMMY_VENTURE.audio != undefined &&
      DUMMY_VENTURE.audio != null
    ) {
      const base64data = DUMMY_VENTURE.audio;
      const decodedData = atob(base64data);
      const arrayBuffer = new ArrayBuffer(decodedData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < decodedData.length; i++) {
        view[i] = decodedData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: "audio/ogg; codecs=opus" });
      setAudioData(blob);
    }
    setIsAudioLoading(false);
    if (DUMMY_VENTURE.mentee != null && DUMMY_VENTURE.mentee != undefined) {
      setMemberType("mentee");
    }
    if (DUMMY_VENTURE.collabId != null && DUMMY_VENTURE.collabId != undefined) {
      setCollabId(DUMMY_VENTURE.collabId);
    }
    if (
      DUMMY_VENTURE != null &&
      DUMMY_VENTURE.course &&
      DUMMY_VENTURE.course.modules
    ) {
      categories.map((category: Category) => {
        const filteredModules = DUMMY_VENTURE.course.modules.filter(
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
              setProblems(filteredModules);
              break;
            case "Character":
              setCharacters(filteredModules);
              break;
            case "Solution":
              setSolutions(filteredModules);
              break;
            case "Setting":
              setSettings(filteredModules);
              break;
          }
        }
      });
    }
    setVenture(DUMMY_VENTURE);
    setIsLoading(false);
  };

  useEffect(() => {
    getVenture();
  }, []);

  const size = 71;

  const pillars: any[] = [];
  PILLARS.forEach((item, index) => {
    pillars.push(
      <Pillar
        style={{
          position: "absolute",
          ...PILLAR_STYLES[index],
        }}
        text={item.name}
        size={size * 2}
        color={item.color}
        key={`pilliars_${index}`}
      />
    );
  });

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

  const groups: any[] = [];
  GROUP_STYLES.forEach((groupStyle, index) => {
    let squareData: ModuleItem[] = [];
    switch (index) {
      case 0:
        squareData = solutions;
        break;
      case 1:
        squareData = settings;
        break;
      case 2:
        squareData = characters;
        break;
      case 3:
        squareData = problems;
        break;
    }

    groups.push(
      <WonderSquareGroup
        squareSize={size}
        data={squareData}
        ventureId={ventureId}
        coords={index % 2 == 0 ? leftToRight : rightToLeft}
        style={{
          position: "absolute",
          color: PILLARS[index].color,
          ...groupStyle,
        }}
        key={`style_${index}`}
      />
    );
  });

  const handleModuleClicked = () => {
    // if (startingPoint?.module._id != '' && startingPoint?.isCheck) {
    //   router.push(`/dashboard/myventures/module/${id}-${startingPoint.module._id}`);
    // }
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

  return isLoading ? (
    <div className="grid place-items-center h-screen">
      <Spinner text={"Loading Venture ..."} />
    </div>
  ) : (
    <div>
      <div className="block sm:flex items-center font-Inter justify-between">
        <div className="flex items-center opacity-75">
          <KeyboardBackspaceIcon />
          <h1 className="font-bold text-[24px] py-0 ml-3">
            All Members Personal Workspace
          </h1>
        </div>
        <div className="flex items-center gap-x-4 justify-between sm:justify-start">
          <button
            className="text-sm flex items-center justify-center bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 font-Inter truncate"
            type="button"
            onClick={() => {
              router.push(`/auth/signin`);
            }}
          >
            Sign In
          </button>
        </div>
      </div>
      <div className="flex items-center opacity-75">
        <div className="font-Inter">
          <div className="flex items-center py-1">
            <Image
              className="w-9 h-9 border-2 border-white rounded-full"
              src={MenteeImg ?? "/user.png"}
              alt={"Mentee"}
              width={40}
              height={40}
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
      <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-8 opacity-75">
        <div className="w-fit shadow-md rounded-lg px-5 py-0 pb-4 md:w-full justify-center pt-4">
          <h2 className="font-Inter font-bold text-[20px] text-[#232325] py-2">
            Wonder Out Loud & Iterative Investigation
          </h2>
          <p className="font-Inter text-[12px] mt-0 py-2">
            Clickable Wonder [?] Squares provide prompts and a journal-like
            space to document assumptions and discovery test plans, link files,
            upload sketches, and track iterations.
          </p>
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
        </div>
        <div className="relative grid grid-cols-1 gap-x-8 gap-y-4">
          <div className="relative rounded-xl shadow-md py-4 px-8">
            <div className="font-Inter text-left">
              <h2 className="font-bold text-[20px] text-[#232325] py-2">
                My Proof of Opportunity
              </h2>
              <p className="text-[12px] mt-0 py-2">
                The entrepreneurial journey is not a linear one, so it matters
                less as to which Wonder Square you start on, but rather how
                complete of a picture you have on your opportunity. Your
                de-risking process is measured on an x & y axis where the x-axis
                = how many questions you are asking across the board to figure
                out the 4 Pillars of your story, and the y-axis = how many times
                you&#39;ve talked, tested, tweaked within each Pillar.
              </p>
            </div>
            <div className="flex flex-col justify-between grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {riskMeters}
            </div>
          </div>
          <div className="relative grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-4">
            <div className="col-span-1 flex flex-col justify-between grid grid-cols-1 gap-x-4 gap-y-4 py-2">
              <RecordAudio
                isRecordable={false}
                audioData={null}
                saveAudio={saveAudio}
                isAudioLoading={isAudioLoading}
              />
            </div>
            <div className="col-span-1 flex flex-col justify-between grid grid-cols-1 gap-x-4 gap-y-4 py-2">
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
                  <button
                    className="text-sm h-fit flex items-center justify-center gap-x-1 font-Inter font-bold bg-[#FFB545] text-white active:bg-[#FFB545] px-1 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 opacity-75"
                    type="button"
                    onClick={() => {}}
                  >
                    <Image
                      src={assistance_img}
                      alt={"Lemonade Icon"}
                      width={25}
                      height={25}
                    />
                    Roadside Assistance
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-between grid grid-cols-1 gap-x-4 gap-y-4 py-2">
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
                    onClick={() => {}}
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
        </div>
      </div>
      {/* <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-8 mt-5 opacity-75">
          <div className="shadow-md rounded-lg p-4">
            <div className="relative w-[80%] m-auto">
              <Image src={dashboard_description} alt='Dashboard Description' className="w-[80%] m-auto"/>
              <p className="font-Inter text-[12px] text-center py-2">Everyone is inspired by differently.  No matter where your journey starts, you need to define all 4 Pillars to have a complete entrepreneurial story.  This is your place start wondering.</p>
              <p className="font-Inter text-[12px] text-center py-2">Clickable Wonder [?] Squares provide prompts and a journal-like space to document assumptions and discovery test plans, link files, upload sketches, and track iterations.</p>
              <p className="font-Inter text-[12px] text-center py-2">For folks who are also part of a Bootcamp, micro-lessons and homework assignments are accessed through the Wonder Squares for a more structured combination of instruction, reflection, and discussion</p>
            </div>
          </div>
          <div>
            <div className='col-span-1 sm:col-span-2 rounded-xl flex flex-col justify-around shadow-md grid grid-cols-1 gap-x-2 gap-y-4 py-3 px-8'>
              <div className='grid grid-cols-4'>
                <div className='text-left col-span-3'>
                  <div className='font-Inter font-bold text-[18px] text-black'>30</div>
                  <div className='font-Inter font-bold text-[14px] text-black'>Tokens earned this quarter</div>
                </div>
                <div>
                  <Image src={token_icon} alt={'Token Icon'} width={70} height={70}/>
                </div>
              </div>
              <div className='grid grid-cols-7 relative items-center'>
                <div className='text-left col-span-2 px-8'>
                  <div className='font-Inter font-bold text-[12px] text-black py-2'>15</div>
                  <div className='font-Inter font-bold text-[12px] text-black py-2'>Abiotic</div>
                </div>
                <div className='text-left col-span-3 px-8'>
                  <div className='font-Inter font-bold text-[12px] text-black py-2'>30</div>
                  <div className='font-Inter font-bold text-[12px] text-black py-2'>Biotic</div>
                </div>
                <div className='text-left col-span-2 px-8'>
                  <div className='font-Inter font-bold text-[12px] text-black py-2'>120</div>
                  <div className='font-Inter font-bold text-[12px] text-black py-2'>Keystone</div>
                </div>
                <Image className='absolute w-full' src={token_line} alt={'Arrow Image'} />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2'>
                <div className='flex flex-col items-center justify-center shadow-md rounded-lg bg-primary-blue py-2'>
                  <div className='font-Inter font-bold text-[14px] text-white text-center pt-1'>Tokens earned this quarter</div>
                  <div className='font-Inter font-bold text-[16px] text-white text-center pt-1'>362</div>
                </div>
                <div className='flex flex-col items-center justify-center shadow-md rounded-lg bg-primary-blue py-2'>
                  <div className='font-Inter font-bold text-[14px] text-white text-center pt-1'>Redeemable Tokens</div>
                  <div className='font-Inter font-bold text-[16px] text-white text-center pt-1'>72</div>
                </div>
              </div>
              <div>
                <button
                  className="text-sm h-fit flex w-full items-center justify-center gap-x-1 font-Inter font-bold bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                  }}
                >
                  Redeem Rewards
                </button>
              </div>
              <p className="font-Inter text-[12px] text-center">Ask for help and help others. Being virtually <q>present & engaged</q> in CORE is represented by Turtle Tokens. Earn Turtle Tokens by being virtually present & engaged.</p>
            </div>
          </div>
        </div> */}
      <div className="inline-flex items-center justify-center w-full mt-[80px]">
        <hr className="w-full h-1 my-8 bg-secondary-gray-3 border-0 rounded" />
        <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900 text-secondary-gray-4 flex items-center flex-col">
          <BusinessCenterOutlinedIcon />
          <h1 className="font-Inter font-bold">Venture Toolbox</h1>
        </div>
      </div>
      <div className="relative mt-5 opacity-75">
        {venture != undefined && (
          <StoryTrainPanel
            data={venture?.storyTrain}
            ventureId={venture?._id}
            memberType={memberType}
          />
        )}
      </div>
      <div className="relative mt-5 opacity-75 font-Inter">
        <h2 className="font-bold text-[20px] text-[#232325]">
          Brainstorming & Iteration Tools
        </h2>
        <p className="text-[12px]">
          constantly reflect and tewak as you progress along in your journey
        </p>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-[30px] gap-x-8 opacity-75">
        {ToolBoxes.map((item) => {
          return (
            <a
              key={`${item.name}`}
              href={`${
                memberType == "mentee"
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
          );
        })}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-[30px] gap-x-8 opacity-75">
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
        audioData={null}
        ventureId={venture?._id}
      />
    </div>
  );
};

export default Gameboard;
