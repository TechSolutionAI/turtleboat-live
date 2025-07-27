import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import ComicStripPanel from "./ComicStripPanel";
import StoryTrainPanel from "./StoryTrainPanel";
import LemonadePanel from "./LemonadePanel";
import CorIcon from "/public/static/images/toolbox/circleofresource_icon.png";
import ComicIcon from "/public/static/images/toolbox/comic_strip_icon.png";
import LemonadeIcon from "/public/static/images/toolbox/lemodade_icon.png";
import CoffeeChatIcon from "/public/static/images/toolbox/coffee_chat.jpg";
import OppIdIcon from "/public/static/images/toolbox/opportunity.png";
import StorytrainIcon from "/public/static/images/toolbox/train_icon.png";
import CharacterstakeIcon from "/public/static/images/toolbox/character_stake_icon.png";

const ToolBoxes = [
  {
    name: "Circle of Resources",
    icon: CorIcon,
    link: "/guest/toolbox/circleofresource",
  },
  {
    name: "Who Should Care & Why? Brainstorm",
    icon: CharacterstakeIcon,
    link: "/guest/toolbox/characterbrainstorm",
  },
  {
    name: "Comic Strip Generator",
    icon: ComicIcon,
    link: "/guest/toolbox/comicstrip",
  },
  {
    name: "Opportunity Identification",
    icon: OppIdIcon,
    link: "/guest/toolbox/",
  },
  {
    name: "Story Train",
    icon: StorytrainIcon,
    link: "/guest/toolbox/storytrain",
  },
  { name: "Coffee Chat", icon: CoffeeChatIcon, link: "/guest/toolbox/" },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Guest ToolBox - Turtle Boat";
  }, []);

  return (
    <div>
      <div className="pb-[32px]">
        <label className="font-Inter font-bold text-[36px] text-primary-black mt-[100px]">
          yCITIES TOOLBOX
        </label>
      </div>
      {isLoading ? (
        <div className="grid place-items-center h-full">
          <Spinner text={"Loading toolbox..."} />
        </div>
      ) : (
        <div className="place-items-center h-full p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-20 gap-x-20">
            {ToolBoxes.map((item: any) => {
              return (
                <a
                  key={item.name}
                  href={item.link}
                  className="cursor-pointer shadow-md rounded-lg flex flex-col items-center justify-center px-4 py-8"
                >
                  <h2 className="font-Inter font-bold text-black text-lg text-center">
                    {item.name}
                  </h2>
                  <Image src={item.icon} alt={item.name} />
                </a>
              );
            })}
            {/* <ComicStripPanel /> */}
            {/* <div className="grid grid-cols-1 gap-y-[30px] gap-x-10">
                                <StoryTrainPanel/>
                                <LemonadePanel />
                            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
