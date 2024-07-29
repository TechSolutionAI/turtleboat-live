import { useEffect, useState } from "react";
import WonderSquare from "./WonderSquare";
import PillarSMSvg from "/public/static/images/pillar-sm.svg";

interface IndividualRiskAssessProps {
    index: number;
    assessment: number[];
    handlePoint: (index: number, point: number) => void;
}

const IndividualRiskAssess = ({ index, assessment, handlePoint }: IndividualRiskAssessProps) => {
    const [point, setPoint] = useState<number>(0);

    const uiParams = [
        { bg: "#4169e1", label: "Problem" },
        { bg: "#5A2391", label: "Character(s)" },
        { bg: "#00BEBE", label: "Setting" },
        { bg: "#ff00ff", label: "Solution" },
    ];

    useEffect(() => {
        handlePoint(index, point);
    }, [point]);

    useEffect(() => {
        if (assessment.length != 0) {
            setPoint(assessment[index]);
        }
    }, []);

    const innerContent = (
        <div className="absolute content flex flex-col items-center w-full top-[-82px] left-[-22px]">
            {/* <Image src={PillarSvg} className={`w-[23px] h-[34px] ${text == 'risk_meter' ? 'mt-0' : 'mt-[-25px]'}`} alt="" /> */}
            <PillarSMSvg className={`mt-0`} alt="" />
        </div>
    );
    return (
        <div className="flex flex-row justify-center my-[2px]">
            <div className="relative inline-block h-[40px] lg:h-[74px]">
                <button className="w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-gray-500 border-[1.5px] rounded-md py-[10px] lg:py-[26px] font-Inter font-light text-[8px] lg:font-semibold lg:text-sm">
                    {uiParams[index].label}
                </button>
                <div className="hidden lg:flex">
                    <WonderSquare
                        style={{ backgroundColor: `${uiParams[index].bg}`, borderRadius: "0px", borderWidth: "3px", position: "absolute", top: "-51px", left: "0px" }}
                        size={43}
                        data={null}
                        content={innerContent}
                    />
                </div>
            </div>
            <button className={point == 1 ? "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-red bg-no-repeat bg-center border-[3px] border-active-btn-border" : "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-red bg-no-repeat bg-center border-[3px] border-eval-red"}
                style={{ backgroundImage: point == 1 ? "url('/static/images/active_btns/three_bars.svg')" : "", backgroundSize: point == 1 ? "34% auto" : "" }}
                onClick={() => setPoint(1)}
            >
            </button>
            <button className={point == 2 ? "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-red-2 bg-no-repeat bg-center border-[3px] border-active-btn-border" : "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-red-2 bg-no-repeat bg-center border-[3px] border-eval-red-2"}
                style={{ backgroundImage: point == 2 ? "url('/static/images/active_btns/three_bars.svg')" : "", backgroundSize: point == 2 ? "34% auto" : "" }}
                onClick={() => setPoint(2)}
            >
            </button>
            <button className={point == 3 ? "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-yellow bg-no-repeat bg-center border-[3px] border-active-btn-border" : "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-yellow bg-no-repeat bg-center border-[3px] border-eval-yellow"}
                style={{ backgroundImage: point == 3 ? "url('/static/images/active_btns/three_bars.svg')" : "", backgroundSize: point == 3 ? "34% auto" : "" }}
                onClick={() => setPoint(3)}
            >
            </button>
            <button className={point == 4 ? "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-green bg-no-repeat bg-center border-[3px] border-active-btn-border" : "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-green bg-no-repeat bg-center border-[3px] border-eval-green"}
                style={{ backgroundImage: point == 4 ? "url('/static/images/active_btns/three_bars.svg')" : "", backgroundSize: point == 4 ? "34% auto" : "" }}
                onClick={() => setPoint(4)}
            >
            </button>
            <button className={point == 5 ? "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-green-2 bg-no-repeat bg-center border-[3px] border-active-btn-border" : "w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] border-sm rounded-md ml-1 lg:ml-2 mr-1 bg-eval-green-2 bg-no-repeat bg-center border-[3px] border-eval-green-2"}
                style={{ backgroundImage: point == 5 ? "url('/static/images/active_btns/three_bars.svg')" : "", backgroundSize: point == 5 ? "34% auto" : "" }}
                onClick={() => setPoint(5)}
            >
            </button>
        </div>
    )
}

export default IndividualRiskAssess;