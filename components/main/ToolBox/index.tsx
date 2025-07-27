import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import Image from "next/image";
import Swal from "sweetalert2";
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
    link: "/dashboard/toolbox/circleofresource",
  },
  {
    name: "Who Should Care & Why? Brainstorm",
    icon: CharacterstakeIcon,
    link: "/dashboard/toolbox/characterbrainstorm",
  },
  {
    name: "Comic Strip Generator",
    icon: ComicIcon,
    link: "/dashboard/toolbox/comicstrip",
  },
  { name: "Opportunity Identification", icon: OppIdIcon, link: "" },
  {
    name: "Story Train",
    icon: StorytrainIcon,
    link: "/dashboard/toolbox/storytrain",
  },
  {
    name: "Coffee Chat",
    icon: CoffeeChatIcon,
    link: "/dashboard/toolbox/lemonade",
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "ToolBox - Turtle Boat";
  }, []);
  return (
    <div>
      <div className="pb-[32px]">
        <h1 className="font-Inter font-bold text-[24px] text-primary-black mt-[0px]">
          yCITIES TOOLBOX
        </h1>
        <p className={"mt-5 font-Inter text-[14px]"}>
          The Toolbox has various interactive tools that will be familiar to you
          if you&#39;ve ever participated in a yCITIES Bootcamp. Even if you
          haven&#39;t completed an M2M Startup Bootcamp or an L3 Innovation
          Challenge, you are welcome to try them out to brainstorm or run
          scenarios with. Screenshot your work if you&#39;re not a CORE member,
          or select a venture to save your work under if you are a CORE member.
        </p>
      </div>
      {isLoading ? (
        <div className="grid place-items-center h-full">
          <Spinner text={"Loading toolbox..."} />
        </div>
      ) : (
        <div className="place-items-center h-full p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-20 gap-x-20">
            {ToolBoxes.map((item: any) => {
              return item.link != "" ? (
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
              ) : (
                <div
                  key={item.name}
                  onClick={() => {
                    Swal.fire("Coming Soon...", "", "info");
                  }}
                  className="cursor-pointer shadow-md rounded-lg flex flex-col items-center justify-center px-4 py-8"
                >
                  <h2 className="font-Inter font-bold text-black text-lg text-center">
                    {item.name}
                  </h2>
                  <Image src={item.icon} alt={item.name} />
                </div>
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
