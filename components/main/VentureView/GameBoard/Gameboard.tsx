import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import WonderSquareGroup from "./WonderSquareGroup";
import { Venture } from '@/types/venture.type';
import { ModuleItem } from '@/types/module.type';
import { categories } from "@/database/modules";
import { Category } from "@/database/modules";
import Spinner from '@/components/Spinner';
import Pillar from "./Pillar";
import { Tooltip } from 'react-tooltip'

const PILLARS = [
  { name: "Solution", color: '#F32D2D' },
  { name: "Setting", color: '#00BEBE' },
  { name: "Character", color: '#5A2391' },
  { name: "Problem", color: '#FF9E45' },
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
  const router = useRouter();
  const { id } = router.query;
  let ventureId = "";
  if (typeof id === 'string' && id !== '') {
    localStorage.setItem('selectedVentureId', id.toString());
    ventureId = id.toString();
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [venture, setVenture] = useState<Venture>();
  const [startingPoint, setStartingPoint] = useState<ModuleItem>();
  const [problems, setProblems] = useState<ModuleItem[]>([]);
  const [settings, setSettings] = useState<ModuleItem[]>([]);
  const [characters, setCharacters] = useState<ModuleItem[]>([]);
  const [solutions, setSolutions] = useState<ModuleItem[]>([]);

  const getVenture = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/ventures/${id}`, {
      method: 'GET'
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err)
    } else {
      setIsLoading(false);
      const { venture } = await response.json();
      if (venture != null && venture.course && venture.course.modules) {
        categories.map((category: Category) => {
          const filteredModules = venture.course.modules.filter((moduleItem: ModuleItem) => moduleItem.module.item == category.value && moduleItem.isCheck);
          // Filter modules by item category
          if (filteredModules.length > 0) {
            switch (category.value) {
              case "Starting Point":
                const checkedStartingPoint = filteredModules.filter((item: ModuleItem) => item.isCheck);
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
        })
      }
      setVenture(venture);
    }
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
    if (startingPoint?.module._id != '' && startingPoint?.isCheck) {
      router.push(`/dashboard/ventures/module/${startingPoint.module._id}`);
    }
  }

  return (
    <>
      <div id="Gameboard" className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <a
            onClick={handleModuleClicked}  
            className="z-50 cursor-pointer center-circle absolute top-[50%] left-[50%] w-[130px] h-[130px] bg-[#f5f5f5] border-4 border-[#ffffff] box-border rounded-[88px] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-center text-[24px] font-bold text-[#595959] leading-7"
            style={{
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 10px rgba(0, 0, 0, 0.35)',
            }}
            data-tooltip-id={"module-view-tool-tip"}
            data-tooltip-content={startingPoint?.module.title}
            data-tooltip-place="top"
          >
            My<br></br>Starting<br></br>Point
          </a>
        <div className="bordering-circle absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-[50%] border-2 border-[#9d9d9d66] box-border blur-[2px]"></div>
        {pillars}
        {groups}
      </div>
      <Tooltip id={"module-view-tool-tip"}/> 
    </>
  );
};

export default Gameboard;
