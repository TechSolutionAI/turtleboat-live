import { useEffect, useState } from "react";
import WonderSquare from "./WonderSquare";
import PillarSMSvg from "/public/static/images/pillar-sm.svg";

interface IndividualArticulateProps {
    index: number;
    articulate: number[];
    handleAbility: (index: number, ability: number) => void;
    ispdf: boolean;
}

const IndividualArticulate = ({ index, articulate, handleAbility, ispdf }: IndividualArticulateProps) => {
    const [ability, setAbility] = useState<number>(0);

    const uiParams = [
        { bg: "#4169e1", bg2: "bg-arti-1", border: "border-[#4169e1]", label: "Problem" },
        { bg: "#5A2391", bg2: "bg-arti-2", border: "border-[#5A2391]", label: "Character(s)" },
        { bg: "#00BEBE", bg2: "bg-arti-3", border: "border-[#00BEBE]", label: "Setting" },
        { bg: "#ff00ff", bg2: "bg-arti-4", border: "border-[#ff00ff]", label: "Solution" },
    ];

    const sizes = [{ w: 'w-[0px]', h: 'h-[0px]', f: 'text-[20px]' }, { w: 'w-[30px]', h: 'h-[30px]', f: 'text-[20px]' }, { w: 'w-[60px]', h: 'h-[60px]', f: 'text-[28px]' }, { w: 'w-[90px]', h: 'h-[90px]', f: 'text-[32px]' }, { w: 'w-[120px]', h: 'h-[120px]', f: 'text-[36px]' }, { w: 'w-[150px]', h: 'h-[150px]', f: 'text-[40px]' }];

    const innerContent = (
        <div className="content flex flex-col items-center w-full">
            {/* <Image src={PillarSvg} className={`w-[23px] h-[34px] ${text == 'risk_meter' ? 'mt-0' : 'mt-[-25px]'}`} alt="" /> */}
            <PillarSMSvg className={`mt-0`} alt="" />
        </div>
    );

    const handleItem = () => {
        if (ability != 5)
            setAbility(ability + 1);
        else
            setAbility(1);
    }

    useEffect(() => {
        handleAbility(index, ability);
    }, [ability]);

    useEffect(() => {
        if (articulate.length != 0) {
            setAbility(articulate[index]);
        }
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row items-center w-[150px]">
                <div className="flex">
                    <WonderSquare
                        style={{ backgroundColor: `${uiParams[index].bg}`, borderRadius: "0px", borderWidth: "3px" }}
                        size={43}
                        data={null}
                        content={innerContent}
                    />
                </div>
                {!ispdf && <h1 className="font-Inter ml-2">{uiParams[index].label}</h1>}
                {ispdf && <span className="font-Inter ml-2 h-full">{uiParams[index].label}</span>}
            </div>
            {!ispdf &&
                <div className={`flex justify-center items-center w-[150px] h-[150px] border-2 ${ability != 5 ? "border-secondary-gray-3" : ""}  border-dotted rounded-full`}>
                    {(ability != 5 && ability != 0) && <button className={`flex rounded-full justify-center items-center text-center font-Inter font-semibold ${sizes[ability].w} ${sizes[ability].h} ${sizes[ability].f} ${uiParams[index].bg2} border ${uiParams[index].border}`} onClick={handleItem}>{ability}</button>}
                    {ability == 5 && <button className={`flex rounded-full justify-center items-center text-center font-Inter font-semibold ${sizes[ability].w} ${sizes[ability].h} ${sizes[ability].f} ${uiParams[index].bg2} border-2 border-dotted ${uiParams[index].border}`} onClick={handleItem}>{ability}</button>}
                    {ability == 0 && <button className="text-[20px] font-semibold font-Inter" onClick={handleItem}>{ability}</button>}
                </div>
            }
            {ispdf &&
                <div className={`flex justify-center items-center w-[150px] h-[150px] border-2 ${ability != 5 ? "border-secondary-gray-3" : ""}  border-dotted rounded-full`}>
                    {(ability == 1) && <button className={`rounded-full font-Inter font-semibold ${sizes[ability].w} ${sizes[ability].h} ${sizes[ability].f} ${uiParams[index].bg2} border ${uiParams[index].border} relative`} onClick={handleItem}><span className="h-full block mt-[-22px]">{ability}</span></button>}
                    {(ability == 2) && <button className={`rounded-full font-Inter font-semibold ${sizes[ability].w} ${sizes[ability].h} ${sizes[ability].f} ${uiParams[index].bg2} border ${uiParams[index].border} relative`} onClick={handleItem}><span className="h-full block mt-[-10px]">{ability}</span></button>}
                    {(ability == 3) && <button className={`rounded-full font-Inter font-semibold ${sizes[ability].w} ${sizes[ability].h} ${sizes[ability].f} ${uiParams[index].bg2} border ${uiParams[index].border} relative`} onClick={handleItem}><span className="h-full block mt-[4px]">{ability}</span></button>}
                    {(ability == 4) && <button className={`rounded-full font-Inter font-semibold ${sizes[ability].w} ${sizes[ability].h} ${sizes[ability].f} ${uiParams[index].bg2} border ${uiParams[index].border} relative`} onClick={handleItem}><span className="h-full block mt-[14px]">{ability}</span></button>}
                    {ability == 5 && <button className={`rounded-full font-Inter font-semibold ${sizes[ability].w} ${sizes[ability].h} ${sizes[ability].f} ${uiParams[index].bg2} border-2 border-dotted ${uiParams[index].border}`} onClick={handleItem}><span className="h-full block mt-[24px]">{ability}</span></button>}
                    {ability == 0 && <button className="text-[20px] font-semibold font-Inter" onClick={handleItem}>{ability}</button>}
                </div>
            }
        </div>
    )
}

export default IndividualArticulate;
