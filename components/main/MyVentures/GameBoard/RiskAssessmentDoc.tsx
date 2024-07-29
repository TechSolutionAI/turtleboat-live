import { useSession } from "next-auth/react";
import AnalysisAssessment from "./AnalysisAssessment"
import IndividualRiskAssess from "./InvidivualRiskAssess"
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { Venture } from "@/types/venture.type";
import { Span } from "next/dist/trace";
import IndividualArticulate from "./IndividualArticulate";

interface RiskAssessmentDocProps {
    venture: Venture | undefined;
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

    const getMentorName = (_id: string) => {
        if (venture && venture.mentors != null && venture.mentors != undefined) {
            for (const item of venture.mentors) {
                if (item._id.toString() === _id.toString()) {
                    return item.name; // Return the name once found
                }
            }
        }

        return "Unknown"; // Return "Unknown" if mentor with _id is not found
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
        getCollaborators();
    }, []);

    return (
        <div className="mx-auto w-[795px]">
            <div className="flex flex-col w-full font-Inter">
                <h1 className="text-2xl font-Inter text-center font-bold mt-10">{venture?.title}</h1>
                <h1 className="font-Inter text-center text-xl">Reported from: {formatDate(venture?.updatedAt)}</h1>
            </div>
            <h1 className="font-Inter mt-6 font-semibold text-xl">Veture Team:
                {coMentees.map((item, index) => {
                    return (
                        <div key={index}>
                            <span className="font-md"> {item.name},</span>
                        </div>
                    )
                })}
                {coMentors.map((item, index) => {
                    return (
                        <div key={index}>
                            <span className="font-md"> {item.name}</span>
                            {index != coMentors.length - 1 && <span>,</span>}
                        </div>
                    )
                })}
            </h1>
            <h1 className="font-Inter mt-6 font-semibold text-xl">Mentors:
                {venture?.mentors.map((item, index) => {
                    return (
                        <div key={index}>
                            <span>{item.name}</span>
                            {alreadyAssessed(item?._id) && <span>*</span>}
                            {index != venture?.mentors.length - 1 && <span>, </span>}
                        </div>
                    )
                })}
            </h1>
            <p className="font-Inter">* Indicates completion of risk assessment</p>
            <h1 className="font-Inter mt-6 text-xl font-semibold">Elevator Pitch</h1>
            <p className="font-Inter">Imagine unlocking the full potential of your iPads with just one case. Introducing Dual Pad, the revolutionary iPad case that allows you to seamlessly connect two iPads together for unparalleled multitasking. Whether you&#39;re a student, professional, or creative, Dual Pad enhances your productivity by letting you run two apps simultaneously, collaborate effortlessly, and streamline your workflow like never before. With its sleek design and intuitive functionality, Dual Pad is the must-have accessory for anyone looking to maximize their iPad experience. Reshape the way you work and play with Dual Pad.</p>
            <h1 className="font-Inter mt-10 text-2xl font-semibold">Individual Mentor Assessments</h1>
            {venture?.assessments && venture?.assessments.map((item, index) => {
                if (memberType == "mentee")
                    return (
                        <div key={index}>
                            <h1 className="font-Inter mt-4 text-xl font-light">{getMentorName(item._id)}:</h1>
                            <div className="flex flex-col w-[712px] mx-12 mt-4">
                                <div className="ml-[120px] mb-2 flex justify-between mr-[16px]">
                                    <span className="italic font-Inter text-[9px]">Highly risky</span>
                                    <span className="italic font-Inter text-[9px]">Lower probable risk</span>
                                </div>
                                <IndividualRiskAssess index={0} assessment={item.value} handlePoint={() => { }} />
                                <IndividualRiskAssess index={1} assessment={item.value} handlePoint={() => { }} />
                                <IndividualRiskAssess index={2} assessment={item.value} handlePoint={() => { }} />
                                <IndividualRiskAssess index={3} assessment={item.value} handlePoint={() => { }} />
                                <div className="flex flex-row justify-center my-[2px]">
                                    <div className="w-[60px] lg:w-[100px] h-[74px] rounded-md">
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Little to no proof/ traction</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Some proof, not enough</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">On the right track</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Promise evidence</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Solid evidence, given stage of venture</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                else if (user?._id == item._id)
                    return (
                        <div key={index}>
                            <h1 className="font-Inter mt-4 text-xl font-light">{getMentorName(item._id)}:</h1>
                            <div className="flex flex-col w-[712px] mx-12 mt-4">
                                <div className="ml-[120px] mb-2 flex justify-between mr-[16px]">
                                    <span className="italic font-Inter text-[9px]">Highly risky</span>
                                    <span className="italic font-Inter text-[9px]">Lower probable risk</span>
                                </div>
                                <IndividualRiskAssess index={0} assessment={item.value} handlePoint={() => { }} />
                                <IndividualRiskAssess index={1} assessment={item.value} handlePoint={() => { }} />
                                <IndividualRiskAssess index={2} assessment={item.value} handlePoint={() => { }} />
                                <IndividualRiskAssess index={3} assessment={item.value} handlePoint={() => { }} />
                                <div className="flex flex-row justify-center my-[2px]">
                                    <div className="w-[60px] lg:w-[100px] h-[74px] rounded-md">
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Little to no proof/ traction</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Some proof, not enough</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">On the right track</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Promise evidence</p>
                                    </div>
                                    <div className="w-[100px] ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Solid evidence, given stage of venture</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
            })}
            <h1 className="font-Inter mt-6 mb-4 text-2xl font-semibold mt-[480px]">Individual Mentor Assessments for Ability to Articulate:</h1>
            {venture?.assessments && venture?.assessments.map((item) => {
                if (memberType == "mentee")
                    return (
                        <>
                            <h1 className="font-Inter mt-4 text-xl font-light">{getMentorName(item._id)}:</h1>
                            <div className="flex grid grid-cols-2 gap-12 bg-[#f8f8f8] border-[2px] rounded-[15px] mx-12 mt-4 p-8">
                                <IndividualArticulate index={0} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                                <IndividualArticulate index={1} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                                <IndividualArticulate index={2} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                                <IndividualArticulate index={3} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                            </div>
                        </>
                    )
                else if (user?._id == item._id)
                    return (
                        <>
                            <h1 className="font-Inter mt-4 text-xl font-light">{getMentorName(item._id)}:</h1>
                            <div className="flex grid grid-cols-2 gap-12 bg-[#f8f8f8] border-[2px] rounded-[15px] mx-12 mt-4 p-8">
                                <IndividualArticulate index={0} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                                <IndividualArticulate index={1} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                                <IndividualArticulate index={2} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                                <IndividualArticulate index={3} articulate={item.articulates} handleAbility={() => { }} ispdf={true} />
                            </div>
                        </>
                    )
            })}
        </div>
    )
}

export default RiskAssessmentDoc;
