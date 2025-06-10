import { Transition } from "@headlessui/react";
import IndividualRiskAssess from "./InvidivualRiskAssess";
import { useState } from "react";
import Swal from "sweetalert2";
import { User } from "next-auth";
import Spinner from "@/components/Spinner";
import IndividualArticulate from "./IndividualArticulate";

interface EvaluatorAssessmentModalProps {
    showModal: boolean;
    closeModal: () => void;
    vid: string;
    user: User;
    assessment: number[];
    articulate: number[];
    handleUpdates: () => void;
}

const EvaluatorAssessmentModal = ({ showModal, closeModal, vid, user, assessment, articulate, handleUpdates }: EvaluatorAssessmentModalProps) => {
    const [points, setPoints] = useState<number[]>(assessment);
    const [abilities, setAbilities] = useState<number[]>(articulate);
    const [assessing, setAssessing] = useState(false);

    const handlePoint = (index: number, point: number) => {
        const tempPoints = [...points];
        tempPoints[index] = point;
        setPoints(tempPoints);
    }

    const handleAbility = (index: number, ability: number) => {
        const tempAbilities = [...abilities];
        tempAbilities[index] = ability;
        setAbilities(tempAbilities);
    }

    const updateAssessment = async () => {
        let chosenAll = true;

        points.map((item: number) => {
            if (item == 0)
                chosenAll = false;
        });

        abilities.map((item: number) => {
            if (item == 0)
                chosenAll = false;
        });

        if (chosenAll) {
            setAssessing(true);
            const response = await fetch("/api/assessment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: user._id?.toString(),
                    vid: vid?.toString(),
                    assessments: points,
                    articulates: abilities
                }),
            });

            if (!response.ok) {
                setAssessing(false);
                const { err } = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err,
                }).then(() => {
                    setAssessing(false);
                }).catch((err) => console.log(err));
            } else {
                const { result } = await response.json();
                setAssessing(false);
                handleUpdates();
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    allowOutsideClick: false,
                    text: `You evaluated successfully!`,
                })
                    .then(() => {
                    })
                    .catch((err) => console.log(err));
                closeModal();
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Please choose all assessments and articulates!`,
            })
                .then(() => {
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <>
            <Transition
                show={showModal}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div
                    className={`fixed top-0 left-0 right-0 w-full flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`}>
                    <div className="relative w-full max-w-3xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow">
                            <button
                                type="button"
                                className={`absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`}
                                onClick={closeModal}>
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd">
                                    </path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-4 mb-4">
                                <h3 className="text-base font-semibold text-gray-900 lg:text-xl font-Inter">
                                    Mentor Assessment
                                </h3>
                                <p className="font-Inter mt-4">Diagnosing where the holes are in the founder&#39;s story</p>
                            </div>
                            <div className="px-6">
                                <h3 className="text-base font-semibold text-gray-900 lg:text-lg font-Inter">Step 1 of 2: Breadth of Exploration</h3>
                                <p className="font-Inter text-sm">Rate the quality of the founder&#39;s hypotheses for each pillar. This rating should reflect only the quality of the hypotheses, not whether anything has been done to prove it out. Assess the entire pillar in aggregate (if they only have one thought-out hypothesis, the pillar is still high risk because only a small portion has been addressed.</p>
                            </div>
                            <div className="flex flex-col mx-4 lg:mx-12 mt-4">
                                <div className="ml-[120px] flex justify-between mr-[16px]">
                                    <span className="italic font-Inter text-[9px]">Highly risky</span>
                                    <span className="italic font-Inter text-[9px]">Lower probable risk</span>
                                </div>
                                <IndividualRiskAssess index={0} assessment={assessment} handlePoint={handlePoint} />
                                <IndividualRiskAssess index={1} assessment={assessment} handlePoint={handlePoint} />
                                <IndividualRiskAssess index={2} assessment={assessment} handlePoint={handlePoint} />
                                <IndividualRiskAssess index={3} assessment={assessment} handlePoint={handlePoint} />
                                <div className="flex flex-row justify-center my-[2px]">
                                    <div className="w-[60px] lg:w-[100px] h-[40px] lg:h-[74px] rounded-md">
                                    </div>
                                    <div className="w-[60px] lg:w-[100px] ml-1 lg:ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">None or not able to understand</p>
                                    </div>
                                    <div className="w-[60px] lg:w-[100px] ml-1 lg:ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Need more detail</p>
                                    </div>
                                    <div className="w-[60px] lg:w-[100px] ml-1 lg:ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">On the right track</p>
                                    </div>
                                    <div className="w-[60px] lg:w-[100px] ml-1 lg:ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Well-thought out</p>
                                    </div>
                                    <div className="w-[60px] lg:w-[100px] ml-1 lg:ml-2 mr-1 text-center my-[auto]">
                                        <p className="font-Inter text-[10px] font-semibold text-gray-600">Very comfortable</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6">
                                <h3 className="text-base font-semibold text-gray-900 lg:text-lg font-Inter">Step 2 of 2: Ability to Articulate</h3>
                                <p className="font-Inter text-sm">Rate the founder&#39;s ability to articulate each pillar in a way that is clear, concise, and compelling on a scale of 1 to 5. Select a circle and enter a value. You may reference the founder&#39;s story train and/or recorded elevator pitch.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-12 bg-[#f8f8f8] border-[2px] rounded-[15px] mx-12 mt-4 p-8">
                                <IndividualArticulate index={0} articulate={articulate} handleAbility={handleAbility} ispdf={false} />
                                <IndividualArticulate index={1} articulate={articulate} handleAbility={handleAbility} ispdf={false} />
                                <IndividualArticulate index={2} articulate={articulate} handleAbility={handleAbility} ispdf={false} />
                                <IndividualArticulate index={3} articulate={articulate} handleAbility={handleAbility} ispdf={false} />
                            </div>
                            <div className="flex justify-end items-center p-6 space-x-2 border-gray-200 rounded-b">
                                <button type="button" className="font-Inter mr-[12px]" onClick={closeModal}>Cancel</button>
                                <button
                                    type="button"
                                    className={`font-Inter text-white bg-primary-blue hover:bg-primary-blue focus:ring-4 focus:outline-none focus:ring-primary-blue font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                                    onClick={updateAssessment}
                                >
                                    {assessing ? <Spinner text="Assessing..." size={"6"} /> : (assessment.length == 0 ? "Submit" : "Update")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </Transition>
            <div className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${!showModal ? "hidden" : ""}`}></div>
        </>
    )
};

export default EvaluatorAssessmentModal;
