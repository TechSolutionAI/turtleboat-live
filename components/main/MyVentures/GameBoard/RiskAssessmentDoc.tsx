import { useSession } from "next-auth/react";
import AnalysisAssessment from "./AnalysisAssessment"
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { Venture } from "@/types/venture.type";


interface RiskAssessmentDocProps {
    venture: Venture | undefined;
}

interface BubbleData {
    x: number;
    y: number;
    z: number;
    color: string;
    svg_color: string;
}

const RiskAssessmentDoc = ({ venture }: RiskAssessmentDocProps) => {
    const { data: session } = useSession();
    const user = session?.user as User;

    const [memberType, setMemberType] = useState<string>("mentor");
    const [coMentees, setCoMentees] = useState<User[]>([]);
    const [coMentors, setCoMentors] = useState<User[]>([]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    const alreadyAssessed = (_id: string) => {
        if (venture && venture.assessments != null && venture.assessments != undefined) {
            return venture.assessments.some(item => item._id.toString() === _id.toString());
        }
        return false;
    }

    const getMentorInfo = (_id: string) => {
        if (venture && venture.mentors != null && venture.mentors != undefined) {
            for (const item of venture.mentors) {
                if (item._id.toString() === _id.toString()) {
                    return { name: item.name, img: item.image }; // Return the name once found
                }
            }
        }

        return { name: "", img: "" }; // Return "Unknown" if mentor with _id is not found
    }

    const getChartData = (_id: string) => {
        let tempData: BubbleData[] = [
            { x: 0, y: 0, z: 0, color: 'rgba(72, 106, 217, 0.6)', svg_color: 'rgb(72, 106, 217)' },
            { x: 0, y: 0, z: 0, color: 'rgba(90, 35, 145, 0.6)', svg_color: 'rgb(90, 35, 145)' },
            { x: 0, y: 0, z: 0, color: 'rgba(84, 187, 189, 0.6)', svg_color: 'rgb(84, 187, 189)' },
            { x: 0, y: 0, z: 0, color: 'rgba(234, 59, 247, 0.6)', svg_color: 'rgb(234, 59, 247)' },
        ];
        let depthData = [{ sum: 0, cnt: 0 }, { sum: 0, cnt: 0 }, { sum: 0, cnt: 0 }, { sum: 0, cnt: 0 }];
        if (venture && venture.assessments != null && venture.assessments != undefined) {
            for (const item of venture.assessments) {
                if (item._id.toString() === _id.toString()) {
                    tempData[0].x = item.value[0] * 10;
                    tempData[1].x = item.value[1] * 10;
                    tempData[2].x = item.value[2] * 10;
                    tempData[3].x = item.value[3] * 10;
                    tempData[0].z = item?.articulates[0] * 14;
                    tempData[1].z = item?.articulates[1] * 14;
                    tempData[2].z = item?.articulates[2] * 14;
                    tempData[3].z = item?.articulates[3] * 14;
                    if (venture.course && venture.course.modules != null && venture.course.modules != undefined) {
                        for (const unit of venture.course.modules) {
                            if (unit.evaluations && unit.evaluations != null && unit.evaluations != undefined) {
                                if (unit.module.item == "Problem") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[0].sum += Number(unit2.value);
                                            depthData[0].cnt += 1;
                                        }
                                    }
                                } else if (unit.module.item === "Character") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[1].sum += Number(unit2.value);
                                            depthData[1].cnt += 1;
                                        }
                                    }
                                } else if (unit.module.item === "Setting") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[2].sum += Number(unit2.value);
                                            depthData[2].cnt += 1;
                                        }
                                    }
                                } else if (unit.module.item === "Solution") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[3].sum += Number(unit2.value);
                                            depthData[3].cnt += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < depthData.length; i++) {
                if (depthData[i].cnt !== 0)
                    tempData[i].y = (depthData[i].sum / depthData[i].cnt) * 9;
            }
            return tempData;
        }
    }

    const getCollaborators = async () => {
        const url = `/api/collaboration/${venture?.collabId.toString()}-${venture?._id}`;

        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err);
        } else {
            const { collaboration } = await response.json();
            setCoMentees(collaboration.mentees);
            setCoMentors(collaboration.mentors);

        }
    }

    useEffect(() => {
        if (venture && venture.mentee != null && venture.mentee != undefined) {
            if (venture.mentee.email == user.email) {
                setMemberType("mentee");
            } else {
                setMemberType("mentor");
            }
        }
        if (venture) {
            getCollaborators();
        }
    }, []);

    return (
        <div className="mx-auto w-[795px]">
            <div className="flex flex-col w-full font-Inter">
                <h1 className="text-2xl font-Inter text-center font-bold mt-10">{venture?.title}</h1>
                <h1 className="font-Inter text-center text-xl">Reported from: {formatDate(new Date().toDateString())}</h1>
            </div>
            <h1 className="font-Inter mt-6 font-semibold text-xl">Venture Team:
                {coMentees.map((item: User, index: number) => {
                    return (
                        <div key={index} className="font-normal">
                            <span className="font-md"> {item.name},</span>
                        </div>
                    )
                })}
                {coMentors.map((item: User, index: number) => {
                    return (
                        <div key={index} className="font-normal">
                            <span className="font-md"> {item.name}</span>
                            {index != coMentors.length - 1 && <span>,</span>}
                        </div>
                    )
                })}
            </h1>
            <h1 className="font-Inter mt-6 font-semibold text-xl">Mentors:
                {venture?.mentors.map((item: any, index: number) => {
                    return (
                        <div key={index} className="font-normal">
                            <span>{item.name}</span>
                            {alreadyAssessed(item?._id) && <span>*</span>}
                            {index != venture?.mentors.length - 1 && <span>, </span>}
                        </div>
                    )
                })}
            </h1>
            <p className="font-Inter">* Indicates completion of risk assessment</p>
            <h1 className="font-Inter mt-6 text-xl font-semibold">Elevator Pitch</h1>
            {
                venture?.storyTrain ?
                    <>
                        {
                            venture.storyTrain.map((item: any, index: number) => {
                                return (
                                    <>
                                        <p className="font-Inter text-md font-bold">{item.label}</p>
                                        <p className="font-Inter">{item.value == "" ? "N/A" : item.value}</p>
                                    </>
                                )
                            })
                        }
                    </> :
                    <p className="font-Inter">N/A</p>
            }
            <h1 className="font-Inter mt-10 text-2xl font-semibold">Individual Mentor Assessments</h1>
            {venture?.assessments && venture?.assessments.map((item, index) => {
                    return (
                        <div key={index}>
                            <div className="flex flex-row items-center my-3">
                                <h1 className="font-Inter ml-3 text-xl font-light">{getMentorInfo(item._id).name}:</h1>
                            </div>
                            <AnalysisAssessment chartData={getChartData(item._id)} />
                          
                        </div>
                    )
            })}
        </div>
    )
}

export default RiskAssessmentDoc;
