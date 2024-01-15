import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import TokenItem from "@/components/layouts/TokenItem";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { NinetyVideo, VideoComment } from "@/types/ninetyvideo.type";
import { formatDate } from "@/utils/utils";

import { emotionList } from "@/utils/constant";

const NanoTalkDetails = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  let videoId = "";
  if (typeof id === "string" && id !== "") {
    videoId = id.toString();
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [video, setVideo] = useState<NinetyVideo>();
  const [moreVideos, setMoreVideos] = useState<NinetyVideo[]>([]);
  const [commentList, setCommentList] = useState<VideoComment[]>([]);
  const [emotions, setEmotions] = useState<any[]>(emotionList);

  const getVideo = async () => {
    if (videoId != "") {
      setIsLoading(true);
      const response = await fetch(`/api/nanotalks/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        setIsLoading(false);
        const { err } = await response.json();
        console.log(err);
      } else {
        const { video, moreVideos } = await response.json();
        setVideo(video);
        document.title = video.title + " - Turtle Boat Admin";
        setMoreVideos(moreVideos);
        if (video?.type != 1) {
          video.comments.map((commentItem: any) => {
            if (commentItem.user._id == user._id) {
              const emotionsData = emotionList.map((emotion: any) => {
                if (emotion.value == commentItem.emotion) {
                  return {
                    text: emotion.text,
                    img: emotion.img,
                    value: emotion.value,
                    isSelected: true,
                  };
                } else {
                  return emotion;
                }
              });

              setEmotions(emotionsData);
            }
          });
        }
        setCommentList(video.comments.reverse());
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getVideo();
  }, []);

  const handleBackClick = () => {
    router.push("/dashboard/admin/makeninety");
  };

  const handleAddEmoji = async (emojivalue: number) => {
    // setIsCreating(true);
    const response = await fetch(`/api/nanotalks/${videoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: {
          emotion: emojivalue,
          user: user,
        },
      }),
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
    } else {
      console.log("Emoji saved successfully");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4">
            <div
              className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex p-2"
              onClick={handleBackClick}
            >
              <span className="flex">
                <KeyboardBackspaceIcon />
              </span>
              <span className="font-Inter font-bold ml-[15px]">All Videos</span>
            </div>
            <TokenItem />
          </div>

          {video != undefined && (
            <div className="w-full lg:w-[70%] m-auto">
              <div className="">
                <video
                  className="rounded-2xl w-full max-h-[400px] min-h-[400px]"
                  controls
                >
                  <source src={video?.video.url} />
                </video>
                <div className="font-Inter inline-grid gap-y-1 pt-2">
                  <label className="text-lg font-semibold">
                    {video?.title}
                  </label>
                  <p className="my-[10px]">{video?.description}</p>
                  <label>{video?.author.name}</label>
                  <label>{formatDate(video?.updatedAt)}</label>
                </div>
                {
                  <div className="block md:flex mt-5">
                    <div className="block sm:flex items-center justify-center">
                      {emotions.map((item: any, index: number) => {
                        if (!(video.type == 4 && index == 0)) {
                          return (
                            <div
                              key={`emoji_${index}`}
                              onClick={() => {
                                handleAddEmoji(
                                  !item.isSelected ? item.value : -1
                                );
                                const temp = [...emotions];
                                const newEmotions = temp.map(
                                  (tempItem: any) => {
                                    if (item.value == tempItem.value) {
                                      return {
                                        text: tempItem.text,
                                        img: tempItem.img,
                                        value: tempItem.value,
                                        isSelected: !item.isSelected,
                                      };
                                    } else {
                                      return {
                                        text: tempItem.text,
                                        img: tempItem.img,
                                        value: tempItem.value,
                                        isSelected: false,
                                      };
                                    }
                                  }
                                );
                                setEmotions(newEmotions);
                              }}
                              className={`flex flex-col rounded-lg items-center cursor-pointer p-1 ${
                                item.isSelected
                                  ? "bg-primary-blue text-white"
                                  : ""
                              }`}
                            >
                              <Image
                                src={item.img}
                                alt={item.text}
                                width={45}
                                height={45}
                              />
                              <div className="w-[75px] text-center">
                                {item.text}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    {/* <div className="flex items-center justify-center py-2">
                                            <button className="px-2 py-2 bg-primary-black text-sm text-white rounded-md" 
                                            onClick={handleAddEmoji}>{isCreating ? <Spinner text="Saving..." /> : "Save Feedback"}</button>
                                        </div> */}
                  </div>
                }
                <div className="mt-7">
                  <label className="text-lg font-semibold font-Inter">
                    Other NanoTalks By This Member
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {moreVideos.map((videoItem: NinetyVideo, index: number) => {
                      return (
                        <a
                          key={`video_item_${index}`}
                          className="grid grid-cols-10 gap-3 font-Inter cursor-pointer"
                          href={`/dashboard/core/makeninety/${videoItem._id}`}
                        >
                          <div className="col-span-4">
                            <video className="rounded-lg max-h-[100px] w-[100%] object-cover">
                              <source src={videoItem.video.url} />
                            </video>
                          </div>
                          <div className="col-span-6">
                            <a
                              href={`/dashboard/core/makeninety/${videoItem._id}`}
                              className="text-md break-words text-[#333] font-bold font-Inter cursor-pointer"
                            >
                              {videoItem.title}
                            </a>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default NanoTalkDetails;
