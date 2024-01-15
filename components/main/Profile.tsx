import { useState, useEffect } from "react";
import { Question } from "@/types/question.type";
import { DynamicObject } from '@/utils/dynamicObject';
// import useUserStore from "@/stores/useUserStore";
import Stepper from "../Stepper";
import ProfileBasic from "./ProfileBasic";
import ProfileAdvanced from "./ProfileAdvanced";
import { useSession } from "next-auth/react";
import { User } from "next-auth"

const Profile = ({ basicQuestions, advancedQuestions }: { basicQuestions: Array<Array<Question>>, advancedQuestions: Array<Question> }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // const { user, setUser } = useUserStore();
  const { data: session } = useSession();

  const onNextBtnClicked = () => {
    setCurrentStep(1);
  }

  const onPrevBtnClicked = () => {
    setCurrentStep(0);
  }

  const basicProfileUpdated = (data: DynamicObject) => {
    if (!session) {
      console.log("Session is null");
      return;
    }
    (session?.user as User).basicProfile = data;
    // setUser(user);
  }

  const advancedProfileUpdated = (data: DynamicObject) => {
    if (!session) {
      console.log("Session is null");
      return;
    }
    (session?.user as User).advancedProfile = data;
    // setUser(user);
  }

  useEffect(() => {
      document.title = "Profile - Turtle Boat";
  }, []);

  return (
    <>
      <Stepper currentStep={currentStep} setCurrentStep={(stepIdx: number) => setCurrentStep(stepIdx)} />
      <div className="mt-10 flex flex-col font-Inter">
        {
          currentStep == 0
            ? <ProfileBasic questions={basicQuestions} nextClicked={onNextBtnClicked} profileUpdated={basicProfileUpdated} />
            : currentStep == 1
              ? <ProfileAdvanced questions={advancedQuestions} prevClicked={onPrevBtnClicked} profileUpdated={advancedProfileUpdated} />
              : null
        }
        {/* <div className="">
          {
            currentStep == 1
              ? <button
                className={
                  `text-white float-left bg-blue-700 hover:bg-blue-800 
                  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                  rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center`}
                onClick={onPrevBtnClicked}
              >
                Prev
              </button>
              : null
          }

          <button
            className={
              `text-white float-right bg-blue-700 hover:bg-blue-800 
                focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center`}
            onClick={onNextBtnClicked}
          >
            Next
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Profile;
