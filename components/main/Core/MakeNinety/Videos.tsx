import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { NinetyVideo } from "@/types/ninetyvideo.type";
import VideoWithUser from "../../VideoWithUser";

const videoTypeItems = [
  {
    title: "Can You Make a Kid Care in 90 Seconds",
    description:
      "The Challenge: can you make a kid(aka anyone reagardless of level of education or familiarity with your experience) in 90 seconds. Upload a video and peers write what they personally interpret from what they hear instead of opinions. Through the aggregate of peer interpretations, you can decide if folks are understanding what you&#39;re trying to convey. After tweaking from your first upload, you&#39;re welcome to upload Take 2 (or Take 7) to see if others hear what you&#39;re trying to say. You don&#39;t have to have a developed venture to upload... you can use this as a tool to practice your storytelling skills or to vet several possible ideas you&#39;re toying aroung with.",
  },
  {
    title: "90 Seconds Inside the Mind of an Investor",
    description:
      "A bite-size version of yCITIES&#39; Inside the Mind of an Investore series, investors of varying years of experiences, investment wallet size, risk tolerances, and interests will share objective and subjective thoughts when it comes to investing in startups.",
  },
  {
    title: "And Then This Happened...",
    description:
      "We all have humbling moments. Using common sense, these 90 seconds sound bites are meant to share the human side of us, letting us know that we&#39;ve all been there...that really bad pitch meeting...the time we messed up our own name...or wore two different shoes because they looked the same in the dark closet.",
  },
  {
    title: "NanoTalks",
    description:
      "Innovation starts with passion, we want to cultivate a culture of passion and learning through NanoTalks.  NanoTalks are a way for CORE members to share and get glimpses into topics we are excited about.   Whether learned or lived through (or a combo of both), NanoTalks may introduce us to something unfamiliar, or they may put a different spin on something we think we know well.  If there are a lot of “curious” emoji reactions for a particular NanoTalk, we will have a NanoTalk Part 2…maybe a NanoTalk Part 3…and even possibly a workshop (live or virtual).",
  },
];

const VideosWithType = ({
  videos,
  type,
}: {
  videos: NinetyVideo[];
  type: number;
}) => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const handleUploadNew = (type: number) => {
    router.push(`/dashboard/core/makeninety/add?type=${type}`);
  };

  return (
    <>
      <div
        className={`flex justify-between items-center bg-white z-10 pt-2 pb-0 ${
          type != 0 ? "mt-4" : "mt-0"
        }`}
      >
        <h2 className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex py-0">
          <span className="font-Inter font-bold mr-1">
            {videoTypeItems[type].title}
          </span>
        </h2>
        <div className="md:flex grid grid-cols-1 gap-y-2 relative">
          <button
            className="flex items-center justify-center gap-x-2 bg-[#2E65F3] text-white active:bg-[#2E65F3] px-4 py-1.5 rounded-[50px] shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 font-Inter truncate"
            type="button"
            onClick={() => handleUploadNew(type + 1)}
          >
            <CloudUploadOutlinedIcon className="m-auto" fontSize="small" />
            Upload
          </button>
        </div>
      </div>
      <p
        className={"mt-0 mb-5 font-Inter text-[14px]"}
        dangerouslySetInnerHTML={{ __html: videoTypeItems[type].description }}
      ></p>
      {
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((item: NinetyVideo, index: number) => {
              if (index < 6 || showAll)
                return (
                  <div key={`video_${index}`}>
                    <VideoWithUser item={item} isAdmin={false} />
                  </div>
                );
            })}
            {videos.length == 0 && (
              <div className="font-Inter text-md px-2">No Videos</div>
            )}
          </div>

          {videos.length > 6 && !showAll && (
            <div className="flex justify-center p-1">
              <button
                className="flex items-center justify-center gap-x-2 bg-[#2E65F3] text-white active:bg-[#2E65F3] px-6 py-3 rounded-[50px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                type="button"
                onClick={() => setShowAll(true)}
              >
                Load More ...
              </button>
            </div>
          )}
        </>
      }
    </>
  );
};

const Videos = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<NinetyVideo[]>([]);
  const [nanotalks, setNanoTalks] = useState<NinetyVideo[]>([]);

  const getVideos = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/makeninety`, {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { ninetyvideos, nanotalkvideos } = await response.json();
      setVideos(ninetyvideos);
      setNanoTalks(nanotalkvideos);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="grid place-items-center h-full">
          <Spinner text="Loading Videos ..." />
        </div>
      ) : (
        <>
          <VideosWithType
            type={0}
            videos={videos.filter((videoItem) => videoItem.type == 1)}
          />
          <VideosWithType
            type={1}
            videos={videos.filter((videoItem) => videoItem.type == 2)}
          />
          <VideosWithType
            type={2}
            videos={videos.filter((videoItem) => videoItem.type == 3)}
          />
          <VideosWithType type={3} videos={nanotalks} />
        </>
      )}
    </div>
  );
};

export default Videos;
