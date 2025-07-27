import { useEffect, useState } from "react";
import { MentorEvaluation } from "@/types/module.type";
import { User } from "next-auth";

interface EvaluationBarProps {
    evaluations: MentorEvaluation[] | [];
    user: User;
    cMentor: User;
    memberType: string;
    setTempEvaluation: React.Dispatch<React.SetStateAction<MentorEvaluation | null>>;
}

const EvaluationBar = ({ evaluations, user, cMentor, memberType, setTempEvaluation }: EvaluationBarProps) => {
    const [value, setValue] = useState(0);
    const [lastUpdated, setLastUpdated] = useState("");

    const uiParams = [
        { left: "0px", src: "/static/images/active_btns/btn_bg1.png", label: "Little to no proof", bg: "bg-eval-sel-red" },
        { left: "39px", src: "/static/images/active_btns/btn_bg2.png", label: "Some proof, but not enough", bg: "bg-eval-sel-red-2" },
        { left: "78px", src: "/static/images/active_btns/btn_bg3.png", label: "On the right track", bg: "bg-eval-sel-orange" },
        { left: "117px", src: "/static/images/active_btns/btn_bg4.png", label: "Some promising evidence", bg: "bg-eval-sel-yellow" },
        { left: "156px", src: "/static/images/active_btns/btn_bg5.png", label: "Good evidence given stage of venture", bg: "bg-eval-sel-green" },
        { left: "195px", src: "/static/images/active_btns/btn_bg6.png", label: "Solid proof points", bg: "bg-eval-sel-green-2" }
    ]

    const getInitData = () => {
        evaluations.map((item) => {
            if (cMentor._id == item._id) {
                setValue(item.value);
                setLastUpdated(item.lastUpdated);
            }
        })
    }

    const handleValue = (val: number) => {
        setValue(val);
        setTempEvaluation({ _id: cMentor._id ? cMentor._id : "", value: val, lastUpdated: "" });
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    useEffect(() => {
        getInitData();
    }, []);

    return (
        <div className="flex items-center justify-center mb-3">
            <div className="w-[238px] max-w-xl">
                <div className="flex flex-row justify-between items-center mb-[10px]">
                    <div className="flex flex-row items-center">
                        <img className="rounded-full" width={24} height={24} src={cMentor.image ? cMentor.image : ""} alt={"ddd"} />
                        <p className="font-Inter text-[12px] ml-[4px]">{cMentor.name}</p>
                    </div>
                    <p className="font-Inter italic text-[12px]">{lastUpdated ? formatDate(lastUpdated) : ""}</p>
                </div>
                <div className="relative">
                    {value == 0 ? "" : <img className={`absolute h-[34px] z-10`} src={uiParams[value - 1].src} alt="" style={{ left: `${uiParams[value - 1].left}` }} />}
                    <div className="relative flex border-gray-300 border-2 rounded-full overflow-hidden">
                        <button className="w-[35px] h-[26px] bg-eval-red hover:bg-eval-sel-red focus:outline-none m-[2px] rounded-l-full" onClick={(memberType=="mentor" && user._id == cMentor._id)?() => handleValue(1):undefined}></button>
                        <button className="w-[35px] h-[26px] bg-eval-red-2 hover:bg-eval-sel-red-2 focus:outline-none m-[2px]" onClick={(memberType=="mentor" && user._id == cMentor._id)?() => handleValue(2):undefined}></button>
                        <button className="relative w-[35px] h-[26px] bg-eval-orange hover:bg-eval-sel-orange focus:outline-none m-[2px]" onClick={(memberType=="mentor" && user._id == cMentor._id)?() => handleValue(3):undefined}></button>
                        <button className="w-[35px] h-[26px] bg-eval-yellow hover:bg-eval-sel-yellow focus:outline-none m-[2px]" onClick={(memberType=="mentor" && user._id == cMentor._id)?() => handleValue(4):undefined}></button>
                        <button className="w-[35px] h-[26px] bg-eval-green hover:bg-eval-sel-green focus:outline-none m-[2px]" onClick={(memberType=="mentor" && user._id == cMentor._id)?() => handleValue(5):undefined}></button>
                        <button className="w-[35px] h-[26px] bg-eval-green-2 hover:bg-eval-sel-green-2 focus:outline-none m-[2px] rounded-r-full" onClick={(memberType=="mentor" && user._id == cMentor._id)?() => handleValue(6):undefined}></button>
                    </div>
                </div>
                <div className="flex justify-center mt-2">
                    {value == 0 ? <span className="font-Inter text-[10px] italic">Not yet evaluated</span> : <span className={`${uiParams[value - 1].bg} text-[10px] text-white font-Inter py-[2px] px-[6px] rounded-sm`}>{uiParams[value - 1].label}</span>}
                </div>
            </div>
        </div>
    )
}

export default EvaluationBar;